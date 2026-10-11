import { Helmet } from 'react-helmet-async';
import ContactForm from '../components/sections/ContactForm';
import BranchesList from '../components/sections/BranchesList';
import ScrollReveal from '../components/animation/ScrollReveal';
import { buildLocalBusinessJsonLd, buildBreadcrumbJsonLd } from '../lib/seo';

export default function Contact() {
  const jsonLd = buildLocalBusinessJsonLd();
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ]);

  return (
    <>
      <Helmet>
        <title>Contact & Enrollment — Kalari Academy | Kalaripayattu Classes</title>
        <meta name="description" content="Enroll in Kalaripayattu classes at Kalari Academy. Contact us for a free trial class. Centres in Kozhikode, Thrissur & Kannur, Kerala." />
        <link rel="canonical" href="https://kalariacademy.in/contact" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <section style={{ paddingTop: 'calc(var(--space-16) + 4rem)', paddingBottom: 'var(--space-12)', paddingLeft: '1.5rem', paddingRight: '1.5rem', backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', textAlign: 'center' }}>
        <ScrollReveal>
          <p className="section-label">Enrollment & Contact</p>
          <div className="section-divider section-divider--center" />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, maxWidth: '600px', margin: '0 auto 1.5rem', lineHeight: 1.05 }}>
            Take Your First <span style={{ color: 'var(--color-gold)' }}>Step</span>
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.8 }}>
            Book a free trial class. No prior experience required. Just show up, and let the Kalari do the rest.
          </p>
        </ScrollReveal>
      </section>

      <ContactForm />
      <BranchesList />
    </>
  );
}
