'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ProductCard.module.css';
import { useCart } from '../context/CartContext';
import type { Product } from '../lib/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // don't navigate when clicking "Add"
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      imageSrc: product.imageSrc,
    });
  };

  return (
    <Link href={`/product/${product.id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.cardImageWrapper}>
          {product.imageSrc ? (
            <Image
              src={product.imageSrc}
              alt={product.title}
              fill
              className={styles.cardImage}
            />
          ) : (
            <div className={styles.cardImagePlaceholder}>
              <span>🍰</span>
            </div>
          )}
          {product.category && (
            <span className={styles.categoryBadge}>{product.category}</span>
          )}
        </div>
        <div className={styles.cardBody}>
          <h3 className={styles.cardTitle}>{product.title}</h3>
          <p className={styles.cardPrice}>{product.priceDisplay}</p>
          <div className={styles.cardFooter}>
            <span className={styles.cardDesc}>{product.description}</span>
            <button className={styles.addToCart} onClick={handleAddToCart} aria-label={`Add ${product.title} to cart`}>
              <span>+ Add</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
