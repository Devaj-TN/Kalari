import { Link } from 'react-router-dom';
import { usePrograms } from '../../hooks/usePrograms';
import ScrollReveal from '../animation/ScrollReveal';
import StaggerReveal from '../animation/StaggerReveal';

export default function ProgramsGrid() {
  const { featured } = usePrograms();

  return (
    <section
      aria-labelledby="programs-heading"
      style={{
        backgroundColor: 'var(--color-bg)',
        padding: 'clamp(5rem, 10vw, 9rem) 1.5rem',
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
          <ScrollReveal>
            <p className="section-label">Training Programs</p>
            <div className="section-divider section-divider--center" />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2
              id="programs-heading"
              style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, maxWidth: '560px', margin: '0 auto 1rem' }}
            >
              Train in the Complete<br />
              <span style={{ color: 'var(--color-gold)' }}>Kalari Tradition</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto', fontSize: '0.97rem' }}>
              From beginner body conditioning to advanced weapons mastery and Ayurvedic healing — we offer the full spectrum of Kalaripayattu training.
            </p>
          </ScrollReveal>
        </div>

        {/* Grid */}
        <StaggerReveal
          stagger={0.1}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5px',
            backgroundColor: 'var(--color-border)',
          }}
        >
          {featured.map((program) => (
            <Link
              key={program.id}
              to={`/programs/${program.slug}`}
              className="program-card"
              aria-label={`${program.title} — ${program.subtitle}`}
              style={{ aspectRatio: '4/5', backgroundColor: 'var(--color-bg)' }}
            >
              <img
                src={program.image}
                alt={program.imageAlt}
                width={480}
                height={600}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div className="program-card-overlay" />
              <div className="program-card-content">
                <p className="section-label" style={{ marginBottom: '0.5rem', color: 'var(--color-gold)' }}>
                  {program.level}
                </p>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.3rem, 2vw, 1.7rem)',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    marginBottom: '0.4rem',
                  }}
                >
                  {program.title}
                </h3>
                <p style={{ fontSize: '0.83rem', color: 'rgba(240,232,216,0.7)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  {program.shortDescription.slice(0, 80)}…
                </p>
                <div className="program-card-cta">
                  <span
                    style={{
                      fontSize: '0.75rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--color-gold)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    Learn More
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </StaggerReveal>

        {/* CTA */}
        <ScrollReveal delay={0.2}>
          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/programs" className="btn btn-outline">
              View All Programs
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
