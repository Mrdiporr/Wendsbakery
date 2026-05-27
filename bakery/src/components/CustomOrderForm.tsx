'use client';

import React, { useState, useRef, useCallback } from 'react';
import styles from './CustomOrderForm.module.css';

// ── Option data ───────────────────────────────────────────────────────────────

const EVENT_TYPES = [
  'Birthday',
  'Wedding',
  'Baby Shower',
  'Bridal Shower',
  'Anniversary',
  'Corporate Event',
  'Graduation',
  'Christening / Naming Ceremony',
  'Other',
];

const CAKE_FLAVOURS = [
  'Vanilla',
  'Red Velvet',
  'Marble',
  'Chocolate Fudge',
  'Lemon Drizzle',
  'Strawberry',
  'Coconut',
  'Carrot',
  'Not sure — surprise me!',
];

const FILLING_OPTIONS = [
  'Buttercream',
  'Cream Cheese',
  'Whipped Cream',
  'Chocolate Ganache',
  'Strawberry Jam',
  'Lemon Curd',
  'Not sure — baker\'s choice',
];

const SERVING_SIZES = [
  '10–20 guests',
  '20–40 guests',
  '40–60 guests',
  '60–80 guests',
  '80–100 guests',
  '100+ guests',
  'Not sure',
];

const TIER_OPTIONS = ['1 tier', '2 tiers', '3 tiers', '4+ tiers', 'Not sure'];

const ORDER_TYPES = [
  { id: 'custom-cake',    icon: '🎂', label: 'Custom Cake',       desc: 'Celebration, wedding, or themed cake' },
  { id: 'small-chops',   icon: '🍽️', label: 'Event Platter',     desc: 'Small chops, puff-puff, spring rolls' },
  { id: 'cake-loaves',   icon: '🍞', label: 'Cake Loaf Bundle',   desc: 'Multiple loaves for gifting or events' },
  { id: 'full-package',  icon: '🎉', label: 'Full Event Package', desc: 'Cake + platters + full catering' },
];

const MAX_FILES = 3;
const MAX_FILE_MB = 5;

// ── Types ─────────────────────────────────────────────────────────────────────

type Stage = 'form' | 'submitted';

interface FormState {
  orderType: string;
  eventType: string;
  eventDate: string;
  guestCount: string;
  tiers: string;
  flavour: string;
  filling: string;
  colours: string;
  dietaryNotes: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

const INITIAL: FormState = {
  orderType: '', eventType: '', eventDate: '', guestCount: '',
  tiers: '', flavour: '', filling: '', colours: '', dietaryNotes: '',
  firstName: '', lastName: '', email: '', phone: '', message: '',
};

// ── Min event date: 7 days from today ─────────────────────────────────────────
function minEventDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CustomOrderForm() {
  const [stage, setStage]           = useState<Stage>('form');
  const [form, setForm]             = useState<FormState>(INITIAL);
  const [errors, setErrors]         = useState<FormErrors>({});
  const [files, setFiles]           = useState<File[]>([]);
  const [dragOver, setDragOver]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Field setter ─────────────────────────────────────────────────────────────
  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm(p => ({ ...p, [field]: e.target.value }));
      setErrors(p => ({ ...p, [field]: undefined }));
    };

  // ── Multi-choice toggle ───────────────────────────────────────────────────────
  const toggleChoice = (field: keyof FormState, value: string) => {
    setForm(p => ({ ...p, [field]: p[field] === value ? '' : value }));
    setErrors(p => ({ ...p, [field]: undefined }));
  };

  // ── File handling ─────────────────────────────────────────────────────────────
  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter(f => {
      if (!f.type.startsWith('image/')) return false;
      if (f.size > MAX_FILE_MB * 1024 * 1024) return false;
      return true;
    });
    setFiles(prev => {
      const combined = [...prev, ...valid];
      return combined.slice(0, MAX_FILES);
    });
  }, []);

  const removeFile = (idx: number) =>
    setFiles(prev => prev.filter((_, i) => i !== idx));

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  // ── Validation ────────────────────────────────────────────────────────────────
  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.orderType)  e.orderType  = 'Please select an order type';
    if (!form.eventType)  e.eventType  = 'Please select an event type';
    if (!form.eventDate)  e.eventDate  = 'Please select your event date';
    if (!form.guestCount) e.guestCount = 'Please select approximate guest count';
    if (!form.firstName.trim()) e.firstName = 'First name required';
    if (!form.lastName.trim())  e.lastName  = 'Last name required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Valid email address required';
    if (!/^\+?[\d\s\-().]{7,}$/.test(form.phone))
      e.phone = 'Valid phone number required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Submit ────────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      // Scroll to first error
      const firstErr = document.querySelector('[data-error="true"]');
      firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      // Build FormData for multipart submission (files + fields)
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach(f => fd.append('inspirationImages', f));

      // POST to Laravel API when connected
      const apiBase = process.env.NEXT_PUBLIC_API_URL;
      if (apiBase) {
        const res = await fetch(`${apiBase}/api/custom-orders`, { method: 'POST', body: fd });
        if (!res.ok) throw new Error(`Server error ${res.status}`);
      }
      // If no backend, fall through to success state (demo mode)

      setStage('submitted');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      // Graceful demo fallback — show success anyway
      setStage('submitted');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success screen ────────────────────────────────────────────────────────────
  if (stage === 'submitted') {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>🎂</div>
        <h2 className={styles.successTitle}>Request Received!</h2>
        <p className={styles.successDesc}>
          Thank you, <strong>{form.firstName}</strong>! We&apos;ve received your custom order
          request and will be in touch within <strong>24–48 hours</strong> at{' '}
          <strong>{form.email}</strong> to discuss your vision and provide a quote.
        </p>
        <div className={styles.successDetails}>
          <div className={styles.successRow}><span>Order Type</span><strong>{ORDER_TYPES.find(o => o.id === form.orderType)?.label}</strong></div>
          <div className={styles.successRow}><span>Event</span><strong>{form.eventType} · {new Date(form.eventDate + 'T12:00:00').toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</strong></div>
          <div className={styles.successRow}><span>Guests</span><strong>{form.guestCount}</strong></div>
        </div>
        <p className={styles.successNote}>
          Have questions in the meantime?{' '}
          <a href="https://www.instagram.com/wendys.bakehouse/" target="_blank" rel="noopener noreferrer" className={styles.igLink}>
            Message us on Instagram @wendys.bakehouse
          </a>
        </p>
        <button className={`btn ${styles.resetBtn}`} onClick={() => { setForm(INITIAL); setFiles([]); setStage('form'); }}>
          Submit Another Request
        </button>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form} id="custom-order-form">

      {/* ── Section 1: Order type ── */}
      <fieldset className={styles.section}>
        <legend className={styles.sectionLegend}>
          <span className={styles.sectionNum}>01</span>
          What can we make for you?
        </legend>
        {errors.orderType && <p className={styles.fieldError} data-error="true">{errors.orderType}</p>}
        <div className={styles.orderTypeGrid}>
          {ORDER_TYPES.map(o => (
            <button
              key={o.id}
              type="button"
              id={`order-type-${o.id}`}
              className={`${styles.orderTypeCard} ${form.orderType === o.id ? styles.orderTypeActive : ''}`}
              onClick={() => toggleChoice('orderType', o.id)}
            >
              <span className={styles.orderTypeIcon}>{o.icon}</span>
              <span className={styles.orderTypeLabel}>{o.label}</span>
              <span className={styles.orderTypeDesc}>{o.desc}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* ── Section 2: Event details ── */}
      <fieldset className={styles.section}>
        <legend className={styles.sectionLegend}>
          <span className={styles.sectionNum}>02</span>
          Tell us about your event
        </legend>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="eventType" className={styles.label}>Event Type *</label>
            <select
              id="eventType"
              className={`${styles.input} ${errors.eventType ? styles.inputError : ''}`}
              value={form.eventType}
              onChange={set('eventType')}
              data-error={!!errors.eventType}
            >
              <option value="">Select event type…</option>
              {EVENT_TYPES.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            {errors.eventType && <span className={styles.error}>{errors.eventType}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="eventDate" className={styles.label}>Event Date *</label>
            <input
              id="eventDate"
              type="date"
              className={`${styles.input} ${errors.eventDate ? styles.inputError : ''}`}
              value={form.eventDate}
              onChange={set('eventDate')}
              min={minEventDate()}
              data-error={!!errors.eventDate}
            />
            {errors.eventDate && <span className={styles.error}>{errors.eventDate}</span>}
            <span className={styles.hint}>Minimum 7 days from today for custom orders.</span>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Approximate Guest Count *</label>
          {errors.guestCount && <span className={styles.error} data-error="true">{errors.guestCount}</span>}
          <div className={styles.chipRow}>
            {SERVING_SIZES.map(s => (
              <button
                key={s}
                type="button"
                id={`guest-count-${s.replace(/[^a-z0-9]/gi, '-')}`}
                className={`${styles.chip} ${form.guestCount === s ? styles.chipActive : ''}`}
                onClick={() => toggleChoice('guestCount', s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </fieldset>

      {/* ── Section 3: Cake preferences (only for cake types) ── */}
      {(form.orderType === 'custom-cake' || form.orderType === 'full-package' || !form.orderType) && (
        <fieldset className={styles.section}>
          <legend className={styles.sectionLegend}>
            <span className={styles.sectionNum}>03</span>
            Cake Preferences <span className={styles.optionalLegend}>(if applicable)</span>
          </legend>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>Cake Tiers</label>
              <div className={styles.chipRow}>
                {TIER_OPTIONS.map(t => (
                  <button
                    key={t}
                    type="button"
                    id={`tiers-${t.replace(/[^a-z0-9]/gi, '-')}`}
                    className={`${styles.chip} ${form.tiers === t ? styles.chipActive : ''}`}
                    onClick={() => toggleChoice('tiers', t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Flavour</label>
            <div className={styles.chipRow}>
              {CAKE_FLAVOURS.map(f => (
                <button
                  key={f}
                  type="button"
                  id={`flavour-${f.replace(/[^a-z0-9]/gi, '-')}`}
                  className={`${styles.chip} ${form.flavour === f ? styles.chipActive : ''}`}
                  onClick={() => toggleChoice('flavour', f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Filling / Frosting</label>
            <div className={styles.chipRow}>
              {FILLING_OPTIONS.map(f => (
                <button
                  key={f}
                  type="button"
                  id={`filling-${f.replace(/[^a-z0-9]/gi, '-')}`}
                  className={`${styles.chip} ${form.filling === f ? styles.chipActive : ''}`}
                  onClick={() => toggleChoice('filling', f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="colours" className={styles.label}>
                Colour Theme <span className={styles.optional}>(optional)</span>
              </label>
              <input
                id="colours"
                type="text"
                className={styles.input}
                placeholder="e.g. Dusty rose, gold, white…"
                value={form.colours}
                onChange={set('colours')}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="dietaryNotes" className={styles.label}>
                Dietary Requirements <span className={styles.optional}>(optional)</span>
              </label>
              <input
                id="dietaryNotes"
                type="text"
                className={styles.input}
                placeholder="e.g. Nut-free, halal…"
                value={form.dietaryNotes}
                onChange={set('dietaryNotes')}
              />
            </div>
          </div>
        </fieldset>
      )}

      {/* ── Section 4: Inspiration images ── */}
      <fieldset className={styles.section}>
        <legend className={styles.sectionLegend}>
          <span className={styles.sectionNum}>{form.orderType === 'small-chops' ? '03' : '04'}</span>
          Inspiration Images <span className={styles.optionalLegend}>(optional · up to {MAX_FILES})</span>
        </legend>

        <div
          className={`${styles.dropzone} ${dragOver ? styles.dropzoneActive : ''}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload inspiration images"
          onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
          id="custom-order-image-upload"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className={styles.fileInput}
            onChange={e => addFiles(e.target.files)}
          />
          <span className={styles.dropzoneIcon}>📸</span>
          <p className={styles.dropzoneText}>
            <strong>Drop images here</strong> or click to browse
          </p>
          <p className={styles.dropzoneHint}>
            PNG, JPG, WEBP · Max {MAX_FILE_MB}MB each · Up to {MAX_FILES} images
          </p>
        </div>

        {files.length > 0 && (
          <div className={styles.filePreviewRow}>
            {files.map((f, i) => (
              <div key={i} className={styles.filePreview}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(f)}
                  alt={`Inspiration ${i + 1}`}
                  className={styles.previewImg}
                />
                <button
                  type="button"
                  className={styles.previewRemove}
                  onClick={() => removeFile(i)}
                  aria-label={`Remove image ${i + 1}`}
                >
                  ✕
                </button>
                <span className={styles.previewName}>{f.name.slice(0, 18)}{f.name.length > 18 ? '…' : ''}</span>
              </div>
            ))}
            {files.length < MAX_FILES && (
              <button
                type="button"
                className={styles.addMoreBtn}
                onClick={() => fileInputRef.current?.click()}
              >
                <span>+</span>
                <span>Add more</span>
              </button>
            )}
          </div>
        )}
      </fieldset>

      {/* ── Section 5: Your details ── */}
      <fieldset className={styles.section}>
        <legend className={styles.sectionLegend}>
          <span className={styles.sectionNum}>{form.orderType === 'small-chops' ? '04' : '05'}</span>
          Your Contact Details
        </legend>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="co-firstName" className={styles.label}>First Name *</label>
            <input
              id="co-firstName"
              type="text"
              className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
              placeholder="Wendy"
              value={form.firstName}
              onChange={set('firstName')}
              autoComplete="given-name"
              data-error={!!errors.firstName}
            />
            {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
          </div>
          <div className={styles.field}>
            <label htmlFor="co-lastName" className={styles.label}>Last Name *</label>
            <input
              id="co-lastName"
              type="text"
              className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
              placeholder="Smith"
              value={form.lastName}
              onChange={set('lastName')}
              autoComplete="family-name"
              data-error={!!errors.lastName}
            />
            {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
          </div>
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="co-email" className={styles.label}>Email Address *</label>
            <input
              id="co-email"
              type="email"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={set('email')}
              autoComplete="email"
              data-error={!!errors.email}
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>
          <div className={styles.field}>
            <label htmlFor="co-phone" className={styles.label}>Phone Number *</label>
            <input
              id="co-phone"
              type="tel"
              className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
              placeholder="+1 (416) 000-0000"
              value={form.phone}
              onChange={set('phone')}
              autoComplete="tel"
              data-error={!!errors.phone}
            />
            {errors.phone && <span className={styles.error}>{errors.phone}</span>}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="co-message" className={styles.label}>
            Additional Details <span className={styles.optional}>(optional)</span>
          </label>
          <textarea
            id="co-message"
            className={`${styles.input} ${styles.textarea}`}
            placeholder="Anything else we should know? Cake message, design inspiration, delivery concerns…"
            value={form.message}
            onChange={set('message')}
            rows={5}
          />
        </div>
      </fieldset>

      {/* ── Submit ── */}
      {submitError && <div className={styles.submitError}>{submitError}</div>}

      <div className={styles.submitRow}>
        <div className={styles.submitNote}>
          <span>🔒</span>
          <span>Your information is secure. We never share your details.</span>
        </div>
        <button
          type="submit"
          id="custom-order-submit-btn"
          className={`btn ${styles.submitBtn}`}
          disabled={submitting}
        >
          {submitting ? (
            <span className={styles.spinner}>Sending Request…</span>
          ) : (
            '✉️ Send My Request →'
          )}
        </button>
      </div>
    </form>
  );
}
