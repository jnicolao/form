import 'server-only';
import type { PickspotCreateOrderRequest, PickspotOrder } from './types';

const TIMEOUT_MS = 15_000;

export class PickspotConfigError extends Error {
  constructor() {
    super(
      'PickSpot is not configured. Set PICKSPOT_API_KEY and PICKSPOT_BASE_URL.',
    );
    this.name = 'PickspotConfigError';
  }
}

// `status` is PickSpot's HTTP status, or 0 when PickSpot could not be reached
// or did not answer in time. `message` is for the server log only: it is never
// shown to a shopper.
export class PickspotApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'PickspotApiError';
    this.status = status;
    this.code = code;
  }
}

// The API key is read on the server for each call and leaves this process only
// in the x-api-key header of a request to PICKSPOT_BASE_URL. The address may be
// given with or without its /api/v1 ending; there is no default, so a missing
// setting can never send orders to the wrong PickSpot.
export function getPickspotConfig(): { apiKey: string; apiUrl: string } | null {
  const apiKey = process.env.PICKSPOT_API_KEY;
  const base = process.env.PICKSPOT_BASE_URL;
  if (!apiKey || !base) return null;
  return {
    apiKey,
    apiUrl: `${base.replace(/\/+$/, '').replace(/\/api\/v1$/, '')}/api/v1`,
  };
}

export function isPickspotConfigured(): boolean {
  return getPickspotConfig() !== null;
}

async function request(
  method: 'GET' | 'POST',
  path: string,
  body?: unknown,
): Promise<{ json: Record<string, unknown>; replayed: boolean }> {
  const config = getPickspotConfig();
  if (!config) throw new PickspotConfigError();

  // A form (picture upload) goes out as it is; anything else is sent as JSON.
  const isForm = body instanceof FormData;
  let response: Response;
  let json: Record<string, unknown> = {};
  try {
    response = await fetch(`${config.apiUrl}${path}`, {
      method,
      headers: {
        'x-api-key': config.apiKey,
        ...(body === undefined || isForm
          ? {}
          : { 'Content-Type': 'application/json' }),
      },
      body:
        body === undefined ? undefined : isForm ? body : JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    });
    // Still inside the time limit. An empty or non-JSON body leaves only the status to report.
    json = await response.json().catch(() => ({}));
  } catch (err) {
    throw new PickspotApiError(
      `PickSpot could not be reached (${(err as Error).name})`,
      0,
    );
  }

  if (!response.ok) {
    // Errors are { err }; the 409 is { code, error, account }. The account
    // (whose number it is) is deliberately not read: the shop never shows it.
    const message = json.err ?? json.error ?? response.statusText;
    throw new PickspotApiError(
      String(message),
      response.status,
      typeof json.code === 'string' ? json.code : undefined,
    );
  }
  return {
    json,
    replayed: response.headers.get('x-idempotent-replay') === 'true',
  };
}

function orderIn(json: Record<string, unknown>): PickspotOrder {
  const order = json.order as PickspotOrder | undefined;
  if (
    !order ||
    typeof order.orderId !== 'string' ||
    typeof order.status !== 'string'
  ) {
    throw new PickspotApiError('PickSpot answered without an order', 502);
  }
  return order;
}

// Sending a reference PickSpot has seen before returns that order (`replayed`)
// instead of creating a second one.
export async function createCheckoutOrder(
  body: PickspotCreateOrderRequest,
): Promise<{ order: PickspotOrder; replayed: boolean }> {
  const { json, replayed } = await request(
    'POST',
    '/integrations/checkout/orders',
    body,
  );
  return { order: orderIn(json), replayed };
}

// `id` may be PickSpot's orderId, a parcel code, a claim id or the shop's reference.
export async function getOrder(id: string): Promise<PickspotOrder> {
  const { json } = await request(
    'GET',
    `/integrations/checkout/orders/${encodeURIComponent(id)}`,
  );
  return orderIn(json);
}

// Uploads one item picture and returns the key to put in `items[].imageKeys`.
export async function uploadItemImage(
  image: Blob,
  fileName: string,
): Promise<string> {
  const form = new FormData();
  form.append('image', image, fileName);
  const { json } = await request('POST', '/integrations/images', form);
  if (typeof json.key !== 'string' || json.key === '')
    throw new PickspotApiError('PickSpot answered without an image key', 502);
  return json.key;
}
