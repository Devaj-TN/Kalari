import { useEffect, useState } from 'react';

export default function BackgroundLayer() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        backgroundColor: '#111111', // Fallback color
        backgroundImage: `url("/images/page-texture-bg.jpg")`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        opacity: 1,
      }}
    >
      {/* Subtle vignette to darken the edges */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </div>
  );
}
