import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import KalariHeader from '../components/layout/KalariHeader';
import KalariFooter from '../components/sections/KalariFooter';
import ScrollReveal from '../components/animation/ScrollReveal';
import SEO from '../components/common/SEO';
import { kalariService, KalariGalleryItem } from '../services/kalariService';

export default function GalleryPage() {
  const [gallery, setGallery] = useState<KalariGalleryItem[]>(() => kalariService.getCachedGallery());
  const [activeItem, setActiveItem] = useState<KalariGalleryItem | null>(null);
  const [loading, setLoading] = useState<boolean>(() => kalariService.getCachedGallery().length === 0);

  const loadGallery = () => {
    kalariService.getGallery().then((data) => {
      setGallery(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadGallery();
    window.addEventListener('kalari_content_updated', loadGallery);
    return () => {
      window.removeEventListener('kalari_content_updated', loadGallery);
    };
  }, []);

  return (
    <>
      <SEO
        title="Photo & Video Gallery — Madhurakandy C.V.N Kalari | Vengeri, Kozhikode"
        description="Explore photos and video demonstrations of traditional Northern Kalaripayattu, weapon combat, Meythari stances, and Marma Chikitsa at Madhurakandy C.V.N Kalari."
        canonical="https://madhurakandykalari.com/gallery"
        breadcrumbs={[
          { name: 'Home', url: 'https://madhurakandykalari.com/' },
          { name: 'Photo & Video Gallery', url: 'https://madhurakandykalari.com/gallery' },
        ]}
      />

      <KalariHeader />

      <main
        style={{
          backgroundColor: '#070503',
          color: 'var(--color-text)',
          minHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(7rem, 14vw, 10rem) 1.5rem clamp(4rem, 8vw, 6rem)',
        }}
      >
        <div
          style={{
            maxWidth: '1600px',
            width: '95%',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem', width: '100%' }}>
            <ScrollReveal>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-script)',
                    fontSize: 'clamp(2.8rem, 5.5vw, 4.8rem)',
                    color: '#e03036',
                    lineHeight: 1,
                    marginBottom: '-1.2rem',
                    position: 'relative',
                    zIndex: 2,
                    display: 'block',
                    WebkitTextStroke: '0 !important',
                  }}
                >
                  Moments
                </span>
                <h1
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(2.4rem, 6vw, 4.8rem)',
                    fontWeight: 300,
                    letterSpacing: '0.03em',
                    color: 'transparent',
                    WebkitTextStroke: '1.2px rgba(255, 255, 255, 0.95)',
                    lineHeight: 1.05,
                    textTransform: 'uppercase',
                    margin: 0,
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  PHOTO & VIDEO GALLERY
                </h1>
              </div>
            </ScrollReveal>
          </div>

          {/* Media Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-gold)' }}>
              Loading Gallery Media…
            </div>
          ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 310px))',
              justifyContent: 'center',
              gap: '1.4rem',
              width: '100%',
              maxWidth: '1360px',
              margin: '0 auto',
            }}
          >
            {gallery.map((item, idx) => (
              <ScrollReveal key={item.id} delay={idx * 0.05}>
                <motion.div
                  initial="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.97 }}
                  variants={{
                    rest: {
                      y: 0,
                      scale: 1,
                      borderColor: 'rgba(255, 255, 255, 0.12)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                    },
                    hover: {
                      y: -8,
                      scale: 1.025,
                      borderColor: 'var(--color-gold)',
                      boxShadow: '0 20px 42px rgba(0,0,0,0.85), 0 0 25px rgba(201, 147, 42, 0.35)',
                    },
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 24 }}
                  onClick={() => setActiveItem(item)}
                  style={{
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(20, 13, 8, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    cursor: 'pointer',
                    aspectRatio: '16 / 11',
                    width: '100%',
                    maxWidth: '310px',
                    margin: '0 auto',
                  }}
                >
                  {/* Image with On-Cursor Zoom Animation */}
                  <motion.img
                    variants={{
                      rest: { scale: 1, filter: 'brightness(0.85)' },
                      hover: { scale: 1.08, filter: 'brightness(1.04)' },
                    }}
                    transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                    src={item.thumbnail_url || item.url}
                    alt={item.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />

                  {item.media_type === 'video' && (
                    <div style={{ position: 'absolute', top: '0.65rem', right: '0.65rem', zIndex: 3 }}>
                      <span
                        style={{
                          fontSize: '0.58rem',
                          backgroundColor: 'var(--color-kalari-red)',
                          color: '#fff',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '3px',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                        }}
                      >
                        ▶ VIDEO
                      </span>
                    </div>
                  )}



                  {/* Bottom Overlay & Metadata */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(10, 7, 5, 0.96) 0%, rgba(10, 7, 5, 0.4) 45%, transparent 75%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: '0.85rem 1rem',
                      zIndex: 2,
                      pointerEvents: 'none',
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '0.98rem',
                        color: '#fff',
                        margin: '0 0 0.15rem',
                        lineHeight: 1.25,
                      }}
                    >
                      {item.title}
                    </h3>
                    {item.caption && (
                      <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.caption}
                      </p>
                    )}
                  </div>

                  {/* Glowing Gold Bottom Highlight on Hover */}
                  <motion.div
                    variants={{
                      rest: { opacity: 0, scaleX: 0.3 },
                      hover: { opacity: 1, scaleX: 1 },
                    }}
                    transition={{ duration: 0.35 }}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)',
                      zIndex: 5,
                      pointerEvents: 'none',
                    }}
                  />
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        )}

          {/* Navigation Back */}
          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} style={{ display: 'inline-block' }}>
              <Link to="/" className="btn-kalari-gold">
                ← Back to Home
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {activeItem && (
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 200,
                backgroundColor: 'rgba(0, 0, 0, 0.93)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
              }}
              onClick={() => setActiveItem(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: '880px',
                  width: '100%',
                  backgroundColor: '#110a05',
                  border: '1px solid var(--color-gold)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
                  position: 'relative',
                }}
              >
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.15, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveItem(null)}
                  aria-label="Close"
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    zIndex: 10,
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    border: '1px solid var(--color-gold)',
                    color: 'var(--color-gold)',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✕
                </motion.button>

                {/* Media Content */}
                {activeItem.media_type === 'video' && activeItem.url.includes('embed') ? (
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                    <iframe
                      src={activeItem.url}
                      title={activeItem.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div style={{ backgroundColor: '#060402', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={activeItem.url}
                      alt={activeItem.title}
                      style={{ width: '100%', maxHeight: '72vh', objectFit: 'contain' }}
                    />
                  </div>
                )}

                {/* Caption & Info */}
                <div style={{ padding: '1.5rem 2rem' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.4rem',
                      color: '#fff',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {activeItem.title}
                  </h3>
                  {activeItem.caption && (
                    <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                      {activeItem.caption}
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <KalariFooter />
    </>
  );
}
