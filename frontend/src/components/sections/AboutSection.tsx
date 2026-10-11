import { Link } from 'react-router-dom';
import ScrollReveal from '../animation/ScrollReveal';
import StaggerReveal from '../animation/StaggerReveal';

export default function AboutSection() {
  return (
    <section
      aria-labelledby="about-heading"
      style={{
        backgroundColor: 'var(--color-bg-warm)',
        padding: 'clamp(5rem, 10vw, 9rem) 1.5rem',
      }}
    >
      <div
        className="max-w-7xl mx-auto"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(3rem, 6vw, 6rem)',
          alignItems: 'center',
        }}
      >
        {/* Image */}
        <ScrollReveal delay={0.1}>
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              aspectRatio: '3/4',
              maxHeight: '580px',
            }}
          >
            <img
              src="/images/about/traditional-kalari-akhada-kozhikode.jpg"
              alt="The sacred akhada training floor of Kalari Academy, lit by oil lamps at dawn"
              width={600}
              height={800}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Gold accent border */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: '-12px',
                left: '-12px',
                right: '12px',
                top: '12px',
                border: '1px solid var(--color-gold-dim)',
                pointerEvents: 'none',
                zIndex: -1,
              }}
            />
          </div>
        </ScrollReveal>

        {/* Text */}
        <div>
          <ScrollReveal delay={0.05}>
            <p className="section-label">Our Heritage</p>
            <div className="section-divider" />
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <h2
              id="about-heading"
              style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem' }}
            >
              A Lineage Older Than<br />
              <span style={{ color: 'var(--color-gold)' }}>Time Itself</span>
            </h2>
          </ScrollReveal>

          <StaggerReveal delay={0.2} stagger={0.08}>
            <p
              style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, marginBottom: '1.2rem', fontSize: '0.97rem' }}
            >
              Kalaripayattu is Kerala's ancient martial art — arguably the oldest surviving codified combat system in the world, with roots stretching back over three millennia. It is at once a martial discipline, a healing science, a movement philosophy, and a spiritual practice.
            </p>
            <p
              style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, marginBottom: '2.5rem', fontSize: '0.97rem' }}
            >
              At Madhurakandy C.V.N Kalari, we preserve this tradition in its complete form — from foundational meythari exercises to flexible steel weaponry, and from the oil-lamp-lit Kuzhi Kalari at dawn to traditional Marma Chikitsa healing.
            </p>
          </StaggerReveal>

          <ScrollReveal delay={0.35}>
            <Link to="/about" className="btn btn-ghost">
              Discover Our Story
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
