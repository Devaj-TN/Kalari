import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import KalariEmblem from '../common/KalariEmblem';

interface KalariHeaderProps {
  onOpenProgramModal?: (slug?: string) => void;
  onOpenContactModal?: () => void;
}

export default function KalariHeader({ onOpenContactModal }: KalariHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    if (id === 'about-page') {
      navigate('/about');
      return;
    }
    if (id === 'guru') {
      navigate('/guru');
      return;
    }
    if (id === 'gallery') {
      navigate('/gallery');
      return;
    }
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const target = document.getElementById(id);
    if (target) {
      const lenis = (window as unknown as { __lenis?: { scrollTo: (target: string | HTMLElement, options?: { offset?: number }) => void } }).__lenis;
      if (lenis) {
        lenis.scrollTo(target, { offset: -30 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* ─── Hero Header Bar (Absolute: Scrolls away with the Hero banner) ─── */}
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          padding: 'clamp(1.2rem, 2.5vw, 2rem) clamp(1.5rem, 3.5vw, 3rem)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}
      >
        {/* Top-Left: Red vertical bar + ENROLL ONLINE / FEEDBACK / CONTACT US (Desktop/Tablet only) */}
        <div
          className="hidden md:flex"
          style={{
            alignItems: 'stretch',
            gap: '0.8rem',
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              width: '2px',
              backgroundColor: 'var(--color-kalari-red)',
              borderRadius: '1px',
              boxShadow: '0 0 8px rgba(134, 18, 18, 0.8)',
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              lineHeight: 1.2,
            }}
          >
            <button
              onClick={() => {
                if (onOpenContactModal) onOpenContactModal();
                else setMenuOpen(true);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text)',
                textAlign: 'left',
                cursor: 'pointer',
                padding: 0,
                fontSize: 'inherit',
                fontWeight: 'inherit',
                letterSpacing: 'inherit',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
            >
              ENROLL ONLINE
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text)',
                textAlign: 'left',
                cursor: 'pointer',
                padding: 0,
                fontSize: 'inherit',
                fontWeight: 'inherit',
                letterSpacing: 'inherit',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
            >
              FEEDBACK
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text)',
                textAlign: 'left',
                cursor: 'pointer',
                padding: 0,
                fontSize: 'inherit',
                fontWeight: 'inherit',
                letterSpacing: 'inherit',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
            >
              CONTACT US
            </button>
          </div>
        </div>

        {/* Top-Center: Oval Kalari-Style Heritage Crest Logo */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: 'clamp(0.9rem, 2vw, 1.8rem)',
            pointerEvents: 'auto',
          }}
        >
          <button
            onClick={() => scrollToSection('hero')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.3s var(--ease-smooth)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            aria-label="Madhurakandy CVN Kalari Home"
          >
            <KalariEmblem size="clamp(85px, 10vw, 150px)" />
          </button>
        </div>
      </header>

      {/* ─── Top-Right Fixed 3-Line Menu (Stays fixed on top-right while scrolling) ─── */}
      <div
        style={{
          position: 'fixed',
          top: 'clamp(1.2rem, 3vw, 2rem)',
          right: 'clamp(1.5rem, 3.5vw, 3rem)',
          zIndex: 100,
          pointerEvents: 'auto',
        }}
      >
        <motion.button
          className={`circular-menu-btn ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          style={{
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
          }}
        >
          <span />
          <span />
          <span />
        </motion.button>
      </div>

      {/* ─── Full-Screen Overlay Navigation with AnimatePresence ─── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="overlay-menu"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 110,
              backgroundColor: '#070503',
              backgroundImage: 'radial-gradient(circle at center, #140d08 0%, #070503 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 'clamp(2.5rem, 5vw, 4.5rem) clamp(2rem, 6vw, 6.5rem)',
              overflowY: 'auto',
            }}
          >
        {/* Top Header inside Overlay: Close Button (X in circle at top-right) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            width: '100%',
            maxWidth: '1280px',
            margin: '0 auto',
          }}
        >
          {/* Top-Left: Logo & Contact Info */}
          <div>
            {/* Authentic Crest Logo */}
            <div style={{ marginBottom: '1.6rem' }}>
              <KalariEmblem size={140} />
            </div>

            {/* Contact Header with Red Underline */}
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.6rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '0.4rem',
              }}
            >
              Contact
            </h2>
            <div style={{ width: '32px', height: '2.5px', backgroundColor: 'var(--color-kalari-red)', marginBottom: '1.2rem' }} />

            <div style={{ fontSize: '0.88rem', color: 'rgba(245, 238, 230, 0.85)', lineHeight: 1.7 }}>
              <p style={{ fontWeight: 600, color: '#fff' }}>Madhurakandy C.V.N Kalari</p>
              <p>Vengeri, Kozhikode, Kerala</p>
              <p style={{ marginTop: '0.6rem' }}>
                Phone: <a href="tel:+919947139696" style={{ color: 'var(--color-gold)', textDecoration: 'none' }}>+91 99471 39696</a>
              </p>
              <p>M: 099471 39696</p>
            </div>
          </div>

          {/* Top-Right: Circular Close Button */}
          <motion.button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            whileHover={{ scale: 1.1, rotate: 90, borderColor: 'var(--color-gold)', color: 'var(--color-gold)' }}
            whileTap={{ scale: 0.92 }}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backgroundColor: 'transparent',
              color: '#fff',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'border-color 0.2s, color 0.2s',
            }}
          >
            ✕
          </motion.button>
        </div>

        {/* Bottom Multi-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'clamp(2rem, 4vw, 4rem)',
            width: '100%',
            maxWidth: '1280px',
            margin: '3rem auto 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '2.5rem',
          }}
        >
          {/* Column 1: Contact Detail */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '0.4rem',
              }}
            >
              Training Centre
            </h3>
            <div style={{ width: '32px', height: '2px', backgroundColor: 'var(--color-kalari-red)', marginBottom: '1.2rem' }} />

            <div style={{ fontSize: '0.88rem', color: 'rgba(245, 238, 230, 0.85)', lineHeight: 1.7 }}>
              <p style={{ fontWeight: 600, color: '#fff' }}>Madhurakandy C.V.N Kalari</p>
              <p>Madhura kandy, CVN KALARI,</p>
              <p>Vengeri, Kozhikode, Kerala 673010</p>
              <p style={{ marginTop: '0.8rem' }}>
                P: <a href="tel:+919947139696" style={{ color: 'var(--color-gold)', textDecoration: 'none' }}>+91 99471 39696</a>
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '0.4rem',
              }}
            >
              Quick Links
            </h3>
            <div style={{ width: '32px', height: '2px', backgroundColor: 'var(--color-kalari-red)', marginBottom: '1.2rem' }} />

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { id: 'hero', label: 'Home' },
                { id: 'about-page', label: 'About & Heritage' },
                { id: 'programs', label: 'Disciplines & Batches' },
                { id: 'gallery', label: 'Photo & Video Gallery' },
                { id: 'guru', label: 'Chief Gurukkal' },
                { id: 'news', label: 'Latest News & Events' },
                { id: 'contact-location', label: 'Centres & Location' },
              ].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(245, 238, 230, 0.85)',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left',
                      transition: 'color 0.2s, transform 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--color-gold)';
                      e.currentTarget.style.transform = 'translateX(6px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(245, 238, 230, 0.85)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Discover Our Courses */}
          <div style={{ gridColumn: 'span 2' }}>
            <h3
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '0.4rem',
              }}
            >
              Discover Our Services
            </h3>
            <div style={{ width: '32px', height: '2px', backgroundColor: 'var(--color-kalari-red)', marginBottom: '1.2rem' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  'Kalarippayattu Training',
                  'Kalaripayattu Workshop',
                  'Kalaripayattu Stage Shows',
                  'Ayurveda & Kalari Marma Massage Treatment',
                  'Action Choreography for movies',
                ].map((item, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => scrollToSection('programs')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(245, 238, 230, 0.85)',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        padding: 0,
                        textAlign: 'left',
                        transition: 'color 0.2s, transform 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--color-gold)';
                        e.currentTarget.style.transform = 'translateX(6px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(245, 238, 230, 0.85)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  'Urumi Flexible Blade',
                  'Kalari Chikitsa',
                  'Verumkai Unarmed',
                  'Women’s Self-Defense',
                ].map((item, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => scrollToSection('programs')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(245, 238, 230, 0.85)',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        padding: 0,
                        textAlign: 'left',
                        transition: 'color 0.2s, transform 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--color-gold)';
                        e.currentTarget.style.transform = 'translateX(6px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(245, 238, 230, 0.85)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
    </>
  );
}
