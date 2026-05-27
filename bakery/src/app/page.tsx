import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../lib/api";

export default async function Home() {
  const products = await fetchProducts();


  return (
    <main>
      <Header />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className={`${styles.container} ${styles.hero}`}>
        <div className={styles.heroContent}>
          <span className={styles.heroTag}>Baked Fresh in Etobicoke, Ontario</span>
          <h1 className={styles.heroTitle}>
            Taste the Magic in <span>Every Bite.</span>
          </h1>
          <p className={styles.heroDesc}>
            From authentic Nigerian meatpies to luxurious custom celebration cakes,
            we bring warmth and sweetness to your special moments.
          </p>
          <div className={styles.heroActions}>
            <Link href="/#menu" className="btn">Order for Pickup</Link>
            <Link href="/custom-order" className="btn btn-secondary">Request Custom Cake</Link>
          </div>
        </div>
        <div className={styles.heroImageContainer}>
          <Image
            src="/hero_cake.png"
            alt="Beautiful Custom Celebration Cake by Wendy's Bakehouse"
            fill
            className={styles.heroImage}
            priority
          />
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────── */}
      <section className={styles.trustStrip}>
        <div className={styles.container}>
          <div className={styles.trustGrid}>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>🍰</span>
              <span>Baked fresh to order</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>📍</span>
              <span>Local pickup · Etobicoke</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>🇨🇦</span>
              <span>Proudly Nigerian-Canadian</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>💬</span>
              <span>Custom orders welcome</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product catalogue ─────────────────────────────────────── */}
      <section id="menu" className={styles.section} style={{ backgroundColor: 'var(--surface)' }}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Signature Favorites</h2>
            <p className={styles.sectionDesc}>
              Our most loved treats, baked fresh and available for local pickup in Etobicoke.
            </p>
          </div>
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Custom order CTA ─────────────────────────────────────── */}
      <section id="custom" className={`${styles.section} ${styles.ctaSection}`}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <span className={styles.heroTag}>Custom Orders</span>
            <h2 className={styles.sectionTitle}>Have a Vision? Let&apos;s Bring It to Life.</h2>
            <p className={styles.sectionDesc}>
              Wedding cakes, milestone birthdays, baby showers — our custom cakes are crafted
              exactly to your specifications, flavour by flavour, tier by tier.
            </p>
            <div className={styles.heroActions} style={{ justifyContent: 'center', marginTop: '2rem' }}>
              <Link href="/custom-order" className="btn">Start a Custom Order</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── About strip ──────────────────────────────────────────── */}
      <section id="about" className={styles.section} style={{ backgroundColor: 'var(--surface)' }}>
        <div className={styles.container}>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutText}>
              <span className={styles.heroTag}>Our Story</span>
              <h2 className={styles.sectionTitle}>Baked with Love,<br/>Rooted in Culture</h2>
              <p style={{ opacity: 0.8, lineHeight: 1.8, marginBottom: '1.5rem' }}>
                Wendy&apos;s Bakehouse was born from a passion for sharing the rich flavours of
                Nigerian baking with the Etobicoke community. Every loaf, every meatpie, every
                celebration cake carries the warmth of home.
              </p>
              <p style={{ opacity: 0.8, lineHeight: 1.8 }}>
                We operate under Wendy&apos;s Collectibles — a family-owned business committed
                to quality, authenticity, and community connection.
              </p>
            </div>
            <div className={styles.aboutBadges}>
              <div className={styles.badge}><strong>100%</strong><span>Fresh Ingredients</span></div>
              <div className={styles.badge}><strong>5★</strong><span>Community Rated</span></div>
              <div className={styles.badge}><strong>48hr</strong><span>Lead Time</span></div>
              <div className={styles.badge}><strong>∞</strong><span>Flavour Possibilities</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p className={styles.footerLogo}>Wendy&apos;s Bakehouse</p>
          <p className={styles.footerSub}>
            Etobicoke, Ontario · Pickup only · Orders via website or{' '}
            <a href="https://www.instagram.com/wendys.bakehouse/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
              Instagram
            </a>
          </p>
          <p className={styles.footerCopy}>
            © {new Date().getFullYear()} Wendy&apos;s Collectibles. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
