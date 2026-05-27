import { apiClient } from './api-client';
import type { Product as FrontendProduct } from './products';

const formatPrice = (cents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
};

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
        imageSrc: p.image_url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
        description: p.description || '',
        longDescription: meta?.long_description || p.description || '',
        category: meta?.category || 'Essentials',
        sizes: meta?.sizes || ['S', 'M', 'L'],
        colors: meta?.colors || ['Black'],
        material: meta?.material || 'Premium Material',
        available: p.status === 'active',
        featured: true,
      };
    });
  } catch (error) {
    console.error('Failed to fetch products from Hub:', error);
    return [];
  }
}

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
      imageSrc: p.image_url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
      description: p.description || '',
      longDescription: meta?.long_description || p.description || '',
      category: meta?.category || 'Essentials',
      sizes: meta?.sizes || ['S', 'M', 'L'],
      colors: meta?.colors || ['Black'],
      material: meta?.material || 'Premium Material',
      available: p.status === 'active',
      featured: true,
    };
  } catch (error) {
    console.error(`Failed to fetch product ${id} from Hub:`, error);
    return undefined;
  }
}

export interface OrderPayload {
  items: { productId: string; variantId?: string; quantity: number }[];
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
}

export async function createOrder(payload: OrderPayload) {
  const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : `idemp-${Date.now()}-${Math.random()}`;

  const mappedPayload = {
    email: payload.customerEmail,
    phone: payload.customerPhone,
    fulfillment_method: 'delivery',
    delivery_address: payload.shippingAddress,
    items: payload.items.map(item => ({
      product_variant_id: item.variantId || item.productId,
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
