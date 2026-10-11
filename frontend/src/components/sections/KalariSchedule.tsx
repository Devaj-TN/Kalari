import { useState, useEffect } from 'react';
import ScrollReveal from '../animation/ScrollReveal';
import { kalariService, KalariSchedule as ISchedule } from '../../services/kalariService';

export default function KalariSchedule() {
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [filterDay, setFilterDay] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    kalariService.getSchedules().then((data) => {
      if (mounted) {
        setSchedules(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const days = ['All', 'Monday to Saturday', 'Monday to Friday', 'Sunday'];

  const filtered =
    filterDay === 'All'
      ? schedules
      : schedules.filter((s) => s.day_of_week.toLowerCase().includes(filterDay.toLowerCase()));

  return (
    <section
      id="schedule"
      aria-labelledby="schedule-heading"
      style={{
        padding: 'clamp(4rem, 8vw, 7rem) 1.5rem',
        backgroundColor: '#0c0805',
        position: 'relative',
        borderTop: '1px solid rgba(201, 147, 42, 0.15)',
        borderBottom: '1px solid rgba(201, 147, 42, 0.15)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <ScrollReveal>
            <p className="section-tag">DAILY TIMETABLE & SLOTS</p>
            <h2 id="schedule-heading" style={{ lineHeight: 1.15 }}>
              <span className="kalari-heading-sans" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', display: 'block' }}>
                DAILY TRAINING SCHEDULE
              </span>
              <span className="kalari-heading-serif" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', display: 'block', marginTop: '-0.3rem' }}>
                Dawn to Dusk at Kuzhi Kalari
              </span>
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.95rem',
                color: 'var(--color-text-muted)',
                maxWidth: '680px',
                margin: '1.2rem auto 0',
                lineHeight: 1.7,
              }}
            >
              Training follows the traditional biorhythms of sunrise (Brahmamuhurtham) and sunset. All classes take place in our sunken, red-earth arena.
            </p>
          </ScrollReveal>

          {/* Day Filters */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '0.6rem',
              marginTop: '2rem',
            }}
          >
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setFilterDay(day)}
                style={{
                  backgroundColor: filterDay === day ? 'var(--color-gold)' : 'rgba(22, 13, 7, 0.8)',
                  color: filterDay === day ? '#0a0705' : 'var(--color-text-muted)',
                  border: filterDay === day ? '1px solid var(--color-gold)' : '1px solid var(--color-border)',
                  padding: '0.5rem 1.1rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  transition: 'all 0.25s var(--ease-smooth)',
                }}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Timetable Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-gold)' }}>
            Loading Training Schedule…
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filtered.map((item, idx) => (
              <ScrollReveal key={item.id} delay={idx * 0.08}>
                <div
                  style={{
                    backgroundColor: 'rgba(20, 13, 8, 0.85)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                    padding: '1.8rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'border-color 0.3s, transform 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-gold)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div>
                    {/* Time Slot & Day */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '0.8rem' }}>
                      <span
                        style={{
                          backgroundColor: 'rgba(201, 147, 42, 0.15)',
                          color: 'var(--color-gold)',
                          border: '1px solid var(--color-gold-dim)',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '3px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                        }}
                      >
                        ⏱ {item.time_slot}
                      </span>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          color: 'var(--color-text-dim)',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                        }}
                      >
                        {item.day_of_week}
                      </span>
                    </div>

                    {/* Session Name */}
                    <h3
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.35rem',
                        color: 'var(--color-text)',
                        marginBottom: '0.6rem',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.session_name}
                    </h3>

                    {/* Level & Instructor */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.8rem', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                      <div>
                        <span style={{ color: 'var(--color-gold)', fontWeight: 600 }}>Level:</span> {item.level}
                      </div>
                      <div>
                        <span style={{ color: 'var(--color-gold)', fontWeight: 600 }}>Master / Instructor:</span> {item.instructor}
                      </div>
                      <div>
                        <span style={{ color: 'var(--color-gold)', fontWeight: 600 }}>Arena:</span> {item.location}
                      </div>
                    </div>
                  </div>

                  {/* Fee Note / Direct Dial */}
                  <div
                    style={{
                      marginTop: '1.4rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', letterSpacing: '0.04em' }}>
                      Vengeri Kuzhi Kalari
                    </span>
                    <a
                      href="tel:+919947139696"
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--color-text)',
                        textDecoration: 'none',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
                    >
                      Join Batch (+91 99471 39696) →
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
