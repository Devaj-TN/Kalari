import { motion, useScroll, useSpring } from 'motion/react';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        backgroundColor: 'var(--color-kalari-red)',
        backgroundImage: 'linear-gradient(90deg, #861212 0%, #e03036 50%, #d4af37 100%)',
        transformOrigin: '0%',
        scaleX,
        zIndex: 9999,
        pointerEvents: 'none',
        boxShadow: '0 0 10px rgba(224, 48, 54, 0.7), 0 0 20px rgba(212, 175, 55, 0.4)',
      }}
    />
  );
}
