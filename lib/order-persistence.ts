import 'server-only';
import { getSupabase } from './supabase-server';
import type { CartItem, PickspotOrder } from './types';

export interface SaveOrderParams {
  reference: string;
  checkoutMethod: 'pickspot' | 'standard';
  status: string;
  kind?: 'PARCEL' | 'CLAIM' | null;
  recipientPhone?: string;
  recipientEmail?: string;
  recipientName?: string;
  subtotalKes: number;
  deliveryFeeKes?: number | null;
  serviceFeeKes?: number | null;
  totalKes?: number | null;
  claimUrl?: string | null;
  pickspotOrderId?: string;
  pickspotParcelCode?: string | null;
  pickspotResponse?: PickspotOrder | null;
  pickspotUpdatedAt?: string | null;
  items: CartItem[];
}

const UNIQUE_VIOLATION = '23505';

// Saves an order and its items. True when the order is in the database
// afterwards, including when it was already there (the same reference saved
// twice is the same order, so a retried checkout does not fail or duplicate).
export async function saveOrderToDatabase(
  params: SaveOrderParams,
): Promise<boolean> {
  try {
    const supabase = getSupabase();
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        reference: params.reference,
        checkout_method: params.checkoutMethod,
        status: params.status,
        kind: params.kind || null,
        recipient_phone: params.recipientPhone || null,
        recipient_email: params.recipientEmail || null,
        recipient_name: params.recipientName || null,
        subtotal_kes: params.subtotalKes,
        delivery_fee_kes: params.deliveryFeeKes ?? null,
        service_fee_kes: params.serviceFeeKes ?? null,
        total_kes: params.totalKes ?? null,
        claim_url: params.claimUrl || null,
        pickspot_order_id: params.pickspotOrderId || null,
        pickspot_parcel_code: params.pickspotParcelCode || null,
        pickspot_response: params.pickspotResponse ?? null,
        pickspot_updated_at: params.pickspotUpdatedAt ?? null,
      })
      .select('id')
      .single();

    if (orderError?.code === UNIQUE_VIOLATION) return true;
    if (orderError || !order) {
      console.error(
        `[saveOrder] ${params.reference} was not saved:`,
        orderError?.message,
      );
      return false;
    }

    const { error: itemsError } = await supabase.from('order_items').insert(
      params.items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.name,
        product_subtitle: item.subtitle,
        product_size: item.size,
        unit_price_kes: item.priceKES,
        quantity: item.quantity,
        line_total_kes: item.priceKES * item.quantity,
        image_url: item.image,
      })),
    );

    if (itemsError) {
      // No order without its items: remove the row so a retry can save both.
      console.error(
        `[saveOrder] items of ${params.reference} were not saved:`,
        itemsError.message,
      );
      await supabase.from('orders').delete().eq('id', order.id);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[saveOrder] ${params.reference} was not saved:`, err);
    return false;
  }
}

export type OrderUpdateOutcome =
  'applied' | 'stale' | 'duplicate' | 'unknown_reference';

// Hands PickSpot's view of an order to the database, which decides in one step
// whether it is news (see supabase/migrations/20261119090000_pickspot_order_updates.sql).
// Orders are matched by the shop's own reference, never by PickSpot's orderId,
// which changes when a claim becomes a parcel. Throws when the database cannot
// be reached, so a webhook can answer 5xx and be retried.
export async function applyPickspotOrder(
  order: PickspotOrder,
  eventAt: string,
  delivery?: { id: string; event: string },
): Promise<OrderUpdateOutcome> {
  const { data, error } = await getSupabase().rpc('apply_pickspot_order', {
    p_reference: order.reference ?? null,
    p_event_at: eventAt,
    p_order: order,
    p_delivery_id: delivery?.id ?? null,
    p_event: delivery?.event ?? null,
  });
  if (error) throw new Error(`apply_pickspot_order failed: ${error.message}`);
  return data as OrderUpdateOutcome;
}

// When this number was last sent an order request, newest first, looking back
// `windowSeconds`. The order being placed right now (`exceptReference`) is left
// out, so retrying the same checkout is never counted against itself.
export async function recentOrderTimesForPhone(
  phone: string,
  exceptReference: string,
  windowSeconds: number,
): Promise<number[]> {
  const since = new Date(Date.now() - windowSeconds * 1000).toISOString();
  const { data, error } = await getSupabase()
    .from('orders')
    .select('created_at')
    .eq('recipient_phone', phone)
    .eq('checkout_method', 'pickspot')
    .neq('reference', exceptReference)
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw new Error(`recent orders lookup failed: ${error.message}`);
  return (data ?? []).map((row) => Date.parse(row.created_at as string));
}

// Picture keys PickSpot gave for product pictures, per PickSpot account, so
// each picture is uploaded once and reused across orders and restarts.
export async function getSavedImageKeys(
  account: string,
  imagePaths: string[],
): Promise<Map<string, string>> {
  const { data, error } = await getSupabase()
    .from('pickspot_image_keys')
    .select('image_path, image_key')
    .eq('pickspot_account', account)
    .in('image_path', imagePaths);
  if (error) throw new Error(`image keys lookup failed: ${error.message}`);
  return new Map(
    (data ?? []).map((row) => [
      row.image_path as string,
      row.image_key as string,
    ]),
  );
}

export async function saveImageKey(
  account: string,
  imagePath: string,
  imageKey: string,
): Promise<void> {
  const { error } = await getSupabase()
    .from('pickspot_image_keys')
    .upsert(
      { pickspot_account: account, image_path: imagePath, image_key: imageKey },
      { onConflict: 'pickspot_account,image_path' },
    );
  if (error) throw new Error(`image key was not saved: ${error.message}`);
}
