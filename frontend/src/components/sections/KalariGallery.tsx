import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import ScrollReveal from '../animation/ScrollReveal';
import { kalariService, KalariGalleryItem } from '../../services/kalariService';

export default function KalariGallery() {
  const [gallery, setGallery] = useState<KalariGalleryItem[]>(() => kalariService.getCachedGallery());
  const [activeItem, setActiveItem] = useState<KalariGalleryItem | null>(null);
  const [loading, setLoading] = useState<boolean>(() => kalariService.getCachedGallery().length === 0);

  // Carousel Ref & State
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const loadGallery = (fromCache = false) => {
    if (fromCache) {
      // On live-update events, first show cached data instantly (which may now have URLs)
      const cached = kalariService.getCachedGallery();
      if (cached.length > 0) {
        setGallery(cached);
        setLoading(false);
        return;
      }
    }
    kalariService.getGallery().then((data) => {
      setGallery(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadGallery(false);
    const handleUpdate = () => loadGallery(true);
    window.addEventListener('kalari_content_updated', handleUpdate);
    return () => {
      window.removeEventListener('kalari_content_updated', handleUpdate);
    };
  }, []);

  // Responsive Items Per Page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 960) {
        setItemsPerPage(2);
      } else if (window.innerWidth < 1280) {
        setItemsPerPage(3);
      } else {
        setItemsPerPage(4);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Carousel Slide Navigation
  const prevSlide = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth / itemsPerPage;
      scrollContainerRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  const nextSlide = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth / itemsPerPage;
      scrollContainerRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  // Mouse Drag Support
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.8;
    if (Math.abs(walk) > 6) {
      setHasDragged(true);
    }
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      style={{
        scrollMarginTop: '80px',
        padding: 'clamp(3.5rem, 6vw, 5.5rem) 1.5rem',
        backgroundColor: '#0a0705',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
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
        {/* Section Heading with Carousel Navigation Arrows (Styled like Batches) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            marginBottom: '1.6rem',
            width: '100%',
          }}
        >
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
              <h2
                id="gallery-heading"
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
              </h2>
            </div>
          </ScrollReveal>

          {/* Carousel Arrows */}
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginTop: '0.8rem' }}>
            <motion.button
              onClick={prevSlide}
              aria-label="Previous gallery slides"
              whileHover={{ scale: 1.12, backgroundColor: 'var(--color-gold)', color: '#0b0704', borderColor: 'var(--color-gold)' }}
              whileTap={{ scale: 0.92 }}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(22, 13, 7, 0.85)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-gold)',
                fontSize: '1.1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s var(--ease-smooth)',
              }}
            >
              ←
            </motion.button>
            <motion.button
              onClick={nextSlide}
              aria-label="Next gallery slides"
              whileHover={{ scale: 1.12, backgroundColor: 'var(--color-gold)', color: '#0b0704', borderColor: 'var(--color-gold)' }}
              whileTap={{ scale: 0.92 }}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(22, 13, 7, 0.85)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-gold)',
                fontSize: '1.1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s var(--ease-smooth)',
              }}
            >
              →
            </motion.button>
          </div>
        </div>

        {/* Media Carousel Viewport */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-gold)' }}>
            Loading Gallery…
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              maxWidth: '1360px',
              padding: '0.4rem 0 1rem',
            }}
          >
            <div
              ref={scrollContainerRef}
              className="no-scrollbar"
              style={{
                display: 'flex',
                gap: '1.4rem',
                width: '100%',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                cursor: isDragging ? 'grabbing' : 'grab',
                padding: '0.5rem 0.2rem 1.2rem',
              }}
              onMouseDown={onMouseDown}
              onMouseLeave={onMouseLeave}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
            >
              {gallery.map((item, idx) => (
                <motion.div
                  key={item.id}
                  onClick={() => {
                    if (hasDragged) return;
                    setActiveItem(item);
                  }}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: Math.min(idx * 0.08, 0.4), ease: [0.16, 1, 0.3, 1] }}
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
                  style={{
                    flex: `0 0 calc((100% - ${(itemsPerPage - 1) * 1.4}rem) / ${itemsPerPage})`,
                    minWidth: `calc((100% - ${(itemsPerPage - 1) * 1.4}rem) / ${itemsPerPage})`,
                    maxWidth: `calc((100% - ${(itemsPerPage - 1) * 1.4}rem) / ${itemsPerPage})`,
                    scrollSnapAlign: 'start',
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(20, 13, 8, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    cursor: 'pointer',
                    aspectRatio: '16 / 11',
                    userSelect: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  {/* Photo / Thumbnail */}
                  {(item.thumbnail_url || item.url) ? (
                    <motion.img
                      variants={{
                        rest: { scale: 1, filter: 'brightness(0.85)' },
                        hover: { scale: 1.08, filter: 'brightness(1.04)' },
                      }}
                      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                      src={item.thumbnail_url || item.url}
                      alt={item.title}
                      loading="lazy"
                      draggable={false}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        pointerEvents: 'none',
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, rgba(201,147,42,0.06) 0%, rgba(255,255,255,0.03) 50%, rgba(201,147,42,0.06) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'pulse 2s ease-in-out infinite',
                    }}>
                      <span style={{ fontSize: '2rem', opacity: 0.3 }}>📷</span>
                    </div>
                  )}

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
              ))}
            </div>
          </div>
        )}

        {/* View All Button */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            style={{ display: 'inline-block' }}
          >
            <Link
              to="/gallery"
              className="btn-kalari-gold"
              style={{
                padding: '0.75rem 2.2rem',
                fontSize: '0.82rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>View All Gallery</span>
              <span>→</span>
            </Link>
          </motion.div>
        </div>

        {/* Lightbox / High-Res Preview Modal with AnimatePresence */}
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
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
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
                <button
                  onClick={() => setActiveItem(null)}
                  aria-label="Close Lightbox"
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
                </button>

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
      </div>
    </section>
  );
}
