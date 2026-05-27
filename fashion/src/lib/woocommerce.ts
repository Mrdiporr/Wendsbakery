// ─────────────────────────────────────────────────────────────────────────────
// WooCommerce → Storefront adapter
//
// The admin dashboard connects directly to WooCommerce REST API.
// The storefront NEVER exposes WC credentials to the browser. Instead:
//   • Next.js API Routes (server-side) proxy all WC requests.
//   • WC credentials live only in `.env.local` (server-side env vars).
//   • This file maps WooCommerceProduct → our canonical Product type.
// ─────────────────────────────────────────────────────────────────────────────

import type { Product } from './products';

// ── WooCommerce REST API shapes (minimal subset we need) ─────────────────────

export interface WCImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface WCCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WCMetaData {
  key: string;
  value: string | string[];
}

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  status: 'draft' | 'pending' | 'private' | 'publish';
  featured: boolean;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  stock_quantity: number | null;
  categories: WCCategory[];
  images: WCImage[];
  meta_data: WCMetaData[];
}

// ── WooCommerce API client (server-side only) ─────────────────────────────────

export interface WCClientConfig {
  siteUrl: string;
  consumerKey: string;
  consumerSecret: string;
}

function getWCConfig(): WCClientConfig {
  const siteUrl        = process.env.WC_SITE_URL        ?? '';
  const consumerKey    = process.env.WC_CONSUMER_KEY    ?? '';
  const consumerSecret = process.env.WC_CONSUMER_SECRET ?? '';
  return { siteUrl: siteUrl.replace(/\/$/, ''), consumerKey, consumerSecret };
}

function isWCConfigured(): boolean {
  const { siteUrl, consumerKey, consumerSecret } = getWCConfig();
  return !!(siteUrl && consumerKey && consumerSecret);
}

async function wcFetch<T>(
  path: string,
  params?: Record<string, string>,
  body?: unknown,
): Promise<T> {
  const { siteUrl, consumerKey, consumerSecret } = getWCConfig();

  const url = new URL(`${siteUrl}/wp-json/wc/v3${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  const isPost = body !== undefined;
  const res = await fetch(url.toString(), {
    method:  isPost ? 'POST' : 'GET',
    headers: {
      Authorization:  `Basic ${auth}`,
      Accept:         'application/json',
      ...(isPost ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(isPost ? { body: JSON.stringify(body) } : {}),
    // Only cache GET requests
    ...(!isPost ? { next: { revalidate: 60 } } : { cache: 'no-store' }),
  });

  if (!res.ok) {
    throw new Error(`WooCommerce API error ${res.status} on ${path}`);
  }

  return res.json() as Promise<T>;
}


// ── Adapter: WCProduct → Product ─────────────────────────────────────────────

/**
 * Extract a meta_data value by key. WC stores custom fields here.
 * Expected keys (set via WC product editor or admin dashboard):
 *   _storefront_long_description
 *   _storefront_allergens          (comma-separated: gluten,dairy,eggs)
 *   _storefront_serving_size
 *   _storefront_lead_time
 */
function getMeta(product: WCProduct, key: string): string {
  const entry = product.meta_data.find(m => m.key === key);
  if (!entry) return '';
  return Array.isArray(entry.value) ? entry.value.join(', ') : String(entry.value);
}

/* Allergens removed for Fashion storefront */
function parseOptions(raw: string): string[] {
  if (!raw) return [];
  return raw.split(',').map(s => s.trim());
}

export function adaptWCProduct(wc: WCProduct): Product {
  const longDesc     = getMeta(wc, '_storefront_long_description') || wc.description || wc.short_description;
  const allergensMeta = getMeta(wc, '_storefront_allergens');
  const servingSize  = getMeta(wc, '_storefront_serving_size');
  const leadTime     = getMeta(wc, '_storefront_lead_time');

  const price        = parseFloat(wc.price) || 0;
  const isOnSale     = wc.on_sale && !!wc.sale_price;
  const priceDisplay = isOnSale
    ? `$${parseFloat(wc.sale_price).toFixed(2)} (was $${parseFloat(wc.regular_price).toFixed(2)})`
    : price > 0
      ? `From $${price.toFixed(2)}`
      : 'Contact for pricing';

  return {
    id:              String(wc.id),
    title:           wc.name,
    price,
    priceDisplay,
    imageSrc:        wc.images?.[0]?.src ?? '',
    description:     wc.short_description || wc.categories?.[0]?.name || '',
    longDescription: longDesc,
    category:        wc.categories?.[0]?.name ?? 'Uncategorized',
    sizes:           parseOptions(getMeta(wc, '_storefront_sizes')),
    colors:          parseOptions(getMeta(wc, '_storefront_colors')),
    material:        getMeta(wc, '_storefront_material'),
    available:       wc.status === 'publish' && wc.stock_status !== 'outofstock' && wc.purchasable,
    featured:        wc.featured,
  };
}

// ── Public API ─────────────────────────────────────────────────────────────────

export { isWCConfigured, wcFetch };
