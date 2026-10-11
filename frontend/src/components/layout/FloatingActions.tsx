import { motion } from 'motion/react';

interface FloatingActionsProps {
  onOpenEnroll?: () => void;
  onOpenFeedback?: () => void;
  onOpenContact?: () => void;
}

export default function FloatingActions({
  onOpenEnroll,
  onOpenFeedback,
  onOpenContact,
}: FloatingActionsProps) {
  const scrollTo = (id: string) => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: string | HTMLElement, options?: { offset?: number }) => void } }).__lenis;
    const target = document.getElementById(id);
    if (lenis && target) {
      lenis.scrollTo(target, { offset: -40 });
    } else if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.aside
      aria-label="Quick Actions"
      className="kalari-floating-actions hidden sm:flex"
      initial={{ x: 70, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.6, type: 'spring', stiffness: 180, damping: 20 }}
      style={{
        position: 'fixed',
        right: '0',
        top: '45%',
        transform: 'translateY(-50%)',
        zIndex: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.4rem',
        pointerEvents: 'auto',
      }}
    >
      {/* Enroll Online Button */}
      <motion.a
        href="tel:+919947139696"
        whileHover={{ x: -8, backgroundColor: 'var(--color-kalari-red-light)' }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{
          backgroundColor: 'var(--color-kalari-red)',
          color: '#fff',
          border: '1px solid var(--color-kalari-red-light)',
          borderRight: 'none',
          padding: '0.65rem 1.1rem',
          fontSize: '0.68rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          borderRadius: '4px 0 0 4px',
          cursor: 'pointer',
          boxShadow: '-4px 4px 15px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          textDecoration: 'none',
        }}
      >
        <span style={{ fontSize: '0.8rem' }}>⚔️</span> CALL ADMISSION
      </motion.a>

      {/* Disciplines & Syllabus */}
      <motion.button
        onClick={() => scrollTo('programs')}
        whileHover={{ x: -8, color: 'var(--color-gold)', borderColor: 'var(--color-gold)' }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{
          backgroundColor: 'rgba(22, 13, 7, 0.92)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
          borderRight: 'none',
          backdropFilter: 'blur(10px)',
          padding: '0.55rem 1rem',
          fontSize: '0.65rem',
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          borderRadius: '4px 0 0 4px',
          cursor: 'pointer',
          boxShadow: '-4px 4px 12px rgba(0,0,0,0.4)',
        }}
      >
        SERVICES
      </motion.button>

      {/* Gurukkal / Master */}
      <motion.button
        onClick={() => scrollTo('guru')}
        whileHover={{ x: -8, color: 'var(--color-gold)', borderColor: 'var(--color-gold)' }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{
          backgroundColor: 'rgba(22, 13, 7, 0.92)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
          borderRight: 'none',
          backdropFilter: 'blur(10px)',
          padding: '0.55rem 1rem',
          fontSize: '0.65rem',
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          borderRadius: '4px 0 0 4px',
          cursor: 'pointer',
          boxShadow: '-4px 4px 12px rgba(0,0,0,0.4)',
        }}
      >
        GURUKKAL
      </motion.button>

      {/* Latest News */}
      <motion.button
        onClick={() => scrollTo('news')}
        whileHover={{ x: -8, backgroundColor: 'var(--color-gold)', color: '#0b0704' }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{
          backgroundColor: 'rgba(22, 13, 7, 0.92)',
          color: 'var(--color-gold)',
          border: '1px solid var(--color-gold-dim)',
          borderRight: 'none',
          backdropFilter: 'blur(10px)',
          padding: '0.55rem 1rem',
          fontSize: '0.65rem',
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          borderRadius: '4px 0 0 4px',
          cursor: 'pointer',
          boxShadow: '-4px 4px 12px rgba(0,0,0,0.4)',
        }}
      >
        NEWS
      </motion.button>
    </motion.aside>
  );
}
