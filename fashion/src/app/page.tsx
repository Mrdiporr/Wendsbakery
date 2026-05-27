import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../lib/api";
import styles from "./page.module.css";

export default async function Home() {
  const products = await fetchProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <main>
      <Header />
      
      {/* ── Hero Section ── */}
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000" 
            alt="New Collection"
            fill
            priority
            className={styles.image}
          />
        </div>
        <div className={styles.heroContent}>
          <p className={styles.heroSubtitle}>New Season 2026</p>
          <h1 className={styles.heroTitle}>Refined <br/> Simplicity</h1>
          <div className={styles.heroActions}>
            <Link href="/shop" className="btn">Shop Collection</Link>
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>New Arrivals</h2>
          <Link href="/shop" className={styles.viewAll}>View All →</Link>
        </div>
        <div className={styles.productGrid}>
          {featuredProducts.length > 0 ? (
            featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className={styles.empty}>New collection arriving soon.</p>
          )}
        </div>
      </section>

      {/* ── Editorial Section ── */}
      <section className={styles.editorial}>
        <div className={styles.editorialGrid}>
          <div className={styles.editorialText}>
            <h2 className={styles.editorialTitle}>The Art of Essentials</h2>
            <p className={styles.editorialDesc}>
              We believe in quality over quantity. Every piece in our collection is meticulously 
              designed to offer timeless style and enduring comfort.
            </p>
            <Link href="/about" className={styles.editorialLink}>Our Philosophy</Link>
          </div>
          <div className={styles.editorialImage}>
            <Image 
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1200" 
              alt="Editorial"
              fill
              className={styles.image}
            />
          </div>
        </div>
      </section>

      {/* ── Footer Preview ── */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>Wardrobe Sensation</div>
          <p className={styles.footerTagline}>Timeless design. Modern lifestyle.</p>
          <div className={styles.footerLinks}>
            <Link href="/shipping">Shipping</Link>
            <Link href="/returns">Returns</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <p className={styles.copyright}>© 2026 Wardrobe Sensation. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
