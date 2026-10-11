import { useState, useRef, useEffect } from 'react';

export default function SoundToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const startSound = async () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
      masterGain.connect(ctx.destination);

      // Play soft ambient drone with harmonic bowl frequencies
      const freqs = [108, 216, 432];
      const activeOscs: OscillatorNode[] = [];

      freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        g.gain.setValueAtTime(0.04, ctx.currentTime);
        osc.connect(g);
        g.connect(masterGain);
        osc.start();
        activeOscs.push(osc);
      });

      oscillatorsRef.current = activeOscs;
      setIsPlaying(true);
    } catch (e) {
      console.warn('AudioContext playback prevented by browser policy:', e);
      setIsPlaying(false);
    }
  };

  const stopSound = () => {
    try {
      oscillatorsRef.current.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // Ignore if already stopped
        }
      });
      oscillatorsRef.current = [];

      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch (e) {
      console.warn('Error stopping sound:', e);
    }
    setIsPlaying(false);
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopSound();
    } else {
      startSound();
    }
  };

  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);

  return (
    <button
      onClick={toggleSound}
      aria-label={isPlaying ? 'Mute ambient sound' : 'Play ambient Kalari sound'}
      title={isPlaying ? 'Mute Ambiance' : 'Play Kalari Ambiance'}
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '2rem',
        zIndex: 90,
        backgroundColor: 'rgba(22, 13, 7, 0.85)',
        border: '1px solid var(--color-border)',
        borderRadius: '30px',
        padding: '0.6rem 1.1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        color: isPlaying ? 'var(--color-gold)' : 'var(--color-text-muted)',
        fontSize: '0.72rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        backdropFilter: 'blur(12px)',
        cursor: 'pointer',
        transition: 'all 0.3s var(--ease-smooth)',
        boxShadow: isPlaying ? '0 0 15px rgba(201, 147, 42, 0.2)' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '14px' }}>
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            style={{
              width: '2px',
              height: isPlaying ? `${Math.sin(i * 1.5) * 6 + 10}px` : '4px',
              backgroundColor: isPlaying ? 'var(--color-gold)' : 'var(--color-text-dim)',
              transition: 'height 0.2s ease',
              animation: isPlaying ? `soundWave 0.8s ease-in-out infinite alternate ${i * 0.15}s` : 'none',
            }}
          />
        ))}
      </div>
      <span>{isPlaying ? 'Sound On' : 'Sound Off'}</span>
      <style>{`
        @keyframes soundWave {
          0% { height: 4px; }
          100% { height: 14px; }
        }
      `}</style>
    </button>
  );
}
