import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatDisplayPhone,
  getPhoneError,
  normalizeKePhone,
  toLocalDigits,
} from './phone.ts';

test('every usual way of typing a Kenyan mobile number gives the same E.164 number', () => {
  for (const typed of [
    '0712 345 678',
    '712345678',
    '254712345678',
    '+254712345678',
    '+254 712-345-678',
    '+254 0712 345 678',
    '(0712) 345678',
    '00254712345678',
    ' 0712345678 ',
  ]) {
    assert.equal(normalizeKePhone(typed), '+254712345678', typed);
  }
  assert.equal(normalizeKePhone('0112345678'), '+254112345678');
  assert.equal(normalizeKePhone('112 345 678'), '+254112345678');
});

test('anything that is not a Kenyan mobile number is refused', () => {
  for (const typed of [
    '',
    'hello',
    '0712',
    '12345',
    '0000000000',
    '0212345678',
    '0812345678',
    '07123456789',
    '071234567',
    '+447911123456',
    '2547123456789',
    '25471234567',
    '0012345678',
    '+254 0000 000 000',
  ]) {
    assert.equal(normalizeKePhone(typed), null, typed);
  }
});

test('the checkout message matches the rule', () => {
  assert.equal(getPhoneError(''), 'Enter your WhatsApp number.');
  assert.equal(getPhoneError('0712 345 678'), '');
  assert.match(getPhoneError('0000000000'), /valid Kenyan mobile number/);
});

test('numbers are shown with the +254 prefix and no leading zero', () => {
  assert.equal(toLocalDigits('+254 0712 345 678'), '712345678');
  assert.equal(formatDisplayPhone('0712345678'), '+254 712345678');
  assert.equal(toLocalDigits('07'), '07');
});
