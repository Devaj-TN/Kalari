import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../../lib/gsap';

const SLIDES = [
  {
    id: 1,
    image: '/images/hero/kalari-akhada-training-floor.jpg',
    imageAlt: 'Students training on the sacred akhada floor of a traditional Kalaripayattu gurukula',
    heading: 'Where Warriors',
    headingAccent: 'Are Born',
    subheading: 'The ancient martial art of Kerala, taught in its purest lineage form.',
  },
  {
    id: 2,
    image: '/images/hero/kalaripayattu-oil-massage-prep.jpg',
    imageAlt: 'Traditional Kalari oil massage preparation at dawn',
    heading: 'Body, Mind,',
    headingAccent: 'Spirit',
    subheading: 'Three thousand years of warrior wisdom — alive and breathing.',
  },
  {
    id: 3,
    image: '/images/hero/kalaripayattu-weapons-form.jpg',
    imageAlt: 'Kalaripayattu practitioner performing a weapon form with traditional staff',
    heading: 'Steel, Flesh,',
    headingAccent: 'Fire',
    subheading: 'Master the urumi, the vel, the otta — under the guidance of a lineage Gurukkal.',
  },
  {
    id: 4,
    image: '/images/hero/guru-teaching-kalari.jpg',
    imageAlt: 'Gurukkal instructing a student in the sacred traditions of Kalaripayattu',
    heading: 'A Living',
    headingAccent: 'Tradition',
    subheading: 'From Gurukkal to student — an unbroken chain of transmission since 1987.',
  },
  {
    id: 5,
    image: '/images/hero/kalari-silhouette-dusk.jpg',
    imageAlt: 'Kalaripayattu practitioner silhouetted against the Kerala sky at dusk',
    heading: 'Find Your',
    headingAccent: 'Edge',
    subheading: 'Enroll today. Discover what you are truly capable of.',
  },
];

const SLIDE_DURATION = 6000; // ms per slide

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressTween = useRef<gsap.core.Tween | null>(null);
  const autoplayTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const tabHidden = useRef(false);

  const goTo = useCallback(
    (idx: number) => {
      if (animating) return;
      const prev = current;
      if (idx === prev) return;
      setAnimating(true);

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const nextSlide = slidesRef.current[idx];
      const prevSlide = slidesRef.current[prev];

      // Fade crossfade
      if (!prefersReduced && nextSlide && prevSlide) {
        gsap.set(nextSlide, { opacity: 0, zIndex: 2 });
        gsap.set(prevSlide, { zIndex: 1 });
        gsap.to(nextSlide, {
          opacity: 1,
          duration: 1.2,
          ease: 'power2.inOut',
          onComplete: () => {
            gsap.set(prevSlide, { opacity: 0, zIndex: 0 });
            setAnimating(false);
          },
        });
      } else {
        setAnimating(false);
      }

      setCurrent(idx);

      // Re-animate text
      if (!prefersReduced && headingRef.current && subRef.current) {
        const lines = headingRef.current.querySelectorAll('.hero-line');
        gsap.fromTo(
          lines,
          { clipPath: 'inset(0 0 100% 0)', y: 20, opacity: 0 },
          { clipPath: 'inset(0 0 0% 0)', y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: 'power3.out', delay: 0.2 }
        );
        gsap.fromTo(subRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.5 });
      }

      // Reset progress bar
      startProgress();
    },
    [animating, current]
  );

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length);
  }, [current, goTo]);

  const startProgress = useCallback(() => {
    if (progressTween.current) progressTween.current.kill();
    if (!progressRef.current) return;
    gsap.set(progressRef.current, { scaleX: 0 });
    progressTween.current = gsap.to(progressRef.current, {
      scaleX: 1,
      duration: SLIDE_DURATION / 1000,
      ease: 'none',
    });
  }, []);

  // Autoplay
  useEffect(() => {
    const tick = () => {
      if (!tabHidden.current) next();
    };
    clearTimeout(autoplayTimer.current);
    autoplayTimer.current = setTimeout(tick, SLIDE_DURATION);
    return () => clearTimeout(autoplayTimer.current);
  }, [current, next]);

  // Tab visibility pause
  useEffect(() => {
    const onVisibility = () => {
      tabHidden.current = document.hidden;
      if (document.hidden) {
        progressTween.current?.pause();
      } else {
        progressTween.current?.play();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Initial animations
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize slide states
    slidesRef.current.forEach((slide, i) => {
      if (!slide) return;
      gsap.set(slide, { opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 1 : 0 });

      // Ken Burns on first slide
      if (!prefersReduced && i === 0) {
        const img = slide.querySelector('img');
        if (img) {
          gsap.fromTo(img, { scale: 1 }, { scale: 1.08, duration: SLIDE_DURATION / 1000, ease: 'none' });
        }
      }
    });

    // Text entrance
    if (!prefersReduced && headingRef.current && subRef.current && ctaRef.current) {
      const lines = headingRef.current.querySelectorAll('.hero-line');
      gsap.fromTo(
        lines,
        { clipPath: 'inset(0 0 100% 0)', y: 30 },
        { clipPath: 'inset(0 0 0% 0)', y: 0, stagger: 0.15, duration: 0.9, ease: 'power3.out', delay: 0.6 }
      );
      gsap.fromTo(
        subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: 1.0 }
      );
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: 1.3 }
      );
    }

    startProgress();
  }, [startProgress]);

  const slide = SLIDES[current];

  return (
    <section
      aria-label="Hero — Kalari Academy showcase"
      style={{ position: 'relative', width: '100%', height: '100vh', minHeight: '600px', overflow: 'hidden' }}
    >
      {/* Slides */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          ref={(el) => { slidesRef.current[i] = el; }}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: i === 0 ? 1 : 0,
          }}
          aria-hidden={i !== current}
        >
          <img
            src={s.image}
            alt={s.imageAlt}
            width={1920}
            height={1080}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : undefined}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transformOrigin: 'center center',
              // Placeholder gradient while image loads
              background: 'linear-gradient(135deg, #1c1000 0%, #2a1800 100%)',
            }}
          />
        </div>
      ))}

      {/* Overlays */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(14,8,0,0.75) 0%, rgba(14,8,0,0.3) 60%, transparent 100%)',
          zIndex: 5,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(14,8,0,0.6) 0%, transparent 50%)',
          zIndex: 5,
        }}
      />
      <div className="vignette" aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 6 }} />

      {/* Content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(2rem, 6vw, 6rem)',
          paddingBottom: 'clamp(5rem, 10vh, 8rem)',
        }}
      >
        {/* Section label */}
        <p className="section-label" style={{ marginBottom: '1.2rem' }}>
          Kalaripayattu — Kerala's Ancient Martial Art
        </p>

        {/* Heading */}
        <h1
          ref={headingRef}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(3rem, 8vw, 6.5rem)',
            fontWeight: 700,
            lineHeight: 1.05,
            color: 'var(--color-text)',
            maxWidth: '700px',
            marginBottom: '1.5rem',
          }}
        >
          <span
            className="hero-line"
            style={{ display: 'block', clipPath: 'inset(0 0 100% 0)' }}
          >
            {slide.heading}
          </span>
          <span
            className="hero-line"
            style={{ display: 'block', color: 'var(--color-gold)', clipPath: 'inset(0 0 100% 0)' }}
          >
            {slide.headingAccent}
          </span>
        </h1>

        {/* Subheading */}
        <p
          ref={subRef}
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            color: 'rgba(240,232,216,0.8)',
            maxWidth: '480px',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
            opacity: 0,
          }}
        >
          {slide.subheading}
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', opacity: 0 }}
        >
          <Link to="/contact" className="btn btn-primary">
            Book a Free Trial
          </Link>
          <Link to="/programs" className="btn btn-outline">
            Explore Programs
          </Link>
        </div>
      </div>

      {/* Slide counter + progress */}
      <div
        style={{
          position: 'absolute',
          bottom: 'clamp(2rem, 5vh, 4rem)',
          right: 'clamp(1.5rem, 4vw, 4rem)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '0.8rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            color: 'rgba(201,147,42,0.7)',
          }}
        >
          {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
        </span>
        <div className="hero-progress" style={{ width: '70px' }}>
          <div ref={progressRef} className="hero-progress-fill" />
        </div>
      </div>

      {/* Slide nav dots */}
      <div
        style={{
          position: 'absolute',
          right: 'clamp(1.5rem, 4vw, 4rem)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
        }}
        role="tablist"
        aria-label="Hero slides"
      >
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === current}
            aria-label={`Slide ${i + 1}: ${s.heading} ${s.headingAccent}`}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? '24px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: i === current ? 'var(--color-gold)' : 'rgba(201,147,42,0.35)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'width 0.4s var(--ease-out-expo), background 0.3s',
            }}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: 0.5,
        }}
      >
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
          Scroll
        </span>
        <div
          style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(to bottom, var(--color-gold), transparent)',
            animation: 'scrollHint 2s ease-in-out infinite',
          }}
        />
        <style>{`
          @keyframes scrollHint {
            0%, 100% { opacity: 0; transform: scaleY(0); transform-origin: top; }
            50% { opacity: 1; transform: scaleY(1); }
          }
        `}</style>
      </div>
    </section>
  );
}
