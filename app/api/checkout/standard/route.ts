import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { z } from 'zod';
import { cartSubtotal, parseCartItems } from '@/lib/checkout';
import { saveOrderToDatabase } from '@/lib/order-persistence';
import {
  STANDARD_DELIVERY_FEE_KES,
  STANDARD_PROCESSING_FEE_KES,
} from '@/lib/products';

// The demo checkout's only server step: keep a record of the demo order. The
// browser sends product ids and quantities; prices, fees and the reference are
// decided here.
const contactSchema = z.object({
  email: z.string().trim().email().max(254),
  firstName: z.string().trim().min(1).max(100),
  middleName: z.string().trim().max(100).optional(),
  lastName: z.string().trim().min(1).max(100),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const contact = contactSchema.safeParse(body);
  const items = parseCartItems((body as { items?: unknown } | null)?.items);
  if (!contact.success || !items) {
    return NextResponse.json(
      { error: 'Check your details and try again.', code: 'INVALID_REQUEST' },
      { status: 400 },
    );
  }

  const subtotal = cartSubtotal(items);
  const saved = await saveOrderToDatabase({
    reference: `FORM-STD-${randomBytes(8).toString('hex').toUpperCase()}`,
    checkoutMethod: 'standard',
    status: 'DEMO_RECEIVED',
    recipientEmail: contact.data.email,
    recipientName: [
      contact.data.firstName,
      contact.data.middleName,
      contact.data.lastName,
    ]
      .filter(Boolean)
      .join(' '),
    subtotalKes: subtotal,
    deliveryFeeKes: STANDARD_DELIVERY_FEE_KES,
    serviceFeeKes: STANDARD_PROCESSING_FEE_KES,
    totalKes:
      subtotal + STANDARD_DELIVERY_FEE_KES + STANDARD_PROCESSING_FEE_KES,
    items,
  });
  if (!saved)
    return NextResponse.json(
      { error: 'Could not save the order.', code: 'NOT_SAVED' },
      { status: 503 },
    );
  return NextResponse.json({ ok: true });
}
