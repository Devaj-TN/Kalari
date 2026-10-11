import React from 'react';
import { motion } from 'motion/react';
import ScrollReveal from '../animation/ScrollReveal';

interface SectionNavCrest {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  icon: (color: string) => React.ReactNode;
}

const SECTION_CRESTS: SectionNavCrest[] = [
  {
    id: 'legacy',
    name: 'A Legacy',
    shortLabel: 'Legacy',
    description: 'Ancient lineage & Kuzhi Kalari heritage',
    icon: (color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 22h20L12 2z" />
        <path d="M7 16h10" />
        <path d="M9.5 11h5" />
        <circle cx="12" cy="7" r="1.2" fill={color} />
      </svg>
    ),
  },
  {
    id: 'programs',
    name: 'Our Services',
    shortLabel: 'Services',
    description: 'Disciplines, workshops & stage shows',
    icon: (color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
        <path d="M13 19l6-6" />
        <path d="M16 16l4 4" />
        <path d="M9.5 17.5L21 6V3h-3L6.5 14.5" />
        <path d="M11 19l-6-6" />
        <path d="M8 16l-4 4" />
      </svg>
    ),
  },
  {
    id: 'batches',
    name: 'Training Batches',
    shortLabel: 'Batches',
    description: 'Daily morning & evening batches',
    icon: (color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15.5 14.5" />
        <path d="M12 1v2M12 21v2M1 12h2M21 12h2" />
      </svg>
    ),
  },
  {
    id: 'guru',
    name: 'Chief Gurukkal',
    shortLabel: 'Gurukkal',
    description: 'Lineage custodian & master healer',
    icon: (color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" />
        <path d="M12 1.5v2" />
        <circle cx="12" cy="7" r="1.5" fill={color} />
      </svg>
    ),
  },
  {
    id: 'treatment',
    name: 'Kalari Chikitsa',
    shortLabel: 'Treatment',
    description: 'Traditional Marma Chikitsa healing',
    icon: (color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    ),
  },
  {
    id: 'gallery',
    name: 'Visual Gallery',
    shortLabel: 'Gallery',
    description: 'Photos & video action demonstrations',
    icon: (color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.5" fill={color} />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    id: 'news',
    name: 'News & Events',
    shortLabel: 'News',
    description: 'Latest events & demonstration news',
    icon: (color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        <path d="M2 8h2M20 8h2" />
      </svg>
    ),
  },
  {
    id: 'location',
    name: 'Visit Our Kalari',
    shortLabel: 'Visit Us',
    description: 'Vengeri, Kozhikode arena & directions',
    icon: (color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" fill={color} />
      </svg>
    ),
  },
];

export default function KalariStripe() {
  const scrollToSection = (id: string) => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number | string | HTMLElement, options?: { duration?: number; offset?: number }) => void } }).__lenis;
    const el = document.getElementById(id);
    if (!el) return;

    if (lenis) {
      lenis.scrollTo(el, { duration: 1.3, offset: -80 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      aria-label="Kalari Sections Fast Navigation Strip"
      style={{
        backgroundColor: 'var(--color-kalari-red)',
        backgroundImage:
          'radial-gradient(ellipse at 50% 50%, rgba(185, 28, 28, 0.95) 0%, rgba(120, 15, 15, 0.98) 60%, rgba(60, 8, 8, 1) 100%)',
        padding: 'clamp(2.4rem, 4vw, 3.4rem) 1rem',
        position: 'relative',
        zIndex: 5,
        margin: '1rem 0 2rem',
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5)',
      }}
    >
      {/* Top Brush Stroke Edge */}
      <div
        style={{
          position: 'absolute',
          top: '-18px',
          left: 0,
          right: 0,
          height: '20px',
          overflow: 'hidden',
          lineHeight: 0,
          zIndex: 2,
        }}
      >
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
          <path
            fill="var(--color-kalari-red)"
            d="M0,120 L0,40 Q30,10 60,60 Q90,90 120,30 Q150,5 180,70 Q210,95 240,20 Q270,10 300,65 Q330,85 360,25 Q390,5 420,70 Q450,90 480,30 Q510,10 540,75 Q570,95 600,20 Q630,5 660,70 Q690,90 720,30 Q750,10 780,75 Q810,95 840,25 Q870,5 900,70 Q930,90 960,30 Q990,10 1020,75 Q1050,95 1080,20 Q1110,5 1140,65 L1200,40 L1200,120 Z"
          />
        </svg>
      </div>

      {/* Bottom Brush Stroke Edge */}
      <div
        style={{
          position: 'absolute',
          bottom: '-18px',
          left: 0,
          right: 0,
          height: '20px',
          overflow: 'hidden',
          lineHeight: 0,
          zIndex: 2,
        }}
      >
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
          <path
            fill="var(--color-kalari-red)"
            d="M0,0 L0,80 Q30,110 60,60 Q90,30 120,90 Q150,115 180,50 Q210,25 240,100 Q270,110 300,55 Q330,35 360,95 Q390,115 420,50 Q450,30 480,90 Q510,110 540,45 Q570,25 600,100 Q630,115 660,50 Q690,30 720,90 Q750,110 780,45 Q810,25 840,95 Q870,115 900,50 Q930,30 960,90 Q990,110 1020,45 Q1050,25 1080,100 Q1110,115 1140,55 L1200,80 L1200,0 Z"
          />
        </svg>
      </div>

      {/* Interactive 8-Section Navigation Track */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ScrollReveal style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <nav
            aria-label="Jump to Kalari sections"
            className="no-scrollbar"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              padding: '0.4rem 1rem',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                flexShrink: 0,
              }}
            >
              {SECTION_CRESTS.map((crest, idx) => (
                <React.Fragment key={crest.id}>
                  {/* Emblem Button */}
                  <motion.button
                    onClick={() => scrollToSection(crest.id)}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                    aria-label={`Jump to ${crest.name} section`}
                    title={`${crest.name} — ${crest.description}`}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      outline: 'none',
                      userSelect: 'none',
                    }}
                  >
                    {/* Circle Crest */}
                    <div
                      style={{
                        width: 'clamp(44px, 4vw, 54px)',
                        height: 'clamp(44px, 4vw, 54px)',
                        borderRadius: '50%',
                        border: '1.5px solid rgba(201, 147, 42, 0.75)',
                        backgroundColor: 'rgba(28, 7, 7, 0.75)',
                        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.4), inset 0 0 12px rgba(201, 147, 42, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-gold-light)';
                        e.currentTarget.style.boxShadow =
                          '0 0 25px rgba(201, 147, 42, 0.65), inset 0 0 16px rgba(201, 147, 42, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(201, 147, 42, 0.75)';
                        e.currentTarget.style.boxShadow =
                          '0 4px 18px rgba(0, 0, 0, 0.4), inset 0 0 12px rgba(201, 147, 42, 0.25)';
                      }}
                    >
                      {crest.icon('var(--color-gold)')}
                    </div>
                  </motion.button>

                  {/* Connecting Filigree Line with Diamond Node */}
                  {idx < SECTION_CRESTS.length - 1 && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        opacity: 0.55,
                        flexShrink: 0,
                        margin: '0 clamp(0.3rem, 1vw, 1rem)',
                      }}
                    >
                      <div
                        style={{
                          width: 'clamp(10px, 2vw, 28px)',
                          height: '1px',
                          backgroundColor: 'var(--color-gold)',
                        }}
                      />
                      <div
                        style={{
                          width: '5px',
                          height: '5px',
                          backgroundColor: 'var(--color-gold-light)',
                          transform: 'rotate(45deg)',
                        }}
                      />
                      <div
                        style={{
                          width: 'clamp(10px, 2vw, 28px)',
                          height: '1px',
                          backgroundColor: 'var(--color-gold)',
                        }}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </nav>
        </ScrollReveal>
      </div>
    </section>
  );
}
