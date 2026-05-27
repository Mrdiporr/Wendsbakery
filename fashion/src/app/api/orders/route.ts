// ─────────────────────────────────────────────────────────────────────────────
// POST /api/orders
//
// Refactored to submit orders to the centralized Laravel Hub.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '../../../lib/api';

export async function POST(request: NextRequest) {
  let payload: any;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const result = await createOrder({
      items: payload.items,
      customerEmail: payload.customerEmail || payload.email,
      customerPhone: payload.customerPhone || payload.phone,
      shippingAddress: payload.shippingAddress || payload.delivery_address || 'Pickup'
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error('[/api/orders] Hub order creation failed:', err);
    return NextResponse.json(
      { error: 'Order creation failed. Please try again.' },
      { status: 502 }
    );
  }
}
