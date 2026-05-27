import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '../../components/Header';
import styles from './policies.module.css';

export const metadata: Metadata = {
  title: "Policies | Wendy's Bakehouse",
  description: "Pickup, refund, privacy, and allergen policies for Wendy's Bakehouse — Etobicoke, Ontario.",
};

export default function PoliciesIndexPage() {
  const policies = [
    { slug: 'pickup',   icon: '📍', title: 'Pickup Policy',   desc: 'Hours, location, and what happens if you need to reschedule.' },
    { slug: 'refunds',  icon: '💳', title: 'Refund Policy',   desc: 'Deposits, cancellations, and our satisfaction guarantee.' },
    { slug: 'privacy',  icon: '🔒', title: 'Privacy Policy',  desc: 'How we collect, use, and protect your personal information under PIPEDA.' },
    { slug: 'allergens',icon: '⚠️', title: 'Allergen Policy', desc: 'Kitchen allergen information and how to raise a concern.' },
  ];

  return (
    <main>
      <Header />
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Policies</h1>
        <p className={styles.pageDesc}>
          Please read our policies before placing an order. If you have questions, contact us on{' '}
          <a href="https://www.instagram.com/wendys.bakehouse/" target="_blank" rel="noopener noreferrer" className={styles.igLink}>
            Instagram @wendys.bakehouse
          </a>.
        </p>
        <div className={styles.policyGrid}>
          {policies.map(p => (
            <Link key={p.slug} href={`/policies/${p.slug}`} className={styles.policyCard}>
              <span className={styles.policyIcon}>{p.icon}</span>
              <h2 className={styles.policyCardTitle}>{p.title}</h2>
              <p className={styles.policyCardDesc}>{p.desc}</p>
              <span className={styles.policyCardArrow}>Read →</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
