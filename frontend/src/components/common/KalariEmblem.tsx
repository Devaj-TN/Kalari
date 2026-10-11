import React from 'react';

interface KalariEmblemProps {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export default function KalariEmblem({
  size = 140,
  className = '',
  style = {},
}: KalariEmblemProps) {
  return (
    <div
      className={`kalari-emblem-wrap ${className}`}
      style={{
        width: size,
        height: 'auto',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        flexShrink: 0,
        ...style,
      }}
    >
      <img
        src="/logo.png"
        alt="Madhurakandy C.V.N Kalari — Calicut, India"
        draggable={false}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          objectFit: 'contain',
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  );
}

