import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '../../../components/Header';
import styles from '../policies.module.css';

export const metadata: Metadata = {
  title: "Privacy Policy | Wendy's Bakehouse",
  description: "How Wendy's Bakehouse collects, uses, and protects your personal information in compliance with PIPEDA (Canada).",
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <Header />
      <div className={styles.policyPage}>

        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link><span>/</span>
          <Link href="/policies">Policies</Link><span>/</span>
          <span>Privacy Policy</span>
        </nav>

        <div className={styles.policyHeader}>
          <span className={styles.policyHeaderIcon}>🔒</span>
          <div>
            <h1 className={styles.policyTitle}>Privacy Policy</h1>
            <p className={styles.policyMeta}>Last updated: May 2026 · Wendy&apos;s Collectibles o/a Wendy&apos;s Bakehouse, Etobicoke, Ontario</p>
          </div>
        </div>

        <div className={styles.content}>

          <div className={styles.highlight}>
            This Privacy Policy explains how <strong>Wendy&apos;s Collectibles</strong> operating as <strong>Wendy&apos;s Bakehouse</strong> collects, uses, discloses, and protects your personal information in accordance with Canada&apos;s <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA).
          </div>

          <h2>1. Who We Are</h2>
          <p>
            Wendy&apos;s Bakehouse is operated by <strong>Wendy&apos;s Collectibles</strong>, a small business based in Etobicoke, Ontario, Canada. We can be reached via{' '}
            <a href="https://www.instagram.com/wendys.bakehouse/" target="_blank" rel="noopener noreferrer">Instagram @wendys.bakehouse</a>.
          </p>

          <h2>2. Information We Collect</h2>
          <p>When you place an order or submit a custom order enquiry, we may collect:</p>
          <ul>
            <li><strong>Name</strong> — to personalise your order</li>
            <li><strong>Email address</strong> — to send your order confirmation and pickup details</li>
            <li><strong>Phone number</strong> — to contact you about your order if needed</li>
            <li><strong>Order details</strong> — items, quantities, pickup date and time, dietary notes</li>
            <li><strong>Payment information</strong> — processed securely by Stripe. We do not store full card details.</li>
            <li><strong>Inspiration images</strong> (custom orders only) — uploaded at your discretion to describe your design preferences</li>
          </ul>
          <p>
            We do not knowingly collect personal information from children under 13. Our website does not use tracking cookies or third-party advertising analytics.
          </p>

          <h2>3. How We Use Your Information</h2>
          <p>Your information is used only to:</p>
          <ul>
            <li>Process and fulfill your order</li>
            <li>Send your order confirmation and pickup instructions</li>
            <li>Contact you about your order (rescheduling, substitutions, delays)</li>
            <li>Respond to your custom order enquiry</li>
            <li>Meet our legal and financial record-keeping obligations</li>
          </ul>
          <p>
            We do not use your email to send marketing communications unless you have explicitly opted in. We do not sell or share your personal data with third parties for marketing purposes.
          </p>

          <h2>4. Information Sharing</h2>
          <p>We may share your information only with:</p>
          <ul>
            <li><strong>Stripe</strong> — our payment processor (operates under its own privacy policy and PCI-DSS compliance)</li>
            <li><strong>WooCommerce / WordPress</strong> — our order management backend, hosted on our own server</li>
            <li><strong>Legal authorities</strong> — if required by law, court order, or to protect our rights</li>
          </ul>
          <p>All service providers are required to protect your information and use it only for the purpose we specify.</p>

          <h2>5. Data Retention</h2>
          <p>
            We retain order records for <strong>7 years</strong> as required by the Canada Revenue Agency for business record-keeping. After that period, records are securely deleted. Custom order enquiries that did not result in a confirmed order are deleted after 12 months.
          </p>

          <h2>6. Your Rights Under PIPEDA</h2>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access</strong> the personal information we hold about you</li>
            <li><strong>Correct</strong> inaccurate information</li>
            <li><strong>Withdraw consent</strong> where processing is based on consent (this may limit our ability to fulfill your order)</li>
            <li><strong>Request deletion</strong> of information we are not legally required to retain</li>
          </ul>
          <p>
            To exercise any of these rights, contact us via Instagram. We will respond within <strong>30 days</strong>.
          </p>

          <h2>7. Security</h2>
          <p>
            We take reasonable technical and organisational measures to protect your personal information, including encrypted connections (HTTPS), server-side credential storage, and restricted staff access. No method of transmission over the internet is 100% secure, but we are committed to protecting your data.
          </p>

          <h2>8. Cookies</h2>
          <p>
            Our website uses only essential, functional cookies (e.g. session management). We do not use advertising, tracking, or analytics cookies. No cookie consent banner is required for essential cookies under Canadian law.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Material changes will be announced on our Instagram page. Continued use of the website after changes constitutes acceptance of the updated policy.
          </p>

          <h2>10. Contact &amp; Complaints</h2>
          <p>
            If you have a privacy concern or complaint, please contact us first via{' '}
            <a href="https://www.instagram.com/wendys.bakehouse/" target="_blank" rel="noopener noreferrer">Instagram @wendys.bakehouse</a>.
            If we are unable to resolve your concern, you may contact the{' '}
            <a href="https://www.priv.gc.ca/" target="_blank" rel="noopener noreferrer">Office of the Privacy Commissioner of Canada</a>.
          </p>

        </div>

        <div className={styles.policyNav}>
          <Link href="/policies/refunds" className={styles.policyNavLink}>← Refund Policy</Link>
          <Link href="/policies/allergens" className={styles.policyNavLink}>Allergen Policy →</Link>
        </div>
      </div>
    </main>
  );
}
