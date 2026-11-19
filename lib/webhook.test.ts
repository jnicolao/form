import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseWebhookEvent } from './webhook.ts';

const RECEIVED = new Date('2026-11-19T12:00:00.000Z');
const envelope = (
  overrides: Record<string, unknown> = {},
  data: Record<string, unknown> = {},
) =>
  JSON.stringify({
    id: '0b6f2a3e-0000-4000-8000-000000000001',
    event: 'order.paid',
    createdAt: '2026-11-19T11:59:58.000Z',
    data: {
      orderId: 'PS-KE-TEST0001',
      reference: 'FORM-TEST0001',
      status: 'PAID',
      updatedAt: '2026-11-19T11:59:57.000Z',
      ...data,
    },
    ...overrides,
  });

test("reads PickSpot's envelope", () => {
  const event = parseWebhookEvent(envelope(), RECEIVED);
  assert.ok(event);
  assert.equal(event.deliveryId, '0b6f2a3e-0000-4000-8000-000000000001');
  assert.equal(event.event, 'order.paid');
  assert.equal(event.reference, 'FORM-TEST0001');
  assert.equal(event.order.status, 'PAID');
  assert.equal(event.eventAt, '2026-11-19T11:59:57.000Z');
});

test("the order's own time decides new from old, then the delivery's, then now", () => {
  assert.equal(
    parseWebhookEvent(envelope({}, { updatedAt: null }), RECEIVED)?.eventAt,
    '2026-11-19T11:59:58.000Z',
  );
  assert.equal(
    parseWebhookEvent(
      envelope({ createdAt: 'not a date' }, { updatedAt: 'nor this' }),
      RECEIVED,
    )?.eventAt,
    RECEIVED.toISOString(),
  );
});

test('an order number is not required to be an update (it is then matched to nothing)', () => {
  assert.equal(
    parseWebhookEvent(envelope({}, { reference: null }), RECEIVED)?.reference,
    null,
  );
});

test('the old top-level { orderId, status } shape is not an update', () => {
  assert.equal(
    parseWebhookEvent(
      '{"orderId":"made-up-id","status":"DELIVERED"}',
      RECEIVED,
    ),
    null,
  );
});

test('anything missing an id, an event or a status is refused', () => {
  for (const body of [
    'hello',
    '',
    'null',
    '[]',
    '"text"',
    '{}',
    envelope({ id: undefined }),
    envelope({ id: 7 }),
    envelope({ event: '' }),
    envelope({ data: null }),
    envelope({ data: 'x' }),
    envelope({}, { status: undefined }),
    envelope({}, { status: 5 }),
  ]) {
    assert.equal(parseWebhookEvent(body, RECEIVED), null, body);
  }
});
