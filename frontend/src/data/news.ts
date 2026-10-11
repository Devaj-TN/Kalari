import type { NewsPost } from '../types';

// Placeholder data — replace with Laravel API call in useNews() hook
const NEWS_DATA: NewsPost[] = [
  {
    id: '1',
    slug: 'national-kalaripayattu-championship-2024',
    title: 'Our Students Dominate National Kalaripayattu Championship',
    excerpt:
      'Kalari Academy students claim five gold medals and two silver medals at the 38th National Kalaripayattu Championship held in Thiruvananthapuram.',
    content: '',
    category: 'competition',
    publishedAt: '2024-11-15T09:00:00Z',
    image: '/images/news/national-championship-kalari-2024.jpg',
    imageAlt: 'Kalari Academy students receiving medals at the National Championship',
    tags: ['competition', 'championship', 'achievement', 'students'],
  },
  {
    id: '2',
    slug: 'gurukkal-featured-documentary-bbc',
    title: 'Gurukkal Featured in BBC Documentary on Living Martial Arts',
    excerpt:
      'Our founding Gurukkal, Santhosh Nair, was featured in a BBC World documentary exploring the last living masters of ancient Asian martial traditions.',
    content: '',
    category: 'media',
    publishedAt: '2024-10-02T12:00:00Z',
    image: '/images/news/gurukkal-bbc-documentary.jpg',
    imageAlt: 'Gurukkal Santhosh Nair demonstrating kalaripayattu for BBC documentary crew',
    tags: ['media', 'documentary', 'gurukkal', 'recognition'],
  },
  {
    id: '3',
    slug: 'summer-intensive-kalaripayattu-workshop-2025',
    title: 'Summer Intensive Workshop — Unarmed Combat & Marma',
    excerpt:
      'A five-day residential intensive workshop covering Verumkai (unarmed combat) and Marma therapy fundamentals, open to intermediate and advanced students.',
    content: '',
    category: 'workshop',
    publishedAt: '2025-04-20T08:00:00Z',
    image: '/images/news/summer-workshop-verumkai-2025.jpg',
    imageAlt: 'Students in a residential Kalaripayattu workshop',
    tags: ['workshop', 'verumkai', 'marma', 'residential'],
  },
  {
    id: '4',
    slug: 'kalaripayattu-cultural-festival-thrissur',
    title: 'Spectacular Demonstration at Thrissur Pooram Cultural Festival',
    excerpt:
      'Our performance troupe delivered a breathtaking Kalaripayattu demonstration to an audience of 40,000 at the Thrissur Pooram cultural ground.',
    content: '',
    category: 'event',
    publishedAt: '2025-05-08T18:00:00Z',
    image: '/images/news/thrissur-festival-demonstration.jpg',
    imageAlt: 'Kalaripayattu performers demonstrating urumi at Thrissur Pooram festival',
    tags: ['event', 'demonstration', 'festival', 'thrissur'],
  },
  {
    id: '5',
    slug: 'new-womens-self-defense-batch-2025',
    title: 'New Women\'s Self-Defense Batch Starting June 2025',
    excerpt:
      'Registrations now open for the next women-only Kalaripayattu self-defense batch — limited to 20 participants for personalized attention.',
    content: '',
    category: 'announcement',
    publishedAt: '2025-05-25T10:00:00Z',
    image: '/images/news/womens-batch-announcement-2025.jpg',
    imageAlt: 'Women in kalaripayattu self-defense training session',
    tags: ['announcement', 'womens', 'self-defense', 'enrollment'],
  },
  {
    id: '6',
    slug: 'kalari-chikitsa-clinic-inaugurated-kannur',
    title: 'New Kalari Chikitsa Clinic Inaugurated at Kannur Centre',
    excerpt:
      'Our Kannur branch now offers a fully-equipped Kalari Chikitsa healing clinic with dedicated treatment rooms and trained marma therapists.',
    content: '',
    category: 'announcement',
    publishedAt: '2025-03-10T11:00:00Z',
    image: '/images/news/chikitsa-clinic-inauguration-kannur.jpg',
    imageAlt: 'Inaugural ceremony of the Kalari Chikitsa clinic in Kannur',
    tags: ['announcement', 'chikitsa', 'therapy', 'kannur'],
  },
];

export default NEWS_DATA;
