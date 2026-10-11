import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import ScrollReveal from './ScrollReveal';

interface ParallaxBannerProps {
  backgroundImage?: string;
  tag?: string;
  title?: string;
  italicTitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  align?: 'left' | 'right' | 'center';
}

export default function ParallaxBanner({
  backgroundImage = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1920&auto=format&fit=crop',
  tag = 'MIND, BREATH & STEEL',
  title = 'The Sacred Path of Warriorhood',
  italicTitle = 'Centuries of Masterhood',
  description = 'In the subterranean coolness of the Kuzhi Kalari, ancient breath control fuses with feline agility and lightning reflexes. Discover the transcendent martial heritage of South India.',
  ctaText = 'Read More',
  ctaLink = '#guru',
  align = 'right',
}: ParallaxBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;
    const bg = bgRef.current;
    if (!banner || !bg) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bg,
        { yPercent: -12, scale: 1.08 },
        {
          yPercent: 12,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: banner,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, banner);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={bannerRef}
      aria-label="Kalari Philosophy Banner"
      style={{
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        padding: 'clamp(5rem, 10vw, 8rem) 1.5rem',
      }}
    >
      {/* Parallax Background Image */}
      <div
        ref={bgRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-12%',
          left: 0,
          right: 0,
          bottom: '-12%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
        }}
      />

      {/* Paragon Right-Gradient Overlay for Text Contrast without heavy box */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0.92) 100%)',
          zIndex: 1,
        }}
      />

      {/* Content Layout (Clean, direct text on background like Paragon) */}
      <div className="max-w-7xl mx-auto w-full" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            maxWidth: '560px',
            marginLeft: align === 'right' ? 'auto' : align === 'center' ? 'auto' : '0',
            marginRight: align === 'left' ? 'auto' : align === 'center' ? 'auto' : '0',
            padding: '1rem 0',
          }}
        >
          <ScrollReveal type="clip-reveal">
            {tag && (
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gold)',
                  marginBottom: '1rem',
                }}
              >
                {tag}
              </p>
            )}
            <h2 style={{ lineHeight: 1.15, marginBottom: '1.5rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
                  fontWeight: 700,
                  color: '#ffffff',
                  display: 'block',
                  letterSpacing: '-0.01em',
                }}
              >
                {title}
              </span>
              {italicTitle && (
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(2.2rem, 4.2vw, 3.6rem)',
                    fontStyle: 'italic',
                    color: 'var(--color-gold)',
                    display: 'block',
                    marginTop: '0.4rem',
                  }}
                >
                  {italicTitle}
                </span>
              )}
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)',
                lineHeight: 1.85,
                marginBottom: '2.2rem',
                fontWeight: 300,
              }}
            >
              {description}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <div>
              <a
                href={ctaLink}
                style={{
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  transition: 'gap 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.gap = '1.2rem')}
                onMouseLeave={(e) => (e.currentTarget.style.gap = '0.8rem')}
              >
                <span>{ctaText}</span>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
