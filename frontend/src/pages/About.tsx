import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import KalariHeader from '../components/layout/KalariHeader';
import KalariFooter from '../components/sections/KalariFooter';
import ScrollReveal from '../components/animation/ScrollReveal';
import SEO from '../components/common/SEO';
import { kalariService, KalariSiteContent } from '../services/kalariService';

export default function About() {
  const [siteContent, setSiteContent] = useState<KalariSiteContent | null>(null);

  const loadContent = () => {
    kalariService.getSiteContent().then((data) => setSiteContent(data));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadContent();
    window.addEventListener('kalari_content_updated', loadContent);
    return () => {
      window.removeEventListener('kalari_content_updated', loadContent);
    };
  }, []);

  const tag = siteContent?.about_page_tag || 'MADURAKANDI CVN KALARI • VENGERI, KOZHIKODE';
  const title = siteContent?.about_page_title || 'Awaken Your Inner Warrior. Embrace a 3,000-Year Legacy.';
  const lead = siteContent?.about_page_lead || 'More than a martial art. A way of transforming yourself.';
  const story =
    siteContent?.about_page_full_story ||
    'For centuries, Kalaripayattu has been more than the art of fighting. It has been a journey of discipline, awareness, strength and self-discovery. At Madurakandi CVN Kalari, you step into an ancient tradition where the body is trained, the mind is sharpened and the spirit is quietly awakened.';
  const photo = siteContent?.about_page_photo;

  return (
    <>
      <SEO
        title="About Us — Madhurakandy C.V.N Kalari | Vengeri, Kozhikode"
        description="Learn about Madhurakandy C.V.N Kalari in Vengeri, Kozhikode. Traditional Northern Kalaripayattu training, earthen Kuzhi Kalari arena, and Marma Chikitsa."
        canonical="https://madhurakandykalari.com/about"
        breadcrumbs={[
          { name: 'Home', url: 'https://madhurakandykalari.com/' },
          { name: 'About Us', url: 'https://madhurakandykalari.com/about' },
        ]}
      />

      <KalariHeader />

      <main
        style={{
          backgroundColor: 'transparent',
          color: 'var(--color-text)',
          minHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(8rem, 16vw, 12rem) 1.5rem clamp(4rem, 8vw, 6rem)',
        }}
      >
        <div
          className="max-w-4xl mx-auto"
          style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <ScrollReveal>
            <p
              style={{
                fontSize: '0.78rem',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                fontWeight: 700,
                marginBottom: '1rem',
              }}
            >
              {tag}
            </p>

            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.6rem, 5.5vw, 4.5rem)',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '2rem',
                lineHeight: 1.15,
              }}
            >
              {title}
            </h1>

            {photo && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                style={{ maxWidth: '700px', width: '100%', margin: '0 auto 2.5rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-gold-dim)', boxShadow: '0 20px 45px rgba(0,0,0,0.6)' }}
              >
                <img src={photo} alt={title} style={{ width: '100%', height: '340px', objectFit: 'cover' }} />
              </motion.div>
            )}

            <p
              style={{
                color: 'var(--color-gold)',
                fontSize: 'clamp(1.15rem, 1.8vw, 1.35rem)',
                lineHeight: 1.8,
                maxWidth: '820px',
                margin: '0 auto 1.5rem',
                textAlign: 'center',
                fontWeight: 600,
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
              }}
            >
              {lead}
            </p>

            <p
              style={{
                color: 'rgba(245, 238, 230, 0.9)',
                fontSize: 'clamp(1.02rem, 1.3vw, 1.15rem)',
                lineHeight: 2,
                maxWidth: '820px',
                margin: '0 auto 2.2rem',
                textAlign: 'center',
                fontWeight: 300,
              }}
            >
              {story}
            </p>

            <div
              style={{
                maxWidth: '650px',
                margin: '0 auto 2.8rem',
                padding: '1.2rem 2rem',
                background: 'rgba(201, 147, 42, 0.08)',
                border: '1px solid var(--color-gold-dim)',
                borderRadius: '6px',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.15rem, 1.8vw, 1.35rem)',
                  color: 'var(--color-gold-light)',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                “Come to learn the art. Stay to discover yourself.”
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1.2rem',
                flexWrap: 'wrap',
              }}
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/" className="btn-kalari-gold">
                  ← Back to Home
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <a href="tel:+919947139696" className="btn-kalari-primary">
                  Contact Us (+91 99471 39696)
                </a>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </main>

      <KalariFooter />
    </>
  );
}
