/*
# Create orders and order_items tables for customer order history

## Overview
Adds two new tables to store customer orders and their line items, so that
authenticated customers can view their past orders and reorder them.

## New Tables

### `orders`
- `id` (uuid, primary key, auto-generated)
- `user_id` (uuid, not null, defaults to the authenticated user, references auth.users with cascade delete)
- `customer_name` (text, not null) — display name provided at checkout
- `customer_phone` (text, not null) — contact phone provided at checkout
- `total` (numeric, not null, default 0) — total order value in COP
- `status` (text, not null, default 'pendiente') — order status
- `created_at` (timestamptz, default now())

### `order_items`
- `id` (uuid, primary key, auto-generated)
- `order_id` (uuid, not null, references orders with cascade delete)
- `product_name` (text, not null) — snapshot of product name at time of order
- `product_price` (numeric, not null) — snapshot of unit price at time of order
- `product_image` (text) — snapshot of product image URL
- `quantity` (integer, not null, default 1)

## Security
- RLS enabled on both tables.
- `orders`: owner-scoped CRUD — each authenticated user can only see/modify their own orders.
  - SELECT, INSERT, UPDATE, DELETE all check auth.uid() = user_id.
  - user_id has DEFAULT auth.uid() so client inserts omitting user_id succeed.
- `order_items`: scoped through the parent order — a user can read/insert order items
  only if they own the parent order.
  - SELECT: EXISTS check on parent order ownership.
  - INSERT: WITH CHECK that the parent order belongs to the user.
  - DELETE: USING check on parent order ownership.
  - No UPDATE policy (order items are immutable once created).

## Important Notes
1. Both tables use `DEFAULT auth.uid()` or parent-ownership checks so the
   frontend can insert without manually threading the user ID.
2. Order items store snapshots of product name, price, and image so that
   historical orders remain accurate even if the admin later edits or
   deletes a product from the catalog.
3. Cascade deletes ensure that deleting an order also removes its items.
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pendiente',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders"
ON orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders"
ON orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_orders" ON orders;
CREATE POLICY "update_own_orders"
ON orders FOR UPDATE
TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_orders" ON orders;
CREATE POLICY "delete_own_orders"
ON orders FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_name text NOT NULL,
  product_price numeric NOT NULL,
  product_image text,
  quantity integer NOT NULL DEFAULT 1
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_order_items" ON order_items;
CREATE POLICY "select_own_order_items"
ON order_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "insert_own_order_items" ON order_items;
CREATE POLICY "insert_own_order_items"
ON order_items FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "delete_own_order_items" ON order_items;
CREATE POLICY "delete_own_order_items"
ON order_items FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
