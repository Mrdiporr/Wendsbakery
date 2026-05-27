<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FashionSeeder extends Seeder
{
    /**
     * Seed the application's database with fashion items.
     */
    public function run(): void
    {
        // 1. Categories
        $categoryId = DB::table('product_categories')->insertGetId([
            'store_id' => 'fashion',
            'name' => 'Essentials',
            'slug' => 'essentials',
            'description' => 'Wardrobe staples.',
            'display_order' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Products
        $productId = DB::table('products')->insertGetId([
            'store_id' => 'fashion',
            'sku' => 'WS-TEE-001',
            'category_id' => $categoryId,
            'name' => "Signature Minimalist Tee",
            'description' => 'A wardrobe staple redefined. Crafted from 100% long-staple pima cotton.',
            'base_price_cents' => 4500, // $45.00
            'status' => 'active',
            'image_url' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
            'metadata_json' => json_encode([
                'category' => 'Essentials',
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => ['Jet Black', 'Pure White', 'Slate Grey'],
                'material' => '100% Pima Cotton'
            ]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('product_variants')->insert([
            'product_id' => $productId,
            'sku' => 'WS-TEE-001-M-BLK',
            'name' => 'Medium / Jet Black',
            'price_override_cents' => 4500,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        $product2Id = DB::table('products')->insertGetId([
            'store_id' => 'fashion',
            'sku' => 'WS-COAT-002',
            'category_id' => $categoryId,
            'name' => "Tailored Wool Overcoat",
            'description' => 'The pinnacle of seasonal outerwear featuring a classic notched lapel.',
            'base_price_cents' => 32000, // $320.00
            'status' => 'active',
            'image_url' => 'https://images.unsplash.com/photo-1539533377285-a925882a99a7?auto=format&fit=crop&q=80&w=800',
            'metadata_json' => json_encode([
                'category' => 'Outerwear',
                'sizes' => ['M', 'L', 'XL'],
                'colors' => ['Navy', 'Camel'],
                'material' => '80% Wool, 20% Cashmere Blend'
            ]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
