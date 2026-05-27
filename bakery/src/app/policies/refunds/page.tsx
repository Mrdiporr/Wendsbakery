import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '../../../components/Header';
import styles from '../policies.module.css';

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Wendy's Bakehouse",
  description: "Our deposit, cancellation, and refund policy for standard and custom orders at Wendy's Bakehouse.",
};

export default function RefundsPolicyPage() {
  return (
    <main>
      <Header />
      <div className={styles.policyPage}>

        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link><span>/</span>
          <Link href="/policies">Policies</Link><span>/</span>
          <span>Refund Policy</span>
        </nav>

        <div className={styles.policyHeader}>
          <span className={styles.policyHeaderIcon}>💳</span>
          <div>
            <h1 className={styles.policyTitle}>Refund &amp; Cancellation Policy</h1>
            <p className={styles.policyMeta}>Last updated: May 2026 · Wendy&apos;s Bakehouse, Etobicoke, Ontario</p>
          </div>
        </div>

        <div className={styles.content}>

          <div className={styles.highlight}>
            <strong>Summary:</strong> Standard catalogue orders cancelled with 24+ hours notice receive a full refund. Custom orders require a non-refundable 50% deposit. All sales are final once production begins.
          </div>

          <h2>Standard Orders (Catalogue Items)</h2>
          <p>
            For standard menu items (loaves, meatpies, platters) ordered via the website:
          </p>
          <ul>
            <li><strong>Cancelled 24+ hours before pickup:</strong> Full refund — no questions asked.</li>
            <li><strong>Cancelled less than 24 hours before pickup:</strong> 50% refund. The remaining 50% covers ingredients and preparation time.</li>
            <li><strong>No-show (no contact, not collected):</strong> No refund issued.</li>
            <li><strong>Order issue / quality concern:</strong> Please contact us within 24 hours of pickup. We will review each case individually and may offer a replacement, credit, or partial refund at our discretion.</li>
          </ul>

          <h2>Custom Orders (Cakes &amp; Bespoke Items)</h2>
          <p>All custom orders require a <strong>50% non-refundable deposit</strong> to confirm your booking.</p>
          <ul>
            <li><strong>Deposit:</strong> Non-refundable. Covers design consultation, ingredient sourcing, and scheduling.</li>
            <li><strong>Balance:</strong> Due at or before pickup.</li>
            <li><strong>Cancelled 7+ days before the event date:</strong> Deposit is forfeited; no further charge.</li>
            <li><strong>Cancelled less than 7 days before the event:</strong> Full balance may be charged if production has already begun.</li>
            <li><strong>Once production begins:</strong> No refund is available. We define &ldquo;production begun&rdquo; as any baking, assembly, or decoration that has commenced.</li>
          </ul>

          <h2>Quality &amp; Satisfaction</h2>
          <p>
            We take tremendous pride in the quality of every item we produce. If you believe there is a genuine quality issue with your order (incorrect flavour, structural failure, significantly different from what was agreed), please:
          </p>
          <ol>
            <li>Contact us within <strong>24 hours of pickup</strong> via Instagram.</li>
            <li>Provide your order ID and photos of the issue.</li>
            <li>We will respond within 1 business day with a resolution — which may include a replacement, partial refund, or store credit.</li>
          </ol>
          <p>
            We do not issue refunds for matters of personal taste (e.g., flavour preference) or damage that occurred after the item left our possession.
          </p>

          <h2>How Refunds Are Processed</h2>
          <p>
            Approved refunds are returned to your original payment method within <strong>5–10 business days</strong>, depending on your bank or card provider. If you paid by e-Transfer, refunds are sent to the email address used for payment.
          </p>

          <h2>Disputes</h2>
          <p>
            We are a small, family-run business and we are committed to resolving any issue fairly. Please reach out to us directly before initiating a chargeback or dispute with your bank — we almost always prefer to resolve things personally.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about your order or a refund request? Message us on{' '}
            <a href="https://www.instagram.com/wendys.bakehouse/" target="_blank" rel="noopener noreferrer">Instagram @wendys.bakehouse</a>{' '}
            with your order ID.
          </p>

        </div>

        <div className={styles.policyNav}>
          <Link href="/policies/pickup" className={styles.policyNavLink}>← Pickup Policy</Link>
          <Link href="/policies/privacy" className={styles.policyNavLink}>Privacy Policy →</Link>
        </div>
      </div>
    </main>
  );
}
