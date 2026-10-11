import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';

interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function ParallaxImage({ src, alt, speed = 0.5, className = '', style = {} }: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current) return;

    // Reset transform before calculating
    gsap.set(imageRef.current, { y: 0 });

    const tl = gsap.to(imageRef.current, {
      y: () => `${speed * 100}px`,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      tl.kill();
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={`parallax-container ${className}`}
      style={{ overflow: 'hidden', position: 'relative', ...style }}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: `calc(100% + ${Math.abs(speed * 100)}px)`,
          objectFit: 'cover',
          position: 'absolute',
          top: speed < 0 ? 0 : `-${speed * 100}px`,
          left: 0,
        }}
      />
    </div>
  );
}
