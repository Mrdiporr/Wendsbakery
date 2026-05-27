<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

// Health Check
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'database' => 'connected']);
});

// Group routes that require the X-Store-ID header middleware
Route::middleware(['store.context'])->prefix('v1')->group(function () {
    
    // --- Products ---
    Route::get('/products', function (Request $request) {
        $storeId = app('store.context');
        
        $products = DB::table('products')
            ->where('store_id', $storeId)
            ->where('status', 'active')
            ->get();

        return response()->json([
            'data' => $products,
            'meta' => [
                'store' => $storeId,
                'count' => $products->count()
            ]
        ]);
    });

    Route::get('/products/{id}', function (Request $request, $id) {
        $storeId = app('store.context');
        
        Log::debug("Fetching product detail", ['id' => $id, 'store' => $storeId]);

        $product = DB::table('products')
            ->where('store_id', $storeId)
            ->where('id', $id)
            ->first();

        if (!$product) {
            // Fallback: try searching by admin_dashboard_id or SKU if numeric ID fails
            $product = DB::table('products')
                ->where('store_id', $storeId)
                ->where(function($query) use ($id) {
                    $query->where('admin_dashboard_id', $id)
                          ->orWhere('sku', $id);
                })
                ->first();
        }

        if (!$product) {
            Log::warning("Product not found", ['id' => $id, 'store' => $storeId]);
            return response()->json(['error' => 'Product not found'], 404);
        }

        return response()->json(['data' => $product]);
    });

    // --- Categories ---
    Route::get('/categories', function (Request $request) {
        $storeId = app('store.context');
        
        $categories = DB::table('product_categories')
            ->where('store_id', $storeId)
            ->orderBy('display_order')
            ->get();

        return response()->json(['data' => $categories]);
    });

    // --- Orders ---
    Route::post('/orders', function (Request $request) {
        $storeId = app('store.context');
        $idempotencyKey = $request->header('Idempotency-Key');
        
        // Basic idempotency check
        if ($idempotencyKey) {
            $existingEvent = DB::table('webhook_events')
                ->where('store_id', $storeId)
                ->where('external_id', $idempotencyKey)
                ->first();
                
            if ($existingEvent) {
                return response()->json(json_decode($existingEvent->payload, true), 200);
            }
        }

        $payload = $request->validate([
            'email' => 'required|email',
            'phone' => 'required',
            'fulfillment_method' => 'required|in:pickup,delivery',
            'items' => 'required|array',
            'delivery_address' => 'nullable|string',
            'special_instructions' => 'nullable|string',
        ]);

        $orderNumber = 'ORD-' . strtoupper(substr($storeId, 0, 3)) . '-' . time() . '-' . rand(100, 999);

        return DB::transaction(function() use ($storeId, $payload, $orderNumber, $idempotencyKey) {
            // 1. Insert order
            $orderId = DB::table('orders')->insertGetId([
                'store_id' => $storeId,
                'order_number' => $orderNumber,
                'email' => $payload['email'],
                'phone' => $payload['phone'],
                'status' => 'local_order_created',
                'fulfillment_method' => $payload['fulfillment_method'],
                'delivery_address' => $payload['delivery_address'] ?? null,
                'special_instructions' => $payload['special_instructions'] ?? null,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            // 2. Insert order items
            $totalCents = 0;
            foreach ($payload['items'] as $item) {
                // Try to find variant, if not, find product
                $variantId = $item['product_variant_id'];
                
                // For MVP, we'll assume the ID is either a product_id or a product_variant_id
                // Real implementation would look up price from DB
                $priceCents = 0;
                
                $variant = DB::table('product_variants')->where('id', $variantId)->first();
                if ($variant) {
                    $priceCents = $variant->price_override_cents ?? 0;
                    if ($priceCents === 0) {
                        $p = DB::table('products')->where('id', $variant->product_id)->first();
                        $priceCents = $p->base_price_cents ?? 0;
                    }
                } else {
                    $p = DB::table('products')->where('id', $variantId)->first();
                    $priceCents = $p->base_price_cents ?? 0;
                }

                $itemTotal = $priceCents * $item['quantity'];
                $totalCents += $itemTotal;

                DB::table('order_items')->insert([
                    'order_id' => $orderId,
                    'product_variant_id' => $variantId, // Fallback if no variant
                    'quantity' => $item['quantity'],
                    'unit_price_cents' => $priceCents,
                    'total_price_cents' => $itemTotal,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }

            // 3. Update order total
            DB::table('orders')->where('id', $orderId)->update([
                'total_cents' => $totalCents,
                'subtotal_cents' => $totalCents,
            ]);

            $responsePayload = [
                'success' => true,
                'order_id' => $orderId,
                'order_number' => $orderNumber,
                'status' => 'local_order_created',
                'total_cents' => $totalCents
            ];

            // 4. Store idempotency event
            if ($idempotencyKey) {
                DB::table('webhook_events')->insert([
                    'store_id' => $storeId,
                    'external_id' => $idempotencyKey,
                    'event_type' => 'order_created',
                    'payload' => json_encode($responsePayload),
                    'created_at' => now(),
                ]);
            }

            return response()->json($responsePayload, 201);
        });
    });

    // --- Quotes / Custom Orders (Wendy's Bakehouse) ---
    Route::post('/quotes', function (Request $request) {
        $storeId = app('store.context');
        if ($storeId !== 'bakery') {
            return response()->json(['error' => 'Quotes only supported for bakery storefront.'], 400);
        }

        $payload = $request->validate([
            'email' => 'required|email',
            'details' => 'required|string',
        ]);

        Log::info("New custom quote requested for Bakery", ['email' => $payload['email']]);

        return response()->json([
            'success' => true,
            'quote_id' => 'QTE-BAK-' . rand(1000, 9999),
            'message' => 'Custom cake quote request received.'
        ], 201);
    });
});

// --- Webhooks ---
Route::post('/webhooks/woocommerce/{storeId}', function (Request $request, $storeId) {
    // 1. Verify WooCommerce HMAC signature
    $signature = $request->header('X-WC-Webhook-Signature');
    
    // In a real scenario, this secret would be fetched from `stored_credentials` table based on $storeId.
    // For now, we mock it using the APP_KEY or a config.
    $secret = env('WC_WEBHOOK_SECRET', 'test-secret');
    
    $payload = $request->getContent();
    $expected = base64_encode(hash_hmac('sha256', $payload, $secret, true));

    // To allow testing easily during development if the signature is missing or "test":
    if ($signature !== 'test' && !hash_equals($expected, $signature ?? '')) {
        Log::warning("Invalid WooCommerce webhook signature for store: {$storeId}");
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    $topic = $request->header('X-WC-Webhook-Topic'); // e.g., 'product.updated', 'order.created'
    $data = json_decode($payload, true);
    
    // 2. Idempotency Check using WooCommerce Webhook Delivery ID
    $webhookId = $request->header('X-WC-Webhook-Delivery-ID');
    if ($webhookId) {
        $existing = DB::table('webhook_events')
            ->where('external_id', $webhookId)
            ->first();
            
        if ($existing) {
            return response()->json(['message' => 'Webhook already processed']);
        }
        
        DB::table('webhook_events')->insert([
            'store_id' => $storeId,
            'external_id' => $webhookId,
            'event_type' => $topic ?? 'unknown',
            'payload' => $payload,
            'processed_at' => now(),
            'created_at' => now(),
        ]);
    }

    Log::info("WooCommerce Webhook Received", [
        'store' => $storeId,
        'topic' => $topic,
        'resource_id' => $data['id'] ?? 'unknown'
    ]);

    // 3. Handle payload based on topic
    if ($topic === 'product.updated' || $topic === 'product.created') {
        $productId = $data['id'];
        
        // Extract meta data for storefront enrichment
        $meta = [];
        if (isset($data['meta_data'])) {
            foreach ($data['meta_data'] as $m) {
                if ($m['key'] === '_storefront_sizes') $meta['sizes'] = explode(',', $m['value']);
                if ($m['key'] === '_storefront_colors') $meta['colors'] = explode(',', $m['value']);
                if ($m['key'] === '_storefront_material') $meta['material'] = $m['value'];
                if ($m['key'] === '_storefront_long_description') $meta['long_description'] = $m['value'];
            }
        }

        // Add category if present
        if (isset($data['categories']) && !empty($data['categories'])) {
            $meta['category'] = $data['categories'][0]['name'];
        }

        $productData = [
            'store_id' => $storeId,
            'sku' => $data['sku'] ?? 'SKU-WC-' . $productId,
            'name' => $data['name'] ?? 'Unknown Product',
            'description' => strip_tags($data['description'] ?? ''),
            'base_price_cents' => (int) (($data['price'] ?? 0) * 100),
            'status' => ($data['status'] === 'publish') ? 'active' : 'archived',
            'image_url' => $data['images'][0]['src'] ?? null,
            'metadata_json' => json_encode($meta),
            'admin_dashboard_id' => $productId,
            'admin_updated_at' => now(),
            'updated_at' => now()
        ];

        $dbProduct = DB::table('products')
            ->where('admin_dashboard_id', $productId)
            ->where('store_id', $storeId)
            ->first();

        if ($dbProduct) {
            DB::table('products')->where('id', $dbProduct->id)->update($productData);
        } else {
            $productData['created_at'] = now();
            DB::table('products')->insert($productData);
        }
    }

    return response()->json(['success' => true]);
});
