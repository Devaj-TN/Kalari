import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';

const STATS = [
  { value: 37, suffix: '+', label: 'Years of Tradition' },
  { value: 2800, suffix: '+', label: 'Students Trained' },
  { value: 3, suffix: '', label: 'Training Centres' },
  { value: 12, suffix: '+', label: 'National Champions' },
];

function CountStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const numRef = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        if (triggered.current) return;
        triggered.current = true;
        if (prefersReduced) {
          el.textContent = value.toLocaleString();
          return;
        }
        // Use a proxy object — NOT fromTo on a plain object literal
        const proxy = { val: 0 };
        gsap.to(proxy, {
          val: value,
          duration: 2,
          ease: 'power2.out',
          onUpdate() {
            if (el) el.textContent = Math.round(proxy.val).toLocaleString();
          },
          onComplete() {
            if (el) el.textContent = value.toLocaleString();
          },
        });
      },
    });

    return () => trigger.kill();
  }, [value]);

  return (
    <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
      <div className="stat-number">
        <span ref={numRef}>0</span>
        <span>{suffix}</span>
      </div>
      <p style={{
        marginTop: '0.6rem',
        fontSize: '0.78rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'var(--color-text-muted)',
      }}>
        {label}
      </p>
    </div>
  );
}

export default function StatsStrip() {
  return (
    <section
      aria-label="Academy achievements"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div
        className="max-w-7xl mx-auto"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        }}
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              borderRight: i < STATS.length - 1 ? '1px solid var(--color-border)' : 'none',
            }}
          >
            <CountStat {...stat} />
          </div>
        ))}
      </div>
    </section>
  );
}
