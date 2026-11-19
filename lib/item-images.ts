import 'server-only';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getSavedImageKeys, saveImageKey } from './order-persistence';
import {
  getPickspotConfig,
  PickspotApiError,
  uploadItemImage,
} from './pickspot-server';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // PickSpot's limit
const IMAGE_TYPES: Record<string, string> = {
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

// Kept while this server instance is warm, in front of the database table.
const known = new Map<string, string>();

// Reads a product picture from the shop's own public folder. `imagePath` is a
// catalogue path such as /assets/images/x.webp. Reading the file needs no
// setting and no request to the shop itself, so it works the same on a laptop
// and when deployed (next.config.js ships these files with the order route).
async function readPicture(imagePath: string): Promise<Blob> {
  const file = path.join(PUBLIC_DIR, imagePath);
  if (!file.startsWith(PUBLIC_DIR + path.sep)) {
    throw new Error('outside the public folder');
  }
  const type = IMAGE_TYPES[path.extname(file).toLowerCase()];
  if (!type) throw new Error('not a picture type the shop sends');
  const bytes = await readFile(file);
  if (bytes.length > MAX_IMAGE_BYTES) {
    throw new Error(`${bytes.length} bytes is over PickSpot's 10 MB limit`);
  }
  return new Blob([new Uint8Array(bytes)], { type });
}

// PickSpot shows a picture next to each item. A picture is uploaded once per
// PickSpot account and its key reused: first from memory, then from the
// database, and only then by uploading.
//
// A picture never holds up an order: whatever cannot be read or uploaded is
// left out of the result, and the reason is written to the server log.
export async function getItemImageKeys(
  imagePaths: string[],
): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  const config = getPickspotConfig();
  if (!config) return result;
  // Keys belong to one PickSpot account on one PickSpot environment.
  const account = createHash('sha256')
    .update(`${config.apiUrl}|${config.apiKey}`)
    .digest('hex')
    .slice(0, 16);
  const paths = Array.from(new Set(imagePaths));

  for (const imagePath of paths) {
    const key = known.get(`${account}|${imagePath}`);
    if (key) result.set(imagePath, key);
  }
  let missing = paths.filter((imagePath) => !result.has(imagePath));
  if (missing.length === 0) return result;

  try {
    const saved = await getSavedImageKeys(account, missing);
    saved.forEach((key, imagePath) => {
      known.set(`${account}|${imagePath}`, key);
      result.set(imagePath, key);
    });
  } catch (err) {
    console.error('[item images] saved keys could not be read:', err);
  }
  missing = paths.filter((imagePath) => !result.has(imagePath));

  await Promise.all(
    missing.map(async (imagePath) => {
      try {
        const picture = await readPicture(imagePath);
        const key = await uploadItemImage(picture, path.basename(imagePath));
        known.set(`${account}|${imagePath}`, key);
        result.set(imagePath, key);
        // The key is already in use for this order; failing to save it only
        // means the picture is uploaded again after a restart.
        await saveImageKey(account, imagePath, key).catch((err) =>
          console.error(
            `[item images] key of ${imagePath} was not saved:`,
            err,
          ),
        );
      } catch (err) {
        const reason =
          err instanceof PickspotApiError
            ? `PickSpot answered ${err.status}: ${err.message}`
            : err;
        console.error(`[item images] ${imagePath} was left out:`, reason);
      }
    }),
  );
  return result;
}
