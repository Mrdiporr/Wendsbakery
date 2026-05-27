export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface Product {
  id: string | number;
  name: string;
  sku: string;
  description: string;
  base_price_cents: number;
  status: 'active' | 'archived';
  category_id: string | number;
  image_url?: string;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string | number;
  product_id: string | number;
  sku: string;
  name: string;
  price_override_cents?: number;
}

export interface Category {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
}

export interface OrderItem {
  product_variant_id: string | number;
  quantity: number;
  custom_message?: string;
}

export interface OrderPayload {
  email: string;
  phone: string;
  fulfillment_method: 'pickup' | 'delivery';
  pickup_slot_id?: string | number;
  delivery_address?: string;
  delivery_postal_code?: string;
  special_instructions?: string;
  items: OrderItem[];
}
