import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cartSubtotal, orderReference, parseCartItems } from './checkout.ts';

test('a valid cart is rebuilt from the catalogue', () => {
  const lines = parseCartItems([
    { productId: 'FORM-001', quantity: 2 },
    { productId: 'FORM-002', quantity: 1 },
  ]);
  assert.ok(lines);
  assert.deepEqual(
    lines.map((l) => [l.productId, l.name, l.priceKES, l.quantity]),
    [
      ['FORM-001', 'Daily Face Cleanser', 1250, 2],
      ['FORM-002', 'Oil Control Serum', 1650, 1],
    ],
  );
  assert.equal(cartSubtotal(lines), 4150);
});

test('a price or name sent by the browser is ignored', () => {
  const lines = parseCartItems([
    { productId: 'FORM-001', quantity: 1, priceKES: 1, name: 'Free' },
  ]);
  assert.equal(lines?.[0].priceKES, 1250);
  assert.equal(lines?.[0].name, 'Daily Face Cleanser');
});

test('anything that is not a list of real products is refused', () => {
  for (const input of [
    undefined,
    null,
    'x',
    {},
    [],
    [null],
    [{}],
    [{ productId: 'NOPE', quantity: 1 }],
    [{ productId: 7, quantity: 1 }],
  ]) {
    assert.equal(parseCartItems(input), null, JSON.stringify(input));
  }
});

test('quantities must be whole numbers from 1 to 99', () => {
  for (const quantity of [
    0,
    -1,
    1.5,
    100,
    1e9,
    '2',
    null,
    undefined,
    NaN,
    Infinity,
  ]) {
    assert.equal(
      parseCartItems([{ productId: 'FORM-001', quantity }]),
      null,
      String(quantity),
    );
  }
  assert.equal(
    parseCartItems([{ productId: 'FORM-001', quantity: 99 }])?.[0].quantity,
    99,
  );
});

test('a product may appear only once, so the cap cannot be sidestepped', () => {
  assert.equal(
    parseCartItems([
      { productId: 'FORM-001', quantity: 99 },
      { productId: 'FORM-001', quantity: 99 },
    ]),
    null,
  );
  assert.equal(
    parseCartItems(
      Array.from({ length: 50 }, () => ({
        productId: 'FORM-001',
        quantity: 1,
      })),
    ),
    null,
  );
});

const ATTEMPT = '0123456789abcdef0123456789abcdef';
const PHONE = '+254712345678';
const cart = (quantity = 1) =>
  parseCartItems([{ productId: 'FORM-001', quantity }])!;

test('retrying the same order always gives the same order number', () => {
  const reference = orderReference(ATTEMPT, PHONE, cart());
  assert.match(reference ?? '', /^FORM-[0-9A-F]{16}$/);
  assert.equal(orderReference(ATTEMPT, PHONE, cart()), reference);
});

test('another visit, another number or another cart is another order', () => {
  const reference = orderReference(ATTEMPT, PHONE, cart());
  assert.notEqual(
    orderReference('1123456789abcdef0123456789abcdef', PHONE, cart()),
    reference,
  );
  assert.notEqual(orderReference(ATTEMPT, '+254712345679', cart()), reference);
  assert.notEqual(orderReference(ATTEMPT, PHONE, cart(2)), reference);
});

test('the order number gives away neither the attempt id nor the phone number', () => {
  const reference = orderReference(ATTEMPT, PHONE, cart()) ?? '';
  assert.equal(reference.toLowerCase().includes(ATTEMPT.slice(0, 8)), false);
  assert.equal(reference.includes('712345678'), false);
});

test('an attempt id must be 32 lowercase hex characters', () => {
  for (const bad of [
    undefined,
    null,
    7,
    '',
    'abc',
    ATTEMPT.toUpperCase(),
    `${ATTEMPT}0`,
    'FORM-0123456789ABCDEF',
    '../../x',
  ]) {
    assert.equal(orderReference(bad, PHONE, cart()), null, String(bad));
  }
});
