'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import type { Product } from '../lib/products';
import styles from './AddToCartButton.module.css';

interface Props {
  product: Product;
}

export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      imageSrc: product.imageSrc,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <button
      id={`add-to-cart-${product.id}`}
      className={`btn ${styles.addBtn} ${added ? styles.added : ''}`}
      onClick={handleClick}
      aria-label={`Add ${product.title} to cart`}
    >
      {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
    </button>
  );
}
