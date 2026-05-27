<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // --- 1. Multi-tenant Context ---
        // Stored Credentials for WooCommerce Integrations
        Schema::create('stored_credentials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('store_id')->index(); // e.g., 'bakery', 'grocery'
            $table->string('platform_name');
            $table->string('base_url', 2048);
            $table->string('auth_method', 50)->nullable();
            $table->longText('encrypted_data'); // AES-256 encrypted JSON
            $table->timestamp('last_decrypted_at')->nullable();
            $table->timestamps();
        });

        // --- 2. Products Catalog ---
        Schema::create('product_categories', function (Blueprint $table) {
            $table->id();
            $table->string('store_id')->index();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('store_id')->index();
            $table->string('sku')->unique();
            $table->foreignId('category_id')->nullable()->constrained('product_categories')->onDelete('set null');
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('base_price_cents')->default(0);
            $table->string('tax_category')->default('standard');
            $table->string('image_url')->nullable();
            $table->string('status')->default('active'); // active, archived
            $table->json('metadata_json')->nullable();
            $table->string('admin_dashboard_id')->nullable(); // Sync ID from WC
            $table->timestamps();
            $table->timestamp('admin_updated_at')->nullable();
        });

        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('sku')->unique();
            $table->string('name');
            $table->integer('price_override_cents')->nullable();
            $table->text('description_short')->nullable();
            $table->json('metadata_json')->nullable();
            $table->string('admin_dashboard_id')->nullable();
            $table->timestamps();
        });

        // --- 3. Orders & Fulfillment ---
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('store_id')->index();
            $table->string('order_number')->unique();
            $table->string('email');
            $table->string('phone');
            $table->integer('subtotal_cents')->default(0);
            $table->integer('tax_cents')->default(0);
            $table->integer('delivery_fee_cents')->default(0);
            $table->integer('discount_cents')->default(0);
            $table->integer('total_cents')->default(0);
            $table->string('currency')->default('CAD');
            $table->string('status'); // local_order_created, preparing, ready_for_pickup
            $table->string('fulfillment_method'); // pickup, delivery
            $table->text('delivery_address')->nullable();
            $table->text('special_instructions')->nullable();
            $table->string('admin_dashboard_id')->nullable(); // WC order ID
            $table->string('admin_sync_status')->default('pending');
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('product_variant_id')->constrained('product_variants');
            $table->integer('quantity');
            $table->integer('unit_price_cents');
            $table->integer('total_price_cents');
            $table->text('custom_message')->nullable();
            $table->timestamps();
        });

        // --- 4. Bakery Specific Operations (Recipes, Batches) ---
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category')->nullable();
            $table->integer('yield_quantity')->nullable();
            $table->string('yield_unit', 50)->nullable();
            $table->decimal('prep_time_hours', 5, 2)->nullable();
            $table->longText('instructions')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });

        Schema::create('ingredients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('quantity_on_hand', 10, 2)->default(0);
            $table->string('unit', 50);
            $table->decimal('reorder_level', 10, 2)->nullable();
            $table->string('supplier')->nullable();
            $table->decimal('cost_per_unit', 10, 4)->nullable();
            $table->timestamp('last_updated')->nullable();
            $table->timestamps();
        });

        // --- 5. Auditing & Webhooks ---
        Schema::create('webhook_events', function (Blueprint $table) {
            $table->id();
            $table->string('store_id')->index();
            $table->string('external_id')->unique();
            $table->string('event_type');
            $table->json('payload');
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('webhook_events');
        Schema::dropIfExists('ingredients');
        Schema::dropIfExists('recipes');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('products');
        Schema::dropIfExists('product_categories');
        Schema::dropIfExists('stored_credentials');
    }
};
