/*
# Lock down orders and order_items

## Why
The first migration let the `anon` and `authenticated` roles read, add, change
and delete every row. The anon key ships inside the site's browser code, so
anyone could download or wipe the order records (phone numbers, names, emails
and PickSpot claim links).

## What changes
1. All eight `USING (true)` policies are dropped.
2. Every table privilege is revoked from `anon` and `authenticated`.
3. Row-level security stays enabled with no policies, so those roles are still
   refused even if a privilege is granted again by mistake.
4. `service_role` is granted access explicitly. It is the only role the site
   uses now, from server code only (see lib/supabase-server.ts).
5. `update_updated_at()` gets a fixed search_path.

## Before applying
Deploy the site with SUPABASE_URL and SUPABASE_SECRET_KEY set first. A
site still running the old code would stop being able to save orders.
*/

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
DROP POLICY IF EXISTS "anon_update_orders" ON orders;
DROP POLICY IF EXISTS "anon_delete_orders" ON orders;

DROP POLICY IF EXISTS "anon_select_order_items" ON order_items;
DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
DROP POLICY IF EXISTS "anon_update_order_items" ON order_items;
DROP POLICY IF EXISTS "anon_delete_order_items" ON order_items;

REVOKE ALL ON orders, order_items FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON orders, order_items TO service_role;

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

ALTER FUNCTION update_updated_at() SET search_path = '';
