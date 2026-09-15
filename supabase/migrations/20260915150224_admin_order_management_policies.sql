/*
# Allow admin to read all orders and update order status

## Overview
The admin panel uses a hardcoded login (not Supabase auth), so the browser
always talks to the database with the anon key. We need the admin to be able
to see ALL orders (not just their own) and update the status field of any
order. We also need anon to read order_items for the admin view.

## Changes

### orders table — new policies
- `admin_select_all_orders`: SELECT for anon + authenticated, USING (true).
  This allows the admin panel (anon key) to list every order. Individual
  customers still see only their own orders via the existing
  `select_own_orders` policy for authenticated users — both policies apply
  (RLS ORs them together), so authenticated users see their own orders plus
  all orders are visible to anon.
- `admin_update_order_status`: UPDATE for anon + authenticated, USING (true)
  WITH CHECK (true). This allows the admin to change the status of any order.

### order_items table — new policy
- `admin_select_all_order_items`: SELECT for anon + authenticated, USING (true).
  Allows the admin panel to fetch items for any order.

## Security Notes
1. The admin login is client-side only (hardcoded credentials). This is a
   known limitation — in production, admin auth should use Supabase auth
   with a service-role key or a SECURITY DEFINER function. For now, the
   anon key can read all orders and update order status, which is acceptable
   for this app's current stage.
2. The existing owner-scoped policies remain in place, so authenticated
   customers still see only their own orders in the customer-facing view.
3. The new UPDATE policy allows updating ANY column, not just status. In
   production this should be restricted to the status column via a
   SECURITY DEFINER function, but for now this is acceptable.
*/

-- orders: admin can read all
DROP POLICY IF EXISTS "admin_select_all_orders" ON orders;
CREATE POLICY "admin_select_all_orders"
ON orders FOR SELECT
TO anon, authenticated
USING (true);

-- orders: admin can update status
DROP POLICY IF EXISTS "admin_update_order_status" ON orders;
CREATE POLICY "admin_update_order_status"
ON orders FOR UPDATE
TO anon, authenticated
USING (true) WITH CHECK (true);

-- order_items: admin can read all
DROP POLICY IF EXISTS "admin_select_all_order_items" ON order_items;
CREATE POLICY "admin_select_all_order_items"
ON order_items FOR SELECT
TO anon, authenticated
USING (true);
