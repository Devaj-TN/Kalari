import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import ScrollReveal from '../animation/ScrollReveal';
import { kalariService, KalariSiteContent } from '../../services/kalariService';

export default function KalariAbout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [siteContent, setSiteContent] = useState<KalariSiteContent | null>(() => kalariService.getCachedSiteContent());

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const rawYImage = useTransform(scrollYProgress, [0, 1], [35, -35]);
  const yImage = useSpring(rawYImage, { stiffness: 100, damping: 30 });

  const rawYContent = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const yContent = useSpring(rawYContent, { stiffness: 100, damping: 30 });

  const rawTextX = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const textX = useSpring(rawTextX, { stiffness: 100, damping: 30 });

  const loadData = () => {
    kalariService.getSiteContent().then((data) => setSiteContent(data));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('kalari_content_updated', loadData);
    return () => window.removeEventListener('kalari_content_updated', loadData);
  }, []);

  const heading = siteContent?.home_about_heading || 'The Sacred Tradition of CVN Kalaripayattu';
  const tag = siteContent?.home_about_tag || 'ABOUT MADHURAKANDY C.V.N KALARI';
  const lead = siteContent?.home_about_lead || 'Located in Vengeri, Kozhikode, Madhurakandy C.V.N Kalari upholds the renowned Northern tradition (Vadakkan Sampradayam) of Kalaripayattu. From foundational body conditioning sequences (Meythari) and wooden weapon sparring (Kolthari) to master-level metal weaponry (Ankathari & Urumi), our Kalari offers authentic martial discipline and vital point science.';
  const body = siteContent?.home_about_body || 'Our consecrated earthen training arena (Kuzhi Kalari) is crafted with traditional red soil and medicinal herbs, fostering agility, breath mastery, and holistic healing under experienced Gurukkals.';
  const photo = siteContent?.home_about_photo || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop';

  return (
    <section
      id="about"
      ref={containerRef}
      aria-labelledby="about-heading"
      style={{
        background: 'transparent',
        padding: 'clamp(4rem, 8vw, 7rem) 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Giant Background Parallax Outline Text */}
      <motion.div
        aria-hidden="true"
        className="outline-text"
        style={{
          position: 'absolute',
          top: '15%',
          left: '-5%',
          fontSize: 'clamp(6rem, 16vw, 18rem)',
          letterSpacing: '0.08em',
          opacity: 0.05,
          zIndex: 0,
          x: textX,
          pointerEvents: 'none',
        }}
      >
        HERITAGE
      </motion.div>

      <div className="max-w-7xl mx-auto" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 'clamp(2.5rem, 5vw, 5rem)',
            alignItems: 'center',
          }}
        >
          {/* Left Intro Image with Motion Parallax */}
          <motion.div style={{ position: 'relative', y: yImage }}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                borderRadius: '4px',
                overflow: 'hidden',
                border: '1.5px solid var(--color-gold-dim)',
                aspectRatio: '4/5',
                boxShadow: '0 25px 50px rgba(0,0,0,0.85), 0 0 30px rgba(201,147,42,0.15)',
                position: 'relative',
              }}
            >
              <img
                src={photo}
                alt="Traditional Kalaripayattu combat practice in Kuzhi Kalari"
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </motion.div>

            {/* Floating Gold Emblem Badge */}
            <motion.div
              whileHover={{ scale: 1.06, y: -4 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              style={{
                position: 'absolute',
                bottom: '-1.5rem',
                right: '-1.2rem',
                backgroundColor: 'rgba(22, 13, 7, 0.95)',
                border: '1px solid var(--color-gold)',
                padding: '1.2rem 1.8rem',
                borderRadius: '4px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.7)',
                backdropFilter: 'blur(10px)',
                cursor: 'default',
              }}
              className="hidden sm:block"
            >
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'var(--color-gold)',
                  lineHeight: 1,
                  margin: 0,
                }}
              >
                3,000+
              </p>
              <p
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  marginTop: '4px',
                  fontWeight: 600,
                  marginBottom: 0,
                }}
              >
                Years of Heritage
              </p>
            </motion.div>
          </motion.div>

          {/* Right Intro Content */}
          <motion.div style={{ y: yContent }}>
            <ScrollReveal type="clip-reveal">
              <p
                className="section-tag"
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gold)',
                  fontWeight: 700,
                  marginBottom: '0.6rem',
                }}
              >
                {tag}
              </p>
              <h2
                id="about-heading"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.6rem, 3.2vw, 2.5rem)',
                  color: '#fff',
                  marginBottom: '1.2rem',
                  lineHeight: 1.2,
                  fontWeight: 600,
                }}
              >
                {heading}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  marginBottom: '1.2rem',
                  textAlign: 'justify',
                }}
              >
                {lead}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: '0.96rem',
                  lineHeight: 1.8,
                  marginBottom: '2rem',
                  textAlign: 'justify',
                }}
              >
                {body}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div style={{ marginTop: '1rem' }}>
                <motion.div
                  whileHover={{ x: 6 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  style={{ display: 'inline-block' }}
                >
                  <Link
                    to="/about"
                    style={{
                      color: 'var(--color-gold)',
                      fontSize: '0.82rem',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    Explore Detailed Heritage <span>→</span>
                  </Link>
                </motion.div>
              </div>
            </ScrollReveal>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
