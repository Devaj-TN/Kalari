import { Helmet } from 'react-helmet-async';
import { useBranches } from '../hooks/useBranches';
import ScrollReveal from '../components/animation/ScrollReveal';
import StaggerReveal from '../components/animation/StaggerReveal';
import { buildBreadcrumbJsonLd } from '../lib/seo';

export default function Branches() {
  const { branches } = useBranches();
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Branches', path: '/branches' },
  ]);

  return (
    <>
      <Helmet>
        <title>Kalaripayattu Training Centres — Kozhikode, Thrissur & Kannur | Kalari Academy</title>
        <meta name="description" content="Find Kalari Academy's training centres in Kozhikode, Thrissur, and Kannur. Join traditional Kalaripayattu classes near you." />
        <link rel="canonical" href="https://kalariacademy.in/branches" />
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <section style={{ paddingTop: 'calc(var(--space-16) + 4rem)', paddingBottom: 'var(--space-12)', paddingLeft: '1.5rem', paddingRight: '1.5rem', backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', textAlign: 'center' }}>
        <ScrollReveal>
          <p className="section-label">Our Locations</p>
          <div className="section-divider section-divider--center" />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, maxWidth: '600px', margin: '0 auto 1.5rem', lineHeight: 1.05 }}>
            Train Across <span style={{ color: 'var(--color-gold)' }}>Kerala</span>
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.8 }}>
            Three fully-equipped training centres, each headed by senior instructors trained directly under Gurukkal Santhosh Nair.
          </p>
        </ScrollReveal>
      </section>

      <section style={{ backgroundColor: 'var(--color-bg)', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
        <div className="max-w-6xl mx-auto">
          <StaggerReveal stagger={0.12} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {branches.map((branch, i) => (
              <div key={branch.id} style={{ borderTop: i === 0 ? '1px solid var(--color-border)' : 'none', borderBottom: '1px solid var(--color-border)', padding: 'clamp(2rem, 4vw, 4rem) 0', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'clamp(1.5rem, 3vw, 3rem)', alignItems: 'start' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 5vw, 5rem)', fontWeight: 700, color: 'rgba(201,147,42,0.2)', lineHeight: 1 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', alignItems: 'start' }}>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
                      {branch.city} Centre
                      {branch.isPrimary && <span style={{ marginLeft: '0.8rem', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-gold)', fontFamily: 'var(--font-sans)', fontWeight: 500 }}> Main</span>}
                    </h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>{branch.name}</p>
                    <address style={{ fontStyle: 'normal', fontSize: '0.92rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                      {branch.address}<br />{branch.city}, {branch.state} — {branch.pincode}
                    </address>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '0.5rem' }}>Hours</p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>{branch.hours}</p>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                      <a href={`tel:${branch.phone.replace(/\s/g, '')}`} aria-label={`Call ${branch.name}`} className="btn btn-ghost" style={{ fontSize: '0.82rem' }}>
                        {branch.phone}
                      </a>
                      <a href={`https://wa.me/${branch.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${branch.name}`} className="btn btn-outline" style={{ fontSize: '0.78rem', padding: '0.5rem 1.2rem' }}>
                        WhatsApp
                      </a>
                    </div>
                  </div>
                  {/* Map embed (lazy) */}
                  <div style={{ gridColumn: '1 / -1', marginTop: '1rem', height: '250px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                    <iframe
                      src={branch.embedUrl}
                      width="100%"
                      height="250"
                      style={{ border: 0, display: 'block', filter: 'grayscale(1) invert(0.8) sepia(0.3)' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map of ${branch.name}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>
    </>
  );
}
