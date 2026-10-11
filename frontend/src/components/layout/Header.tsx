import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { gsap } from '../../lib/gsap';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/programs', label: 'Programs' },
  { to: '/branches', label: 'Branches' },
  { to: '/news', label: 'News' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Sticky header scroll detection
  useEffect(() => {
    const handler = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Header entrance animation
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    gsap.fromTo(el, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' });
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        role="banner"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled ? 'py-3' : 'py-6'
        }`}
        style={{
          opacity: 0,
          backgroundColor: isScrolled ? 'rgba(14, 8, 0, 0.92)' : 'transparent',
          borderBottom: isScrolled ? '1px solid var(--color-border)' : 'none',
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            aria-label="Kalari Academy — Home"
            className="flex flex-col leading-none"
            style={{ transition: 'transform 0.4s var(--ease-smooth)' }}
          >
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: isScrolled ? '1.4rem' : '1.8rem',
                fontWeight: 700,
                color: 'var(--color-gold)',
                letterSpacing: '-0.01em',
                transition: 'font-size 0.5s var(--ease-smooth)',
                lineHeight: 1,
              }}
            >
              Kalari
            </span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6rem',
                letterSpacing: '0.25em',
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                marginTop: '3px',
              }}
            >
              Academy
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav role="navigation" aria-label="Main navigation" className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/contact" className="btn btn-primary" style={{ padding: '0.65rem 1.6rem' }}>
              Enroll Now
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span
              style={{
                width: '24px',
                height: '1.5px',
                backgroundColor: 'var(--color-text)',
                display: 'block',
                transition: 'transform 0.3s, opacity 0.3s',
                transform: menuOpen ? 'translateY(4.5px) rotate(45deg)' : 'none',
              }}
            />
            <span
              style={{
                width: '18px',
                height: '1.5px',
                backgroundColor: 'var(--color-gold)',
                display: 'block',
                transition: 'opacity 0.3s',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                width: '24px',
                height: '1.5px',
                backgroundColor: 'var(--color-text)',
                display: 'block',
                transition: 'transform 0.3s, opacity 0.3s',
                transform: menuOpen ? 'translateY(-4.5px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          backgroundColor: 'rgba(14, 8, 0, 0.97)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2.5rem',
          transition: 'opacity 0.4s var(--ease-smooth), visibility 0.4s',
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? 'visible' : 'hidden',
          pointerEvents: menuOpen ? 'all' : 'none',
        }}
      >
        {NAV_LINKS.map((link, i) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={{
              fontSize: '1.6rem',
              fontFamily: 'var(--font-serif)',
              fontWeight: 700,
              letterSpacing: '0.05em',
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              transition: `transform 0.4s var(--ease-out-expo) ${i * 0.06}s, opacity 0.4s ${i * 0.06}s`,
              opacity: menuOpen ? 1 : 0,
            }}
          >
            {link.label}
          </NavLink>
        ))}
        <Link
          to="/contact"
          className="btn btn-primary"
          style={{
            marginTop: '1rem',
            transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
            transition: 'transform 0.4s var(--ease-out-expo) 0.36s, opacity 0.4s 0.36s',
            opacity: menuOpen ? 1 : 0,
          }}
        >
          Enroll Now
        </Link>
      </div>
    </>
  );
}
