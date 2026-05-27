<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Categories
        $categoryId = DB::table('product_categories')->insertGetId([
            'store_id' => 'bakery',
            'name' => 'Signature Cakes',
            'slug' => 'signature-cakes',
            'description' => 'Our famous signature cakes.',
            'display_order' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Products
        $productId = DB::table('products')->insertGetId([
            'store_id' => 'bakery',
            'sku' => 'WB-SIG-001',
            'category_id' => $categoryId,
            'name' => "Wendy's Signature Red Velvet",
            'description' => 'A luxurious red velvet cake with cream cheese frosting.',
            'base_price_cents' => 4500, // $45.00
            'status' => 'active',
            'image_url' => '/hero_cake.png',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('product_variants')->insert([
            'product_id' => $productId,
            'sku' => 'WB-SIG-001-8IN',
            'name' => '8-inch Round',
            'price_override_cents' => 4500,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $product2Id = DB::table('products')->insertGetId([
            'store_id' => 'bakery',
            'sku' => 'WB-PAS-002',
            'category_id' => $categoryId,
            'name' => "Nigerian Meatpie (Half Dozen)",
            'description' => 'Authentic, flaky, and packed with savory minced meat and veggies.',
            'base_price_cents' => 2400, // $24.00
            'status' => 'active',
            'image_url' => '/hero_cake.png', // Fallback
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('product_variants')->insert([
            'product_id' => $product2Id,
            'sku' => 'WB-PAS-002-6PK',
            'name' => '6 Pack',
            'price_override_cents' => 2400,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
