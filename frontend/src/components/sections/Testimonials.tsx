import ScrollReveal from '../animation/ScrollReveal';
import StaggerReveal from '../animation/StaggerReveal';
import TESTIMONIALS_DATA from '../../data/testimonials';

export default function Testimonials() {
  return (
    <section
      aria-labelledby="testimonials-heading"
      style={{ backgroundColor: 'var(--color-bg-warm)', padding: 'clamp(5rem, 10vw, 9rem) 1.5rem' }}
    >
      <div className="max-w-7xl mx-auto">
        <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
          <ScrollReveal>
            <p className="section-label">Student Stories</p>
            <div className="section-divider section-divider--center" />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 id="testimonials-heading" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, maxWidth: '500px', margin: '0 auto' }}>
              Words from <span style={{ color: 'var(--color-gold)' }}>Practitioners</span>
            </h2>
          </ScrollReveal>
        </div>

        <StaggerReveal
          stagger={0.1}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1px',
            backgroundColor: 'var(--color-border)',
          }}
        >
          {TESTIMONIALS_DATA.map((t) => (
            <blockquote
              key={t.id}
              className="testimonial-card"
              style={{ backgroundColor: 'var(--color-surface)', margin: 0 }}
            >
              <p style={{ position: 'relative', zIndex: 1, fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.85, paddingTop: '2rem' }}>
                {t.quote}
              </p>
              <footer style={{ marginTop: '1.8rem' }}>
                <cite style={{ fontStyle: 'normal' }}>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.2rem' }}>
                    {t.name}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {t.role} · {t.duration}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-gold)', marginTop: '0.3rem' }}>{t.program}</p>
                </cite>
              </footer>
            </blockquote>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
