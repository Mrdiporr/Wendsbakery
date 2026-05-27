// ─────────────────────────────────────────────────────────────────────────────
// GET /api/products
//
// Refactored to fetch from the centralized Laravel Hub.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { fetchProducts, fetchProduct } from '../../../lib/api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const product = await fetchProduct(id);
      if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(product);
    }

    const products = await fetchProducts();
    return NextResponse.json(products);
  } catch (err) {
    console.error('[/api/products] Hub fetch failed:', err);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 502 });
  }
}
