import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';

interface BidirectionalMarqueeProps {
  line1?: string;
  line2?: string;
  line3?: string;
}

export default function BidirectionalMarquee({
  line1 = 'Chosen Among Highly',
  line2 = 'Recommended',
  line3 = 'Kalari Academies',
}: BidirectionalMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  const x1 = useTransform(smoothProgress, [0, 1], shouldReduceMotion ? [0, 0] : [180, -180]);
  const x2 = useTransform(smoothProgress, [0, 1], shouldReduceMotion ? [0, 0] : [-80, 80]);
  const x3 = useTransform(smoothProgress, [0, 1], shouldReduceMotion ? [0, 0] : [220, -220]);

  const headingStyle: React.CSSProperties = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 'clamp(2.8rem, 6.8vw, 5.8rem)',
    fontWeight: 300,
    color: 'transparent',
    WebkitTextStroke: '1.4px rgba(255, 255, 255, 0.95)',
    lineHeight: 1.15,
    letterSpacing: '0.015em',
    textAlign: 'center',
    margin: 0,
    userSelect: 'none',
    whiteSpace: 'nowrap',
  };

  return (
    <section
      id="legacy"
      ref={containerRef}
      aria-label="Chosen Among Highly Recommended"
      style={{
        scrollMarginTop: '80px',
        padding: 'clamp(4rem, 8vw, 7rem) 1.5rem',
        overflow: 'hidden',
        position: 'relative',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.2rem',
        }}
      >
        {/* Line 1 (Glides Left) */}
        <motion.div
          style={{
            x: x1,
            willChange: 'transform',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <h2 style={headingStyle}>{line1}</h2>
        </motion.div>

        {/* Line 2 (Glides Right) */}
        <motion.div
          style={{
            x: x2,
            willChange: 'transform',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <h2 style={headingStyle}>{line2}</h2>
        </motion.div>

        {/* Line 3 (Glides Left) */}
        <motion.div
          style={{
            x: x3,
            willChange: 'transform',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <h2 style={headingStyle}>{line3}</h2>
        </motion.div>
      </div>
    </section>
  );
}
