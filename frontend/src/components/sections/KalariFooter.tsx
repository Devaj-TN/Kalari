import { motion } from 'motion/react';

export default function KalariFooter() {
  const scrollToTop = () => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number | string, options?: { duration?: number }) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer style={{ background: 'transparent', position: 'relative' }}>
      {/* Master Footer Bottom Strip */}
      <div style={{ padding: '2.5rem 1.5rem 2rem' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <motion.a
              href="/"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
              }}
              aria-label="Madhurakandy C.V.N Kalari Home"
            >
              {/* Warm Golden Ambient Aura */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-20px -36px',
                  background: 'radial-gradient(ellipse at center, rgba(201, 147, 42, 0.35) 0%, rgba(201, 147, 42, 0.12) 50%, transparent 75%)',
                  pointerEvents: 'none',
                  filter: 'blur(16px)',
                  zIndex: 0,
                }}
              />
              <img
                src="/images/kalari-logo-banner.png"
                alt="Madhurakandy C.V.N Kalari — Vengeri, Kozhikode, Kerala 673010"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  height: 'auto',
                  maxHeight: 'clamp(120px, 14vw, 165px)',
                  width: 'auto',
                  maxWidth: 'clamp(320px, 85vw, 540px)',
                  display: 'block',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 22px rgba(201, 147, 42, 0.45)) drop-shadow(0 8px 24px rgba(0, 0, 0, 0.95))',
                }}
              />
            </motion.a>
          </div>

          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            <motion.a
              whileHover={{ color: 'var(--color-gold)', y: -1 }}
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
            >
              Facebook
            </motion.a>
            <span>|</span>
            <motion.a
              whileHover={{ color: 'var(--color-gold)', y: -1 }}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
            >
              Instagram
            </motion.a>
            <span>|</span>
            <motion.a
              whileHover={{ color: 'var(--color-gold)', y: -1 }}
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
            >
              YouTube
            </motion.a>
          </div>

          {/* Back to Top Button */}
          <motion.button
            whileHover={{ y: -4, scale: 1.1, backgroundColor: 'var(--color-gold)', color: '#0b0704' }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'rgba(22, 13, 7, 0.85)',
              border: '1px solid var(--color-gold)',
              color: 'var(--color-gold)',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'border-color 0.3s var(--ease-smooth)',
            }}
          >
            ↑
          </motion.button>
        </div>

        <div
          style={{
            textAlign: 'center',
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            fontSize: '0.72rem',
            color: 'var(--color-text-dim)',
          }}
        >
          © 2026 Madhurakandy C.V.N Kalari, Vengeri, Kozhikode. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
