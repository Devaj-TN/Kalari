import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import ScrollReveal from '../animation/ScrollReveal';
import { kalariService, KalariSiteContent } from '../../services/kalariService';

export default function KalariGuru() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [siteContent, setSiteContent] = useState<KalariSiteContent | null>(() => kalariService.getCachedSiteContent());

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const rawHeadingX = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const headingX = useSpring(rawHeadingX, { stiffness: 90, damping: 28 });

  const rawImgY = useTransform(scrollYProgress, [0, 1], [35, -35]);
  const imgY = useSpring(rawImgY, { stiffness: 90, damping: 28 });

  const rawContentY = useTransform(scrollYProgress, [0, 1], [-18, 18]);
  const contentY = useSpring(rawContentY, { stiffness: 90, damping: 28 });

  const loadData = () => {
    kalariService.getSiteContent().then((data) => setSiteContent(data));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('kalari_content_updated', loadData);
    return () => window.removeEventListener('kalari_content_updated', loadData);
  }, []);

  const title = siteContent?.home_guru_title || 'Chief Gurukkal';
  const subtitle = siteContent?.home_guru_subtitle || 'Lineage Custodian & Master Healer';
  const bio = siteContent?.home_guru_bio || 'Dedicated to preserving authentic Northern Kalaripayattu, guiding students through physical agility, weaponry discipline, and traditional Marma Chikitsa healing.';
  const photo = siteContent?.home_guru_image || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop';

  return (
    <section
      id="guru"
      ref={containerRef}
      aria-labelledby="guru-heading"
      style={{
        scrollMarginTop: '80px',
        background: 'transparent',
        padding: 'clamp(3rem, 6vw, 6rem) clamp(1rem, 3.5vw, 1.5rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Massive Outline Heading at Top with Motion Parallax */}
        <motion.div
          style={{
            marginBottom: 'clamp(2rem, 5vw, 4rem)',
            textAlign: 'center',
            overflow: 'visible',
            paddingTop: '0.5rem',
          }}
        >
          <h2
            id="guru-heading"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(2.1rem, 6.8vw, 6.5rem)',
              fontWeight: 400,
              color: 'transparent',
              WebkitTextStroke: '1.2px rgba(255, 255, 255, 0.85)',
              lineHeight: 1.15,
              letterSpacing: '0.01em',
              margin: 0,
            }}
          >
            Our Martial<br />Master,
          </h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 'clamp(2rem, 5vw, 4.5rem)',
            alignItems: 'center',
          }}
        >
          {/* Left Simple Arch Masked Portrait with Motion Parallax */}
          <motion.div style={{ position: 'relative', display: 'flex', justifyContent: 'center', y: imgY }}>
            <motion.div
              whileHover={{ scale: 1.025, boxShadow: '0 30px 65px rgba(0,0,0,0.85), 0 0 25px rgba(201,147,42,0.2)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '380px',
                aspectRatio: '4/5',
                borderRadius: 'min(220px, 42vw) min(220px, 42vw) 16px 16px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <img
                src={photo}
                alt={title}
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 20%',
                  display: 'block',
                }}
              />
            </motion.div>
          </motion.div>

          {/* Right Narrative */}
          <motion.div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', y: contentY }}>
            <ScrollReveal delay={0.1}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                {subtitle}
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', color: '#fff', margin: '0 0 1.2rem', lineHeight: 1.2 }}>
                {title}
              </h3>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: 'clamp(0.95rem, 1.35vw, 1.05rem)',
                  lineHeight: 1.8,
                  marginBottom: '2rem',
                  fontWeight: 300,
                  textAlign: 'justify',
                }}
              >
                {bio}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <motion.div
                whileHover={{ x: 6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                style={{ display: 'inline-block' }}
              >
                <Link
                  to="/guru"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    cursor: 'pointer',
                    marginBottom: '1.5rem',
                    textDecoration: 'none',
                  }}
                >
                  <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>Read More</span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            </ScrollReveal>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
