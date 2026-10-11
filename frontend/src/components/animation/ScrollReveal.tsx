import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  type?: 'fade-up' | 'clip-reveal' | 'scale-up';
  style?: React.CSSProperties;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.7,
  y = 35,
  once = true,
  type = 'fade-up',
  style,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  if (type === 'clip-reveal') {
    return (
      <motion.div
        className={className}
        style={{ ...style, overflow: 'hidden' }}
        initial={{ clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, y: 20 }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, y: 0 }}
        viewport={{ once, amount: 0.15 }}
        transition={{
          duration: duration * 1.15,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    );
  }

  if (type === 'scale-up') {
    return (
      <motion.div
        className={className}
        style={style}
        initial={{ opacity: 0, scale: 0.94, y: y * 0.5 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once, amount: 0.2 }}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    );
  }

  // Standard fade-up
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
