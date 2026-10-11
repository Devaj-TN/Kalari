import type { SEOProps } from '../types';

const SITE_URL = 'https://madhurakandykalari.com';
const SITE_NAME = 'Madhurakandy C.V.N Kalari';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

export function buildPageTitle(title: string): string {
  if (title === SITE_NAME) return title;
  return `${title} | ${SITE_NAME}`;
}

export function buildCanonical(path: string): string {
  return `${SITE_URL}${path}`;
}

export function buildOgTags(props: SEOProps & { path: string }) {
  return {
    title: buildPageTitle(props.title),
    description: props.description,
    canonical: props.canonical ?? buildCanonical(props.path),
    ogImage: props.ogImage ?? DEFAULT_OG_IMAGE,
    ogType: props.ogType ?? 'website',
  };
}

// ─── JSON-LD Builders ─────────────────────────────────────────────────────────

export function buildLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: SITE_NAME,
    description:
      'Authentic Kalaripayattu training academy in Vengeri, Kozhikode offering traditional martial arts, body conditioning, weapons training, and Kalari Chikitsa healing.',
    url: SITE_URL,
    telephone: '+91 99471 39696',
    email: 'info@madhurakandykalari.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Madhura kandy, CVN KALARI, Vengeri',
      addressLocality: 'Kozhikode',
      addressRegion: 'Kerala',
      postalCode: '673010',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 11.2980,
      longitude: 75.7950,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '05:30',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '07:00',
        closes: '12:00',
      },
    ],
    sameAs: [
      'https://www.facebook.com/kalariacademy',
      'https://www.instagram.com/kalariacademy',
      'https://www.youtube.com/kalariacademy',
    ],
  };
}

export function buildCourseJsonLd(title: string, description: string, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: title,
    description,
    url: `${SITE_URL}/programs/${slug}`,
    provider: {
      '@type': 'EducationalOrganization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function buildBreadcrumbJsonLd(crumbs: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };
}

export function buildArticleJsonLd(opts: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  image: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    url: `${SITE_URL}/news/${opts.slug}`,
    datePublished: opts.publishedAt,
    image: opts.image,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  };
}
