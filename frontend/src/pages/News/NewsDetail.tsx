import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useNewsBySlug } from '../../hooks/useNews';
import ScrollReveal from '../../components/animation/ScrollReveal';
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from '../../lib/seo';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const post = useNewsBySlug(slug ?? '');

  if (!post) return <Navigate to="/news" replace />;

  const articleJsonLd = buildArticleJsonLd({ title: post.title, description: post.excerpt, slug: post.slug, publishedAt: post.publishedAt, image: post.image });
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'News', path: '/news' },
    { name: post.title, path: `/news/${post.slug}` },
  ]);

  return (
    <>
      <Helmet>
        <title>{post.title} | Kalari Academy</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://kalariacademy.in/news/${post.slug}`} />
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <section aria-label="Article hero" style={{ position: 'relative', height: 'clamp(45vh, 60vh, 70vh)', overflow: 'hidden' }}>
        <img src={post.image} alt={post.imageAlt} width={1920} height={1080} loading="eager" fetchPriority="high"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,8,0,0.9) 0%, rgba(14,8,0,0.3) 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: 'clamp(2rem, 5vh, 4rem)', left: 'clamp(1.5rem, 5vw, 5rem)', right: 'clamp(1.5rem, 5vw, 5rem)' }}>
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1rem' }}>
            <ol style={{ listStyle: 'none', display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              <li><Link to="/" style={{ color: 'var(--color-text-muted)' }}>Home</Link></li>
              <li>/</li>
              <li><Link to="/news" style={{ color: 'var(--color-text-muted)' }}>News</Link></li>
            </ol>
          </nav>
          <time dateTime={post.publishedAt} style={{ fontSize: '0.8rem', color: 'var(--color-gold)', letterSpacing: '0.1em', display: 'block', marginBottom: '0.8rem' }}>
            {formatDate(post.publishedAt)}
          </time>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', fontWeight: 700, lineHeight: 1.1, color: 'var(--color-text)', maxWidth: '800px' }}>
            {post.title}
          </h1>
        </div>
      </section>

      <section style={{ backgroundColor: 'var(--color-bg)', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.9, marginBottom: '2rem', fontStyle: 'italic' }}>{post.excerpt}</p>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.9 }}>
              {post.content || 'Full article content will be available once the Laravel CMS backend is connected. This is a placeholder for the article body.'}
            </p>
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
              <Link to="/news" className="btn btn-ghost">
                ← Back to News
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
