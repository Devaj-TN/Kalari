import { Helmet } from 'react-helmet-async';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  breadcrumbs?: BreadcrumbItem[];
  noindex?: boolean;
}

export default function SEO({
  title = 'Madhurakandy C.V.N Kalari — Kalaripayattu Martial Arts & Healing, Kozhikode',
  description = 'Official Madhurakandy C.V.N Kalari, Vengeri, Kozhikode. Experience authentic Vadakkan Kalaripayattu training and healing. Courses in Meythari, Kolthari, Ankathari & Marma Chikitsa in Kozhikode, Kerala.',
  canonical = 'https://madhurakandykalari.com/',
  image = 'https://madhurakandykalari.com/images/og-cover.jpg',
  type = 'website',
  breadcrumbs,
  noindex = false,
}: SEOProps) {
  // Schema.org JSON-LD Structured Data for Google Indexing & Local SEO
  const localBusinessData = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: 'Madhurakandy C.V.N Kalari',
    alternateName: 'Madhurakandy CVN Kalari Vengeri Kozhikode',
    description: description,
    url: canonical,
    image: image,
    telephone: '+919947139696',
    priceRange: '$$',
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
      latitude: '11.2980',
      longitude: '75.7950',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '48',
    },
    founder: {
      '@type': 'Person',
      name: 'Gurukkal',
      jobTitle: 'Chief Martial Instructor & Master',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Kalaripayattu Programs',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Meythari — Body Control & Flexibility Training',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Kolthari — Wooden Weaponry Mastery',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Ankathari — Metal Weapon Combat & Urumi',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Dhanwanthari Marma Chikitsa — Traditional Healing',
          },
        },
      ],
    },
  };

  const breadcrumbData = breadcrumbs && breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  } : null;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* OpenGraph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Madhurakandy C.V.N Kalari" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Google Schema.org JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(localBusinessData)}</script>
      {breadcrumbData && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbData)}</script>
      )}
    </Helmet>
  );
}
