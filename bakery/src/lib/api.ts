// ─────────────────────────────────────────────────────────────────────────────
// Storefront API utility
//
// Refactored to use the centralized Laravel Hub API client.
// ─────────────────────────────────────────────────────────────────────────────

import { apiClient } from './api-client';
import type { Product as FrontendProduct } from './products';
import { ALLERGENS } from './products';

// Helper to format currency
const formatPrice = (cents: number) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(cents / 100);
};

// ── Product API ────────────────────────────────────────────────────────────────

/**
 * Fetch all available products directly from the Laravel backend.
 */
export async function fetchProducts(): Promise<FrontendProduct[]> {
  try {
    const response = await apiClient.getProducts();
    const items = (response as any).data || [];

    return items.map((p: any) => {
      let meta = p.metadata_json;
      if (typeof meta === 'string') {
        try { meta = JSON.parse(meta); } catch { meta = {}; }
      }

      return {
        id: String(p.id),
        title: p.name,
        price: p.base_price_cents / 100,
        priceDisplay: formatPrice(p.base_price_cents),
        imageSrc: p.image_url || '/hero_cake.png',
        description: p.description || '',
        longDescription: meta?.long_description || p.description || '',
        category: meta?.category || 'Signature',
        allergens: meta?.allergens ? meta.allergens.map((a: string) => ALLERGENS[a as keyof typeof ALLERGENS] || { name: a, icon: '⚠️' }) : [],
        servingSize: meta?.serving_size,
        leadTime: meta?.lead_time,
        available: p.status === 'active',
        featured: true,
      };
    });
  } catch (error) {
    console.error('Failed to fetch products from Hub:', error);
    return [];
  }
}

/**
 * Fetch a single product by ID.
 */
export async function fetchProduct(id: string): Promise<FrontendProduct | undefined> {
  try {
    const response = await apiClient.getProduct(id);
    const p = (response as any).data;
    
    if (!p) return undefined;

    let meta = p.metadata_json;
    if (typeof meta === 'string') {
      try { meta = JSON.parse(meta); } catch { meta = {}; }
    }

    return {
      id: String(p.id),
      title: p.name,
      price: p.base_price_cents / 100,
      priceDisplay: formatPrice(p.base_price_cents),
      imageSrc: p.image_url || '/hero_cake.png',
      description: p.description || '',
      longDescription: meta?.long_description || p.description || '',
      category: meta?.category || 'Signature',
      allergens: meta?.allergens ? meta.allergens.map((a: string) => ALLERGENS[a as keyof typeof ALLERGENS] || { name: a, icon: '⚠️' }) : [],
      servingSize: meta?.serving_size,
      leadTime: meta?.lead_time,
      available: p.status === 'active',
      featured: true,
    };
  } catch (error) {
    console.error(`Failed to fetch product ${id} from Hub:`, error);
    return undefined;
  }
}

// ── Order API ──────────────────────────────────────────────────────────────────

export interface OrderPayload {
  items: { productId: string; quantity: number }[];
  pickupDate: string;
  pickupTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}

export interface OrderResponse {
  orderId: string;
  orderNumber?: string;
  status: string;
  total?: number;
  checkoutUrl?: string | null;
  _demo?: boolean;
}

/**
 * Submit a new order to Laravel Hub.
 */
export async function createOrder(payload: OrderPayload): Promise<OrderResponse> {
  const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : `idemp-${Date.now()}-${Math.random()}`;

  const mappedPayload = {
    email: payload.customerEmail,
    phone: payload.customerPhone,
    fulfillment_method: 'pickup',
    special_instructions: payload.notes,
    items: payload.items.map(item => ({
      product_variant_id: item.productId, // simplified
      quantity: item.quantity
    }))
  };

  const response = await apiClient.createOrder(mappedPayload, idempotencyKey);
  
  return {
    orderId: String(response.order_id),
    orderNumber: response.order_number,
    status: response.status,
  };
}

// ── Custom Order API ───────────────────────────────────────────────────────────

export interface CustomOrderPayload {
  orderType: string;
  eventType: string;
  eventDate: string;
  guestCount: string;
  tiers?: string;
  flavour?: string;
  filling?: string;
  colours?: string;
  dietaryNotes?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message?: string;
}

/**
 * Submit a custom order enquiry to the Hub.
 */
export async function createCustomOrder(payload: CustomOrderPayload): Promise<{ success: boolean }> {
  try {
    const response = await apiClient.submitCustomQuote({
      email: payload.email,
      details: JSON.stringify(payload),
    });
    return { success: response.success };
  } catch (error) {
    console.error('Failed to submit quote:', error);
    return { success: false };
  }
}
