import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { verifySignature } from './signature.ts';

const SECRET = 'whsec_test_secret';
const BODY =
  '{"id":"d1","event":"order.paid","data":{"reference":"FORM-TEST0001"}}';
const NOW_MS = Date.UTC(2026, 10, 19, 12, 0, 0);
const NOW_S = NOW_MS / 1000;

// Built by hand, exactly as PickSpot documents it.
function sign(body: string, secret: string, t: number): string {
  return `t=${t},v1=${createHmac('sha256', secret).update(`${t}.${body}`).digest('hex')}`;
}
const reasonOf = (check: ReturnType<typeof verifySignature>) =>
  check.valid ? 'valid' : check.reason;

test('accepts a signature made exactly as the docs describe', () => {
  assert.deepEqual(
    verifySignature(BODY, sign(BODY, SECRET, NOW_S), SECRET, NOW_MS),
    { valid: true },
  );
});

test('accepts a timestamp up to 5 minutes away, in either direction', () => {
  for (const t of [NOW_S - 300, NOW_S + 300]) {
    assert.equal(
      verifySignature(BODY, sign(BODY, SECRET, t), SECRET, NOW_MS).valid,
      true,
    );
  }
});

test('rejects a stale timestamp, and one too far in the future', () => {
  for (const t of [NOW_S - 301, NOW_S + 301]) {
    assert.match(
      reasonOf(verifySignature(BODY, sign(BODY, SECRET, t), SECRET, NOW_MS)),
      /5 minutes/,
    );
  }
});

test('rejects a signature made with another secret', () => {
  assert.match(
    reasonOf(
      verifySignature(BODY, sign(BODY, 'whsec_other', NOW_S), SECRET, NOW_MS),
    ),
    /does not match/,
  );
});

test('rejects a body that was altered after signing', () => {
  const tampered = BODY.replace('order.paid', 'order.delivered');
  assert.match(
    reasonOf(
      verifySignature(tampered, sign(BODY, SECRET, NOW_S), SECRET, NOW_MS),
    ),
    /does not match/,
  );
});

test('rejects a timestamp that was changed to look fresh', () => {
  const refreshed = sign(BODY, SECRET, NOW_S - 3600).replace(
    `t=${NOW_S - 3600}`,
    `t=${NOW_S}`,
  );
  assert.match(
    reasonOf(verifySignature(BODY, refreshed, SECRET, NOW_MS)),
    /does not match/,
  );
});

test('rejects a signature over the body alone (the old, wrong scheme)', () => {
  const bodyOnly = createHmac('sha256', SECRET).update(BODY).digest('hex');
  assert.match(
    reasonOf(verifySignature(BODY, bodyOnly, SECRET, NOW_MS)),
    /Malformed/,
  );
  assert.match(
    reasonOf(
      verifySignature(BODY, `t=${NOW_S},v1=${bodyOnly}`, SECRET, NOW_MS),
    ),
    /does not match/,
  );
});

test('rejects a missing or malformed header', () => {
  assert.match(
    reasonOf(verifySignature(BODY, null, SECRET, NOW_MS)),
    /Missing/,
  );
  for (const header of [
    '',
    'nonsense',
    `t=${NOW_S}`,
    `v1=${'a'.repeat(64)}`,
    `t=${NOW_S},v1=abc`,
    `t=abc,v1=${'a'.repeat(64)}`,
  ]) {
    assert.equal(
      verifySignature(BODY, header, SECRET, NOW_MS).valid,
      false,
      header,
    );
  }
});

test('accepts nothing when no secret is configured', () => {
  for (const secret of [undefined, '']) {
    assert.match(
      reasonOf(verifySignature(BODY, sign(BODY, '', NOW_S), secret, NOW_MS)),
      /No signing secret/,
    );
    assert.match(
      reasonOf(verifySignature(BODY, null, secret, NOW_MS)),
      /No signing secret/,
    );
  }
});
