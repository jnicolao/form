import { createHmac, timingSafeEqual } from 'node:crypto';

// X-Pickspot-Signature: t=<unix seconds>,v1=<hex>
// v1 = HMAC_SHA256(secret, "<t>.<raw request body>")
const HEADER_FORMAT = /^t=(\d+),v1=([0-9a-f]{64})$/i;
const TOLERANCE_SECONDS = 300;

export type SignatureCheck = { valid: true } | { valid: false; reason: string };

// `rawBody` must be the request body exactly as received, before JSON parsing.
// With no secret configured nothing is accepted: an unsigned update is never
// believed.
export function verifySignature(
  rawBody: string,
  header: string | null,
  secret: string | undefined,
  nowMs: number = Date.now(),
): SignatureCheck {
  if (!secret) return { valid: false, reason: 'No signing secret configured' };
  if (!header)
    return { valid: false, reason: 'Missing X-Pickspot-Signature header' };
  const match = HEADER_FORMAT.exec(header.trim());
  if (!match)
    return { valid: false, reason: 'Malformed X-Pickspot-Signature header' };
  const [, t, v1] = match;
  const expected = createHmac('sha256', secret)
    .update(`${t}.${rawBody}`)
    .digest();
  // Both buffers are 32 bytes (the pattern guarantees 64 hex characters).
  if (!timingSafeEqual(expected, Buffer.from(v1, 'hex'))) {
    return {
      valid: false,
      reason: 'Signature does not match (wrong secret or altered body)',
    };
  }
  if (Math.abs(nowMs / 1000 - Number(t)) > TOLERANCE_SECONDS) {
    return {
      valid: false,
      reason: 'Timestamp is more than 5 minutes from now',
    };
  }
  return { valid: true };
}
