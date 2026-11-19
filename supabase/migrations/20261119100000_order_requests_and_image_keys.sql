/*
# Order-request limits and saved picture keys

## What is added
1. An index on `orders (recipient_phone, created_at)`. Before sending a new
   order request, the site checks how recently the same number was sent one.
2. `pickspot_image_keys` — the key PickSpot returns for each product picture,
   per PickSpot account, so a picture is uploaded once and reused.
   - `pickspot_account` is a short hash of the PickSpot address and API key.
     It identifies the account without storing the key.

## Security
The new table has row-level security enabled with no policies and no
privileges for `anon` or `authenticated`. Only `service_role` (server code)
can use it.
*/

CREATE INDEX IF NOT EXISTS idx_orders_recipient_phone_created_at ON orders (recipient_phone, created_at DESC);

CREATE TABLE IF NOT EXISTS pickspot_image_keys (
  pickspot_account text NOT NULL,
  image_path text NOT NULL,
  image_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (pickspot_account, image_path)
);

ALTER TABLE pickspot_image_keys ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON pickspot_image_keys FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON pickspot_image_keys TO service_role;
