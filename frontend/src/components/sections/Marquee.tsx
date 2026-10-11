import ScrollReveal from '../animation/ScrollReveal';

const AFFILIATIONS = [
  'Kerala Kalaripayattu Association',
  'All India Kalaripayattu Federation',
  'Ministry of Youth Affairs & Sports',
  'Cultural Heritage India',
  'National Geographic',
  'BBC World Service',
  'Doordarshan Kerala',
  'Sports Authority of India',
  'Kalari Gurukulam Trust',
  'International Martial Arts Council',
];

export default function Marquee() {
  const doubled = [...AFFILIATIONS, ...AFFILIATIONS];

  return (
    <section
      aria-label="Affiliations and media features"
      style={{
        backgroundColor: 'var(--color-surface-2)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        padding: '2rem 0',
        overflow: 'hidden',
      }}
    >
      <ScrollReveal>
        <p className="section-label" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          Recognized By
        </p>
      </ScrollReveal>
      <div style={{ overflow: 'hidden' }} aria-hidden="true">
        <div className="marquee-track">
          {doubled.map((name, i) => (
            <span
              key={i}
              style={{
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                letterSpacing: '0.04em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4rem',
                transition: 'color 0.3s',
              }}
            >
              {name}
              <span style={{ color: 'var(--color-gold)', fontSize: '0.5rem' }}>◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
