import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { kalariService, KalariHeroSlide, SEED_HERO_SLIDES } from '../../services/kalariService';

const SLIDE_DURATION = 6500;

export default function KalariHero() {
  const [slides, setSlides] = useState<KalariHeroSlide[]>(() => kalariService.getCachedHeroSlides());
  const [activeSlide, setActiveSlide] = useState(0);

  const loadData = () => {
    kalariService.getHeroSlides().then((data) => {
      if (data && data.length > 0) {
        setSlides(data);
      }
    });
  };

  useEffect(() => {
    loadData();
    window.addEventListener('kalari_content_updated', loadData);
    return () => window.removeEventListener('kalari_content_updated', loadData);
  }, []);

  const currentSlides = slides.length > 0 ? slides : SEED_HERO_SLIDES;

  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  useEffect(() => {
    if (activeSlide >= currentSlides.length) {
      setActiveSlide(0);
    }
  }, [currentSlides.length, activeSlide]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % currentSlides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [activeSlide, currentSlides.length]);

  const slide = currentSlides[activeSlide] || currentSlides[0];
  const slideImg = slide.image;

  return (
    <section
      id="hero"
      aria-label="Kalari Hero Showcase"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '680px',
        overflow: 'hidden',
        backgroundColor: '#0a0705',
      }}
    >
      {/* Background Slides with Motion Ken Burns crossfade */}
      <AnimatePresence initial={false}>
        <motion.div
          key={`hero-bg-${activeSlide}`}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        >
          <img
            src={slideImg}
            alt={slide.titleLine2}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 22%',
              filter: 'brightness(0.62)',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic Dark Gradient Overlays (Optimized for Mobile & Desktop) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(10,7,5,0.92) 0%, rgba(10,7,5,0.55) 50%, rgba(10,7,5,0.2) 100%)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(0deg, rgba(10,7,5,0.95) 0%, rgba(10,7,5,0.2) 40%, rgba(10,7,5,0.65) 100%)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />

      {/* Top-Left Slide Pagination */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(4.2rem, 8vw, 6.5rem)',
          left: 'clamp(1.2rem, 3.5vw, 3rem)',
          zIndex: 30,
          display: 'flex',
          alignItems: 'baseline',
          gap: '0.25rem',
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '1.2rem',
          pointerEvents: 'none',
        }}
      >
        <motion.span
          key={`num-${activeSlide}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            color: 'var(--color-gold)',
            fontSize: '1.5rem',
            fontWeight: 700,
            fontStyle: 'normal',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {activeSlide + 1}
        </motion.span>
        <span style={{ fontSize: '1.1rem' }}>/ {currentSlides.length}</span>
      </div>

      {/* Main Content Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 clamp(1.2rem, 3.5vw, 3rem)',
        }}
      >
        <div style={{ maxWidth: '820px', marginTop: 'clamp(3rem, 6vh, 6rem)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`hero-text-${activeSlide}`}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 style={{ lineHeight: 1.1, marginBottom: '1.2rem', overflowWrap: 'break-word', wordBreak: 'normal' }}>
                <span
                  className="kalari-heading-sans"
                  style={{
                    fontSize: 'clamp(1.75rem, 5.8vw, 5.5rem)',
                    display: 'block',
                    textTransform: 'none',
                    fontWeight: 800,
                    color: '#fff',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.08,
                  }}
                >
                  {slide.titleLine1} <br />
                  {slide.titleLine2}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-script)',
                    fontSize: 'clamp(1.85rem, 6vw, 5.2rem)',
                    display: 'inline-block',
                    marginTop: '0.35rem',
                    color: 'var(--color-gold)',
                    fontWeight: 400,
                    letterSpacing: '0.02em',
                    lineHeight: 1.15,
                  }}
                >
                  {slide.titleItalic}
                </span>
              </h1>

              {/* Vertical line + Paragraph */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'flex', alignItems: 'stretch', gap: 'clamp(0.8rem, 2vw, 1.5rem)', marginTop: 'clamp(1.2rem, 3vh, 2.2rem)' }}
              >
                <div
                  style={{
                    width: '1.5px',
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    flexShrink: 0,
                  }}
                />
                <p
                  style={{
                    color: 'rgba(245, 238, 230, 0.92)',
                    fontSize: 'clamp(0.88rem, 1.2vw, 1.05rem)',
                    lineHeight: 1.65,
                    maxWidth: '520px',
                  }}
                >
                  {slide.desc}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Navigation Dots & Arrows (Spaced across bottom with WhatsApp clearance) */}
      <div
        style={{
          position: 'absolute',
          bottom: 'clamp(1.5rem, 3.5vh, 2.8rem)',
          left: 'clamp(1.2rem, 3.5vw, 3rem)',
          right: 'clamp(1.2rem, 3.5vw, 3rem)',
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingRight: '64px',
        }}
      >
        {/* Slide indicator dots */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {currentSlides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: i === activeSlide ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: i === activeSlide ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.3)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Slide Navigation Arrows */}
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <motion.button
            onClick={() => goToSlide((activeSlide - 1 + currentSlides.length) % currentSlides.length)}
            aria-label="Previous slide"
            whileHover={{ scale: 1.1, backgroundColor: 'var(--color-gold)', color: '#0b0704', borderColor: 'var(--color-gold)' }}
            whileTap={{ scale: 0.92 }}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'rgba(22, 13, 7, 0.75)',
              border: '1px solid var(--color-border)',
              color: '#fff',
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.25s ease',
            }}
          >
            ←
          </motion.button>
          <motion.button
            onClick={() => goToSlide((activeSlide + 1) % currentSlides.length)}
            aria-label="Next slide"
            whileHover={{ scale: 1.1, backgroundColor: 'var(--color-gold)', color: '#0b0704', borderColor: 'var(--color-gold)' }}
            whileTap={{ scale: 0.92 }}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'rgba(22, 13, 7, 0.75)',
              border: '1px solid var(--color-border)',
              color: '#fff',
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.25s ease',
            }}
          >
            →
          </motion.button>
        </div>
      </div>
    </section>
  );
}
