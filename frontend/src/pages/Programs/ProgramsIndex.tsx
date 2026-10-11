import React from 'react';
import { Link } from 'react-router-dom';
import PROGRAMS_DATA from '../../data/programs';
import type { Program } from '../../types';

export default function ProgramsIndex() {
  return (
    <div style={{ padding: '6rem 1.5rem 4rem', backgroundColor: 'transparent' }}>
      <div className="max-w-7xl mx-auto">
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', color: 'var(--color-gold)', marginBottom: '2rem' }}>
          All Kalaripayattu Disciplines
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {PROGRAMS_DATA.map((p: Program) => (
            <div key={p.id} style={{ border: '1px solid var(--color-border)', padding: '1.5rem', borderRadius: '4px', backgroundColor: 'rgba(22,13,7,0.7)' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--color-gold)' }}>{p.title}</h2>
              <p style={{ color: 'var(--color-text-muted)', margin: '0.8rem 0' }}>{p.shortDescription}</p>
              <Link to={`/programs/${p.slug}`} style={{ color: 'var(--color-gold)', fontSize: '0.85rem' }}>Read Details →</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
