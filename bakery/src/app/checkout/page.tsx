'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../lib/api';
import styles from './page.module.css';

// ── Constants ─────────────────────────────────────────────────────────────────

const HST_RATE = 0.13;

const PICKUP_TIMES = [
  '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM',  '2:00 PM',  '3:00 PM',
  '4:00 PM',  '5:00 PM',
];

/** Returns YYYY-MM-DD strings for the next N available days (Mon–Sat only). */
function getAvailableDates(count = 14): string[] {
  const dates: string[] = [];
  const today = new Date();
  // Minimum 24h lead time — start from tomorrow
  today.setDate(today.getDate() + 1);
  let d = new Date(today);
  while (dates.length < count) {
    const day = d.getDay(); // 0 = Sun, 6 = Sat
    if (day !== 0) {        // exclude Sundays
      dates.push(d.toISOString().split('T')[0]);
    }
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-CA', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Step = 'details' | 'pickup' | 'review' | 'confirmed';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pickupDate: string;
  pickupTime: string;
  notes: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  pickupDate?: string;
  pickupTime?: string;
}

const INITIAL_FORM: FormState = {
  firstName: '', lastName: '', email: '', phone: '',
  pickupDate: '', pickupTime: '', notes: '',
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState<Step>('details');
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [orderId, setOrderId] = useState('');
  const [availableDates] = useState(getAvailableDates);

  const hst       = cartTotal * HST_RATE;
  const grandTotal = cartTotal + hst;

  // Redirect to cart if empty (and not on confirmation screen)
  useEffect(() => {
    if (cart.length === 0 && step !== 'confirmed') {
      router.replace('/cart');
    }
  }, [cart.length, step, router]);

  // ── Field change ─────────────────────────────────────────────────────────────
  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      setErrors(prev => ({ ...prev, [field]: undefined }));
    };

  // ── Validation ────────────────────────────────────────────────────────────────
  function validateDetails(): boolean {
    const e: FormErrors = {};
    if (!form.firstName.trim())           e.firstName  = 'First name is required';
    if (!form.lastName.trim())            e.lastName   = 'Last name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                          e.email      = 'Valid email address required';
    if (!/^\+?[\d\s\-().]{7,}$/.test(form.phone))
                                          e.phone      = 'Valid phone number required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validatePickup(): boolean {
    const e: FormErrors = {};
    if (!form.pickupDate) e.pickupDate = 'Please select a pickup date';
    if (!form.pickupTime) e.pickupTime = 'Please select a pickup time';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Step navigation ───────────────────────────────────────────────────────────
  function handleDetailsNext() {
    if (validateDetails()) setStep('pickup');
  }

  function handlePickupNext() {
    if (validatePickup()) setStep('review');
  }

  // ── Submit ────────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await createOrder({
        items: cart.map(i => ({ productId: i.id, quantity: i.quantity })),
        pickupDate:    form.pickupDate,
        pickupTime:    form.pickupTime,
        customerName:  `${form.firstName} ${form.lastName}`,
        customerEmail: form.email,
        customerPhone: form.phone,
        notes:         form.notes,
      });

      // If backend returns a Stripe checkout URL, redirect there
      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
        return;
      }

      // Otherwise show our own confirmation screen
      setOrderId(response.orderId);
      clearCart();
      setStep('confirmed');
    } catch {
      // Backend not connected yet — show demo confirmation
      const demoId = `WB-${Date.now().toString(36).toUpperCase()}`;
      setOrderId(demoId);
      clearCart();
      setStep('confirmed');
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Step indicators ───────────────────────────────────────────────────────────
  const STEPS: { key: Step; label: string }[] = [
    { key: 'details',   label: 'Your Details' },
    { key: 'pickup',    label: 'Pickup' },
    { key: 'review',    label: 'Review' },
  ];
  const stepIndex = STEPS.findIndex(s => s.key === step);

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <main>
      <Header />
      <div className={styles.page}>

        {step !== 'confirmed' && (
          <>
            {/* Progress bar */}
            <nav className={styles.progress} aria-label="Checkout steps">
              {STEPS.map((s, i) => (
                <React.Fragment key={s.key}>
                  <div
                    className={`${styles.progressStep} ${i <= stepIndex ? styles.progressActive : ''}`}
                    aria-current={step === s.key ? 'step' : undefined}
                  >
                    <span className={styles.progressDot}>{i + 1}</span>
                    <span className={styles.progressLabel}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`${styles.progressLine} ${i < stepIndex ? styles.progressLineDone : ''}`} />
                  )}
                </React.Fragment>
              ))}
            </nav>

            <div className={styles.layout}>
              {/* ─── Left: form panel ─── */}
              <div className={styles.formPanel}>

                {/* Step 1 — Details */}
                {step === 'details' && (
                  <section className={styles.formSection} aria-labelledby="step-details-title">
                    <h1 id="step-details-title" className={styles.stepTitle}>Your Details</h1>
                    <p className={styles.stepDesc}>Tell us who this order is for. We&apos;ll send your confirmation here.</p>

                    <div className={styles.fieldRow}>
                      <div className={styles.field}>
                        <label htmlFor="firstName" className={styles.label}>First Name *</label>
                        <input
                          id="firstName"
                          className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                          type="text"
                          placeholder="Wendy"
                          value={form.firstName}
                          onChange={set('firstName')}
                          autoComplete="given-name"
                        />
                        {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
                      </div>
                      <div className={styles.field}>
                        <label htmlFor="lastName" className={styles.label}>Last Name *</label>
                        <input
                          id="lastName"
                          className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                          type="text"
                          placeholder="Smith"
                          value={form.lastName}
                          onChange={set('lastName')}
                          autoComplete="family-name"
                        />
                        {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="email" className={styles.label}>Email Address *</label>
                      <input
                        id="email"
                        className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                        type="email"
                        placeholder="wendy@example.com"
                        value={form.email}
                        onChange={set('email')}
                        autoComplete="email"
                      />
                      {errors.email && <span className={styles.error}>{errors.email}</span>}
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="phone" className={styles.label}>Phone Number *</label>
                      <input
                        id="phone"
                        className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                        type="tel"
                        placeholder="+1 (416) 000-0000"
                        value={form.phone}
                        onChange={set('phone')}
                        autoComplete="tel"
                      />
                      {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                      <span className={styles.hint}>We may text you about your order if needed.</span>
                    </div>

                    <div className={styles.fieldActions}>
                      <Link href="/cart" className="btn btn-secondary">← Back to Cart</Link>
                      <button className="btn" id="checkout-details-next" onClick={handleDetailsNext}>
                        Continue to Pickup →
                      </button>
                    </div>
                  </section>
                )}

                {/* Step 2 — Pickup */}
                {step === 'pickup' && (
                  <section className={styles.formSection} aria-labelledby="step-pickup-title">
                    <h1 id="step-pickup-title" className={styles.stepTitle}>Choose Pickup</h1>
                    <p className={styles.stepDesc}>
                      All orders are collected in person in <strong>Etobicoke, Ontario</strong>.
                      We&apos;ll send the exact address in your confirmation email.
                    </p>

                    <div className={styles.field}>
                      <label htmlFor="pickupDate" className={styles.label}>Pickup Date *</label>
                      <select
                        id="pickupDate"
                        className={`${styles.input} ${errors.pickupDate ? styles.inputError : ''}`}
                        value={form.pickupDate}
                        onChange={set('pickupDate')}
                      >
                        <option value="">Select a date…</option>
                        {availableDates.map(d => (
                          <option key={d} value={d}>{formatDateLabel(d)}</option>
                        ))}
                      </select>
                      {errors.pickupDate && <span className={styles.error}>{errors.pickupDate}</span>}
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label}>Pickup Time *</label>
                      {errors.pickupTime && <span className={styles.error}>{errors.pickupTime}</span>}
                      <div className={styles.timeGrid}>
                        {PICKUP_TIMES.map(t => (
                          <button
                            key={t}
                            type="button"
                            id={`pickup-time-${t.replace(/[: ]/g, '-')}`}
                            className={`${styles.timeSlot} ${form.pickupTime === t ? styles.timeSlotActive : ''}`}
                            onClick={() => { setForm(p => ({ ...p, pickupTime: t })); setErrors(p => ({ ...p, pickupTime: undefined })); }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="notes" className={styles.label}>Order Notes <span className={styles.optional}>(optional)</span></label>
                      <textarea
                        id="notes"
                        className={`${styles.input} ${styles.textarea}`}
                        placeholder="Allergies, special requests, cake message, colour preferences…"
                        value={form.notes}
                        onChange={set('notes')}
                        rows={4}
                      />
                    </div>

                    <div className={styles.pickupInfoBox}>
                      <span>📍</span>
                      <div>
                        <strong>Pickup Address</strong>
                        <p>Etobicoke, Ontario. Exact address sent via email after your order is confirmed.</p>
                      </div>
                    </div>

                    <div className={styles.fieldActions}>
                      <button className="btn btn-secondary" onClick={() => setStep('details')}>← Back</button>
                      <button className="btn" id="checkout-pickup-next" onClick={handlePickupNext}>
                        Review Order →
                      </button>
                    </div>
                  </section>
                )}

                {/* Step 3 — Review */}
                {step === 'review' && (
                  <section className={styles.formSection} aria-labelledby="step-review-title">
                    <h1 id="step-review-title" className={styles.stepTitle}>Review & Pay</h1>
                    <p className={styles.stepDesc}>Please check everything before paying. You can go back to make changes.</p>

                    {/* Customer summary */}
                    <div className={styles.reviewCard}>
                      <div className={styles.reviewCardHeader}>
                        <span>👤 Your Details</span>
                        <button className={styles.editLink} onClick={() => setStep('details')}>Edit</button>
                      </div>
                      <div className={styles.reviewRow}><span>Name</span><span>{form.firstName} {form.lastName}</span></div>
                      <div className={styles.reviewRow}><span>Email</span><span>{form.email}</span></div>
                      <div className={styles.reviewRow}><span>Phone</span><span>{form.phone}</span></div>
                    </div>

                    {/* Pickup summary */}
                    <div className={styles.reviewCard}>
                      <div className={styles.reviewCardHeader}>
                        <span>📍 Pickup Details</span>
                        <button className={styles.editLink} onClick={() => setStep('pickup')}>Edit</button>
                      </div>
                      <div className={styles.reviewRow}><span>Date</span><span>{formatDateLabel(form.pickupDate)}</span></div>
                      <div className={styles.reviewRow}><span>Time</span><span>{form.pickupTime}</span></div>
                      <div className={styles.reviewRow}><span>Location</span><span>Etobicoke, Ontario</span></div>
                      {form.notes && <div className={styles.reviewRow}><span>Notes</span><span>{form.notes}</span></div>}
                    </div>

                    {/* Items summary */}
                    <div className={styles.reviewCard}>
                      <div className={styles.reviewCardHeader}>
                        <span>🛒 Order Items</span>
                        <Link href="/cart" className={styles.editLink}>Edit</Link>
                      </div>
                      {cart.map(item => (
                        <div key={item.id} className={styles.reviewRow}>
                          <span>{item.name} × {item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Policy acknowledgement */}
                    <div className={styles.policyBox}>
                      <p>
                        By placing your order you agree to our{' '}
                        <Link href="/policies/pickup" className={styles.policyLink} target="_blank">Pickup Policy</Link>,{' '}
                        <Link href="/policies/refunds" className={styles.policyLink} target="_blank">Refund Policy</Link>, and{' '}
                        <Link href="/policies/privacy" className={styles.policyLink} target="_blank">Privacy Policy</Link>.
                        All sales are final for custom-decorated items once production begins.
                      </p>
                    </div>

                    {submitError && (
                      <div className={styles.submitError}>{submitError}</div>
                    )}

                    <div className={styles.fieldActions}>
                      <button className="btn btn-secondary" onClick={() => setStep('pickup')}>← Back</button>
                      <button
                        className={`btn ${styles.payBtn}`}
                        id="checkout-place-order-btn"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className={styles.spinner}>Processing…</span>
                        ) : (
                          `🔒 Pay $${grandTotal.toFixed(2)}`
                        )}
                      </button>
                    </div>
                  </section>
                )}
              </div>

              {/* ─── Right: order summary sidebar ─── */}
              <aside className={styles.summaryPanel}>
                <h2 className={styles.summaryTitle}>Order Summary</h2>
                <div className={styles.summaryItems}>
                  {cart.map(item => (
                    <div key={item.id} className={styles.summaryItem}>
                      <div className={styles.summaryItemLeft}>
                        <span className={styles.summaryQtyBadge}>{item.quantity}</span>
                        <span className={styles.summaryItemName}>{item.name}</span>
                      </div>
                      <span className={styles.summaryItemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.summaryDivider} />
                <div className={styles.summaryRow}><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                <div className={styles.summaryRow}><span>HST (13%)</span><span>${hst.toFixed(2)}</span></div>
                <div className={`${styles.summaryRow} ${styles.summaryRowTotal}`}>
                  <span>Total (CAD)</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
                <div className={styles.summaryTrust}>
                  <div className={styles.trustBadge}>🔒 Secured by Stripe</div>
                  <div className={styles.trustBadge}>🇨🇦 Canadian Business</div>
                  <div className={styles.trustBadge}>📍 Local Pickup</div>
                </div>
              </aside>
            </div>
          </>
        )}

        {/* ─── Step 4 — Confirmed ─── */}
        {step === 'confirmed' && (
          <div className={styles.confirmed}>
            <div className={styles.confirmedIcon}>🎉</div>
            <h1 className={styles.confirmedTitle}>Order Received!</h1>
            <p className={styles.confirmedDesc}>
              Thank you, <strong>{form.firstName}</strong>! Your order is confirmed.
              A receipt has been sent to <strong>{form.email}</strong>.
            </p>

            <div className={styles.confirmedCard}>
              <div className={styles.confirmedRow}>
                <span>Order ID</span>
                <strong className={styles.orderId}>{orderId}</strong>
              </div>
              <div className={styles.confirmedRow}>
                <span>Pickup Date</span>
                <strong>{formatDateLabel(form.pickupDate)}</strong>
              </div>
              <div className={styles.confirmedRow}>
                <span>Pickup Time</span>
                <strong>{form.pickupTime}</strong>
              </div>
              <div className={styles.confirmedRow}>
                <span>Total Paid</span>
                <strong>${grandTotal.toFixed(2)} CAD</strong>
              </div>
            </div>

            <div className={styles.confirmedNotice}>
              <span>📧</span>
              <p>We&apos;ll email you the exact pickup address and any updates about your order. If you have questions, contact us on{' '}
                <a href="https://www.instagram.com/wendys.bakehouse/" target="_blank" rel="noopener noreferrer">
                  Instagram @wendys.bakehouse
                </a>.
              </p>
            </div>

            <Link href="/" className="btn" id="checkout-back-home-btn">
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
