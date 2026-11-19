import { createHash } from 'node:crypto';
import { getProductById, products } from './products.ts';
import type { CartItem } from './types';

export const MAX_QUANTITY_PER_PRODUCT = 99;

// Reads the `[{ productId, quantity }]` a checkout page sends and rebuilds the
// cart from the shop's own catalogue, so names and prices never come from the
// browser. Null when anything in it is not a real product in a sensible
// quantity; a product may appear only once.
export function parseCartItems(input: unknown): CartItem[] | null {
  if (
    !Array.isArray(input) ||
    input.length === 0 ||
    input.length > products.length
  )
    return null;
  const lines: CartItem[] = [];
  for (const entry of input) {
    const { productId, quantity } = (entry ?? {}) as Record<string, unknown>;
    const product =
      typeof productId === 'string' ? getProductById(productId) : undefined;
    if (!product || lines.some((line) => line.productId === product.id))
      return null;
    if (typeof quantity !== 'number' || !Number.isInteger(quantity))
      return null;
    if (quantity < 1 || quantity > MAX_QUANTITY_PER_PRODUCT) return null;
    lines.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      subtitle: product.subtitle,
      size: product.size,
      priceKES: product.priceKES,
      image: product.image,
      parcelClass: product.parcelClass,
      quantity,
    });
  }
  return lines;
}

export function cartSubtotal(lines: CartItem[]): number {
  return lines.reduce((sum, line) => sum + line.priceKES * line.quantity, 0);
}

// The browser makes one random id per visit to the checkout and sends it with
// every try. The order number is derived from that id together with the phone
// number and the cart, so:
// - a retry of the same order gives PickSpot the same reference and gets the
//   same order back instead of a second one;
// - a different number or cart is a different order with its own number.
// The order number is shown to the customer; the attempt id never is, and it
// cannot be worked out from the order number.
export function orderReference(
  attemptId: unknown,
  phone: string,
  lines: CartItem[],
): string | null {
  if (typeof attemptId !== 'string' || !/^[0-9a-f]{32}$/.test(attemptId))
    return null;
  const cart = lines
    .map((line) => `${line.productId}x${line.quantity}`)
    .join(',');
  const digest = createHash('sha256')
    .update(`${attemptId}|${phone}|${cart}`)
    .digest('hex');
  return `FORM-${digest.slice(0, 16).toUpperCase()}`;
}
