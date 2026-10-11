import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenisInstance: Lenis | null = null;

export function useLenis() {
  const initialized = useRef(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || initialized.current) return;

    initialized.current = true;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    lenisInstance = lenis;

    // Sync Lenis to GSAP ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Let ScrollTrigger know when scroll happens
    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      lenis.destroy();
      lenisInstance = null;
      initialized.current = false;
    };
  }, []);

  return lenisInstance;
}

export function getLenis() {
  return lenisInstance;
}
