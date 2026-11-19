import { test } from 'node:test';
import assert from 'node:assert/strict';
import { claimLinkOf, toPublicOrder } from './public-order.ts';
import type { PickspotOrder } from './types';

const full = {
  orderId: 'claim_1',
  kind: 'CLAIM',
  reference: 'FORM-TEST0001',
  status: 'AWAITING_RECIPIENT',
  rawStatus: 'PENDING',
  parcelCode: null,
  claimId: 'claim_1',
  recipient: {
    handle: 'someone@pickspot.world',
    phone: '+254712345678',
    displayName: 'Some One',
  },
  claim: {
    claimUrl: 'https://claim.example/c/1',
    branchUrl: 'https://branch.example/c/1',
    expiresAt: '2026-11-20T10:00:00.000Z',
    whatsapp: 'sent',
  },
  pricing: {
    currency: 'KES',
    itemValue: 2900,
    deliveryFee: 180,
    platformFee: 50,
    total: 3130,
  },
  dispatch: {
    scheduledFor: '2026-11-19T14:00:00.000Z',
    scheduleReason: 'IN_WINDOW',
    status: 'x',
    trackingUrl: 'https://track.example/secret',
    courier: { name: 'Rider One', phone: '+254700000001' },
  },
  autoDispatch: true,
  integration: {
    platform: 'CUSTOM',
    storeUrl: 'https://shop.example',
    orderUrl: null,
  },
  createdAt: '2026-11-19T10:00:00.000Z',
  updatedAt: '2026-11-19T10:00:00.000Z',
  somethingPickspotAddsLater: { secret: 'value' },
} as unknown as PickspotOrder;

test('only the fields the order page shows are kept', () => {
  assert.deepEqual(toPublicOrder(full), {
    orderId: 'claim_1',
    kind: 'CLAIM',
    reference: 'FORM-TEST0001',
    status: 'AWAITING_RECIPIENT',
    parcelCode: null,
    claim: { whatsapp: 'sent', expiresAt: '2026-11-20T10:00:00.000Z' },
    pricing: {
      itemValue: 2900,
      deliveryFee: 180,
      platformFee: 50,
      total: 3130,
    },
    dispatch: {
      scheduledFor: '2026-11-19T14:00:00.000Z',
      courierName: 'Rider One',
    },
  });
});

test('no personal detail or private link survives, wherever it sits', () => {
  const sent = JSON.stringify(toPublicOrder(full));
  for (const secret of [
    '+254712345678',
    'someone@pickspot.world',
    'Some One',
    'claim.example',
    'branch.example',
    'track.example',
    '+254700000001',
    'somethingPickspotAddsLater',
    'recipient',
  ]) {
    assert.equal(sent.includes(secret), false, secret);
  }
});

test('missing parts become null rather than breaking', () => {
  const bare = toPublicOrder({
    orderId: 'PS-KE-TEST0001',
    kind: 'PARCEL',
    status: 'PAID',
  } as PickspotOrder);
  assert.deepEqual(bare, {
    orderId: 'PS-KE-TEST0001',
    kind: 'PARCEL',
    reference: null,
    status: 'PAID',
    parcelCode: null,
    claim: null,
    pricing: null,
    dispatch: null,
  });
});

test("the customer's link must be an https address", () => {
  assert.equal(claimLinkOf(full), 'https://claim.example/c/1');
  assert.equal(
    claimLinkOf({
      ...full,
      claim: { branchUrl: 'https://branch.example/c/1' },
    } as PickspotOrder),
    'https://branch.example/c/1',
  );
  assert.equal(
    claimLinkOf({
      ...full,
      claim: { claimUrl: 'javascript:alert(1)' },
    } as PickspotOrder),
    null,
  );
  assert.equal(claimLinkOf({ ...full, claim: null } as PickspotOrder), null);
});
