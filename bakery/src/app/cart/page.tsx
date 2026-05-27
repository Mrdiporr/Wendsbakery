'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import { useCart } from '../../context/CartContext';
import styles from './page.module.css';

const HST_RATE = 0.13; // Ontario HST

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  const hst = cartTotal * HST_RATE;
  const grandTotal = cartTotal + hst;

  const isEmpty = cart.length === 0;

  return (
    <main>
      <Header />
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Your Cart</h1>

        {isEmpty ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>🛒</span>
            <h2>Your cart is empty</h2>
            <p>Browse our menu and add something delicious!</p>
            <Link href="/#menu" className="btn" id="cart-browse-menu-btn">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className={styles.layout}>
            {/* ── Line items ── */}
            <div className={styles.items}>
              <div className={styles.itemsHeader}>
                <span>{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
                <button className={styles.clearBtn} onClick={clearCart} id="cart-clear-btn">
                  Clear cart
                </button>
              </div>

              {cart.map((item) => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemImage}>
                    {item.imageSrc ? (
                      <Image
                        src={item.imageSrc}
                        alt={item.name}
                        fill
                        className={styles.itemImg}
                      />
                    ) : (
                      <div className={styles.itemImgPlaceholder}>🍰</div>
                    )}
                  </div>

                  <div className={styles.itemInfo}>
                    <Link href={`/product/${item.id}`} className={styles.itemName}>
                      {item.name}
                    </Link>
                    <span className={styles.itemUnitPrice}>
                      ${item.price.toFixed(2)} each
                    </span>
                  </div>

                  <div className={styles.itemControls}>
                    <div className={styles.qtyRow}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className={styles.qty}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <div className={styles.itemLineTotal}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Order summary ── */}
            <aside className={styles.summary}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>

              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>HST (13% · Ontario)</span>
                <span>${hst.toFixed(2)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>

              <div className={styles.pickupNotice}>
                <span>📍</span>
                <span>
                  <strong>Pickup only</strong> · Etobicoke, Ontario.
                  Pickup date & time confirmed after order.
                </span>
              </div>

              <Link
                href="/checkout"
                className={`btn ${styles.checkoutBtn}`}
                id="cart-proceed-checkout-btn"
              >
                Proceed to Checkout →
              </Link>

              <Link href="/#menu" className={styles.continueLink}>
                ← Continue Shopping
              </Link>

              <div className={styles.trustRow}>
                <span>🔒 Secure checkout via Stripe</span>
                <span>🇨🇦 Canadian business</span>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
