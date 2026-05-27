import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '../../../components/Header';
import styles from '../policies.module.css';

export const metadata: Metadata = {
  title: "Pickup Policy | Wendy's Bakehouse",
  description: "Learn about our pickup-only order collection process at Wendy's Bakehouse in Etobicoke, Ontario.",
};

export default function PickupPolicyPage() {
  return (
    <main>
      <Header />
      <div className={styles.policyPage}>

        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link><span>/</span>
          <Link href="/policies">Policies</Link><span>/</span>
          <span>Pickup Policy</span>
        </nav>

        <div className={styles.policyHeader}>
          <span className={styles.policyHeaderIcon}>📍</span>
          <div>
            <h1 className={styles.policyTitle}>Pickup Policy</h1>
            <p className={styles.policyMeta}>Last updated: May 2026 · Wendy&apos;s Bakehouse, Etobicoke, Ontario</p>
          </div>
        </div>

        <div className={styles.content}>

          <div className={styles.highlight}>
            <strong>All orders are pickup-only.</strong> We do not offer delivery at this time. Pickup is available in Etobicoke, Ontario. The exact address will be emailed to you once your order is confirmed.
          </div>

          <h2>Pickup Hours</h2>
          <p>
            Pickups are available <strong>Monday through Saturday, 10:00 AM – 5:00 PM</strong>. We are closed on Sundays and Canadian public holidays.
          </p>
          <p>
            Your selected pickup time is confirmed at checkout. Please arrive within <strong>30 minutes</strong> of your scheduled time. If you need to adjust your time, contact us as early as possible via Instagram.
          </p>

          <h2>Lead Times</h2>
          <p>Each product category has a minimum lead time:</p>
          <ul>
            <li><strong>Cake Loaves:</strong> 24 hours notice required</li>
            <li><strong>Meatpies &amp; Savoury:</strong> 48 hours notice required</li>
            <li><strong>Small Chops Platters:</strong> 72 hours notice required</li>
            <li><strong>Custom Celebration Cakes:</strong> Minimum 7 days — consultation mandatory</li>
            <li><strong>Wedding Cakes:</strong> Minimum 2–4 weeks</li>
          </ul>
          <p>Orders placed with insufficient lead time will be cancelled and refunded in full.</p>

          <h2>Rescheduling a Pickup</h2>
          <p>
            If you need to reschedule your pickup, please contact us <strong>at least 24 hours before your scheduled time</strong> via{' '}
            <a href="https://www.instagram.com/wendys.bakehouse/" target="_blank" rel="noopener noreferrer">Instagram @wendys.bakehouse</a>.
          </p>
          <p>
            We will do our best to accommodate your new time, subject to availability. Rescheduling is free of charge for a one-time change. Subsequent changes may result in a rescheduling fee at our discretion.
          </p>

          <h2>Late Pickups &amp; No-Shows</h2>
          <p>
            If you are more than 30 minutes late without prior notice, we may not be able to hold your order. For perishable items (fresh cream cakes, platters), orders not collected within 2 hours of the scheduled time may be forfeited without refund.
          </p>
          <p>
            For custom orders requiring a deposit, failure to collect within 24 hours of the agreed date without prior notice will be treated as a cancellation. Please review our <Link href="/policies/refunds">Refund Policy</Link> for details.
          </p>

          <h2>What to Bring</h2>
          <ul>
            <li>Your order confirmation email (digital or printed)</li>
            <li>Your order ID (format: WB-XXXXXX)</li>
            <li>A suitable container or bag for transport (especially for platters)</li>
          </ul>

          <h2>Contact</h2>
          <p>
            For pickup-related questions, please reach us on{' '}
            <a href="https://www.instagram.com/wendys.bakehouse/" target="_blank" rel="noopener noreferrer">Instagram @wendys.bakehouse</a>.
          </p>

        </div>

        <div className={styles.policyNav}>
          <Link href="/policies" className={styles.policyNavLink}>← All Policies</Link>
          <Link href="/policies/refunds" className={styles.policyNavLink}>Refund Policy →</Link>
        </div>
      </div>
    </main>
  );
}
