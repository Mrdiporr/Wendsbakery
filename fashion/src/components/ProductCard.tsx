'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../lib/products';
import styles from './ProductCard.module.css';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <Link href={`/product/${product.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image 
          src={product.imageSrc} 
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.image}
        />
        <div className={styles.overlay}>
          <span className={styles.quickView}>View Details</span>
        </div>
      </div>
      <div className={styles.info}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.price}>{product.priceDisplay}</p>
      </div>
    </Link>
  );
}
