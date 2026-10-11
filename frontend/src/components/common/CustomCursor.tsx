import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable custom cursor on non-touch devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.08,
        ease: 'power2.out',
      });

      gsap.to(ring, {
        x: mouseX,
        y: mouseY,
        duration: 0.28,
        ease: 'power2.out',
      });
    };

    const handleHoverStart = () => {
      gsap.to(ring, {
        scale: 1.8,
        backgroundColor: 'rgba(201, 147, 42, 0.15)',
        borderColor: 'var(--color-gold)',
        duration: 0.3,
      });
      gsap.to(dot, {
        scale: 0.5,
        backgroundColor: 'var(--color-kalari-red-light)',
        duration: 0.3,
      });
    };

    const handleHoverEnd = () => {
      gsap.to(ring, {
        scale: 1,
        backgroundColor: 'transparent',
        borderColor: 'rgba(201, 147, 42, 0.4)',
        duration: 0.3,
      });
      gsap.to(dot, {
        scale: 1,
        backgroundColor: 'var(--color-gold)',
        duration: 0.3,
      });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const attachHoverListeners = () => {
      const interactiveEls = document.querySelectorAll(
        'a, button, input, textarea, select, .case-study-name, .hover-target, .paragon-tilted-card, .menu-icon'
      );
      interactiveEls.forEach((el) => {
        el.addEventListener('mouseenter', handleHoverStart);
        el.addEventListener('mouseleave', handleHoverEnd);
      });
    };

    attachHoverListeners();
    const observer = new MutationObserver(attachHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Inner Dot */}
      <div
        id="cursor"
        ref={cursorDotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-gold)',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          transition: 'opacity 0.2s',
        }}
      />
      {/* Outer Ring */}
      <div
        id="cursor2"
        ref={cursorRingRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '1px solid rgba(201, 147, 42, 0.4)',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-50%, -50%)',
          transition: 'border-color 0.2s',
        }}
      />
    </>
  );
}
