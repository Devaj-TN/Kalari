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

  const tag = siteContent?.about_page_tag || 'MADHURAKANDY C.V.N KALARI • VENGERI, KOZHIKODE';
  const title = siteContent?.about_page_title || 'About Us';
  const lead = siteContent?.about_page_lead || 'Located in Vengeri, Kozhikode, Madhurakandy C.V.N Kalari is a traditional centre dedicated to upholding the authentic Northern (Vadakkan) lineage of Kalaripayattu.';
  const story = siteContent?.about_page_full_story || 'Practicing inside our consecrated four-foot subterranean red-earth pit (Kuzhi Kalari), students of all ages receive comprehensive training in foundational bodily agility, high kicks, stance postures (Meythari), traditional wooden weaponry (Kolthari), advanced steel blades (Ankathari), and classical Ayurvedic Marma Chikitsa healing under dedicated Gurukkal guidance.';
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
                fontSize: 'clamp(1.1rem, 1.5vw, 1.3rem)',
                lineHeight: 1.8,
                maxWidth: '820px',
                margin: '0 auto 1.5rem',
                textAlign: 'center',
                fontWeight: 500,
              }}
            >
              {lead}
            </p>

            <p
              style={{
                color: 'rgba(245, 238, 230, 0.88)',
                fontSize: 'clamp(1.02rem, 1.3vw, 1.15rem)',
                lineHeight: 2,
                maxWidth: '820px',
                margin: '0 auto 2.8rem',
                textAlign: 'center',
                fontWeight: 300,
              }}
            >
              {story}
            </p>

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
