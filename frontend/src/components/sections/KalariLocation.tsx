import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import ScrollReveal from '../animation/ScrollReveal';
import { kalariService, KalariContactSettings } from '../../services/kalariService';

export default function KalariLocation() {
  const [settings, setSettings] = useState<KalariContactSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSettings = () => {
    kalariService.getContactSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadSettings();
    window.addEventListener('kalari_content_updated', loadSettings);
    return () => {
      window.removeEventListener('kalari_content_updated', loadSettings);
    };
  }, []);

  if (loading || !settings) {
    return null;
  }

  return (
    <section
      id="location"
      aria-labelledby="location-heading"
      style={{
        scrollMarginTop: '80px',
        padding: 'clamp(4.5rem, 8vw, 7.5rem) 1.5rem',
        backgroundColor: '#0a0705',
        position: 'relative',
        borderTop: '1px solid rgba(201, 147, 42, 0.15)',
      }}
    >
      <div style={{ maxWidth: '1600px', width: '95%', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
                  fontSize: 'clamp(1.9rem, 4.5vw, 3.4rem)',
                  color: '#e03036',
                  lineHeight: 1.1,
                  marginBottom: '-0.35rem',
                  position: 'relative',
                  zIndex: 2,
                  display: 'block',
                  WebkitTextStroke: '0 !important',
                }}
              >
                Visit
              </span>
              <h2
                id="location-heading"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(1.85rem, 5vw, 3.6rem)',
                  fontWeight: 300,
                  letterSpacing: '0.03em',
                  color: 'transparent',
                  WebkitTextStroke: '1.2px rgba(255, 255, 255, 0.95)',
                  lineHeight: 1.1,
                  textTransform: 'uppercase',
                  margin: 0,
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                OUR KALARI
              </h2>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.92rem',
                color: 'var(--color-text-muted)',
                maxWidth: '640px',
                margin: '1.2rem auto 0',
                lineHeight: 1.6,
              }}
            >
              Step into our consecrated Kuzhi Kalari in Vengeri, Kozhikode. Visitors and practitioners are welcome to observe training sessions, enroll in batches, or consult for traditional Kalari treatment.
            </p>
          </ScrollReveal>
        </div>

        {/* Contact Info + Map Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'clamp(1.5rem, 3.5vw, 2.5rem)', alignItems: 'stretch' }}>
          {/* Left Column: Direct Phone / WhatsApp / Address Cards */}
          <ScrollReveal delay={0.1}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
              {/* Primary Centre Card */}
              <motion.div
                whileHover={{ y: -4, borderColor: 'var(--color-gold)' }}
                transition={{ duration: 0.25 }}
                style={{
                  backgroundColor: 'rgba(22, 13, 7, 0.92)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: 'clamp(1.2rem, 3.5vw, 2rem)',
                  boxShadow: '0 12px 35px rgba(0,0,0,0.6)',
                }}
              >
                <span className="section-tag" style={{ fontSize: '0.65rem' }}>TRADITIONAL KALARI CENTRE</span>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.5rem',
                    color: 'var(--color-gold)',
                    marginBottom: '0.6rem',
                  }}
                >
                  {settings.primary_location}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.2rem' }}>
                  {settings.full_address}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: 'var(--color-text-dim)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block' }}>Primary Telephone</span>
                    <a href={`tel:${settings.primary_phone.replace(/\s+/g, '')}`} style={{ color: 'var(--color-gold)', textDecoration: 'none', fontWeight: 600 }}>
                      📞 {settings.primary_phone}
                    </a>
                  </div>
                  {settings.secondary_phone && (
                    <div>
                      <span style={{ color: 'var(--color-text-dim)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block' }}>Alternate Line</span>
                      <a href={`tel:${settings.secondary_phone.replace(/\s+/g, '')}`} style={{ color: 'var(--color-text)', textDecoration: 'none' }}>
                        📞 {settings.secondary_phone}
                      </a>
                    </div>
                  )}
                  <div>
                    <span style={{ color: 'var(--color-text-dim)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block' }}>Contact Email</span>
                    <a href={`mailto:${settings.email}`} style={{ color: 'var(--color-text)', textDecoration: 'none' }}>
                      ✉️ {settings.email}
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Instant WhatsApp & Phone Direct Buttons */}
              <div
                style={{
                  backgroundColor: 'rgba(22, 13, 7, 0.92)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: 'clamp(1.2rem, 3vw, 1.8rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--color-text)' }}>
                  Instant Direct Inquiry
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '0.8rem' }}>
                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello,%20I%20would%20like%20to%20inquire%20about%20training%20at%20Madhurakandy%20CVN%20Kalari.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-kalari-gold"
                    style={{ justifyContent: 'center', fontSize: '0.78rem', padding: '0.75rem 1rem' }}
                  >
                    💬 WhatsApp Us
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    href={`tel:${settings.primary_phone.replace(/\s+/g, '')}`}
                    className="btn-kalari-primary"
                    style={{ justifyContent: 'center', fontSize: '0.78rem', padding: '0.75rem 1rem' }}
                  >
                    📞 Call Gurukkal
                  </motion.a>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Google Maps Embed Frame */}
          <ScrollReveal delay={0.2}>
            <motion.div
              whileHover={{ borderColor: 'var(--color-gold)' }}
              transition={{ duration: 0.25 }}
              style={{
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                height: '100%',
                minHeight: '380px',
                boxShadow: '0 12px 35px rgba(0,0,0,0.6)',
                backgroundColor: 'rgba(22, 13, 7, 0.92)',
                position: 'relative',
              }}
            >
              <iframe
                src={settings.map_embed_url}
                title="Kalari Academy Location Map"
                style={{ width: '100%', height: '100%', minHeight: '380px', border: 'none', filter: 'invert(90%) hue-rotate(180deg) brightness(85%) contrast(1.15)' }}
                allowFullScreen
                loading="lazy"
              />
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
