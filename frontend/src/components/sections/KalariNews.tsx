import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ScrollReveal from '../animation/ScrollReveal';
import { kalariService, KalariNewsItem, KalariContactSettings } from '../../services/kalariService';

export default function KalariNews() {
  const [news, setNews] = useState<KalariNewsItem[]>(() => kalariService.getCachedNews());
  const [selectedPost, setSelectedPost] = useState<KalariNewsItem | null>(null);
  const [contactSettings, setContactSettings] = useState<KalariContactSettings | null>(() => kalariService.getCachedContactSettings());
  const [itemsPerPage, setItemsPerPage] = useState(3);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const loadData = () => {
    kalariService.getNews().then((data) => setNews(data));
    kalariService.getContactSettings().then((data) => setContactSettings(data));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('kalari_content_updated', loadData);
    return () => {
      window.removeEventListener('kalari_content_updated', loadData);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1280) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current!.offsetLeft);
    setScrollLeft(scrollContainerRef.current!.scrollLeft);
  };
  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk;
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day} - ${month} - ${year}`;
    } catch {
      return isoString;
    }
  };

  const getArticleImage = (post: KalariNewsItem, index: number) => {
    if (post.image_url && post.image_url.trim().length > 0) return post.image_url;
    const fallbacks = [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    ];
    return fallbacks[index % fallbacks.length];
  };

  if (!news || news.length === 0) {
    return null;
  }

  return (
    <>
      <section
        id="news"
        aria-labelledby="news-heading"
        style={{
          scrollMarginTop: '80px',
          background: 'transparent',
          padding: 'clamp(2.5rem, 4.5vw, 4rem) 1.5rem',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <div style={{ maxWidth: '1600px', width: '95%', margin: '0 auto' }}>
          {/* Section Title Header */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '1rem',
              textAlign: 'center',
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
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    color: '#e03036',
                    lineHeight: 1,
                    marginBottom: '-1.1rem',
                    position: 'relative',
                    zIndex: 2,
                    display: 'block',
                    WebkitTextStroke: '0 !important',
                  }}
                >
                  Updates
                </span>
                <h2
                  id="news-heading"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(2.5rem, 4.5vw, 3.8rem)',
                    color: 'transparent',
                    WebkitTextStroke: '1px var(--color-gold)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    lineHeight: 1.1,
                    margin: 0,
                    fontWeight: 800,
                  }}
                >
                  NEWS & EVENTS
                </h2>
              </div>
            </ScrollReveal>
          </div>

          {/* Carousel Arrows */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.8rem',
              marginBottom: '1.2rem',
              paddingRight: '0.5rem',
            }}
          >
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'var(--color-gold)', color: '#000' }}
              whileTap={{ scale: 0.92 }}
              onClick={prevSlide}
              aria-label="Previous news slide"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                border: '1px solid rgba(201, 147, 42, 0.4)',
                backgroundColor: 'rgba(20, 12, 6, 0.8)',
                color: 'var(--color-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.1rem',
                transition: 'border-color 0.2s ease',
              }}
            >
              ←
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'var(--color-gold)', color: '#000' }}
              whileTap={{ scale: 0.92 }}
              onClick={nextSlide}
              aria-label="Next news slide"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                border: '1px solid rgba(201, 147, 42, 0.4)',
                backgroundColor: 'rgba(20, 12, 6, 0.8)',
                color: 'var(--color-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.1rem',
                transition: 'border-color 0.2s ease',
              }}
            >
              →
            </motion.button>
          </div>

          {/* News Carousel Viewport */}
          <div
            ref={scrollContainerRef}
            className="no-scrollbar"
            style={{
              display: 'flex',
              gap: '1.5rem',
              width: '100%',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              cursor: isDragging ? 'grabbing' : 'grab',
              paddingBottom: '1rem',
            }}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
          >
            {news.map((post, i) => {
              const imageSrc = getArticleImage(post, i);
              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: Math.min(i * 0.1, 0.4), ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, borderColor: 'var(--color-gold)' }}
                  onClick={() => setSelectedPost(post)}
                  style={{
                    flex: `0 0 calc((100% - ${(itemsPerPage - 1) * 1.5}rem) / ${itemsPerPage})`,
                    maxWidth: `calc((100% - ${(itemsPerPage - 1) * 1.5}rem) / ${itemsPerPage})`,
                    scrollSnapAlign: 'start',
                    backgroundColor: 'rgba(20, 12, 6, 0.92)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    backdropFilter: 'blur(10px)',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                >
                  {/* Image with date badge */}
                  <div style={{ position: 'relative', height: '170px', overflow: 'hidden' }}>
                    <img
                      src={imageSrc}
                      alt={`Kalari Academy Event & News — ${post.title}`}
                      loading="lazy"
                      decoding="async"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.6s var(--ease-out-expo)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        backgroundColor: 'var(--color-kalari-red)',
                        color: '#fff',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        padding: '0.3rem 0.75rem',
                        clipPath: 'polygon(8px 0, 100% 0, 100% 100%, 0 100%)',
                      }}
                    >
                      {formatDate(post.date)}
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '1.2rem 1.4rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.62rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'var(--color-gold)',
                        fontWeight: 600,
                        marginBottom: '0.35rem',
                      }}
                    >
                      {post.tag || 'NEWS'}
                    </span>

                    <h3
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        lineHeight: 1.3,
                        marginBottom: '0.6rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.title}
                    </h3>

                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.85rem',
                        color: 'var(--color-text-muted)',
                        lineHeight: 1.6,
                        marginBottom: '1.2rem',
                        flexGrow: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.summary}
                    </p>

                    <div
                      style={{
                        marginTop: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.72rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--color-gold)',
                        fontWeight: 600,
                      }}
                    >
                      <span>Read Story</span>
                      <span>→</span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* News Article Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            role="dialog"
            aria-modal="true"
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            aria-labelledby="modal-news-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 120,
              backgroundColor: 'rgba(10, 7, 4, 0.92)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              overscrollBehavior: 'contain',
            }}
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="no-scrollbar"
              initial={{ scale: 0.93, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                backgroundColor: 'rgba(22, 13, 7, 0.97)',
                border: '1.5px solid var(--color-gold)',
                borderRadius: '6px',
                maxWidth: '700px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: 'clamp(1.8rem, 4vw, 3rem)',
                position: 'relative',
                boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 40px rgba(201,147,42,0.25)',
                overscrollBehavior: 'contain',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedPost(null)}
                aria-label="Close story modal"
                style={{
                  position: 'absolute',
                  top: '1.2rem',
                  right: '1.2rem',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--color-gold)',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </motion.button>

              <span className="kalari-badge" style={{ marginBottom: '0.8rem' }}>
                {selectedPost.tag || 'NEWS'} · {formatDate(selectedPost.date)}
              </span>

              <h2
                id="modal-news-title"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                  fontWeight: 700,
                  color: 'var(--color-gold)',
                  lineHeight: 1.15,
                  marginBottom: '1rem',
                }}
              >
                {selectedPost.title}
              </h2>

              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.98rem', color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
                {selectedPost.summary}
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href={`tel:${(contactSettings?.primary_phone || '+91 99471 39696').replace(/\s+/g, '')}`}
                  className="btn-kalari-primary"
                  onClick={() => setSelectedPost(null)}
                >
                  Call Kalari ({contactSettings?.primary_phone || '+91 99471 39696'}) →
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
