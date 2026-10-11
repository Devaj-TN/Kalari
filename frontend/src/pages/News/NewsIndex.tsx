import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useNews } from '../../hooks/useNews';
import ScrollReveal from '../../components/animation/ScrollReveal';
import StaggerReveal from '../../components/animation/StaggerReveal';
import { buildBreadcrumbJsonLd } from '../../lib/seo';

const CATEGORY_LABELS: Record<string, string> = {
  event: 'Event', workshop: 'Workshop', competition: 'Competition',
  media: 'Media', achievement: 'Achievement', announcement: 'Announcement',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function NewsIndex() {
  const { news } = useNews();
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'News', path: '/news' },
  ]);

  return (
    <>
      <Helmet>
        <title>News & Events — Kalari Academy | Kalaripayattu</title>
        <meta name="description" content="Latest news, events, workshops, and competitions from Kalari Academy. Stay updated on Kalaripayattu activities in Kerala." />
        <link rel="canonical" href="https://kalariacademy.in/news" />
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <section style={{ paddingTop: 'calc(var(--space-16) + 4rem)', paddingBottom: 'var(--space-12)', paddingLeft: '1.5rem', paddingRight: '1.5rem', backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', textAlign: 'center' }}>
        <ScrollReveal>
          <p className="section-label">News & Events</p>
          <div className="section-divider section-divider--center" />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, maxWidth: '600px', margin: '0 auto 1.5rem', lineHeight: 1.05 }}>
            From the <span style={{ color: 'var(--color-gold)' }}>Kalari</span>
          </h1>
        </ScrollReveal>
      </section>

      <section style={{ backgroundColor: 'var(--color-bg)', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
        <div className="max-w-7xl mx-auto">
          <StaggerReveal
            stagger={0.08}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5px', backgroundColor: 'var(--color-border)' }}
          >
            {news.map((post) => (
              <Link key={post.id} to={`/news/${post.slug}`} style={{ backgroundColor: 'var(--color-bg)', display: 'block' }} aria-label={post.title}>
                <article>
                  <div className="card-image-wrap" style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                    <img src={post.image} alt={post.imageAlt} width={640} height={360} loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.8rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 500 }}>
                        {CATEGORY_LABELS[post.category] ?? post.category}
                      </span>
                      <time dateTime={post.publishedAt} style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>
                        {formatDate(post.publishedAt)}
                      </time>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.7rem', color: 'var(--color-text)' }}>
                      {post.title}
                    </h2>
                    <p style={{ fontSize: '0.87rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{post.excerpt}</p>
                  </div>
                </article>
              </Link>
            ))}
          </StaggerReveal>
        </div>
      </section>
    </>
  );
}
