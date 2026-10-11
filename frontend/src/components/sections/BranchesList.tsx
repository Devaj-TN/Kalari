import { Link } from 'react-router-dom';
import { useBranches } from '../../hooks/useBranches';
import ScrollReveal from '../animation/ScrollReveal';
import StaggerReveal from '../animation/StaggerReveal';

export default function BranchesList() {
  const { branches } = useBranches();

  return (
    <section
      aria-labelledby="branches-heading"
      style={{ backgroundColor: 'var(--color-bg)', padding: 'clamp(5rem, 10vw, 9rem) 1.5rem' }}
    >
      <div className="max-w-7xl mx-auto">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem', marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
          <div>
            <ScrollReveal>
              <p className="section-label">Our Locations</p>
              <div className="section-divider" />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2 id="branches-heading" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700 }}>
                Train Near <span style={{ color: 'var(--color-gold)' }}>You</span>
              </h2>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={0.2}>
            <Link to="/branches" className="btn btn-ghost">
              View All Branches
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </ScrollReveal>
        </div>

        <StaggerReveal stagger={0.1}>
          {branches.map((branch, i) => (
            <div key={branch.id} className="branch-card" style={{ borderTop: '1px solid var(--color-border)', padding: '2.5rem 0', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '2rem', alignItems: 'start' }}>
              <span className="branch-number">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {branch.name}
                  {branch.isPrimary && (
                    <span style={{ marginLeft: '0.8rem', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-gold)', fontFamily: 'var(--font-sans)', fontWeight: 500, verticalAlign: 'middle' }}>
                      Main Centre
                    </span>
                  )}
                </h3>
                <address style={{ fontStyle: 'normal', fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                  {branch.address}, {branch.city}, {branch.state} — {branch.pincode}
                </address>
                <p style={{ marginTop: '0.4rem', fontSize: '0.83rem', color: 'var(--color-text-dim)', letterSpacing: '0.05em' }}>
                  {branch.hours}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', textAlign: 'right' }}>
                <a href={`tel:${branch.phone.replace(/\s/g, '')}`} aria-label={`Call ${branch.name}`}
                  style={{ fontSize: '0.87rem', color: 'var(--color-gold)', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold-light)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}>
                  {branch.phone}
                </a>
                <a href={`https://wa.me/${branch.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${branch.name}`}
                  style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
