import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface OrderRow {
  id: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  total: number;
  status: string;
  created_at: string;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_name: string;
  product_price: number;
  product_image: string | null;
  quantity: number;
}

export interface OrderWithItems extends OrderRow {
  order_items: OrderItemRow[];
}
