/*
# Create orders and order_items tables for FORM. store

## Purpose
Persists orders created through both checkout methods (PickSpot and standard demo checkout)
so they can be tracked across devices and sessions. Previously orders were only stored in
browser localStorage, which is lost when switching devices or clearing browser data.

## New Tables

### orders
- `id` (uuid, primary key)
- `reference` (text, unique, not null) - the store order reference (e.g. FORM-XXXX)
- `pickspot_order_id` (text, nullable) - the orderId returned by the PickSpot API
- `pickspot_parcel_code` (text, nullable) - the parcel code from PickSpot (e.g. PS-KE-XXXX)
- `checkout_method` (text, not null) - 'pickspot' or 'standard'
- `status` (text, not null, default 'AWAITING_RECIPIENT') - current order status
- `kind` (text, nullable) - 'PARCEL' or 'CLAIM' (PickSpot order kind)
- `recipient_phone` (text, nullable) - customer WhatsApp number for PickSpot orders
- `recipient_handle` (text, nullable) - customer PickSpot handle if matched
- `recipient_email` (text, nullable) - customer email for standard checkout
- `recipient_name` (text, nullable) - customer name for standard checkout
- `subtotal_kes` (integer, not null) - product subtotal in KES
- `delivery_fee_kes` (integer, nullable) - delivery fee in KES
- `service_fee_kes` (integer, nullable) - PickSpot service fee in KES
- `total_kes` (integer, nullable) - final total in KES
- `claim_url` (text, nullable) - PickSpot claim/branch URL
- `pickspot_response` (jsonb, nullable) - full PickSpot API response for debugging
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

### order_items
- `id` (uuid, primary key)
- `order_id` (uuid, foreign key to orders.id ON DELETE CASCADE)
- `product_id` (text, not null) - e.g. FORM-001
- `product_name` (text, not null)
- `product_subtitle` (text, nullable) - ingredient/size info
- `product_size` (text, nullable)
- `unit_price_kes` (integer, not null)
- `quantity` (integer, not null)
- `line_total_kes` (integer, not null) - unit_price * quantity
- `image_url` (text, nullable)
- `created_at` (timestamptz, default now())

## Security
- Both tables have RLS enabled.
- Both tables grant CRUD to `anon` and `authenticated` (single-tenant, no sign-in).
- All policies use `USING (true)` / `WITH CHECK (true)` because this is a demo store
  with no user accounts - all data is intentionally public/shared.

## Notes
1. `pickspot_response` stores the full API response as JSONB for audit/debugging.
2. `updated_at` is maintained via a trigger to track status changes.
3. The `reference` column has a unique constraint to support idempotent retries.
4. Indexes on `reference` and `pickspot_order_id` for fast lookups.
*/

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE NOT NULL,
  pickspot_order_id text,
  pickspot_parcel_code text,
  checkout_method text NOT NULL CHECK (checkout_method IN ('pickspot', 'standard')),
  status text NOT NULL DEFAULT 'AWAITING_RECIPIENT',
  kind text CHECK (kind IN ('PARCEL', 'CLAIM') OR kind IS NULL),
  recipient_phone text,
  recipient_handle text,
  recipient_email text,
  recipient_name text,
  subtotal_kes integer NOT NULL,
  delivery_fee_kes integer,
  service_fee_kes integer,
  total_kes integer,
  claim_url text,
  pickspot_response jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  product_name text NOT NULL,
  product_subtitle text,
  product_size text,
  unit_price_kes integer NOT NULL,
  quantity integer NOT NULL CHECK (quantity >= 1),
  line_total_kes integer NOT NULL,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_orders_reference ON orders(reference);
CREATE INDEX IF NOT EXISTS idx_orders_pickspot_order_id ON orders(pickspot_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Grants: single-tenant demo store, no auth, all data is public/shared
GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON order_items TO anon, authenticated;

-- Orders policies (single-tenant: all data is intentionally shared)
DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);

-- Order items policies (single-tenant: all data is intentionally shared)
DROP POLICY IF EXISTS "anon_select_order_items" ON order_items;
CREATE POLICY "anon_select_order_items" ON order_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_order_items" ON order_items;
CREATE POLICY "anon_update_order_items" ON order_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_order_items" ON order_items;
CREATE POLICY "anon_delete_order_items" ON order_items FOR DELETE
  TO anon, authenticated USING (true);

-- Auto-update updated_at on orders
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
