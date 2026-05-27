// ─────────────────────────────────────────────────────────────────────────────
// Shared product catalogue — single source of truth for the storefront.
// Replace the mock data here with a real API fetch once the Laravel backend
// endpoints are wired up (see src/lib/api.ts).
// ─────────────────────────────────────────────────────────────────────────────

export interface Allergen {
  name: string;
  icon: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  priceDisplay: string;
  imageSrc: string;
  description: string;
  longDescription: string;
  category: string;
  allergens: Allergen[];
  servingSize?: string;
  leadTime?: string; // e.g. "48 hours notice required"
  available: boolean;
  featured: boolean;
}

export const ALLERGENS: Record<string, Allergen> = {
  gluten:  { name: "Gluten",    icon: "🌾" },
  dairy:   { name: "Dairy",     icon: "🥛" },
  eggs:    { name: "Eggs",      icon: "🥚" },
  nuts:    { name: "Tree Nuts", icon: "🥜" },
  soy:     { name: "Soy",       icon: "🫘" },
  sesame:  { name: "Sesame",    icon: "🌱" },
};

export const PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Signature Cake Loaf",
    price: 25.00,
    priceDisplay: "From $25.00",
    imageSrc: "/signature_loaf.png",
    description: "Vanilla, Red Velvet, Marble",
    longDescription:
      "Our beloved Signature Cake Loaf is the heart of Wendy's Bakehouse. Baked fresh to order in Etobicoke, each loaf is crafted with premium ingredients and finished with a delicate glaze. Choose from our three classic flavours — timeless Vanilla, vibrant Red Velvet, or the stunning Marble swirl. Perfect for gifting, celebrations, or simply treating yourself.",
    category: "Loaves",
    allergens: [ALLERGENS.gluten, ALLERGENS.dairy, ALLERGENS.eggs],
    servingSize: "Serves 6–8",
    leadTime: "24 hours notice required",
    available: true,
    featured: true,
  },
  {
    id: "2",
    title: "Classic Nigerian Meatpies",
    price: 35.00,
    priceDisplay: "$35.00 / Half Dozen",
    imageSrc: "/meatpies.png",
    description: "Flaky, savory, authentic",
    longDescription:
      "A proud staple of Nigerian cuisine. Our meatpies are stuffed with a richly seasoned filling of beef, potatoes, and carrots, all wrapped in our signature buttery, flaky pastry. Baked — never fried — for a wholesome bite every time. Ideal for parties, family gatherings, or as a satisfying snack. Sold per half dozen (6 pies).",
    category: "Savoury",
    allergens: [ALLERGENS.gluten, ALLERGENS.dairy, ALLERGENS.eggs],
    servingSize: "Half Dozen (6 pies)",
    leadTime: "48 hours notice required",
    available: true,
    featured: true,
  },
  {
    id: "3",
    title: "Small Chops Platter",
    price: 50.00,
    priceDisplay: "From $50.00",
    imageSrc: "",
    description: "Perfect for events",
    longDescription:
      "Elevate your next gathering with our Small Chops Platter — a curated selection of bite-sized Nigerian party favourites. Each platter includes puff-puff, spring rolls, samosas, and mini meatpies. Ideal for birthdays, corporate events, and celebrations of all sizes. Pricing varies based on quantity; contact us for bulk event orders.",
    category: "Platters",
    allergens: [ALLERGENS.gluten, ALLERGENS.dairy, ALLERGENS.eggs, ALLERGENS.soy],
    servingSize: "Approx. 20–25 pieces",
    leadTime: "72 hours notice required",
    available: true,
    featured: false,
  },
  {
    id: "4",
    title: "Custom Celebration Cake",
    price: 120.00,
    priceDisplay: "From $120.00",
    imageSrc: "/hero_cake.png",
    description: "Tailored to your vision",
    longDescription:
      "Our Custom Celebration Cakes are where artistry meets flavour. Whether it's a wedding, birthday, baby shower, or corporate milestone, we craft each cake to your exact specifications — from flavour and filling to tiers, colours, and decorative style. Pricing depends on size, complexity, and design. Consultation required for all custom orders.",
    category: "Custom",
    allergens: [ALLERGENS.gluten, ALLERGENS.dairy, ALLERGENS.eggs, ALLERGENS.nuts],
    servingSize: "Serves 20–100+",
    leadTime: "7 days notice required — consultation mandatory",
    available: true,
    featured: true,
  },
];

/** Lookup a single product by ID. Returns undefined if not found. */
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/** Returns only available products. */
export function getAvailableProducts(): Product[] {
  return PRODUCTS.filter((p) => p.available);
}

/** Returns featured products for the homepage spotlight. */
export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured && p.available);
}
