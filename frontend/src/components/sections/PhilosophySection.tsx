import ScrollReveal from '../animation/ScrollReveal';
import StaggerReveal from '../animation/StaggerReveal';

const PHILOSOPHY_POINTS = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: 'Disciplined Body',
    text: 'Kalari builds a body that is simultaneously explosive and supple — a living paradox forged through thousands of hours of precise practice.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" strokeLinecap="round" />
      </svg>
    ),
    title: 'Focused Mind',
    text: 'The Kalari is a crucible for attention. Training demands an intensity of focus that restructures how you move through the world — on and off the mat.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: 'Living Spirit',
    text: 'Kalaripayattu is not a sport — it is a spiritual practice. Every sequence carries the breath of those who came before: an unbroken thread from antiquity to this moment.',
  },
];

export default function PhilosophySection() {
  return (
    <section
      aria-labelledby="philosophy-heading"
      style={{
        position: 'relative',
        backgroundColor: 'var(--color-surface)',
        padding: 'clamp(5rem, 10vw, 9rem) 1.5rem',
        overflow: 'hidden',
      }}
    >
      {/* Large decorative text */}
      <p
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(8rem, 20vw, 18rem)',
          fontWeight: 700,
          color: 'rgba(201,147,42,0.03)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          letterSpacing: '-0.03em',
        }}
      >
        Kalari
      </p>

      <div className="max-w-7xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ maxWidth: '680px', marginBottom: 'clamp(3rem, 6vw, 5.5rem)' }}>
          <ScrollReveal>
            <p className="section-label">Philosophy</p>
            <div className="section-divider" />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2
              id="philosophy-heading"
              style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem' }}
            >
              Why Kalaripayattu Is Unlike<br />
              <span style={{ color: 'var(--color-gold)' }}>Anything Else</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, fontSize: '1.05rem' }}>
              At its deepest, Kalaripayattu is not simply about fighting. It is about arriving at a state of physical mastery so complete that the line between warrior and healer, between aggression and stillness, ceases to exist. This is the paradox at the heart of the Kalari tradition — and the reason it has endured for three thousand years.
            </p>
          </ScrollReveal>
        </div>

        {/* Three pillars */}
        <StaggerReveal
          stagger={0.12}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2px',
            backgroundColor: 'var(--color-border)',
          }}
        >
          {PHILOSOPHY_POINTS.map((point) => (
            <div
              key={point.title}
              style={{
                backgroundColor: 'var(--color-surface)',
                padding: '3rem 2.5rem',
              }}
            >
              <div style={{ color: 'var(--color-gold)', marginBottom: '1.5rem' }}>{point.icon}</div>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  color: 'var(--color-text)',
                }}
              >
                {point.title}
              </h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                {point.text}
              </p>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
