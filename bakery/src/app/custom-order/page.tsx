import type { Metadata } from 'next';
import Header from '../../components/Header';
import CustomOrderForm from '../../components/CustomOrderForm';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: "Custom Order Request | Wendy's Bakehouse",
  description:
    "Request a custom celebration cake, event platter, or bespoke baked treat from Wendy's Bakehouse in Etobicoke, Ontario. Tell us your vision — we'll bring it to life.",
};

export default function CustomOrderPage() {
  return (
    <main>
      <Header />

      {/* ── Hero banner ─────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroTag}>Custom Orders</span>
          <h1 className={styles.heroTitle}>
            Let&apos;s Create Something <span>Extraordinary.</span>
          </h1>
          <p className={styles.heroDesc}>
            Every custom order starts with a conversation. Tell us about your event,
            your vision, and your flavour preferences — and we&apos;ll craft something
            truly one-of-a-kind for you.
          </p>
          <div className={styles.heroBadges}>
            <span className={styles.heroBadge}>🎂 Custom Cakes</span>
            <span className={styles.heroBadge}>🍽️ Event Platters</span>
            <span className={styles.heroBadge}>🎉 Party Packages</span>
            <span className={styles.heroBadge}>💍 Wedding Cakes</span>
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────── */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <h2 className={styles.howTitle}>How It Works</h2>
          <div className={styles.steps}>
            {[
              { n: '01', title: 'Submit Your Request', desc: 'Fill in the form below with your event details, preferences, and inspiration.' },
              { n: '02', title: 'We Reach Out',        desc: 'Wendy will contact you within 24–48 hours to discuss your order and provide a quote.' },
              { n: '03', title: 'Confirm & Deposit',   desc: 'Approve the quote, pay a 50% deposit to secure your date, and leave the rest to us.' },
              { n: '04', title: 'Collect & Celebrate', desc: 'Pick up your creation in Etobicoke and enjoy every bite!' },
            ].map(s => (
              <div key={s.n} className={styles.step}>
                <span className={styles.stepNum}>{s.n}</span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form ────────────────────────────────────────── */}
      <section className={styles.formSection}>
        <div className={styles.container}>
          <div className={styles.formLayout}>
            <div className={styles.formMain}>
              <CustomOrderForm />
            </div>
            <aside className={styles.formSidebar}>
              <div className={styles.sideCard}>
                <h3 className={styles.sideCardTitle}>📋 Before You Order</h3>
                <ul className={styles.sideList}>
                  <li>Custom cakes require <strong>at least 7 days</strong> notice</li>
                  <li>Wedding / tiered cakes require <strong>2–4 weeks</strong> notice</li>
                  <li>Event platters require <strong>72 hours</strong> notice</li>
                  <li>A <strong>50% non-refundable deposit</strong> is required to confirm</li>
                  <li>Pickup only — <strong>Etobicoke, Ontario</strong></li>
                </ul>
              </div>

              <div className={styles.sideCard}>
                <h3 className={styles.sideCardTitle}>💬 Prefer to Message Us?</h3>
                <p className={styles.sideCardDesc}>
                  Reach out directly on Instagram and we&apos;ll get back to you as soon as possible.
                </p>
                <a
                  href="https://www.instagram.com/wendys.bakehouse/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.igBtn}
                  id="custom-order-instagram-btn"
                >
                  📸 @wendys.bakehouse
                </a>
              </div>

              <div className={styles.sideCard}>
                <h3 className={styles.sideCardTitle}>⚠️ Allergen Notice</h3>
                <p className={styles.sideCardDesc}>
                  Our kitchen handles gluten, dairy, eggs, and tree nuts. Please
                  disclose all allergies in your request so we can advise accordingly.
                  We cannot guarantee a fully allergen-free environment.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
