import { Link } from 'react-router-dom';
import { useNews } from '../../hooks/useNews';
import ScrollReveal from '../animation/ScrollReveal';
import StaggerReveal from '../animation/StaggerReveal';

const CATEGORY_LABELS: Record<string, string> = {
  event: 'Event',
  workshop: 'Workshop',
  competition: 'Competition',
  media: 'Media',
  achievement: 'Achievement',
  announcement: 'Announcement',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function NewsGrid() {
  const { news } = useNews();
  const displayed = news.slice(0, 4);

  return (
    <section
      aria-labelledby="news-heading"
      style={{ backgroundColor: 'var(--color-surface)', padding: 'clamp(5rem, 10vw, 9rem) 1.5rem' }}
    >
      <div className="max-w-7xl mx-auto">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem', marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
          <div>
            <ScrollReveal>
              <p className="section-label">News & Events</p>
              <div className="section-divider" />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2 id="news-heading" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700 }}>
                Latest from the <span style={{ color: 'var(--color-gold)' }}>Kalari</span>
              </h2>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={0.2}>
            <Link to="/news" className="btn btn-ghost">
              All News
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </ScrollReveal>
        </div>

        <StaggerReveal
          stagger={0.09}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5px',
            backgroundColor: 'var(--color-border)',
          }}
        >
          {displayed.map((post) => (
            <Link
              key={post.id}
              to={`/news/${post.slug}`}
              style={{ backgroundColor: 'var(--color-surface)', display: 'block', textDecoration: 'none' }}
              aria-label={post.title}
            >
              <article>
                <div className="card-image-wrap" style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                  <img
                    src={post.image}
                    alt={post.imageAlt}
                    width={640}
                    height={360}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ padding: '1.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 500 }}>
                      {CATEGORY_LABELS[post.category] ?? post.category}
                    </span>
                    <time dateTime={post.publishedAt} style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>
                      {formatDate(post.publishedAt)}
                    </time>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.7rem', color: 'var(--color-text)' }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: '0.87rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                    {post.excerpt.slice(0, 100)}…
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
