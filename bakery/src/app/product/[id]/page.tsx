import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../../components/Header';
import AddToCartButton from '../../../components/AddToCartButton';
import { fetchProducts, fetchProduct } from '../../../lib/api';
import styles from './page.module.css';

// Pre-generate all product detail pages at build time
export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await fetchProduct(id);
  if (!product) return {};
  return {
    title: `${product.title} | Wendy's Bakehouse`,
    description: product.longDescription?.slice(0, 160) ?? '',
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) notFound();


  return (
    <main>
      <Header />

      <div className={styles.page}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/#menu">Menu</Link>
          <span>/</span>
          <span>{product.title}</span>
        </nav>

        <div className={styles.grid}>
          {/* ── Image panel ── */}
          <div className={styles.imagePanel}>
            <div className={styles.imageWrapper}>
              {product.imageSrc ? (
                <Image
                  src={product.imageSrc}
                  alt={product.title}
                  fill
                  className={styles.image}
                  priority
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <span>🍰</span>
                  <p>Image coming soon</p>
                </div>
              )}
              <span className={styles.categoryBadge}>{product.category}</span>
            </div>
          </div>

          {/* ── Info panel ── */}
          <div className={styles.infoPanel}>
            <h1 className={styles.title}>{product.title}</h1>
            <p className={styles.price}>{product.priceDisplay}</p>

            <p className={styles.description}>{product.longDescription}</p>

            {/* Meta pills */}
            <div className={styles.metaRow}>
              {product.servingSize && (
                <div className={styles.metaPill}>
                  <span>🍽️</span>
                  <span>{product.servingSize}</span>
                </div>
              )}
              {product.leadTime && (
                <div className={styles.metaPill}>
                  <span>⏱️</span>
                  <span>{product.leadTime}</span>
                </div>
              )}
              <div className={styles.metaPill}>
                <span>📍</span>
                <span>Pickup only · Etobicoke</span>
              </div>
            </div>

            {/* Allergen notice */}
            {product.allergens.length > 0 && (
              <div className={styles.allergenBox}>
                <p className={styles.allergenTitle}>⚠️ Allergen Information</p>
                <div className={styles.allergenList}>
                  {product.allergens.map((a) => (
                    <span key={a.name} className={styles.allergenTag}>
                      {a.icon} {a.name}
                    </span>
                  ))}
                </div>
                <p className={styles.allergenNote}>
                  Our products are prepared in a kitchen that handles various allergens.
                  Please contact us if you have severe allergies before ordering.
                </p>
              </div>
            )}

            {/* Add to cart CTA */}
            <div className={styles.ctaRow}>
              <AddToCartButton product={product} />
              <Link href="/cart" className={`btn btn-secondary ${styles.viewCartBtn}`}>
                View Cart
              </Link>
            </div>

            {/* Custom order upsell (only for non-custom products) */}
            {product.category !== 'Custom' && (
              <div className={styles.upsellBox}>
                <p>
                  🎂 Need something special?{' '}
                  <Link href="/custom-order" className={styles.upsellLink}>
                    Request a custom cake →
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
