import Header from "../../../components/Header";
import { fetchProduct } from "../../../lib/api";
import styles from "./ProductPage.module.css";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <Header />
      <div className={styles.container}>
        <div className={styles.productLayout}>
          <div className={styles.imageSection}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imageSrc}
              alt={product.title}
              className={styles.mainImage}
            />
          </div>
          <div className={styles.infoSection}>
            <p className={styles.category}>{product.category}</p>
            <h1 className={styles.title}>{product.title}</h1>
            <p className={styles.price}>{product.priceDisplay}</p>
            
            <div className={styles.description}>
              <p>{product.longDescription}</p>
            </div>

            {product.sizes && (
              <div className={styles.optionGroup}>
                <span className={styles.optionLabel}>Size</span>
                <div className={styles.optionGrid}>
                  {product.sizes.map(size => (
                    <button key={size} className={styles.optionButton}>{size}</button>
                  ))}
                </div>
              </div>
            )}

            <button className={styles.addToCart}>Add to Bag</button>
            
            <div className={styles.details}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Material</span>
                <span className={styles.detailValue}>{product.material}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Shipping</span>
                <span className={styles.detailValue}>Standard shipping in 3-5 days.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
