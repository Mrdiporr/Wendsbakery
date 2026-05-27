import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '../../../components/Header';
import styles from '../policies.module.css';

export const metadata: Metadata = {
  title: "Allergen Policy | Wendy's Bakehouse",
  description: "Allergen information for Wendy's Bakehouse products. Our kitchen handles gluten, dairy, eggs, tree nuts, soy, and more.",
};

const ALLERGENS = [
  { icon: '🌾', name: 'Gluten / Wheat',   detail: 'All baked goods contain wheat flour. We do not produce gluten-free products.' },
  { icon: '🥛', name: 'Dairy',             detail: 'Butter, cream, and milk are used across our product range.' },
  { icon: '🥚', name: 'Eggs',              detail: 'Eggs are used in all cakes, pastries, and meatpies.' },
  { icon: '🥜', name: 'Tree Nuts',         detail: 'Some products contain or are made near tree nuts (e.g., almond flour, praline).' },
  { icon: '🫘', name: 'Soy',               detail: 'Soy is present in some fillings and coatings used in our savoury range.' },
  { icon: '🌱', name: 'Sesame',            detail: 'Sesame seeds may be used as decoration or in certain savoury recipes.' },
];

export default function AllergenPolicyPage() {
  return (
    <main>
      <Header />
      <div className={styles.policyPage}>

        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link><span>/</span>
          <Link href="/policies">Policies</Link><span>/</span>
          <span>Allergen Policy</span>
        </nav>

        <div className={styles.policyHeader}>
          <span className={styles.policyHeaderIcon}>⚠️</span>
          <div>
            <h1 className={styles.policyTitle}>Allergen Policy</h1>
            <p className={styles.policyMeta}>Last updated: May 2026 · Wendy&apos;s Bakehouse, Etobicoke, Ontario</p>
          </div>
        </div>

        <div className={styles.content}>

          <div className={styles.highlight}>
            <strong>Important:</strong> Our kitchen is <strong>not allergen-free</strong>. We handle gluten, dairy, eggs, tree nuts, soy, and sesame in the same space. If you have a severe allergy, please read this policy carefully and contact us before ordering.
          </div>

          <h2>Allergens Present in Our Kitchen</h2>
          <p>The following major allergens (as defined by Health Canada) are handled in our kitchen environment:</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '0.6rem 0.5rem', fontSize: '0.85rem', opacity: 0.6 }}>Allergen</th>
                <th style={{ textAlign: 'left', padding: '0.6rem 0.5rem', fontSize: '0.85rem', opacity: 0.6 }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {ALLERGENS.map(a => (
                <tr key={a.name} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 0.5rem', whiteSpace: 'nowrap', fontWeight: 600, fontSize: '0.9rem' }}>
                    {a.icon} {a.name}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.88rem', opacity: 0.8 }}>{a.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Cross-Contamination Risk</h2>
          <p>
            All products are prepared in a <strong>home-based commercial kitchen</strong> where the above allergens are regularly present. While we take care to clean equipment between batches, we <strong>cannot guarantee the absence of cross-contamination</strong>.
          </p>
          <p>
            We do not manufacture in a certified allergen-free facility. Customers with severe allergies (including anaphylaxis risk) should carefully consider whether our products are appropriate for them.
          </p>

          <h2>Per-Product Allergen Information</h2>
          <p>
            Each product on our website displays an allergen notice listing the allergens <em>intentionally included</em> in that product. This does not include cross-contamination risk.
          </p>
          <ul>
            <li>Allergen details are shown on every product detail page</li>
            <li>You can also request a full ingredients list via Instagram before ordering</li>
          </ul>

          <h2>Custom Orders &amp; Dietary Requests</h2>
          <p>
            If you have a dietary requirement or allergy, please disclose it in the <strong>Order Notes</strong> field at checkout or in your custom order request. We will advise on the feasibility of your requirement.
          </p>
          <p>
            We do not currently offer certified vegan, gluten-free, or nut-free products. We may be able to <em>reduce</em> certain ingredients on request, but cannot guarantee full elimination given our shared kitchen environment.
          </p>

          <h2>Halal</h2>
          <p>
            We use <strong>halal-certified meats</strong> in our savoury products (meatpies, small chops). We do not use alcohol as an ingredient. Lard is never used. However, we do not hold a formal halal certification for our facility.
          </p>

          <h2>If You Have a Reaction</h2>
          <p>
            In the event of an allergic reaction, seek immediate medical attention. If you believe the reaction was caused by our product, please contact us within 24 hours with your order ID and details of the reaction. We will cooperate fully with any investigation.
          </p>

          <h2>Contact</h2>
          <p>
            For specific allergen enquiries before placing an order, please message us on{' '}
            <a href="https://www.instagram.com/wendys.bakehouse/" target="_blank" rel="noopener noreferrer">Instagram @wendys.bakehouse</a>. We are happy to answer questions about individual ingredients.
          </p>

        </div>

        <div className={styles.policyNav}>
          <Link href="/policies/privacy" className={styles.policyNavLink}>← Privacy Policy</Link>
          <Link href="/policies" className={styles.policyNavLink}>All Policies →</Link>
        </div>
      </div>
    </main>
  );
}
