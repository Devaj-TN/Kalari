import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PROGRAMS_DATA from '../../data/programs';

export default function ProgramDetail() {
  const { slug } = useParams<{ slug: string }>();
  const program = PROGRAMS_DATA.find((p) => p.slug === slug) || PROGRAMS_DATA[0];

  return (
    <div style={{ padding: '6rem 1.5rem 4rem', backgroundColor: 'transparent' }}>
      <div className="max-w-4xl mx-auto">
        <Link to="/programs" style={{ color: 'var(--color-gold)', fontSize: '0.85rem' }}>← Back to Programs</Link>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', color: 'var(--color-gold)', margin: '1rem 0' }}>
          {program.title}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', lineHeight: 1.8 }}>
          {program.fullDescription}
        </p>
      </div>
    </div>
  );
}
