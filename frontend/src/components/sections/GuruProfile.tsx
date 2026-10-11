import ScrollReveal from '../animation/ScrollReveal';
import StaggerReveal from '../animation/StaggerReveal';

const GURU = {
  name: 'Gurukkal Santhosh Nair',
  title: 'Founder & Chief Instructor',
  lineage: 'Northern Tradition — Vadakkan Sampradayam',
  bio: [
    'Gurukkal Santhosh Nair began his training at age five under his father in Payyanur, North Kerala. His initiation into the Vadakkan (Northern) tradition placed him in a lineage that counts some of the most celebrated masters of the art.',
    'Over forty years of unbroken practice and teaching, he has trained thousands of students, established three training centres, and contributed to national championships, academic research, and documentary filmmaking.',
    'His Kalari Chikitsa practice draws from classical Dhanwanthari treatments, and his hands have treated professional athletes, classical dancers, and patients who had exhausted conventional medicine.',
  ],
  credentials: [
    'National Award for Preservation of Martial Heritage — 2019',
    'Invited faculty — International Kalaripayattu Festival, Thiruvananthapuram',
    'Certified Kalari Chikitsa practitioner — Dhanwanthari lineage',
    'Featured: BBC, National Geographic, Doordarshan Kerala',
    '40+ years of unbroken practice and instruction',
  ],
  image: '/images/guru/gurukkal-portrait.jpg',
  imageAlt: 'Gurukkal Santhosh Nair, founder of Kalari Academy, in traditional stance',
};

export default function GuruProfile() {
  return (
    <section
      aria-labelledby="guru-heading"
      style={{ backgroundColor: 'var(--color-bg-warm)', padding: 'clamp(5rem, 10vw, 9rem) 1.5rem' }}
    >
      <div
        className="max-w-7xl mx-auto"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(3rem, 6vw, 7rem)',
          alignItems: 'start',
        }}
      >
        <div>
          <ScrollReveal>
            <p className="section-label">Meet the Gurukkal</p>
            <div className="section-divider" />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 id="guru-heading" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '0.5rem' }}>
              {GURU.name}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="section-label" style={{ color: 'var(--color-text-muted)', marginBottom: '0.3rem' }}>{GURU.title}</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-gold)', letterSpacing: '0.08em', marginBottom: '2rem' }}>{GURU.lineage}</p>
          </ScrollReveal>
          <StaggerReveal stagger={0.08} delay={0.2}>
            {GURU.bio.map((para, i) => (
              <p key={i} style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, fontSize: '0.97rem', marginBottom: '1.1rem' }}>{para}</p>
            ))}
          </StaggerReveal>
          <ScrollReveal delay={0.4}>
            <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
              <p className="section-label" style={{ marginBottom: '1.2rem' }}>Credentials & Recognition</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {GURU.credentials.map((cred) => (
                  <li key={cred} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                    <span style={{ color: 'var(--color-gold)', flexShrink: 0 }}>—</span>{cred}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
        <ScrollReveal delay={0.2}>
          <div style={{ position: 'relative' }}>
            <div style={{ overflow: 'hidden', aspectRatio: '3/4', maxHeight: '640px' }}>
              <img src={GURU.image} alt={GURU.imageAlt} width={540} height={720} loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ position: 'absolute', bottom: '2rem', left: '-2rem', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1.2rem 1.8rem', maxWidth: '220px' }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-gold)', lineHeight: 1 }}>40+</p>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginTop: '0.3rem' }}>Years of Practice</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
