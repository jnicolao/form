import 'server-only';
import { createHash } from 'node:crypto';
import { getSavedImageKeys, saveImageKey } from './order-persistence';
import { getPickspotConfig, uploadItemImage } from './pickspot-server';

const FETCH_TIMEOUT_MS = 8_000;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // PickSpot's limit

// Kept while this server instance is warm, in front of the database table.
const known = new Map<string, string>();

// PickSpot shows a picture next to each item. A picture is uploaded once per
// PickSpot account and its key reused: first from memory, then from the
// database, and only then by uploading. `imagePaths` are the catalogue's own
// paths (e.g. /assets/images/x.webp) and are fetched from the shop's configured
// address, never from the address in the incoming request.
//
// A picture never holds up an order: whatever cannot be found or uploaded is
// simply left out of the result.
export async function getItemImageKeys(
  imagePaths: string[],
  siteUrl: string | null,
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

  for (const path of paths) {
    const key = known.get(`${account}|${path}`);
    if (key) result.set(path, key);
  }
  let missing = paths.filter((path) => !result.has(path));
  if (missing.length === 0) return result;

  try {
    const saved = await getSavedImageKeys(account, missing);
    saved.forEach((key, path) => {
      known.set(`${account}|${path}`, key);
      result.set(path, key);
    });
  } catch (err) {
    console.error('[item images] saved keys could not be read:', err);
  }
  missing = paths.filter((path) => !result.has(path));
  if (missing.length === 0 || !siteUrl) return result;

  await Promise.all(
    missing.map(async (path) => {
      try {
        const source = await fetch(new URL(path, siteUrl), {
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
          cache: 'no-store',
        });
        const image = await source.blob();
        if (
          !source.ok ||
          !image.type.startsWith('image/') ||
          image.size > MAX_IMAGE_BYTES
        ) {
          throw new Error(
            `not a usable picture (${source.status}, ${image.type}, ${image.size} bytes)`,
          );
        }
        const key = await uploadItemImage(
          image,
          path.split('/').pop() || 'item',
        );
        known.set(`${account}|${path}`, key);
        result.set(path, key);
        await saveImageKey(account, path, key);
      } catch (err) {
        console.error(`[item images] ${path} was left out:`, err);
      }
    }),
  );
  return result;
}
