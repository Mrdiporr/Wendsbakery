// ─────────────────────────────────────────────────────────────────────────────
// GET /api/products
//
// Server-side proxy → WooCommerce REST API.
// WC credentials NEVER leave the server. The browser only sees adapted Products.
//
// Query params:
//   ?id=<wc_product_id>   → single product
//   (none)                → all published products
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { wcFetch, adaptWCProduct, isWCConfigured, type WCProduct } from '../../../lib/woocommerce';
import { PRODUCTS } from '../../../lib/products';

export const dynamic = 'force-dynamic'; // always revalidate — products can change in WC admin

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // ── No WC credentials → serve static mock catalogue ─────────────────────────
  if (!isWCConfigured()) {
    if (id) {
      const product = PRODUCTS.find(p => p.id === id);
      if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(product);
    }
    return NextResponse.json(PRODUCTS.filter(p => p.available));
  }

  // ── WC configured → proxy live data ─────────────────────────────────────────
  try {
    if (id) {
      // Single product by WC numeric ID
      const wc = await wcFetch<WCProduct>(`/products/${id}`);
      return NextResponse.json(adaptWCProduct(wc));
    }

    // All published, purchasable products (up to 100)
    const products = await wcFetch<WCProduct[]>('/products', {
      status:   'publish',
      per_page: '100',
      orderby:  'menu_order',
      order:    'asc',
    });

    const adapted = products
      .filter(p => p.purchasable && p.stock_status !== 'outofstock')
      .map(adaptWCProduct);

    return NextResponse.json(adapted);
  } catch (err) {
    console.error('[/api/products] WooCommerce fetch failed:', err);

    // Graceful fallback to static catalogue so the storefront never goes blank
    if (id) {
      const fallback = PRODUCTS.find(p => p.id === id);
      if (!fallback) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(fallback, {
        headers: { 'X-Fallback': 'static', 'X-Error': 'wc-unavailable' },
      });
    }

    return NextResponse.json(PRODUCTS.filter(p => p.available), {
      headers: { 'X-Fallback': 'static', 'X-Error': 'wc-unavailable' },
    });
  }
}
