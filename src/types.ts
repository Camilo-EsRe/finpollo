export type Category = 'Empaques' | 'Limpieza' | 'Salsas' | 'Otros';

export const CATEGORIES: Category[] = ['Empaques', 'Limpieza', 'Salsas', 'Otros'];

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  description?: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItemSnapshot {
  product_name: string;
  product_price: number;
  product_image: string | null;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  total: number;
  status: string;
  created_at: string;
  items: OrderItemSnapshot[];
}
