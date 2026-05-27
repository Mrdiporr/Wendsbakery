'use client';

import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function Header() {
  const { cartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`${styles.container} ${styles.nav}`}>
        <Link href="/" className={styles.logo}>
          Wendy&apos;s Bakehouse
        </Link>

        {/* Desktop nav */}
        <nav className={styles.navLinks}>
          <Link href="/#menu" className={styles.navLink}>Our Menu</Link>
          <Link href="/custom-order" className={styles.navLink}>Custom Orders</Link>
          <Link href="/#about" className={styles.navLink}>About</Link>
          <Link href="/cart" className={`btn ${styles.cartBtn}`} id="header-cart-btn">
            🛒 Cart
            {cartCount > 0 && (
              <span className={styles.cartBadge}>{cartCount}</span>
            )}
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        <Link href="/#menu"        className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Our Menu</Link>
        <Link href="/custom-order"  className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Custom Orders</Link>
        <Link href="/#about"       className={styles.mobileLink} onClick={() => setMenuOpen(false)}>About</Link>
        <Link href="/cart"    className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
          🛒 Cart {cartCount > 0 && `(${cartCount})`}
        </Link>
      </div>
    </header>
  );
}
