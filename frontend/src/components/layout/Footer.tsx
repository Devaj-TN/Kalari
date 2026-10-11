import { Link } from 'react-router-dom';

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About the Kalari' },
  { to: '/programs', label: 'Training Programs' },
  { to: '/branches', label: 'Our Locations' },
  { to: '/news', label: 'News & Events' },
  { to: '/contact', label: 'Enroll / Contact' },
];

const PROGRAM_LINKS = [
  { to: '/programs/foundation-beginners-training', label: 'Foundation Training' },
  { to: '/programs/meythari-body-conditioning', label: 'Meythari' },
  { to: '/programs/kolthari-weapons-training', label: 'Kolthari' },
  { to: '/programs/ankathari-advanced-combat', label: 'Ankathari' },
  { to: '/programs/kalari-chikitsa-marma-therapy', label: 'Kalari Chikitsa' },
  { to: '/programs/kids-kalari-training', label: "Kids' Kalari" },
];

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      style={{
        backgroundColor: 'var(--color-bg)',
        borderTop: '1px solid var(--color-border)',
        paddingTop: '5rem',
        paddingBottom: '2rem',
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Main footer grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '3rem',
            paddingBottom: '4rem',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link to="/" aria-label="Kalari Academy Home">
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'var(--color-gold)',
                  display: 'block',
                  lineHeight: 1,
                  marginBottom: '0.3rem',
                }}
              >
                Kalari
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.25em',
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                }}
              >
                Academy
              </span>
            </Link>
            <p
              style={{
                marginTop: '1.5rem',
                fontSize: '0.87rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.8,
                maxWidth: '240px',
              }}
            >
              Preserving the ancient art of Kalaripayattu — training warriors for life since 1987.
            </p>
            {/* Social links */}
            <div style={{ display: 'flex', gap: '1.2rem', marginTop: '1.5rem' }}>
              {[
                {
                  href: 'https://www.instagram.com/kalariacademy',
                  label: 'Instagram',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                    </svg>
                  ),
                },
                {
                  href: 'https://www.facebook.com/kalariacademy',
                  label: 'Facebook',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3z" />
                    </svg>
                  ),
                },
                {
                  href: 'https://www.youtube.com/kalariacademy',
                  label: 'YouTube',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                    </svg>
                  ),
                },
              ].map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Kalari Academy on ${label}`}
                  style={{
                    color: 'var(--color-text-muted)',
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer quick links">
            <p className="section-label" style={{ marginBottom: '1.5rem' }}>
              Navigate
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--color-text-muted)',
                      transition: 'color 0.3s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold-light)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Programs */}
          <nav aria-label="Footer program links">
            <p className="section-label" style={{ marginBottom: '1.5rem' }}>
              Programs
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {PROGRAM_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--color-text-muted)',
                      transition: 'color 0.3s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold-light)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <address style={{ fontStyle: 'normal' }}>
            <p className="section-label" style={{ marginBottom: '1.5rem' }}>
              Contact
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  Address
                </p>
                <p style={{ fontSize: '0.87rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  12, Gurukula Lane, East Hill<br />
                  Kozhikode, Kerala 673005
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  Phone
                </p>
                <a
                  href="tel:+914952783410"
                  style={{ fontSize: '0.87rem', color: 'var(--color-text-muted)', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold-light)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                >
                  +91 495 278 3410
                </a>
              </div>
              <div>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  WhatsApp
                </p>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.87rem', color: 'var(--color-text-muted)', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold-light)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                >
                  +91 98765 43210
                </a>
              </div>
              <div>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  Email
                </p>
                <a
                  href="mailto:info@kalariacademy.in"
                  style={{ fontSize: '0.87rem', color: 'var(--color-text-muted)', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold-light)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                >
                  info@kalariacademy.in
                </a>
              </div>
            </div>
          </address>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
            © {new Date().getFullYear()} Kalari Academy. All rights reserved.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
            Preserving a 3,000-year-old tradition.
          </p>
        </div>
      </div>
    </footer>
  );
}
