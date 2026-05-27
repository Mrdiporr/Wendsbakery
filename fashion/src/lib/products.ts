export interface Product {
  id: string;
  title: string;
  price: number;
  priceDisplay: string;
  imageSrc: string;
  description: string;
  longDescription: string;
  category: string;
  sizes?: string[];
  colors?: string[];
  material?: string;
  available: boolean;
  featured: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Signature Minimalist Tee',
    price: 45.00,
    priceDisplay: '$45.00',
    imageSrc: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
    description: 'Ultra-soft pima cotton essential.',
    longDescription: 'A wardrobe staple redefined. Our Signature Minimalist Tee is crafted from 100% long-staple pima cotton, providing unparalleled softness and a drape that lasts. Features a reinforced neckline and a tailored fit.',
    category: 'Essentials',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Jet Black', 'Pure White', 'Slate Grey'],
    material: '100% Pima Cotton',
    available: true,
    featured: true
  },
  {
    id: '2',
    title: 'Tailored Wool Overcoat',
    price: 320.00,
    priceDisplay: '$320.00',
    imageSrc: 'https://images.unsplash.com/photo-1539533377285-a925882a99a7?auto=format&fit=crop&q=80&w=800',
    description: 'Classic silhouette in premium Italian wool.',
    longDescription: 'The pinnacle of seasonal outerwear. This overcoat features a classic notched lapel, three-button closure, and a fully lined interior. Engineered for warmth without the bulk.',
    category: 'Outerwear',
    sizes: ['M', 'L', 'XL'],
    material: '80% Wool, 20% Cashmere Blend',
    available: true,
    featured: true
  },
  {
    id: '3',
    title: 'Selvedge Denim Jeans',
    price: 150.00,
    priceDisplay: '$150.00',
    imageSrc: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800',
    description: 'Raw indigo denim with a classic straight cut.',
    longDescription: 'Our Selvedge Denim is sourced from the finest mills. These jeans are designed to age uniquely to your body, developing a character that is entirely your own.',
    category: 'Denim',
    sizes: ['30', '32', '34', '36'],
    available: true,
    featured: false
  },
  {
    id: '4',
    title: 'Silk Slip Dress',
    price: 185.00,
    priceDisplay: '$185.00',
    imageSrc: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&q=80&w=800',
    description: 'Elegant evening wear in heavy-weight silk.',
    longDescription: 'A timeless silhouette that flows with every movement. This slip dress is made from premium heavy-weight silk satin with adjustable straps and a bias-cut finish.',
    category: 'Premium',
    sizes: ['XS', 'S', 'M', 'L'],
    available: true,
    featured: true
  }
];

export function getFeaturedProducts() {
  return PRODUCTS.filter(p => p.featured && p.available);
}

export function getProductsByCategory(category: string) {
  return PRODUCTS.filter(p => p.category === category && p.available);
}

export function getProductById(id: string) {
  return PRODUCTS.find(p => p.id === id);
}
