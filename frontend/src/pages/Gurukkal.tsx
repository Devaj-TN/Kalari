import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import KalariHeader from '../components/layout/KalariHeader';
import KalariFooter from '../components/sections/KalariFooter';
import ScrollReveal from '../components/animation/ScrollReveal';
import SEO from '../components/common/SEO';
import { kalariService, KalariSiteContent } from '../services/kalariService';

export default function Gurukkal() {
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

  const title = siteContent?.guru_page_title || 'Our Gurukkal';
  const subtitle = siteContent?.guru_page_subtitle || 'Master of Northern Kalaripayattu & Lineage Custodian';
  const bio = siteContent?.guru_page_full_bio || 'The Gurukkal of Madhurakandy C.V.N Kalari is a life-long custodian of the authentic Vadakkan (Northern) tradition of Kalaripayattu, a lineage passed down through generations within the sacred walls of our consecrated earthen arena in Vengeri, Kozhikode. With decades of devoted practice and teaching, the Gurukkal guides students through every stage of the art — from foundational body conditioning and Meythari stances, through wooden and steel weaponry, to the deeply therapeutic science of Marma Chikitsa. Rooted in discipline, humility, and an unwavering respect for the ancient Gurukula system, every lesson taught here carries the weight of tradition and the warmth of genuine care for each practitioner\'s growth — in body, mind, and spirit.';
  const photo = siteContent?.guru_page_image || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop';

  return (
    <>
      <SEO
        title="Our Gurukkal — Madhurakandy C.V.N Kalari | Vengeri, Kozhikode"
        description="Meet the Gurukkal of Madhurakandy C.V.N Kalari. A master of traditional Northern Kalaripayattu with decades of experience in training, healing, and preserving the ancient martial art."
        canonical="https://madhurakandykalari.com/guru"
        type="profile"
        breadcrumbs={[
          { name: 'Home', url: 'https://madhurakandykalari.com/' },
          { name: 'Our Gurukkal', url: 'https://madhurakandykalari.com/guru' },
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
              MADHURAKANDY C.V.N KALARI • VENGERI, KOZHIKODE
            </p>

            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.6rem, 5.5vw, 4.5rem)',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '0.8rem',
                lineHeight: 1.15,
              }}
            >
              {title}
            </h1>

            <p
              style={{
                fontSize: '0.9rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                fontWeight: 600,
                marginBottom: '2rem',
              }}
            >
              {subtitle}
            </p>

            {photo && (
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.35 }}
                style={{ maxWidth: '420px', width: '100%', margin: '0 auto 2.5rem', borderRadius: '220px 220px 16px 16px', overflow: 'hidden', border: '1px solid var(--color-gold-dim)', boxShadow: '0 25px 50px rgba(0,0,0,0.7)' }}
              >
                <img src={photo} alt={title} style={{ width: '100%', height: '440px', objectFit: 'cover' }} />
              </motion.div>
            )}

            <p
              style={{
                color: 'rgba(245, 238, 230, 0.88)',
                fontSize: 'clamp(1.02rem, 1.3vw, 1.15rem)',
                lineHeight: 2,
                maxWidth: '820px',
                margin: '0 auto 2.8rem',
                textAlign: 'justify',
                fontWeight: 300,
              }}
            >
              {bio}
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
                  Contact Gurukkal (+91 99471 39696)
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
