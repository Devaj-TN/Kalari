import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ScrollReveal from '../animation/ScrollReveal';
import { kalariService, KalariBatch, KalariCourse } from '../../services/kalariService';
import { validateName, validateAge, validatePhone, sanitizeText, checkRateLimit } from '../../lib/security';

interface KalariProgramsProps {
  onSelectProgram?: (program: KalariCourse) => void;
}

const DEFAULT_SERVICES: KalariCourse[] = [
  {
    id: 'service-1',
    title: 'Kalarippayattu Training',
    level: 'TRAINING',
    badge: 'DAILY BATCHES',
    summary: 'Traditional Kuzhi Kalari training for all skill levels & age groups',
    description: 'Comprehensive training in traditional Northern style (Vadakkan) Kalaripayattu, covering Meythari (body conditioning), Kolthari (wooden weapons), Ankathari (metal weapons), and Verumkai (unarmed combat).',
    highlights: [
      'Meythari, Kolthari & Ankathari',
      'Daily morning & evening batches',
      'Open to all age groups & fitness levels',
    ],
    photo_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
    display_order: 1,
  },
  {
    id: 'service-2',
    title: 'Kalaripayattu Workshop',
    level: 'WORKSHOP',
    badge: 'INTENSIVE SESSIONS',
    summary: 'Short-term intensive workshops for martial artists, dancers & actors',
    description: 'Specialized masterclasses and corporate or institutional workshops focused on breath control, animal stances, flexibility, reflexes, and foundational martial movement.',
    highlights: [
      'Weekend & masterclass formats',
      'Custom corporate & school modules',
      'Flexibility & movement dynamics',
    ],
    photo_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    display_order: 2,
  },
  {
    id: 'service-3',
    title: 'Kalaripayattu Stage Shows',
    level: 'STAGE SHOW',
    badge: 'LIVE PERFORMANCE',
    summary: 'Dynamic live demonstrations, weapon combat & cultural performances',
    description: 'Breathtaking high-energy stage performances featuring synchronized empty-hand duels, spinning staff battles, sword & shield combat, and spectacular flexible blade (Urumi) demonstrations for festivals, cultural summits, and international events.',
    highlights: [
      'Acrobatic weapon duels & Urumi',
      'Cultural festivals & mega events',
      'Elite senior warrior performers',
    ],
    photo_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    display_order: 3,
  },
  {
    id: 'service-4',
    title: 'Ayurveda & Kalari Marma Massage Treatment',
    level: 'TREATMENT',
    badge: 'MARMA CHIKITSA',
    summary: 'Ancient Marma therapy, joint alignment & therapeutic herbal oil massage',
    description: 'Authentic Kalari Marma Chikitsa and traditional Uzhichil body treatment under Gurukkal diagnosis for spine & disc alignment, sports injuries, nervous vigor, and deep physical rejuvenation.',
    highlights: [
      'Traditional Marma & spine care',
      'Herbal oil Uzhichil massage',
      'By Gurukkal appointment',
    ],
    photo_url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop',
    display_order: 4,
  },
  {
    id: 'service-5',
    title: 'Action Choreography for movies',
    level: 'CHOREOGRAPHY',
    badge: 'CINEMA & STUNT',
    summary: 'Professional fight direction, weapon stunts & screen combat coordination',
    description: 'Custom martial combat choreography and stunt coordination for feature films, theatre productions, and music videos, blending authentic ancient techniques with cinematic screen impact.',
    highlights: [
      'Authentic movie fight direction',
      'Actor training & stunt coaching',
      'Weaponry & cinematic combat',
    ],
    photo_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
    display_order: 5,
  },
];

const PROGRAM_PHOTOS: Record<string, string> = {
  '1': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
  '2': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
  '3': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
  '4': 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop',
  '5': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
  'service-1': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
  'service-2': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
  'service-3': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
  'service-4': 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop',
  'service-5': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
};

interface EnrollForm {
  name: string;
  age: string;
  phone: string;
  message: string;
}

export default function KalariPrograms({ onSelectProgram }: KalariProgramsProps) {
  const [courses, setCourses] = useState<KalariCourse[]>(() => kalariService.getCachedCourses());
  const [selectedModal, setSelectedModal] = useState<KalariCourse | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [batches, setBatches] = useState<KalariBatch[]>(() => kalariService.getCachedBatches());
  const [enrollBatch, setEnrollBatch] = useState<KalariBatch | null>(null);
  const [form, setForm] = useState<EnrollForm>({ name: '', age: '', phone: '', message: '' });
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; age?: string; phone?: string }>({});
  const [rateError, setRateError] = useState<string>('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Batch Carousel Ref & Drag State
  const batchScrollContainerRef = useRef<HTMLDivElement>(null);
  const [isBatchDragging, setIsBatchDragging] = useState(false);
  const [batchStartX, setBatchStartX] = useState(0);
  const [batchScrollLeft, setBatchScrollLeft] = useState(0);

  const loadData = () => {
    kalariService.getCourses().then((data) => {
      if (data && data.length > 0) {
        setCourses(data);
      } else {
        setCourses(DEFAULT_SERVICES);
      }
    });
    kalariService.getBatches().then((data) => setBatches(data));
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
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Batch Carousel Slide Controls
  const prevBatchSlide = () => {
    if (batchScrollContainerRef.current) {
      const cardWidth = batchScrollContainerRef.current.offsetWidth / itemsPerPage;
      batchScrollContainerRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  const nextBatchSlide = () => {
    if (batchScrollContainerRef.current) {
      const cardWidth = batchScrollContainerRef.current.offsetWidth / itemsPerPage;
      batchScrollContainerRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  const onBatchMouseDown = (e: React.MouseEvent) => {
    setIsBatchDragging(true);
    setBatchStartX(e.pageX - batchScrollContainerRef.current!.offsetLeft);
    setBatchScrollLeft(batchScrollContainerRef.current!.scrollLeft);
  };
  const onBatchMouseLeave = () => setIsBatchDragging(false);
  const onBatchMouseUp = () => setIsBatchDragging(false);
  const onBatchMouseMove = (e: React.MouseEvent) => {
    if (!isBatchDragging || !batchScrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - batchScrollContainerRef.current.offsetLeft;
    const walk = (x - batchStartX) * 2;
    batchScrollContainerRef.current.scrollLeft = batchScrollLeft - walk;
  };

  const handleCardClick = (p: KalariCourse) => {
    if (onSelectProgram) {
      onSelectProgram(p);
    } else {
      setSelectedModal(p);
    }
  };

  return (
    <>
      <section
        id="programs"
        aria-labelledby="programs-heading"
        style={{
          background: 'transparent',
          padding: 'clamp(2.5rem, 4.5vw, 4rem) 1.5rem',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <div style={{ maxWidth: '1600px', width: '95%', margin: '0 auto' }}>
          {/* Section Header */}
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
                  marginBottom: '0.8rem',
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
                  Discover
                </span>
                <h2
                  id="programs-heading"
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
                  OUR SERVICES
                </h2>
              </div>
            </ScrollReveal>

            {/* Scroll Navigation Arrows */}
            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginTop: '0.4rem' }}>
              <motion.button
                onClick={prevSlide}
                aria-label="Previous services"
                whileHover={{ scale: 1.12, backgroundColor: 'var(--color-gold)', color: '#0b0704', borderColor: 'var(--color-gold)' }}
                whileTap={{ scale: 0.92 }}
                style={{
                  width: '40px',
                  height: '40px',
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
                aria-label="Next services"
                whileHover={{ scale: 1.12, backgroundColor: 'var(--color-gold)', color: '#0b0704', borderColor: 'var(--color-gold)' }}
                whileTap={{ scale: 0.92 }}
                style={{
                  width: '40px',
                  height: '40px',
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

          {/* Carousel Viewport */}
          <div
            style={{
              width: '100%',
              padding: '0.4rem 0 1rem',
            }}
          >
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
              }}
              onMouseDown={onMouseDown}
              onMouseLeave={onMouseLeave}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
            >
              {courses.map((p, i) => {
                const photo = p.photo_url || PROGRAM_PHOTOS[p.id] || PROGRAM_PHOTOS['1'];
                const isEven = i % 2 === 0;
                const highlightsList = p.highlights && p.highlights.length > 0 ? p.highlights : [p.summary || p.description || 'Traditional warrior training'];
                return (
                  <motion.div
                    key={p.id}
                    onClick={() => handleCardClick(p)}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      flex: `0 0 calc((100% - ${(itemsPerPage - 1) * 1.5}rem) / ${itemsPerPage})`,
                      maxWidth: `calc((100% - ${(itemsPerPage - 1) * 1.5}rem) / ${itemsPerPage})`,
                      scrollSnapAlign: 'start',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: itemsPerPage === 1 ? 'column' : 'row',
                      alignItems: itemsPerPage === 1 ? 'stretch' : 'center',
                      gap: '1.2rem',
                      padding: '1rem 0',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      const imgBox = e.currentTarget.querySelector('.img-box') as HTMLElement;
                      if (imgBox) {
                        imgBox.style.transform = `rotate(0deg) scale(1.02)`;
                        imgBox.style.boxShadow = '0 15px 35px rgba(0,0,0,0.8), 0 0 20px rgba(201,147,42,0.15)';
                      }
                      const arrowBtn = e.currentTarget.querySelector('.arrow-btn') as HTMLElement;
                      if (arrowBtn) {
                        arrowBtn.style.color = '#fff';
                        arrowBtn.style.borderColor = '#fff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      const imgBox = e.currentTarget.querySelector('.img-box') as HTMLElement;
                      if (imgBox) {
                        imgBox.style.transform = `rotate(${isEven ? '4deg' : '-4deg'}) scale(1)`;
                        imgBox.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
                      }
                      const arrowBtn = e.currentTarget.querySelector('.arrow-btn') as HTMLElement;
                      if (arrowBtn) {
                        arrowBtn.style.color = 'rgba(255,255,255,0.4)';
                        arrowBtn.style.borderColor = 'rgba(255,255,255,0.2)';
                      }
                    }}
                  >
                    {/* Tilted Photo Container */}
                    <div style={{ width: itemsPerPage === 1 ? '100%' : '55%', maxWidth: itemsPerPage === 1 ? '320px' : 'none', margin: itemsPerPage === 1 ? '0 auto' : '0', flexShrink: 0, position: 'relative' }}>
                      <div 
                        className="img-box"
                        style={{
                          backgroundColor: '#121212',
                          padding: '0.6rem',
                          borderRadius: '8px',
                          transform: `rotate(${isEven ? '4deg' : '-4deg'})`,
                          boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}
                      >
                        <div style={{ overflow: 'hidden', borderRadius: '6px', position: 'relative', aspectRatio: itemsPerPage === 1 ? '16/11' : '3/4' }}>
                          <img
                            src={photo}
                            alt={`Kalaripayattu Service — ${p.title} at Madhurakandy C.V.N Kalari`}
                            loading="lazy"
                            decoding="async"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center 25%',
                              display: 'block',
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: '0.4rem',
                              left: '0.4rem',
                              backgroundColor: 'var(--color-kalari-red)',
                              color: '#fff',
                              fontFamily: 'var(--font-sans)',
                              fontSize: '0.55rem',
                              fontWeight: 700,
                              letterSpacing: '0.12em',
                              textTransform: 'uppercase',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '2px',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
                            }}
                          >
                            {p.level}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Description Content */}
                    <div style={{ width: itemsPerPage === 1 ? '100%' : '45%', display: 'flex', flexDirection: 'column', paddingRight: '0.5rem', paddingLeft: '0.5rem' }}>
                      <h3
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: 'clamp(1.1rem, 1.8vw, 1.4rem)',
                          fontWeight: 700,
                          color: '#ffffff',
                          marginBottom: '1rem',
                          lineHeight: 1.15,
                        }}
                      >
                        {p.title}
                      </h3>

                      {/* Highlights */}
                      <ul
                        style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: '0 0 1.2rem 0',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem',
                        }}
                      >
                        {highlightsList.slice(0, 3).map((b, idx) => (
                          <li
                            key={idx}
                            style={{
                              fontFamily: 'var(--font-sans)',
                              fontSize: 'clamp(0.8rem, 1.2vw, 0.9rem)',
                              color: 'rgba(255, 255, 255, 0.75)',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.5rem',
                              lineHeight: 1.4,
                            }}
                          >
                            <span style={{ color: 'var(--color-gold)', fontSize: '0.65rem', marginTop: '0.25rem' }}>○</span>
                            {b}
                          </li>
                        ))}
                      </ul>

                      {/* Bottom Action Circle */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                        <div
                          className="arrow-btn"
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'rgba(255, 255, 255, 0.4)',
                            fontSize: '0.9rem',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          →
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Batches — Clean Enrollment Cards in Carousel */}
          {batches.length > 0 && (
            <div id="batches" style={{ marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(201, 147, 42, 0.18)', scrollMarginTop: '90px' }}>
              {/* Batches Header with Carousel Arrows */}
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
                      marginBottom: '0.8rem',
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
                      Training
                    </span>
                    <h3
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
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
                      BATCHES
                    </h3>
                  </div>
                </ScrollReveal>

                {/* Scroll Navigation Arrows */}
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginTop: '0.4rem' }}>
                  <motion.button
                    onClick={prevBatchSlide}
                    aria-label="Previous batches"
                    whileHover={{ scale: 1.12, backgroundColor: 'var(--color-gold)', color: '#0b0704', borderColor: 'var(--color-gold)' }}
                    whileTap={{ scale: 0.92 }}
                    style={{
                      width: '40px',
                      height: '40px',
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
                    onClick={nextBatchSlide}
                    aria-label="Next batches"
                    whileHover={{ scale: 1.12, backgroundColor: 'var(--color-gold)', color: '#0b0704', borderColor: 'var(--color-gold)' }}
                    whileTap={{ scale: 0.92 }}
                    style={{
                      width: '40px',
                      height: '40px',
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

              {/* Batches Carousel Viewport */}
              <div
                style={{
                  width: '100%',
                  padding: '0.4rem 0 1rem',
                }}
              >
                <div
                  ref={batchScrollContainerRef}
                  className="no-scrollbar"
                  style={{
                    display: 'flex',
                    gap: '1.5rem',
                    width: '100%',
                    overflowX: 'auto',
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none',
                    cursor: isBatchDragging ? 'grabbing' : 'grab',
                  }}
                  onMouseDown={onBatchMouseDown}
                  onMouseLeave={onBatchMouseLeave}
                  onMouseUp={onBatchMouseUp}
                  onMouseMove={onBatchMouseMove}
                >
                  {batches.map((batch, idx) => {
                    const isEven = idx % 2 === 0;
                    const photo = batch.photo_url || (isEven
                      ? 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop'
                      : 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop');
                    const badgeText = batch.title?.toLowerCase().includes('evening') || batch.timing?.toLowerCase().includes('pm')
                      ? 'EVENING'
                      : batch.title?.toLowerCase().includes('morning') || batch.timing?.toLowerCase().includes('am')
                      ? 'MORNING'
                      : (isEven ? 'MORNING' : 'EVENING');

                    // Dynamic highlights from database / admin management console
                    const batchHighlights = batch.highlights && batch.highlights.length > 0
                      ? batch.highlights
                      : (isEven
                        ? [
                            'Brahmamuhurtham Meythari, high kicks & agility',
                            `${batch.schedule || 'Mon / Tue / Wed / Fri / Sat'} (${batch.timing || '05:30 AM – 07:00 AM'})`,
                            'Open for all age groups (8+) & all skill levels',
                          ]
                        : [
                            'Warrior stances, weapon drills & body control',
                            `${batch.schedule || 'Mon / Tue / Wed / Fri / Sat'} (${batch.timing || '05:30 PM – 07:00 PM'})`,
                            'Ideal for students & working professionals',
                          ]);

                    return (
                      <motion.div
                        key={batch.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          flex: `0 0 calc((100% - ${(itemsPerPage - 1) * 1.5}rem) / ${itemsPerPage})`,
                          maxWidth: `calc((100% - ${(itemsPerPage - 1) * 1.5}rem) / ${itemsPerPage})`,
                          minWidth: `calc((100% - ${(itemsPerPage - 1) * 1.5}rem) / ${itemsPerPage})`,
                          scrollSnapAlign: 'start',
                          backgroundColor: 'transparent',
                          display: 'flex',
                          flexDirection: itemsPerPage === 1 ? 'column' : 'row',
                          alignItems: itemsPerPage === 1 ? 'stretch' : 'center',
                          gap: 'clamp(1rem, 2vw, 1.5rem)',
                          padding: '1rem 0.2rem',
                          boxSizing: 'border-box',
                        }}
                        onMouseEnter={(e) => {
                          const imgBox = e.currentTarget.querySelector('.batch-img-box') as HTMLElement;
                          if (imgBox) {
                            imgBox.style.transform = 'rotate(0deg) scale(1.02)';
                            imgBox.style.boxShadow = '0 16px 35px rgba(0,0,0,0.85), 0 0 20px rgba(201,147,42,0.2)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          const imgBox = e.currentTarget.querySelector('.batch-img-box') as HTMLElement;
                          if (imgBox) {
                            imgBox.style.transform = `rotate(${isEven ? '-3deg' : '3deg'}) scale(1)`;
                            imgBox.style.boxShadow = '0 12px 30px rgba(0,0,0,0.7)';
                          }
                        }}
                      >
                        {/* Tilted Photo Box */}
                        <div style={{ width: itemsPerPage === 1 ? '100%' : '48%', maxWidth: itemsPerPage === 1 ? '320px' : 'none', margin: itemsPerPage === 1 ? '0 auto' : '0', flexShrink: 0, position: 'relative' }}>
                          <div
                            className="batch-img-box"
                            style={{
                              backgroundColor: '#121212',
                              padding: '0.5rem',
                              borderRadius: '8px',
                              transform: `rotate(${isEven ? '-3deg' : '3deg'})`,
                              boxShadow: '0 12px 30px rgba(0,0,0,0.7)',
                              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            }}
                          >
                            <div style={{ overflow: 'hidden', borderRadius: '6px', position: 'relative', aspectRatio: itemsPerPage === 1 ? '16/11' : '3/4' }}>
                              <img
                                src={photo}
                                alt={batch.title}
                                loading="lazy"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  display: 'block',
                                }}
                              />
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '0.4rem',
                                  left: '0.4rem',
                                  backgroundColor: 'var(--color-kalari-red)',
                                  color: '#fff',
                                  fontFamily: 'var(--font-sans)',
                                  fontSize: '0.58rem',
                                  fontWeight: 700,
                                  letterSpacing: '0.12em',
                                  textTransform: 'uppercase',
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '2px',
                                  boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
                                }}
                              >
                                {badgeText}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Side: Details & Highlights */}
                        <div
                          style={{
                            width: itemsPerPage === 1 ? '100%' : '52%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.45rem',
                          }}
                        >
                          <h4
                            style={{
                              fontFamily: 'var(--font-sans)',
                              fontSize: 'clamp(1.15rem, 1.8vw, 1.4rem)',
                              fontWeight: 700,
                              color: '#fff',
                              margin: 0,
                              lineHeight: 1.2,
                            }}
                          >
                            {batch.title}
                          </h4>

                          <p style={{ fontSize: '0.82rem', color: 'var(--color-gold)', margin: 0, fontWeight: 600 }}>
                            🕐 {batch.timing}
                          </p>

                          <ul
                            style={{
                              listStyle: 'none',
                              padding: 0,
                              margin: '0.2rem 0 0.5rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.35rem',
                            }}
                          >
                            {batchHighlights.map((h, i) => (
                              <li
                                key={i}
                                style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: '0.5rem',
                                  fontSize: '0.78rem',
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  lineHeight: 1.35,
                                }}
                              >
                                <span style={{ color: 'var(--color-gold)', fontSize: '0.65rem', marginTop: '0.15rem' }}>○</span>
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>

                          <div>
                            <button
                              onClick={() => {
                                setEnrollBatch(batch);
                                setFieldErrors({});
                                setRateError('');
                                setForm({ name: '', age: '', phone: '', message: '' });
                              }}
                              style={{
                                padding: '0.58rem 1.3rem',
                                backgroundColor: 'var(--color-kalari-red)',
                                border: 'none',
                                borderRadius: '4px',
                                color: '#fff',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                boxShadow: '0 4px 12px rgba(134,18,18,0.35)',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = '0.9';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = '1';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                            >
                              <span>Enroll Now</span>
                              <span>→</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ─── Enrollment Form Modal ─── */}
          <AnimatePresence>
            {enrollBatch && (
              <motion.div
                role="dialog"
                aria-modal="true"
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                aria-label="Enroll in batch"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => { if (e.target === e.currentTarget) setEnrollBatch(null); }}
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 200,
                  backgroundColor: 'rgba(4, 2, 1, 0.88)',
                  backdropFilter: 'blur(18px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.5rem',
                  overscrollBehavior: 'contain',
                }}
              >
                <motion.div
                  data-lenis-prevent="true"
                  onWheel={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 15 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  style={{
                    width: '100%',
                    maxWidth: '460px',
                    backgroundColor: '#110a05',
                    border: '1px solid var(--color-gold)',
                    borderRadius: '8px',
                    padding: 'clamp(1.5rem, 3.5vw, 2.2rem)',
                    position: 'relative',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.9)',
                    overscrollBehavior: 'contain',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                  }}
                >
                {/* Close */}
                <button
                  onClick={() => setEnrollBatch(null)}
                  aria-label="Close"
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    fontSize: '1.3rem',
                    cursor: 'pointer',
                    lineHeight: 1,
                  }}
                >✕</button>

                {/* Heading */}
                <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '0.4rem' }}>Enroll</p>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#fff', marginBottom: '0.3rem', lineHeight: 1.2 }}>
                  {enrollBatch.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-gold)', marginBottom: '1.5rem', fontWeight: 600 }}>
                  🕐 {enrollBatch.timing} &nbsp;·&nbsp; {enrollBatch.schedule}
                </p>

                {rateError && (
                  <div style={{ padding: '0.6rem 0.8rem', backgroundColor: 'rgba(224,48,54,0.15)', border: '1px solid var(--color-kalari-red)', borderRadius: '4px', color: '#ff6b6b', fontSize: '0.8rem', marginBottom: '1rem' }}>
                    {rateError}
                  </div>
                )}

                {/* Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Name */}
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>Full Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, name: e.target.value }));
                        if (fieldErrors.name) setFieldErrors((err) => ({ ...err, name: undefined }));
                      }}
                      placeholder="Your full name"
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: fieldErrors.name ? '1px solid #ff4d4f' : '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    {fieldErrors.name && (
                      <span style={{ fontSize: '0.72rem', color: '#ff6b6b', marginTop: '0.25rem', display: 'block' }}>{fieldErrors.name}</span>
                    )}
                  </div>

                  {/* Age + Phone */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>Age *</label>
                      <input
                        type="number"
                        value={form.age}
                        onChange={(e) => {
                          setForm((f) => ({ ...f, age: e.target.value }));
                          if (fieldErrors.age) setFieldErrors((err) => ({ ...err, age: undefined }));
                        }}
                        placeholder="Age (e.g. 18)"
                        min="5"
                        max="80"
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.85rem',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          border: fieldErrors.age ? '1px solid #ff4d4f' : '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '4px',
                          color: '#fff',
                          fontSize: '0.9rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      {fieldErrors.age && (
                        <span style={{ fontSize: '0.72rem', color: '#ff6b6b', marginTop: '0.25rem', display: 'block' }}>{fieldErrors.age}</span>
                      )}
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>Phone *</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => {
                          setForm((f) => ({ ...f, phone: e.target.value }));
                          if (fieldErrors.phone) setFieldErrors((err) => ({ ...err, phone: undefined }));
                        }}
                        placeholder="+91 99471 39696"
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.85rem',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          border: fieldErrors.phone ? '1px solid #ff4d4f' : '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '4px',
                          color: '#fff',
                          fontSize: '0.9rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      {fieldErrors.phone && (
                        <span style={{ fontSize: '0.72rem', color: '#ff6b6b', marginTop: '0.25rem', display: 'block' }}>{fieldErrors.phone}</span>
                      )}
                    </div>
                  </div>

                  {/* Optional message */}
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>Any message (optional)</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Any questions or special requirements..."
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  {/* Submit via WhatsApp */}
                  <button
                    disabled={formSubmitting}
                    onClick={() => {
                      setFieldErrors({});
                      setRateError('');

                      // 1. Rate limiting
                      const rateCheck = checkRateLimit('public_batch_enrollment', 6, 60000);
                      if (!rateCheck.allowed) {
                        setRateError(`Too many inquiries submitted. Please wait ${rateCheck.retryAfterSec}s.`);
                        return;
                      }

                      // 2. Validate Inputs
                      const cleanName = sanitizeText(form.name);
                      const cleanAge = sanitizeText(form.age);
                      const cleanPhone = sanitizeText(form.phone);
                      const cleanMsg = sanitizeText(form.message);

                      const nameValidation = validateName(cleanName);
                      const ageValidation = validateAge(cleanAge);
                      const phoneValidation = validatePhone(cleanPhone);

                      if (!nameValidation.isValid || !ageValidation.isValid || !phoneValidation.isValid) {
                        setFieldErrors({
                          name: nameValidation.error,
                          age: ageValidation.error,
                          phone: phoneValidation.error,
                        });
                        return;
                      }

                      setFormSubmitting(true);

                      // Automatically log inquiry to Admin Dashboard
                      kalariService.addInquiry({
                        type: 'batch',
                        name: cleanName,
                        age: cleanAge,
                        phone: cleanPhone,
                        details: `${enrollBatch.title} (${enrollBatch.timing} · ${enrollBatch.schedule})`,
                        message: cleanMsg || undefined,
                      }).catch((err) => console.warn('Auto log inquiry error:', err));

                      const lines = [
                        `*Kalaripayattu Enrollment Inquiry*`,
                        ``,
                        `*Batch:* ${enrollBatch.title}`,
                        `*Timing:* ${enrollBatch.timing}`,
                        `*Schedule:* ${enrollBatch.schedule}`,
                        ``,
                        `*Name:* ${cleanName}`,
                        `*Age:* ${cleanAge}`,
                        `*Phone:* ${cleanPhone}`,
                        cleanMsg ? `*Message:* ${cleanMsg}` : '',
                      ].filter(Boolean);
                      const fullMessage = lines.join('\n');
                      window.open(`https://wa.me/919947139696?text=${encodeURIComponent(fullMessage)}`, '_blank');
                      setTimeout(() => {
                        setFormSubmitting(false);
                        setEnrollBatch(null);
                      }, 800);
                    }}
                    style={{
                      marginTop: '0.4rem',
                      padding: '0.75rem',
                      backgroundColor: '#25d366',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'opacity 0.2s',
                      width: '100%',
                    }}
                  >
                    <span>💬</span>
                    <span>{formSubmitting ? 'Opening WhatsApp...' : 'Send Inquiry via WhatsApp'}</span>
                  </button>

                  <p style={{ fontSize: '0.68rem', color: 'var(--color-text-dim)', textAlign: 'center', margin: 0 }}>
                    Your details will be sent to us via WhatsApp for confirmation.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>

      {/* Course/Service Syllabus Modal Drawer */}
      <AnimatePresence>
        {selectedModal && (
          <motion.div
            role="dialog"
            aria-modal="true"
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            aria-labelledby="modal-program-title"
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
            onClick={() => setSelectedModal(null)}
          >
            <motion.div
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="no-scrollbar"
              style={{
                backgroundColor: 'rgba(22, 13, 7, 0.98)',
                border: '1.5px solid var(--color-gold)',
                borderRadius: '6px',
                maxWidth: '680px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: 'clamp(2rem, 5vw, 3.5rem)',
                position: 'relative',
                boxShadow: '0 30px 70px rgba(0,0,0,0.95), 0 0 40px rgba(201,147,42,0.25)',
                overscrollBehavior: 'contain',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedModal(null)}
                aria-label="Close modal"
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-gold)',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-gold)';
                  e.currentTarget.style.backgroundColor = 'var(--color-gold)';
                  e.currentTarget.style.color = '#0b0704';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--color-gold)';
                }}
              >
                ✕
              </button>

              <span className="kalari-badge" style={{ marginBottom: '1rem' }}>
                {selectedModal.level} {selectedModal.badge ? `· ${selectedModal.badge}` : ''}
              </span>

              <h2
                id="modal-program-title"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                  fontWeight: 700,
                  color: 'var(--color-gold)',
                  lineHeight: 1.1,
                  marginBottom: '0.4rem',
                }}
              >
                {selectedModal.title}
              </h2>

              {selectedModal.summary && (
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '1.5rem' }}>
                  {selectedModal.summary}
                </p>
              )}

              <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-text-muted)', fontSize: '0.98rem', lineHeight: 1.8, marginBottom: '1.8rem' }}>
                {selectedModal.description}
              </p>

              {selectedModal.highlights && selectedModal.highlights.length > 0 && (
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', marginBottom: '1.8rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '1rem', fontWeight: 700 }}>
                    SERVICE HIGHLIGHTS
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    {selectedModal.highlights.map((b, i) => (
                      <li key={i} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ color: 'var(--color-kalari-red-light)' }}>✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', letterSpacing: '0.12em', color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>
                    Location
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: 'var(--color-gold)', fontWeight: 600 }}>Madhurakandy C.V.N Kalari, Vengeri</p>
                </div>
                <a
                  href="tel:+919947139696"
                  onClick={() => setSelectedModal(null)}
                  style={{
                    color: 'var(--color-gold)',
                    fontFamily: 'var(--font-sans)',
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
                  Inquire Now (+91 99471 39696) →
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
