// ─────────────────────────────────────────────────────────────────────────────
// POST /api/orders
//
// Creates a WooCommerce order server-side and returns the order ID.
// WC credentials stay on the server. Stripe payment link is returned
// when WC Stripe gateway is active (future phase).
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { wcFetch, isWCConfigured } from '../../../lib/woocommerce';

interface OrderItem {
  productId: string;
  quantity: number;
}

interface OrderPayload {
  items: OrderItem[];
  pickupDate: string;
  pickupTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}

interface WCOrderPayload {
  status: string;
  customer_note?: string;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    country: string;
    state: string;
    city: string;
  };
  line_items: { product_id: number; quantity: number }[];
  meta_data: { key: string; value: string }[];
}

export async function POST(request: NextRequest) {
  let payload: OrderPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Basic validation
  const { items, pickupDate, pickupTime, customerName, customerEmail, customerPhone } = payload;
  if (!items?.length || !pickupDate || !pickupTime || !customerEmail) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 422 });
  }

  const [firstName, ...lastParts] = customerName.trim().split(' ');
  const lastName = lastParts.join(' ') || '-';

  // ── No WC credentials → demo mode ───────────────────────────────────────────
  if (!isWCConfigured()) {
    const demoId = `WB-${Date.now().toString(36).toUpperCase()}`;
    return NextResponse.json({
      orderId:    demoId,
      status:     'pending',
      total:      0,
      checkoutUrl: null,
      _demo:      true,
    });
  }

  // ── Create WooCommerce order ─────────────────────────────────────────────────
  try {
    const wcPayload: WCOrderPayload = {
      status: 'pending',
      customer_note: payload.notes,
      billing: {
        first_name: firstName,
        last_name:  lastName,
        email:      customerEmail,
        phone:      customerPhone,
        country:    'CA',
        state:      'ON',
        city:       'Etobicoke',
      },
      line_items: items.map(i => ({
        product_id: parseInt(i.productId, 10),
        quantity:   i.quantity,
      })),
      meta_data: [
        { key: '_pickup_date', value: pickupDate },
        { key: '_pickup_time', value: pickupTime },
        { key: '_order_source', value: 'storefront' },
      ],
    };

    const wcOrder = await wcFetch<{ id: number; total: string; payment_url?: string }>(
      '/orders',
      undefined,
      wcPayload,
    );

    return NextResponse.json({
      orderId:    String(wcOrder.id),
      status:     'pending',
      total:      parseFloat(wcOrder.total),
      checkoutUrl: wcOrder.payment_url ?? null,
    });
  } catch (err) {
    console.error('[/api/orders] WooCommerce order creation failed:', err);
    return NextResponse.json(
      { error: 'Order creation failed. Please try again or contact us on Instagram.' },
      { status: 502 }
    );
  }
}
