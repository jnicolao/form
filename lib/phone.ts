// Kenyan mobile numbers only: the checkout shows a fixed +254 prefix.
// 0712 345 678, 712345678, 254712345678, +254 712-345-678, +254 0712 345 678
// and 00254712345678 all become +254712345678. Anything else is null.
export function normalizeKePhone(input: string): string | null {
  const digits = input.replace(/\D/g, '').replace(/^00/, '');
  const match = /^(?:254)?0?([17]\d{8})$/.exec(digits);
  return match ? `+254${match[1]}` : null;
}

export function getPhoneError(value: string): string {
  if (value.replace(/\D/g, '').length === 0)
    return 'Enter your WhatsApp number.';
  return normalizeKePhone(value)
    ? ''
    : 'Enter a valid Kenyan mobile number (e.g. 712 345 678).';
}

// The nine digits after +254, or the digits as typed when they are not a number yet.
export function toLocalDigits(value: string): string {
  return normalizeKePhone(value)?.slice(4) ?? value.replace(/\D/g, '');
}

export function formatDisplayPhone(value: string): string {
  return `+254 ${toLocalDigits(value)}`;
}
