import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ScrollReveal from '../animation/ScrollReveal';
import { kalariService, KalariTreatmentData, KalariContactSettings } from '../../services/kalariService';
import { validateName, validateAge, validatePhone, sanitizeText, checkRateLimit } from '../../lib/security';

interface TreatmentForm {
  name: string;
  age: string;
  phone: string;
  issue: string;
  message: string;
}

export default function KalariTreatment() {
  const [modalOpen, setModalOpen] = useState(false);
  const [treatmentData, setTreatmentData] = useState<KalariTreatmentData | null>(() => kalariService.getCachedTreatmentData());
  const [contactSettings, setContactSettings] = useState<KalariContactSettings | null>(() => kalariService.getCachedContactSettings());
  const [form, setForm] = useState<TreatmentForm>({
    name: '',
    age: '',
    phone: '',
    issue: '',
    message: '',
  });
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; age?: string; phone?: string }>({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [inquiryRateError, setInquiryRateError] = useState<string>('');

  const loadTreatment = () => {
    kalariService.getTreatmentData().then((data) => {
      setTreatmentData(data);
    });
    kalariService.getContactSettings().then((data) => {
      setContactSettings(data);
    });
  };

  useEffect(() => {
    loadTreatment();
    window.addEventListener('kalari_content_updated', loadTreatment);
    return () => {
      window.removeEventListener('kalari_content_updated', loadTreatment);
    };
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
    setFieldErrors({});
    setInquiryRateError('');
    setForm({
      name: '',
      age: '',
      phone: '',
      issue: '',
      message: '',
    });
  };

  const handleSendWhatsApp = () => {
    setFieldErrors({});
    setInquiryRateError('');

    // 1. Rate limiting: Anti-spam
    const rateCheck = checkRateLimit('public_treatment_inquiry', 6, 60000);
    if (!rateCheck.allowed) {
      setInquiryRateError(`Too many inquiries submitted. Please wait ${rateCheck.retryAfterSec}s.`);
      return;
    }

    // 2. Validate Inputs
    const cleanName = sanitizeText(form.name);
    const cleanAge = sanitizeText(form.age);
    const cleanPhone = sanitizeText(form.phone);
    const cleanIssue = sanitizeText(form.issue);
    const cleanMsg = sanitizeText(form.message);

    const nameValidation = validateName(cleanName);
    const ageValidation = validateAge(cleanAge);
    const phoneValidation = validatePhone(cleanPhone);

    if (!nameValidation.isValid || !ageValidation.isValid || !phoneValidation.isValid) {
      setFieldErrors({
        name: nameValidation.error,
        age: ageValidation.error,
        phone: phoneValidation.error,
      });
      return;
    }

    setFormSubmitting(true);

    // Automatically log inquiry to Admin Dashboard
    kalariService.addInquiry({
      type: 'treatment',
      name: cleanName,
      age: cleanAge,
      phone: cleanPhone,
      details: cleanIssue ? `Treatment Inquiry (${cleanIssue})` : 'General Kalari Treatment Inquiry',
      message: cleanMsg || undefined,
    }).catch((err) => console.warn('Auto log treatment inquiry error:', err));

    const fullMessage = `*Kalari Treatment Inquiry*

*Name:* ${cleanName}
*Age:* ${cleanAge}
*Phone:* ${cleanPhone}${cleanIssue ? `\n*Health Concern:* ${cleanIssue}` : ''}${cleanMsg ? `\n*Message:* ${cleanMsg}` : ''}`;

    const whatsappNum = (contactSettings?.whatsapp || '919947139696').replace(/\D/g, '');
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(fullMessage)}`, '_blank');

    setTimeout(() => {
      setFormSubmitting(false);
      setModalOpen(false);
    }, 800);
  };

  const treatmentTitle = treatmentData?.title || 'Traditional Kalari Treatment';
  const treatmentSubtitle = treatmentData?.subtitle || '🌿 Traditional Pain Relief & Body Care • By Prior Appointment';
  const treatmentPhoto = treatmentData?.photo_url || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop';
  const highlights = treatmentData?.highlights && treatmentData.highlights.length > 0 ? treatmentData.highlights : [
    'Spine & Joint Alignment — Disc compression, chronic back pain & sciatica relief',
    'Sports & Musculoskeletal Care — Sprains, tendon strains & joint recovery',
    'Traditional Kalari Uzhichil — Deep herbal oil massage for nerve & muscle vigor',
    'Sacred Dhanwanthari Lineage — Direct diagnostic care & therapy under Gurukkal',
  ];

  return (
    <section
      id="treatment"
      aria-labelledby="treatment-heading"
      style={{
        scrollMarginTop: '80px',
        background: 'transparent',
        padding: 'clamp(2.5rem, 4.5vw, 4rem) 1.5rem',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <div style={{ maxWidth: '1600px', width: '95%', margin: '0 auto' }}>
        {/* Section Heading — Styled like Courses / Batches */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            marginBottom: '2.5rem',
          }}
        >
          <ScrollReveal>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-script)',
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  color: '#e03036',
                  lineHeight: 1,
                  marginBottom: '-1.1rem',
                  position: 'relative',
                  zIndex: 2,
                  display: 'block',
                  WebkitTextStroke: '0 !important',
                }}
              >
                Healing
              </span>
              <h2
                id="treatment-heading"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
                  fontWeight: 300,
                  letterSpacing: '0.03em',
                  color: 'transparent',
                  WebkitTextStroke: '1.2px rgba(255, 255, 255, 0.95)',
                  lineHeight: 1.05,
                  textTransform: 'uppercase',
                  margin: 0,
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                KALARI TREATMENT
              </h2>
            </div>
          </ScrollReveal>
        </div>

        {/* Single Big Seamless Showcase Banner (Course Style - Frameless & Blended) */}
        <div
          style={{
            maxWidth: '1350px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          <ScrollReveal>
            <div
              style={{
                background: 'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(134, 18, 18, 0.1) 0%, rgba(20, 13, 8, 0.3) 45%, transparent 75%)',
                padding: 'clamp(1.5rem, 4vw, 3rem) 0',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'clamp(2rem, 5vw, 4.5rem)',
                flexWrap: 'wrap',
              }}
            >
              {/* Left Side: Large Authentic Tilted Photo Box */}
              <div
                style={{
                  flex: '1 1 min(100%, 360px)',
                  maxWidth: '480px',
                  position: 'relative',
                  margin: '0 auto',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#141414',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    boxShadow: '0 20px 45px rgba(0,0,0,0.8), 0 0 30px rgba(134,18,18,0.2)',
                    transform: 'rotate(-2.5deg)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'rotate(0deg) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 25px 55px rgba(0,0,0,0.9), 0 0 35px rgba(201,147,42,0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'rotate(-2.5deg) scale(1)';
                    e.currentTarget.style.boxShadow = '0 20px 45px rgba(0,0,0,0.8), 0 0 30px rgba(134,18,18,0.2)';
                  }}
                >
                  <div style={{ overflow: 'hidden', borderRadius: '8px', position: 'relative', aspectRatio: '4/3' }}>
                    <img
                      src={treatmentPhoto}
                      alt={`Kalari Chikitsa Treatment — ${treatmentTitle}`}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '0.65rem',
                        left: '0.65rem',
                        backgroundColor: 'var(--color-kalari-red)',
                        color: '#fff',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '3px',
                        boxShadow: '0 3px 8px rgba(0,0,0,0.6)',
                      }}
                    >
                      KALARI TREATMENT
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Title, Details & Highlights */}
              <div
                style={{
                  flex: '1.4 1 min(100%, 320px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  maxWidth: '650px',
                }}
              >
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-gold)', margin: '0 0 0.4rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {treatmentSubtitle}
                  </p>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)',
                      color: '#fff',
                      lineHeight: 1.18,
                      margin: 0,
                    }}
                  >
                    {treatmentTitle}
                  </h3>
                </div>

                {/* Highlights List with Gold Circle Bullets (Matching Course Style) */}
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0.3rem 0 0.8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                  }}
                >
                  {highlights.map((h, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        fontSize: '0.9rem',
                        color: 'rgba(255, 255, 255, 0.88)',
                        lineHeight: 1.5,
                      }}
                    >
                      <span style={{ color: 'var(--color-gold)', fontSize: '0.85rem', marginTop: '0.15rem' }}>○</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <div style={{ marginTop: '0.4rem' }}>
                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleOpenModal}
                    style={{
                      padding: '0.85rem 2.2rem',
                      backgroundColor: 'var(--color-kalari-red)',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      boxShadow: '0 4px 15px rgba(134,18,18,0.4)',
                    }}
                  >
                    <span>Enquire for Treatment</span>
                    <span>→</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* ─── Treatment Inquiry Modal Form ─── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            aria-label="Kalari Treatment Inquiry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setModalOpen(false);
            }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              backgroundColor: 'rgba(4, 2, 1, 0.88)',
              backdropFilter: 'blur(18px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              overscrollBehavior: 'contain',
            }}
          >
            <motion.div
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="no-scrollbar"
              style={{
                width: '100%',
                maxWidth: '480px',
                backgroundColor: '#110a05',
                border: '1px solid var(--color-gold)',
                borderRadius: '8px',
                padding: '2rem',
                position: 'relative',
                boxShadow: '0 24px 60px rgba(0,0,0,0.9)',
                maxHeight: '90vh',
                overflowY: 'auto',
                overscrollBehavior: 'contain',
              }}
            >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setModalOpen(false)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                fontSize: '1.3rem',
                cursor: 'pointer',
                lineHeight: 1,
              }}
            >
              ✕
            </motion.button>

            {/* Modal Heading */}
            <p
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                marginBottom: '0.4rem',
              }}
            >
              Inquiry
            </p>
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.35rem',
                color: '#fff',
                marginBottom: '0.3rem',
                lineHeight: 1.2,
              }}
            >
              Kalari Treatment Inquiry
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-gold)', marginBottom: '1.4rem', fontWeight: 600 }}>
              🌿 Consultation with Gurukkal
            </p>

            {inquiryRateError && (
              <div
                role="alert"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #ef4444',
                  color: '#fca5a5',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  marginBottom: '1rem',
                  textAlign: 'center',
                }}
              >
                {inquiryRateError}
              </div>
            )}

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {/* Full Name */}
              <div>
                <label
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--color-text-muted)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '0.35rem',
                  }}
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, name: e.target.value }));
                    if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder="Your full name"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${fieldErrors.name ? '#ef4444' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                {fieldErrors.name && (
                  <span style={{ color: '#f87171', fontSize: '0.72rem', marginTop: '0.25rem', display: 'block' }}>
                    {fieldErrors.name}
                  </span>
                )}
              </div>

              {/* Age & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div>
                  <label
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--color-text-muted)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '0.35rem',
                    }}
                  >
                    Age *
                  </label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, age: e.target.value }));
                      if (fieldErrors.age) setFieldErrors((prev) => ({ ...prev, age: undefined }));
                    }}
                    placeholder="Age"
                    min="1"
                    max="110"
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${fieldErrors.age ? '#ef4444' : 'rgba(255,255,255,0.12)'}`,
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  {fieldErrors.age && (
                    <span style={{ color: '#f87171', fontSize: '0.72rem', marginTop: '0.25rem', display: 'block' }}>
                      {fieldErrors.age}
                    </span>
                  )}
                </div>
                <div>
                  <label
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--color-text-muted)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '0.35rem',
                    }}
                  >
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, phone: e.target.value }));
                      if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    placeholder="+91 XXXXX XXXXX"
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${fieldErrors.phone ? '#ef4444' : 'rgba(255,255,255,0.12)'}`,
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  {fieldErrors.phone && (
                    <span style={{ color: '#f87171', fontSize: '0.72rem', marginTop: '0.25rem', display: 'block' }}>
                      {fieldErrors.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Health Issue / Concern */}
              <div>
                <label
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--color-text-muted)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '0.35rem',
                  }}
                >
                  Health Issue / Condition (e.g. Back pain, Joint stiffness)
                </label>
                <input
                  type="text"
                  value={form.issue}
                  onChange={(e) => setForm((f) => ({ ...f, issue: e.target.value }))}
                  placeholder="Describe your pain, injury or wellness requirement"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Optional message */}
              <div>
                <label
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--color-text-muted)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '0.35rem',
                  }}
                >
                  Additional Details (Optional)
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Any questions or specific needs..."
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Submit via WhatsApp */}
              <motion.button
                whileHover={!form.name.trim() || !form.age.trim() || !form.phone.trim() ? {} : { scale: 1.02 }}
                whileTap={!form.name.trim() || !form.age.trim() || !form.phone.trim() ? {} : { scale: 0.98 }}
                disabled={formSubmitting || !form.name.trim() || !form.age.trim() || !form.phone.trim()}
                onClick={handleSendWhatsApp}
                style={{
                  marginTop: '0.4rem',
                  padding: '0.75rem',
                  backgroundColor:
                    !form.name.trim() || !form.age.trim() || !form.phone.trim()
                      ? 'rgba(100,100,100,0.3)'
                      : '#25d366',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  cursor:
                    !form.name.trim() || !form.age.trim() || !form.phone.trim()
                      ? 'not-allowed'
                      : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'opacity 0.2s',
                  width: '100%',
                }}
              >
                <span>💬</span>
                <span>{formSubmitting ? 'Opening WhatsApp...' : 'Send Inquiry via WhatsApp'}</span>
              </motion.button>

              <p style={{ fontSize: '0.68rem', color: 'var(--color-text-dim)', textAlign: 'center', margin: 0 }}>
                Your inquiry will be sent directly to Gurukkal via WhatsApp.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </section>
  );
}
