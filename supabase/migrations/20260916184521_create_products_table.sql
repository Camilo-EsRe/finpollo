/*
# Create products table for shared catalog

## Overview
The product catalog currently lives in localStorage (browser storage),
which means changes made by the admin are only visible to that browser.
This migration creates a `products` table in Supabase so the catalog is
shared across all users and updates are visible in real time.

## New Table

### `products`
- `id` (text, primary key) — product identifier (e.g. "p001")
- `name` (text, not null) — product name
- `price` (numeric, not null, default 0) — price in COP
- `category` (text, not null) — category name
- `image` (text, not null) — image URL
- `description` (text) — optional product description
- `stock` (integer, not null, default 0) — stock quantity
- `created_at` (timestamptz, default now())

## Security
- RLS enabled on `products`.
- Public read (anon + authenticated) so all visitors see the catalog.
- Public write (anon + authenticated) so the admin panel can add/edit/delete.
  The admin login is client-side only (same pattern as orders table).
- 4 separate policies: SELECT, INSERT, UPDATE, DELETE.

## Seed Data
- Inserts the 12 initial products from seedProducts.ts using INSERT ... ON CONFLICT DO NOTHING to be idempotent.
*/

CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  category text NOT NULL,
  image text NOT NULL,
  description text,
  stock integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_products" ON products;
CREATE POLICY "select_products"
ON products FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "insert_products" ON products;
CREATE POLICY "insert_products"
ON products FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "update_products" ON products;
CREATE POLICY "update_products"
ON products FOR UPDATE
TO anon, authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_products" ON products;
CREATE POLICY "delete_products"
ON products FOR DELETE
TO anon, authenticated
USING (true);

-- Seed initial products (idempotent)
INSERT INTO products (id, name, price, category, image, description, stock) VALUES
('p001', 'Empaque Papas Cartón 1/2 Libra', 85, 'Empaques', 'https://images.pexels.com/photos/27758755/pexels-photo-27758755.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Caja de papel kraft resistente, ideal para papas fritas medianas. Paquete x100 unidades.', 350),
('p002', 'Caja Takeaway Doble Fondo', 120, 'Empaques', 'https://images.pexels.com/photos/31701975/pexels-photo-31701975.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Contenedor de cartón con revestimiento interior anti-grasa. Paquete x50 unidades.', 200),
('p003', 'Vaso Desechable 12 oz', 65, 'Empaques', 'https://images.pexels.com/photos/692666/pexels-photo-692666.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Vaso de polipapel para bebidas calientes y frías. Paquete x100 unidades.', 500),
('p004', 'Envase Plástico con Tapa', 95, 'Empaques', 'https://images.pexels.com/photos/13969133/pexels-photo-13969133.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Recipientes plásticos reutilizables con tapa hermética. Paquete x50 unidades.', 180),
('p005', 'Servilletas Blancas x500', 42, 'Empaques', 'https://images.pexels.com/photos/37806019/pexels-photo-37806019.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Servilletas de papel absorbente, tamaño estándar. Paquete x500 unidades.', 800),
('p006', 'Escoba de Cepillo Duro', 35, 'Limpieza', 'https://images.pexels.com/photos/33300345/pexels-photo-33300345.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Escoba industrial con cerdas resistentes para pisos de alto tráfico. Unidad.', 120),
('p007', 'Papel Higiénico Industrial x12', 58, 'Limpieza', 'https://images.pexels.com/photos/10760874/pexels-photo-10760874.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Rollos de papel higiénico de doble hoja. Caja x12 unidades.', 240),
('p008', 'Guantes Desechables x100', 48, 'Limpieza', 'https://images.pexels.com/photos/13704354/pexels-photo-13704354.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Guantes de látex desechables para manipulación de alimentos. Caja x100 unidades.', 300),
('p009', 'Salsa Ketchup Galón 3.8L', 145, 'Salsas', 'https://images.pexels.com/photos/30682735/pexels-photo-30682735.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Ketchup en presentación industrial a granel. Galón 3.8 litros.', 90),
('p010', 'Mayonesa Industrial 1kg', 72, 'Salsas', 'https://images.pexels.com/photos/34318136/pexels-photo-34318136.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Mayonesa cremosa para acompañar papas y snacks. Pote 1 kg.', 150),
('p011', 'Salsa BBQ Galón 3.8L', 155, 'Salsas', 'https://images.pexels.com/photos/15801054/pexels-photo-15801054.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Salsa barbacoa ahumada, ideal para papas y carnes. Galón 3.8 litros.', 60),
('p012', 'Set Salsas Variadas x4', 98, 'Salsas', 'https://images.pexels.com/photos/3993187/pexels-photo-3993187.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Pack de salsas: ketchup, mayonesa, mostaza y BBQ. 4 potes de 500ml.', 110)
ON CONFLICT (id) DO NOTHING;
