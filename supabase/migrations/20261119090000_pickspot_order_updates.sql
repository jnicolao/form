/*
# Applying PickSpot's order updates safely

## Why
PickSpot tells the shop about an order twice over: by webhook, and when the
shop asks. Webhook deliveries can repeat and can arrive out of order, and
PickSpot's `orderId` changes when a claim becomes a parcel. The shop's own
`reference` never changes, so it is the key used here.

## What is added
1. `orders.pickspot_updated_at` — PickSpot's own time for the state the row
   holds. An update older than this is ignored, so an order never moves
   backwards.
2. `pickspot_webhook_deliveries` — one row per webhook delivery, keyed by
   PickSpot's delivery id. A delivery seen before changes nothing.
3. `apply_pickspot_order(...)` — records the delivery and updates the order in
   one transaction, and says what happened:
   - `duplicate`          this delivery id was already handled
   - `unknown_reference`  no order with that reference
   - `stale`              older than what the row already holds
   - `applied`            the order was updated

## Security
- The new table has row-level security enabled with no policies, and no
  privileges for `anon` or `authenticated`.
- The function runs with the caller's rights, has a fixed search_path, and can
  be executed by `service_role` only.
*/

ALTER TABLE orders ADD COLUMN IF NOT EXISTS pickspot_updated_at timestamptz;

CREATE TABLE IF NOT EXISTS pickspot_webhook_deliveries (
  id text PRIMARY KEY,
  event text NOT NULL,
  reference text,
  outcome text NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE pickspot_webhook_deliveries ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON pickspot_webhook_deliveries FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON pickspot_webhook_deliveries TO service_role;

CREATE OR REPLACE FUNCTION apply_pickspot_order(
  p_reference text,
  p_event_at timestamptz,
  p_order jsonb,
  p_delivery_id text DEFAULT NULL,
  p_event text DEFAULT NULL
) RETURNS text
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  v_rows integer;
  v_outcome text;
BEGIN
  IF p_delivery_id IS NOT NULL THEN
    INSERT INTO public.pickspot_webhook_deliveries (id, event, reference, outcome)
    VALUES (p_delivery_id, COALESCE(p_event, ''), p_reference, 'pending')
    ON CONFLICT (id) DO NOTHING;
    IF NOT FOUND THEN
      RETURN 'duplicate';
    END IF;
  END IF;

  UPDATE public.orders SET
    status = p_order->>'status',
    kind = CASE WHEN p_order->>'kind' IN ('PARCEL', 'CLAIM') THEN p_order->>'kind' ELSE kind END,
    pickspot_order_id = COALESCE(p_order->>'orderId', pickspot_order_id),
    pickspot_parcel_code = COALESCE(p_order->>'parcelCode', pickspot_parcel_code),
    delivery_fee_kes = COALESCE(round((p_order->'pricing'->>'deliveryFee')::numeric)::integer, delivery_fee_kes),
    service_fee_kes = COALESCE(round((p_order->'pricing'->>'platformFee')::numeric)::integer, service_fee_kes),
    total_kes = COALESCE(round((p_order->'pricing'->>'total')::numeric)::integer, total_kes),
    pickspot_response = p_order,
    pickspot_updated_at = p_event_at
  WHERE reference = p_reference
    AND p_order->>'status' IS NOT NULL
    AND (pickspot_updated_at IS NULL OR pickspot_updated_at <= p_event_at);
  GET DIAGNOSTICS v_rows = ROW_COUNT;

  IF v_rows > 0 THEN
    v_outcome := 'applied';
  ELSIF EXISTS (SELECT 1 FROM public.orders WHERE reference = p_reference) THEN
    v_outcome := 'stale';
  ELSE
    v_outcome := 'unknown_reference';
  END IF;

  IF p_delivery_id IS NOT NULL THEN
    UPDATE public.pickspot_webhook_deliveries SET outcome = v_outcome WHERE id = p_delivery_id;
  END IF;
  RETURN v_outcome;
END;
$$;

REVOKE EXECUTE ON FUNCTION apply_pickspot_order(text, timestamptz, jsonb, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION apply_pickspot_order(text, timestamptz, jsonb, text, text) TO service_role;
