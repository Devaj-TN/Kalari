import { supabase, isSupabaseConfigured } from '../lib/supabase';

// ─── Data Interfaces ──────────────────────────────────────────────────────────

export interface KalariInquiry {
  id: string;
  type: 'batch' | 'treatment' | 'general';
  name: string;
  age: string;
  phone: string;
  details: string; // e.g. "Morning Batch (05:30 AM - 07:00 AM)" or "Back Pain / Joint Relief"
  message?: string;
  status: 'new' | 'contacted' | 'completed';
  created_at: string;
}

export interface KalariBatch {
  id: string;
  title: string;
  age_group: string;
  level: string;
  schedule: string;
  timing: string;
  fee_details?: string;
  status: 'open' | 'filling_fast' | 'closed';
  max_capacity?: number;
  highlights?: string[];
  photo_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface KalariSchedule {
  id: string;
  day_of_week: string;
  time_slot: string;
  session_name: string;
  instructor: string;
  location: string;
  level: string;
  fee_note?: string;
  created_at?: string;
}

export interface KalariCourse {
  id: string;
  title: string;
  level: string;
  badge: string;
  summary: string;
  description: string;
  highlights: string[];
  photo_url: string;
  display_order: number;
}

export interface KalariTreatmentData {
  title: string;
  badge: string;
  tagline: string;
  subtitle: string;
  description: string;
  photo_url: string;
  highlights: string[];
  timing_info: string;
}

export interface KalariNewsItem {
  id: string;
  title: string;
  tag: string;
  date: string;
  summary: string;
  image_url?: string;
  is_featured?: boolean;
}

export interface KalariGalleryItem {
  id: string;
  title: string;
  category?: string;
  media_type: 'image' | 'video';
  url: string;
  thumbnail_url?: string;
  caption?: string;
  display_order: number;
  created_at?: string;
}

export interface KalariHeroSlide {
  id: string;
  titleLine1: string;
  titleLine2: string;
  titleItalic: string;
  desc: string;
  badgeNum: string;
  badgeText: string;
  image: string;
  display_order?: number;
}

export interface KalariContactSettings {
  id?: string;
  primary_phone: string;
  secondary_phone: string;
  whatsapp: string;
  email: string;
  primary_location: string;
  full_address: string;
  map_embed_url: string;
  updated_at?: string;
}

export interface KalariSiteContent {
  marquee_line1: string;
  marquee_line2: string;
  marquee_line3: string;
  hero_title_1: string;
  hero_title_2: string;
  hero_tag: string;
  hero_bg_image: string;
  home_about_tag: string;
  home_about_heading: string;
  home_about_lead: string;
  home_about_body: string;
  home_about_photo: string;
  about_page_tag: string;
  about_page_title: string;
  about_page_lead: string;
  about_page_full_story: string;
  about_page_photo: string;
  home_guru_tag: string;
  home_guru_title: string;
  home_guru_subtitle: string;
  home_guru_bio: string;
  home_guru_image: string;
  guru_page_title: string;
  guru_page_subtitle: string;
  guru_page_full_bio: string;
  guru_page_image: string;
}

export interface KalariAnnouncement {
  id: string;
  title: string;
  tag: string;
  content: string;
  published_date: string;
  is_active: boolean;
  created_at?: string;
}

// ─── Default Seed Stores ──────────────────────────────────────────────────────

const SEED_BATCHES: KalariBatch[] = [
  {
    id: 'batch-1',
    title: 'Morning Batch',
    age_group: 'All Ages (8+)',
    level: 'All Levels',
    schedule: 'Mon / Tue / Wed / Fri / Sat',
    timing: '05:30 AM - 07:00 AM',
    fee_details: '₹2,500 / month',
    status: 'open',
    max_capacity: 20,
    highlights: [
      'Brahmamuhurtham Meythari, high kicks & agility',
      'Mon / Tue / Wed / Fri / Sat (05:30 AM – 07:00 AM)',
      'Open for all age groups (8+) & all skill levels',
    ],
  },
  {
    id: 'batch-2',
    title: 'Evening Batch',
    age_group: 'All Ages (8+)',
    level: 'All Levels',
    schedule: 'Mon / Tue / Wed / Fri / Sat',
    timing: '05:30 PM - 07:00 PM',
    fee_details: '₹2,500 / month',
    status: 'open',
    max_capacity: 20,
    highlights: [
      'Warrior stances, weapon drills & body control',
      'Mon / Tue / Wed / Fri / Sat (05:30 PM – 07:00 PM)',
      'Ideal for students & working professionals',
    ],
  },
];

const SEED_COURSES: KalariCourse[] = [
  {
    id: 'service-1',
    title: 'Kalarippayattu Training',
    level: 'TRAINING',
    badge: 'DAILY BATCHES',
    summary: 'Traditional Kuzhi Kalari training for all skill levels & age groups',
    description: 'Comprehensive training in traditional Northern style (Vadakkan) Kalaripayattu, covering Meythari (body conditioning), Kolthari (wooden weapons), Ankathari (metal weapons), and Verumkai (unarmed combat).',
    highlights: [
      'Meythari, Kolthari & Ankathari',
      'Morning & Evening daily batches',
      'Open to all age groups & fitness levels',
    ],
    photo_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
    display_order: 1,
  },
  {
    id: 'service-2',
    title: 'Kalaripayattu Workshop',
    level: 'WORKSHOP',
    badge: 'INTENSIVE SESSIONS',
    summary: 'Short-term intensive workshops for martial artists, dancers & actors',
    description: 'Specialized masterclasses and corporate or institutional workshops focused on breath control, animal stances, flexibility, reflexes, and foundational martial movement.',
    highlights: [
      'Weekend & masterclass formats',
      'Custom corporate & school modules',
      'Flexibility & movement dynamics',
    ],
    photo_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    display_order: 2,
  },
  {
    id: 'service-3',
    title: 'Kalaripayattu Stage Shows',
    level: 'STAGE SHOW',
    badge: 'LIVE PERFORMANCE',
    summary: 'Dynamic live demonstrations, weapon combat & cultural performances',
    description: 'Breathtaking high-energy stage performances featuring synchronized empty-hand duels, spinning staff battles, sword & shield combat, and spectacular flexible blade (Urumi) demonstrations for festivals, cultural summits, and international events.',
    highlights: [
      'Acrobatic weapon duels & Urumi',
      'Cultural festivals & mega events',
      'Elite senior warrior performers',
    ],
    photo_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    display_order: 3,
  },
  {
    id: 'service-4',
    title: 'Ayurveda & Kalari Marma Massage Treatment',
    level: 'TREATMENT',
    badge: 'MARMA CHIKITSA',
    summary: 'Ancient Marma therapy, joint alignment & therapeutic herbal oil massage',
    description: 'Authentic Kalari Marma Chikitsa and traditional Uzhichil body treatment under Gurukkal diagnosis for spine & disc alignment, sports injuries, nervous vigor, and deep physical rejuvenation.',
    highlights: [
      'Traditional Marma & spine care',
      'Herbal oil Uzhichil massage',
      'By Gurukkal appointment',
    ],
    photo_url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop',
    display_order: 4,
  },
  {
    id: 'service-5',
    title: 'Action Choreography for movies',
    level: 'CHOREOGRAPHY',
    badge: 'CINEMA & STUNT',
    summary: 'Professional fight direction, weapon stunts & screen combat coordination',
    description: 'Custom martial combat choreography and stunt coordination for feature films, theatre productions, and music videos, blending authentic ancient techniques with cinematic screen impact.',
    highlights: [
      'Authentic movie fight direction',
      'Actor training & stunt coaching',
      'Weaponry & cinematic combat',
    ],
    photo_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
    display_order: 5,
  },
];

const SEED_TREATMENT: KalariTreatmentData = {
  title: 'Traditional Kalari Treatment',
  badge: 'KALARI TREATMENT',
  tagline: 'Healing',
  subtitle: '🌿 Traditional Pain Relief & Body Care • By Prior Appointment',
  description: 'Ancient Ayurvedic Marma Chikitsa and musculoskeletal healing under Gurukkal diagnosis.',
  photo_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop',
  highlights: [
    'Spine & Joint Alignment — Disc compression, chronic back pain & sciatica relief',
    'Sports & Musculoskeletal Care — Sprains, tendon strains & joint recovery',
    'Traditional Kalari Uzhichil — Deep herbal oil massage for nerve & muscle vigor',
    'Sacred Dhanwanthari Lineage — Direct diagnostic care & therapy under Gurukkal',
  ],
  timing_info: 'By Prior Appointment',
};

const SEED_GALLERY: KalariGalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Gaja Vadivu (Sacred Elephant Stance)',
    category: 'Meythari',
    media_type: 'image',
    url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
    thumbnail_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop',
    caption: 'Student demonstrating deep grounded stability and core power in the Kuzhi Kalari arena.',
    display_order: 1,
  },
  {
    id: 'gal-2',
    title: 'Urumi Flexible Blade Demonstration',
    category: 'Ankathari',
    media_type: 'image',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    thumbnail_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop',
    caption: 'The legendary ribbon blade whipped at high velocity to defend against multiple armed assailants.',
    display_order: 2,
  },
  {
    id: 'gal-3',
    title: 'Poothara Altar & Sacred Oil Lamp',
    category: 'Rituals',
    media_type: 'image',
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
    thumbnail_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400&auto=format&fit=crop',
    caption: 'The seven-tier step altar honoring the 21 master lineages of Kalaripayattu.',
    display_order: 3,
  },
  {
    id: 'gal-4',
    title: 'Kettukari 12-Foot Staff Combat',
    category: 'Kolthari',
    media_type: 'image',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    thumbnail_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop',
    caption: 'Long range wooden weapon sparring developing lightning arm speed and footwork coordination.',
    display_order: 4,
  },
  {
    id: 'gal-5',
    title: 'Simha Vadivu (Lion Stance) Agility',
    category: 'Meythari',
    media_type: 'image',
    url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
    thumbnail_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop',
    caption: 'Explosive vertical jumps and feline landing mechanics in traditional Kalari soil.',
    display_order: 5,
  },
  {
    id: 'gal-6',
    title: 'Chief Gurukkal Lineage Instruction',
    category: 'Gurukkals',
    media_type: 'image',
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
    thumbnail_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400&auto=format&fit=crop',
    caption: 'Gurukkal guiding disciples in authentic Vadakkan traditions.',
    display_order: 6,
  },
];

export const SEED_HERO_SLIDES: KalariHeroSlide[] = [
  {
    id: 'slide-1',
    titleLine1: 'Creating a',
    titleLine2: 'Martial Symphony',
    titleItalic: 'for You',
    desc: 'With an enviable martial heritage rooted in Kozhikode, Madhurakandy C.V.N Kalari sets the standard in authentic Kalaripayattu and healing science.',
    badgeNum: '5.0★',
    badgeText: 'RATED\nCVN\nKALARI',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1920&auto=format&fit=crop',
    display_order: 1,
  },
  {
    id: 'slide-2',
    titleLine1: 'Savor the',
    titleLine2: 'True Spirit of',
    titleItalic: 'Ancient Malabar',
    desc: 'Immerse in authentic Vadakkan lineage training and sacred Kuzhi Kalari mud arena practice at Madhurakandy C.V.N Kalari, Vengeri.',
    badgeNum: '08',
    badgeText: 'SACRED\nANIMAL\nPOSES',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1920&auto=format&fit=crop',
    display_order: 2,
  },
  {
    id: 'slide-3',
    titleLine1: 'Master the',
    titleLine2: 'Sacred Steel on',
    titleItalic: 'Your Path',
    desc: 'Master traditional wooden and metal weaponry with authentic Vadakkan techniques under dedicated Gurukkal guidance.',
    badgeNum: '04',
    badgeText: 'SACRED\nWEAPON\nSTAGES',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1920&auto=format&fit=crop',
    display_order: 3,
  },
  {
    id: 'slide-4',
    titleLine1: 'Experience a',
    titleLine2: 'Martial Excellence',
    titleItalic: 'at its Finest',
    desc: 'Immerse in warrior discipline, breath control, and core agility in our traditional Kozhikode Kuzhi Kalari setting.',
    badgeNum: 'DAILY',
    badgeText: 'TRAINING\nBATCHES\nOPEN',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1920&auto=format&fit=crop',
    display_order: 4,
  },
  {
    id: 'slide-5',
    titleLine1: 'Ancient Healing',
    titleLine2: 'Moments That',
    titleItalic: 'Restore Life',
    desc: 'With ancient Ayurvedic Marma Chikitsa and therapeutic joint realignment that have healed warriors for generations.',
    badgeNum: '108',
    badgeText: 'VITAL\nMARMA\nPOINTS',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1920&auto=format&fit=crop',
    display_order: 5,
  },
  {
    id: 'slide-6',
    titleLine1: 'Discover',
    titleLine2: 'Our Unique',
    titleItalic: 'Living Art',
    desc: 'From high kicks to weapon dexterity, awaken the warrior within through the consecrated tradition of CVN Kalari.',
    badgeNum: 'VADAKKAN',
    badgeText: 'HERITAGE\nLINEAGE\nESTD',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1920&auto=format&fit=crop',
    display_order: 6,
  },
];

const SEED_NEWS: KalariNewsItem[] = [
  {
    id: 'news-1',
    title: 'New Term Admissions Open at Vengeri',
    tag: 'ADMISSIONS',
    date: '2026-08-20',
    summary: 'New morning and evening batches for Meythari & Kolthari starting this month at Madhurakandy C.V.N Kalari, Vengeri, Kozhikode.',
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
    is_featured: true,
  },
  {
    id: 'news-2',
    title: 'Traditional Kalari Treatment & Consultation Sessions',
    tag: 'TREATMENT',
    date: '2026-08-18',
    summary: 'Traditional Ayurvedic Marma massage and Kalari healing sessions available by prior appointment under Gurukkal guidance.',
    image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    is_featured: false,
  },
  {
    id: 'news-3',
    title: 'Kalaripayattu Demonstration & Cultural Showcase',
    tag: 'EVENTS',
    date: '2026-08-10',
    summary: 'Senior disciples showcased high-speed Urumi and staff combat routines during the annual Kozhikode cultural festival.',
    image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    is_featured: false,
  },
];

const SEED_CONTACT_SETTINGS: KalariContactSettings = {
  primary_phone: '+91 99471 39696',
  secondary_phone: '099471 39696',
  whatsapp: '+91 99471 39696',
  email: 'info@madhurakandykalari.com',
  primary_location: 'Madhurakandy C.V.N Kalari',
  full_address: 'Madhura kandy, CVN KALARI, Vengeri, Kozhikode, Kerala 673010',
  map_embed_url:
    'https://maps.google.com/maps?q=Madhura+kandy+CVN+KALARI+Vengeri+Kozhikode+Kerala+673010&t=&z=15&ie=UTF8&iwloc=&output=embed',
};

const SEED_SITE_CONTENT: KalariSiteContent = {
  marquee_line1: 'A Legacy',
  marquee_line2: 'of',
  marquee_line3: 'Kalaripayattu',
  hero_title_1: 'THE SACRED ART OF',
  hero_title_2: 'KALARIPAYATTU',
  hero_tag: 'MADHURAKANDY C.V.N KALARI',
  hero_bg_image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1600&auto=format&fit=crop',

  // Homepage About section snippet
  home_about_tag: 'ABOUT MADHURAKANDY C.V.N KALARI',
  home_about_heading: 'The Sacred Tradition of CVN Kalaripayattu',
  home_about_lead: 'Located in Vengeri, Kozhikode, Madhurakandy C.V.N Kalari upholds the renowned Northern tradition (Vadakkan Sampradayam) of Kalaripayattu. From foundational body conditioning sequences (Meythari) and wooden weapon sparring (Kolthari) to master-level metal weaponry (Ankathari & Urumi), our Kalari offers authentic martial discipline and vital point science.',
  home_about_body: 'Our consecrated earthen training arena (Kuzhi Kalari) is crafted with traditional red soil and medicinal herbs, fostering agility, breath mastery, and holistic healing under experienced Gurukkals.',
  home_about_photo: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop',

  // Full About Us Page (/about)
  about_page_tag: 'MADHURAKANDY C.V.N KALARI • VENGERI, KOZHIKODE',
  about_page_title: 'About Us',
  about_page_lead: 'Located in Vengeri, Kozhikode, Madhurakandy C.V.N Kalari is a traditional centre dedicated to upholding the authentic Northern (Vadakkan) lineage of Kalaripayattu.',
  about_page_full_story: 'Practicing inside our consecrated four-foot subterranean red-earth pit (Kuzhi Kalari), students of all ages receive comprehensive training in foundational bodily agility, high kicks, stance postures (Meythari), traditional wooden weaponry (Kolthari), advanced steel blades (Ankathari), and classical Ayurvedic Marma Chikitsa healing under dedicated Gurukkal guidance.',
  about_page_photo: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',

  // Homepage Gurukkal section snippet
  home_guru_tag: 'LINEAGE & LEADERSHIP',
  home_guru_title: 'Chief Gurukkal',
  home_guru_subtitle: 'Lineage Custodian & Master Healer',
  home_guru_bio: 'Dedicated to preserving authentic Northern Kalaripayattu, guiding students through physical agility, weaponry discipline, and traditional Marma Chikitsa healing.',
  home_guru_image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',

  // Full Gurukkal Page (/guru)
  guru_page_title: 'Our Gurukkal',
  guru_page_subtitle: 'Master of Northern Kalaripayattu & Lineage Custodian',
  guru_page_full_bio: 'The Gurukkal of Madhurakandy C.V.N Kalari is a life-long custodian of the authentic Vadakkan (Northern) tradition of Kalaripayattu, a lineage passed down through generations within the sacred walls of our consecrated earthen arena in Vengeri, Kozhikode. With decades of devoted practice and teaching, the Gurukkal guides students through every stage of the art — from foundational body conditioning and Meythari stances, through wooden and steel weaponry, to the deeply therapeutic science of Marma Chikitsa. Rooted in discipline, humility, and an unwavering respect for the ancient Gurukula system, every lesson taught here carries the weight of tradition and the warmth of genuine care for each practitioner\'s growth — in body, mind, and spirit.',
  guru_page_image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
};

const SEED_INQUIRIES: KalariInquiry[] = [
  {
    id: 'inq-1',
    type: 'batch',
    name: 'Devaj',
    age: '19',
    phone: '+91 85903 07712',
    details: 'Morning Batch (05:30 AM - 07:00 AM)',
    message: 'Interested in daily morning training starting next Monday.',
    status: 'new',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'inq-2',
    type: 'treatment',
    name: 'Rahul Nair',
    age: '34',
    phone: '+91 98470 12345',
    details: 'Spine & Lower Back Pain Care',
    message: 'Looking for a consultation session this weekend.',
    status: 'contacted',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

function triggerLiveUpdate(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('kalari_content_updated'));
  }
}

// Helper to access LocalStorage with fallback
function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`kalari_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`kalari_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to write to localStorage', e);
  }
}

// ── Image Cache Preloader ───────────────────────────────────────────────────
const preloadedUrls = new Set<string>();

export function preloadImage(url?: string): void {
  if (!url || typeof window === 'undefined') return;
  const trimmed = url.trim();
  if (!trimmed || preloadedUrls.has(trimmed)) return;
  if (trimmed.startsWith('http') || trimmed.startsWith('data:image') || trimmed.startsWith('/')) {
    preloadedUrls.add(trimmed);
    const img = new Image();
    img.src = trimmed;
  }
}

export function preloadImages(urls: (string | undefined)[]): void {
  urls.forEach((u) => preloadImage(u));
}

// ─── Kalari Service API ───────────────────────────────────────────────────────

export const kalariService = {
  // ── Synchronous Instant Cache Readers ───────────────────────────────────────
  getCachedGallery(): KalariGalleryItem[] {
    const cached = getLocal<KalariGalleryItem[] | null>('gallery', null);
    if (cached !== null) return cached;
    return isSupabaseConfigured ? [] : SEED_GALLERY;
  },
  getCachedCourses(): KalariCourse[] {
    const cached = getLocal<KalariCourse[] | null>('courses', null);
    if (cached !== null) return cached;
    return isSupabaseConfigured ? [] : SEED_COURSES;
  },
  getCachedBatches(): KalariBatch[] {
    const cached = getLocal<KalariBatch[] | null>('batches', null);
    if (cached !== null) return cached;
    return isSupabaseConfigured ? [] : SEED_BATCHES;
  },
  getCachedNews(): KalariNewsItem[] {
    const cached = getLocal<KalariNewsItem[] | null>('news', null);
    if (cached !== null) return cached;
    return isSupabaseConfigured ? [] : SEED_NEWS;
  },
  getCachedHeroSlides(): KalariHeroSlide[] {
    const cached = getLocal<KalariHeroSlide[] | null>('hero_slides', null);
    if (cached !== null) return cached;
    return SEED_HERO_SLIDES;
  },
  getCachedInquiries(): KalariInquiry[] {
    const cached = getLocal<KalariInquiry[] | null>('inquiries', null);
    if (cached !== null) return cached;
    return isSupabaseConfigured ? [] : SEED_INQUIRIES;
  },
  getCachedTreatmentData(): KalariTreatmentData {
    return getLocal<KalariTreatmentData>('treatment_data', SEED_TREATMENT);
  },
  getCachedSiteContent(): KalariSiteContent {
    const raw = getLocal<Partial<KalariSiteContent>>('site_content', SEED_SITE_CONTENT);
    return { ...SEED_SITE_CONTENT, ...raw };
  },
  getCachedContactSettings(): KalariContactSettings {
    return getLocal<KalariContactSettings>('contact_settings', SEED_CONTACT_SETTINGS);
  },

  // ── 1. INQUIRIES & APPOINTMENTS ────────────────────────────────────────────
  async getInquiries(): Promise<KalariInquiry[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('inquiries')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          setLocal('inquiries', data);
          return data as KalariInquiry[];
        }
        if (error) {
          console.warn('Supabase getInquiries query error:', error);
        }
      } catch (err) {
        console.warn('Supabase getInquiries network error:', err);
      }
    }
    const cached = getLocal<KalariInquiry[] | null>('inquiries', null);
    if (cached !== null) return cached;
    return isSupabaseConfigured ? [] : SEED_INQUIRIES;
  },

  async addInquiry(
    inquiry: Omit<KalariInquiry, 'id' | 'created_at' | 'status'>
  ): Promise<KalariInquiry> {
    const item: KalariInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      status: 'new',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('inquiries')
          .insert([item])
          .select()
          .single();
        if (!error && data) {
          const list = getLocal<KalariInquiry[]>('inquiries', []);
          setLocal('inquiries', [data as KalariInquiry, ...list]);
          triggerLiveUpdate();
          return data as KalariInquiry;
        }
      } catch (err) {
        console.warn('Supabase addInquiry failed, saving locally', err);
      }
    }

    const list = getLocal<KalariInquiry[]>('inquiries', []);
    const updated = [item, ...list];
    setLocal('inquiries', updated);
    triggerLiveUpdate();
    return item;
  },

  async updateInquiryStatus(
    id: string,
    status: 'new' | 'contacted' | 'completed'
  ): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('inquiries')
          .update({ status })
          .eq('id', id);
        if (!error) {
          const list = getLocal<KalariInquiry[]>('inquiries', []);
          setLocal(
            'inquiries',
            list.map((item) => (item.id === id ? { ...item, status } : item))
          );
          triggerLiveUpdate();
          return true;
        }
      } catch (err) {
        console.warn('Supabase updateInquiryStatus failed', err);
      }
    }

    const list = getLocal<KalariInquiry[]>('inquiries', []);
    setLocal(
      'inquiries',
      list.map((item) => (item.id === id ? { ...item, status } : item))
    );
    triggerLiveUpdate();
    return true;
  },

  async deleteInquiry(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('inquiries').delete().eq('id', id);
        if (!error) {
          const list = getLocal<KalariInquiry[]>('inquiries', []);
          setLocal(
            'inquiries',
            list.filter((item) => item.id !== id)
          );
          triggerLiveUpdate();
          return true;
        }
      } catch (err) {
        console.warn('Supabase deleteInquiry failed', err);
      }
    }
    const list = getLocal<KalariInquiry[]>('inquiries', []);
    setLocal(
      'inquiries',
      list.filter((item) => item.id !== id)
    );
    triggerLiveUpdate();
    return true;
  },

  // ── 2. BATCHES & TRAINING SCHEDULES ────────────────────────────────────────
  async getBatches(): Promise<KalariBatch[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('batches')
          .select('*')
          .order('created_at', { ascending: true });

        if (!error && data) {
          const merged: KalariBatch[] = (data as any[]).map((b) => {
            let photoUrl = b.photo_url || '';
            let rawHighlights: string[] = Array.isArray(b.highlights) ? [...b.highlights] : [];

            // If photo_url is not in table column, check highlights array for PHOTO_URL: prefix
            if (!photoUrl && rawHighlights.length > 0) {
              const photoIdx = rawHighlights.findIndex((h) => typeof h === 'string' && h.startsWith('PHOTO_URL:'));
              if (photoIdx !== -1) {
                photoUrl = rawHighlights[photoIdx].replace('PHOTO_URL:', '').trim();
                rawHighlights = rawHighlights.filter((_, idx) => idx !== photoIdx);
              }
            }

            return {
              ...b,
              photo_url: photoUrl,
              highlights: rawHighlights.length > 0 ? rawHighlights : [
                `${b.schedule || 'Mon / Tue / Wed / Fri / Sat'} (${b.timing || '05:30 AM - 07:00 AM'})`,
                'Open for all age groups & all skill levels',
              ],
            } as KalariBatch;
          });

          setLocal('batches', merged);
          preloadImages(merged.map((b) => b.photo_url));
          return merged;
        }
        if (error) {
          console.warn('Supabase getBatches error:', error);
        }
      } catch (err) {
        console.warn('Supabase getBatches failed, using local store', err);
      }
    }

    const cached = getLocal<KalariBatch[] | null>('batches', null);
    if (cached !== null) {
      preloadImages(cached.map((b) => b.photo_url));
      return cached;
    }

    preloadImages(SEED_BATCHES.map((b) => b.photo_url));
    return isSupabaseConfigured ? [] : SEED_BATCHES;
  },

  async saveBatch(batch: Partial<KalariBatch>): Promise<KalariBatch> {
    const isNew = !batch.id;
    const photoUrl = batch.photo_url || '';

    let cleanHighlights = (batch.highlights || [
      `${batch.schedule || 'Mon / Tue / Wed / Fri / Sat'} (${batch.timing || '05:30 AM - 07:00 AM'})`,
      'Open for all age groups & all skill levels',
    ]).filter((h) => !h.startsWith('PHOTO_URL:'));

    const highlightsWithPhoto = photoUrl
      ? [...cleanHighlights, `PHOTO_URL:${photoUrl}`]
      : cleanHighlights;

    const item: KalariBatch = {
      id: batch.id || `batch-${Date.now()}`,
      title: batch.title || 'New Kalari Batch',
      age_group: batch.age_group || 'All Ages (8+)',
      level: batch.level || 'All Levels',
      schedule: batch.schedule || 'Mon / Tue / Wed / Fri / Sat',
      timing: batch.timing || '05:30 AM - 07:00 AM',
      fee_details: batch.fee_details || '₹2,500 / month',
      status: batch.status || 'open',
      max_capacity: batch.max_capacity || 20,
      photo_url: photoUrl,
      highlights: cleanHighlights,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const payloadWithHighlights = {
          ...item,
          highlights: highlightsWithPhoto,
        };

        // Try saving with photo_url column first
        let res = isNew
          ? await supabase.from('batches').insert([payloadWithHighlights]).select().single()
          : await supabase.from('batches').update(payloadWithHighlights).eq('id', item.id).select().single();

        // If photo_url column doesn't exist yet in Supabase table (code 42703 or PGRST204), omit photo_url column
        if (res.error && (res.error.code === '42703' || res.error.code === 'PGRST204' || res.error.message?.toLowerCase().includes('photo_url'))) {
          const { photo_url: _discarded, ...supabaseItem } = payloadWithHighlights;
          res = isNew
            ? await supabase.from('batches').insert([supabaseItem]).select().single()
            : await supabase.from('batches').update(supabaseItem).eq('id', item.id).select().single();
        }

        if (!res.error && res.data) {
          const saved: KalariBatch = {
            ...res.data,
            photo_url: photoUrl,
            highlights: cleanHighlights,
          };
          const list = getLocal<KalariBatch[]>('batches', []);
          const updated = isNew
            ? [...list, saved]
            : list.map((b) => (b.id === item.id ? saved : b));
          setLocal('batches', updated);
          preloadImage(photoUrl);
          triggerLiveUpdate();
          return saved;
        }
      } catch (err) {
        console.warn('Supabase saveBatch failed, updating local store', err);
      }
    }

    const list = getLocal<KalariBatch[]>('batches', []);
    const updated = isNew
      ? [...list, item]
      : list.map((b) => (b.id === item.id ? item : b));
    setLocal('batches', updated);
    preloadImage(photoUrl);
    triggerLiveUpdate();
    return item;
  },

  async deleteBatch(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('batches').delete().eq('id', id);
        if (!error) {
          const list = getLocal<KalariBatch[]>('batches', []);
          setLocal('batches', list.filter((b) => b.id !== id));
          triggerLiveUpdate();
          return true;
        }
      } catch (err) {
        console.warn('Supabase deleteBatch failed, deleting locally', err);
      }
    }
    const list = getLocal<KalariBatch[]>('batches', []);
    setLocal(
      'batches',
      list.filter((b) => b.id !== id)
    );
    triggerLiveUpdate();
    return true;
  },

  async getSchedules(): Promise<KalariSchedule[]> {
    return [
      {
        id: 'sched-1',
        day_of_week: 'Monday to Saturday',
        time_slot: '05:30 AM - 07:00 AM',
        session_name: 'Brahmamuhurtham Meythari & Agility',
        instructor: 'Gurukkal',
        location: 'Madhurakandy CVN Kalari, Vengeri',
        level: 'All Levels',
        fee_note: 'Daily Training Batch',
      },
      {
        id: 'sched-2',
        day_of_week: 'Monday to Saturday',
        time_slot: '05:30 PM - 07:00 PM',
        session_name: 'Evening Meypayattu & Weapon Combat',
        instructor: 'Gurukkal',
        location: 'Madhurakandy CVN Kalari, Vengeri',
        level: 'All Levels',
        fee_note: 'Daily Training Batch',
      },
    ];
  },

  // ── 3. COURSES & SERVICES ──────────────────────────────────────────────────
  async getCourses(): Promise<KalariCourse[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          setLocal('courses', data);
          preloadImages(data.map((c: any) => c.photo_url));
          return data as KalariCourse[];
        }
        if (error) {
          console.warn('Supabase getCourses query error:', error);
        }
      } catch (err) {
        console.warn('Supabase getCourses failed, using local store', err);
      }
    }

    const cached = getLocal<KalariCourse[] | null>('courses', null);
    if (cached !== null) {
      preloadImages(cached.map((c) => c.photo_url));
      return cached;
    }

    preloadImages(SEED_COURSES.map((c) => c.photo_url));
    return isSupabaseConfigured ? [] : SEED_COURSES;
  },

  async saveCourse(course: Partial<KalariCourse>): Promise<KalariCourse> {
    const isNew = !course.id;
    const item: KalariCourse = {
      id: course.id || `course-${Date.now()}`,
      title: course.title || 'New Course',
      level: course.level || 'BEGINNER',
      badge: course.badge || 'STAGE I',
      summary: course.summary || '',
      description: course.description || '',
      highlights: course.highlights || ['Foundational stances and discipline'],
      photo_url:
        course.photo_url ||
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
      display_order: course.display_order ?? 1,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = isNew
          ? await supabase.from('courses').insert([item]).select().single()
          : await supabase.from('courses').update(item).eq('id', item.id).select().single();

        if (!error && data) {
          const list = getLocal<KalariCourse[]>('courses', []);
          const updated = isNew
            ? [...list, data as KalariCourse]
            : list.map((c) => (c.id === item.id ? (data as KalariCourse) : c));
          setLocal('courses', updated);
          preloadImage((data as any).photo_url);
          triggerLiveUpdate();
          return data as KalariCourse;
        }
        if (error) {
          console.error('Supabase saveCourse error:', error);
        }
      } catch (err) {
        console.warn('Supabase saveCourse failed, updating local store', err);
      }
    }

    const list = getLocal<KalariCourse[]>('courses', []);
    const updated = isNew
      ? [...list, item]
      : list.map((c) => (c.id === item.id ? item : c));
    setLocal('courses', updated);
    preloadImage(item.photo_url);
    triggerLiveUpdate();
    return item;
  },

  async deleteCourse(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('courses').delete().eq('id', id);
        if (!error) {
          const list = getLocal<KalariCourse[]>('courses', []);
          setLocal('courses', list.filter((c) => c.id !== id));
          triggerLiveUpdate();
          return true;
        }
      } catch (err) {
        console.warn('Supabase deleteCourse failed, deleting locally', err);
      }
    }
    const list = getLocal<KalariCourse[]>('courses', []);
    setLocal(
      'courses',
      list.filter((c) => c.id !== id)
    );
    triggerLiveUpdate();
    return true;
  },

  // ── 4. TREATMENT DATA ───────────────────────────────────────────────────────
  async getTreatmentData(): Promise<KalariTreatmentData> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('treatment_data')
          .select('*')
          .limit(1)
          .single();
        if (!error && data) {
          const merged = { ...SEED_TREATMENT, ...data };
          setLocal('treatment_data', merged);
          return merged as KalariTreatmentData;
        }
      } catch (err) {
        console.warn('Supabase getTreatmentData failed, using local store', err);
      }
    }
    return getLocal<KalariTreatmentData>('treatment_data', SEED_TREATMENT);
  },

  async saveTreatmentData(
    data: Partial<KalariTreatmentData>
  ): Promise<KalariTreatmentData> {
    const current = await this.getTreatmentData();
    const updated: KalariTreatmentData = {
      ...current,
      ...data,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbData, error } = await supabase
          .from('treatment_data')
          .upsert([{ ...updated, id: 'primary_treatment', updated_at: new Date().toISOString() }])
          .select()
          .single();
        if (!error && dbData) {
          setLocal('treatment_data', dbData);
          triggerLiveUpdate();
          return dbData as KalariTreatmentData;
        }
      } catch (err) {
        console.warn('Supabase saveTreatmentData failed, updating local store', err);
      }
    }

    setLocal('treatment_data', updated);
    triggerLiveUpdate();
    return updated;
  },

  // ── 5. GALLERY (Authoritative Database Sync) ──────────────────────────────
  async getGallery(): Promise<KalariGalleryItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        // Phase 1: Fast metadata-only fetch (excludes large base64 url/thumbnail_url columns).
        // Returns in ~600ms even with many uploaded images, unblocking the UI immediately.
        const { data: metaData, error: metaError } = await supabase
          .from('gallery')
          .select('id, title, category, media_type, caption, display_order, created_at')
          .order('display_order', { ascending: true });

        if (!metaError && metaData && metaData.length > 0) {
          // Merge with any previously cached URLs so existing images show instantly
          const cachedFull = getLocal<KalariGalleryItem[] | null>('gallery', null);
          const cachedMap = new Map((cachedFull || []).map((g) => [g.id, g]));

          const fastItems: KalariGalleryItem[] = metaData.map((m: any) => {
            const cached = cachedMap.get(m.id);
            return {
              id: m.id,
              title: m.title || 'Kalari Media',
              category: m.category,
              media_type: m.media_type || 'image',
              url: cached?.url || '',
              thumbnail_url: cached?.thumbnail_url || '',
              caption: m.caption,
              display_order: m.display_order ?? 0,
              created_at: m.created_at,
            } as KalariGalleryItem;
          });

          // Persist fast items (with cached URLs) immediately
          setLocal('gallery', fastItems);

          // Phase 2: Background fetch of full URLs (may be slow for base64 data)
          // When done, update cache and trigger a live refresh for any open components
          Promise.resolve(
            supabase
              .from('gallery')
              .select('id, url, thumbnail_url')
              .order('display_order', { ascending: true })
          ).then(({ data: urlData, error: urlError }) => {
              if (!urlError && urlData) {
                const urlMap = new Map(urlData.map((u: any) => [u.id, u]));
                const fullItems = fastItems.map((item) => {
                  const urlRow = urlMap.get(item.id);
                  return urlRow
                    ? { ...item, url: urlRow.url || item.url, thumbnail_url: urlRow.thumbnail_url || item.thumbnail_url }
                    : item;
                });
                setLocal('gallery', fullItems);
                preloadImages(fullItems.flatMap((g) => [g.url, g.thumbnail_url]));
                triggerLiveUpdate();
              }
            }).catch((err: unknown) => console.warn('Gallery URL background fetch notice:', err));

          preloadImages(fastItems.map((g) => g.thumbnail_url || g.url));
          return fastItems;
        }

        if (metaError) {
          console.warn('Supabase getGallery query error:', metaError);
        }
      } catch (err) {
        console.warn('Supabase getGallery network error:', err);
      }
    }

    const cached = getLocal<KalariGalleryItem[] | null>('gallery', null);
    if (cached !== null) {
      preloadImages(cached.flatMap((g) => [g.url, g.thumbnail_url]));
      return cached;
    }

    preloadImages(SEED_GALLERY.flatMap((g) => [g.url, g.thumbnail_url]));
    return isSupabaseConfigured ? [] : SEED_GALLERY;
  },

  async saveGalleryItem(
    item: Partial<KalariGalleryItem>
  ): Promise<KalariGalleryItem> {
    const isNew = !item.id;
    const fullItem: KalariGalleryItem = {
      id: item.id || `gal-${Date.now()}`,
      title: item.title || 'Kalari Media',
      category: item.category || 'General',
      media_type: item.media_type || 'image',
      url:
        item.url ||
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
      thumbnail_url: item.thumbnail_url || item.url,
      caption: item.caption || '',
      display_order: item.display_order ?? 0,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        if (isNew) {
          const { data, error } = await supabase
            .from('gallery')
            .insert([fullItem])
            .select()
            .single();
          if (error) {
            console.error('Supabase gallery insert error:', error);
            throw error;
          }
          if (data) {
            const list = getLocal<KalariGalleryItem[]>('gallery', []);
            setLocal('gallery', [data as KalariGalleryItem, ...list]);
            preloadImage((data as any).url);
            triggerLiveUpdate();
            return data as KalariGalleryItem;
          }
        } else {
          const { data, error } = await supabase
            .from('gallery')
            .update(fullItem)
            .eq('id', fullItem.id)
            .select()
            .single();
          if (error) {
            console.error('Supabase gallery update error:', error);
            throw error;
          }
          if (data) {
            const list = getLocal<KalariGalleryItem[]>('gallery', []);
            setLocal('gallery', list.map((g) => (g.id === fullItem.id ? (data as KalariGalleryItem) : g)));
            preloadImage((data as any).url);
            triggerLiveUpdate();
            return data as KalariGalleryItem;
          }
        }
      } catch (err) {
        console.warn('Supabase saveGalleryItem error, falling back locally', err);
        throw err;
      }
    }

    const list = getLocal<KalariGalleryItem[]>('gallery', []);
    const updated = isNew
      ? [fullItem, ...list]
      : list.map((g) => (g.id === fullItem.id ? fullItem : g));
    setLocal('gallery', updated);
    preloadImage(fullItem.url);
    triggerLiveUpdate();
    return fullItem;
  },

  async deleteGalleryItem(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('gallery').delete().eq('id', id);
        if (error) {
          console.error('Supabase deleteGalleryItem error:', error);
          throw error;
        }
        const list = getLocal<KalariGalleryItem[]>('gallery', []);
        setLocal('gallery', list.filter((g) => g.id !== id));
        triggerLiveUpdate();
        return true;
      } catch (err) {
        console.warn('Supabase deleteGalleryItem failed:', err);
        throw err;
      }
    }
    const list = getLocal<KalariGalleryItem[]>('gallery', []);
    setLocal(
      'gallery',
      list.filter((g) => g.id !== id)
    );
    triggerLiveUpdate();
    return true;
  },

  // ── 6. NEWS & EVENTS ───────────────────────────────────────────────────────
  async getNews(): Promise<KalariNewsItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setLocal('news', data);
          preloadImages(data.map((n: any) => n.image_url));
          return data as KalariNewsItem[];
        }
        if (error) {
          console.warn('Supabase getNews query error:', error);
        }
      } catch (err) {
        console.warn('Supabase getNews failed, using local store', err);
      }
    }

    const cached = getLocal<KalariNewsItem[] | null>('news', null);
    if (cached !== null) {
      preloadImages(cached.map((n) => n.image_url));
      return cached;
    }

    preloadImages(SEED_NEWS.map((n) => n.image_url));
    return isSupabaseConfigured ? [] : SEED_NEWS;
  },

  async saveNewsItem(item: Partial<KalariNewsItem>): Promise<KalariNewsItem> {
    const isNew = !item.id;
    const fullItem: KalariNewsItem = {
      id: item.id || `news-${Date.now()}`,
      title: item.title || 'Academy News',
      tag: item.tag || 'NEWS',
      date: item.date || new Date().toISOString().split('T')[0],
      summary: item.summary || '',
      image_url:
        item.image_url ||
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
      is_featured: item.is_featured ?? false,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        if (isNew) {
          const { data, error } = await supabase
            .from('news')
            .insert([fullItem])
            .select()
            .single();
          if (!error && data) {
            const list = getLocal<KalariNewsItem[]>('news', []);
            setLocal('news', [data as KalariNewsItem, ...list]);
            preloadImage((data as any).image_url);
            triggerLiveUpdate();
            return data as KalariNewsItem;
          }
        } else {
          const { data, error } = await supabase
            .from('news')
            .update(fullItem)
            .eq('id', fullItem.id)
            .select()
            .single();
          if (!error && data) {
            const list = getLocal<KalariNewsItem[]>('news', []);
            setLocal('news', list.map((n) => (n.id === fullItem.id ? (data as KalariNewsItem) : n)));
            preloadImage((data as any).image_url);
            triggerLiveUpdate();
            return data as KalariNewsItem;
          }
        }
      } catch (err) {
        console.warn('Supabase saveNewsItem failed, updating local store', err);
      }
    }

    const list = getLocal<KalariNewsItem[]>('news', []);
    const updated = isNew
      ? [fullItem, ...list]
      : list.map((n) => (n.id === fullItem.id ? fullItem : n));
    setLocal('news', updated);
    preloadImage(fullItem.image_url);
    triggerLiveUpdate();
    return fullItem;
  },

  async deleteNewsItem(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('news').delete().eq('id', id);
        if (!error) {
          const list = getLocal<KalariNewsItem[]>('news', []);
          setLocal('news', list.filter((n) => n.id !== id));
          triggerLiveUpdate();
          return true;
        }
      } catch (err) {
        console.warn('Supabase deleteNewsItem failed, deleting locally', err);
      }
    }
    const list = getLocal<KalariNewsItem[]>('news', []);
    setLocal(
      'news',
      list.filter((n) => n.id !== id)
    );
    triggerLiveUpdate();
    return true;
  },

  // ── 7. SITE VISUAL CONTENT & EDITABLE SETTINGS ─────────────────────────────
  async getSiteContent(): Promise<KalariSiteContent> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('*')
          .limit(1)
          .single();
        if (!error && data) {
          const merged = { ...SEED_SITE_CONTENT, ...data };
          setLocal('site_content', merged);
          return merged as KalariSiteContent;
        }
      } catch (err) {
        console.warn('Supabase getSiteContent failed, using local store', err);
      }
    }
    const raw = getLocal<Partial<KalariSiteContent>>('site_content', SEED_SITE_CONTENT);
    return {
      marquee_line1: raw.marquee_line1 || SEED_SITE_CONTENT.marquee_line1,
      marquee_line2: raw.marquee_line2 || SEED_SITE_CONTENT.marquee_line2,
      marquee_line3: raw.marquee_line3 || SEED_SITE_CONTENT.marquee_line3,
      hero_title_1: raw.hero_title_1 || SEED_SITE_CONTENT.hero_title_1,
      hero_title_2: raw.hero_title_2 || SEED_SITE_CONTENT.hero_title_2,
      hero_tag: raw.hero_tag || SEED_SITE_CONTENT.hero_tag,
      hero_bg_image: raw.hero_bg_image || SEED_SITE_CONTENT.hero_bg_image,
      home_about_tag: raw.home_about_tag || SEED_SITE_CONTENT.home_about_tag,
      home_about_heading: raw.home_about_heading || SEED_SITE_CONTENT.home_about_heading,
      home_about_lead: raw.home_about_lead || SEED_SITE_CONTENT.home_about_lead,
      home_about_body: raw.home_about_body || SEED_SITE_CONTENT.home_about_body,
      home_about_photo: raw.home_about_photo || SEED_SITE_CONTENT.home_about_photo,
      about_page_tag: raw.about_page_tag || SEED_SITE_CONTENT.about_page_tag,
      about_page_title: raw.about_page_title || SEED_SITE_CONTENT.about_page_title,
      about_page_lead: raw.about_page_lead || SEED_SITE_CONTENT.about_page_lead,
      about_page_full_story: raw.about_page_full_story || SEED_SITE_CONTENT.about_page_full_story,
      about_page_photo: raw.about_page_photo || SEED_SITE_CONTENT.about_page_photo,
      home_guru_tag: raw.home_guru_tag || SEED_SITE_CONTENT.home_guru_tag,
      home_guru_title: raw.home_guru_title || SEED_SITE_CONTENT.home_guru_title,
      home_guru_subtitle: raw.home_guru_subtitle || SEED_SITE_CONTENT.home_guru_subtitle,
      home_guru_bio: raw.home_guru_bio || SEED_SITE_CONTENT.home_guru_bio,
      home_guru_image: raw.home_guru_image || SEED_SITE_CONTENT.home_guru_image,
      guru_page_title: raw.guru_page_title || SEED_SITE_CONTENT.guru_page_title,
      guru_page_subtitle: raw.guru_page_subtitle || SEED_SITE_CONTENT.guru_page_subtitle,
      guru_page_full_bio: raw.guru_page_full_bio || SEED_SITE_CONTENT.guru_page_full_bio,
      guru_page_image: raw.guru_page_image || SEED_SITE_CONTENT.guru_page_image,
    };
  },

  async saveSiteContent(
    content: Partial<KalariSiteContent>
  ): Promise<KalariSiteContent> {
    const current = await this.getSiteContent();
    const updated: KalariSiteContent = {
      ...current,
      ...content,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbData, error } = await supabase
          .from('site_content')
          .upsert([{ ...updated, id: 'primary_content', updated_at: new Date().toISOString() }])
          .select()
          .single();
        if (!error && dbData) {
          setLocal('site_content', dbData);
          triggerLiveUpdate();
          return dbData as KalariSiteContent;
        }
      } catch (err) {
        console.warn('Supabase saveSiteContent failed, updating local store', err);
      }
    }

    setLocal('site_content', updated);
    triggerLiveUpdate();
    return updated;
  },

  // ── 8. CONTACT & LOCATION SETTINGS ─────────────────────────────────────────
  async getContactSettings(): Promise<KalariContactSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('contact_settings')
          .select('*')
          .limit(1)
          .single();
        if (!error && data) {
          const merged = { ...SEED_CONTACT_SETTINGS, ...data };
          setLocal('contact_settings', merged);
          return merged as KalariContactSettings;
        }
      } catch (err) {
        console.warn('Supabase getContactSettings failed, using local store', err);
      }
    }
    return getLocal<KalariContactSettings>(
      'contact_settings',
      SEED_CONTACT_SETTINGS
    );
  },

  async updateContactSettings(
    settings: Partial<KalariContactSettings>
  ): Promise<KalariContactSettings> {
    const current = await this.getContactSettings();
    const updated: KalariContactSettings = {
      ...current,
      ...settings,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('contact_settings')
          .upsert([updated])
          .select()
          .single();
        if (!error && data) {
          setLocal('contact_settings', data);
          triggerLiveUpdate();
          return data as KalariContactSettings;
        }
      } catch (err) {
        console.warn('Supabase updateContactSettings failed, updating local store', err);
      }
    }

    setLocal('contact_settings', updated);
    triggerLiveUpdate();
    return updated;
  },

  // ── 9. HERO BANNER SLIDES ──────────────────────────────────────────────────
  async getHeroSlides(): Promise<KalariHeroSlide[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        // Try dedicated hero_slides table first
        const { data, error } = await supabase
          .from('hero_slides')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped = data.map((d: any) => ({
            id: String(d.id),
            titleLine1: d.title_line_1 || d.titleLine1 || 'Creating a',
            titleLine2: d.title_line_2 || d.titleLine2 || 'Martial Symphony',
            titleItalic: d.title_italic || d.titleItalic || 'for You',
            desc: d.description || d.desc || '',
            badgeNum: d.badge_num || d.badgeNum || '5.0★',
            badgeText: d.badge_text || d.badgeText || 'RATED\nCVN\nKALARI',
            image: d.image || '',
            display_order: d.display_order ?? 1,
          }));
          setLocal('hero_slides', mapped);
          preloadImages(mapped.map((h: any) => h.image));
          return mapped;
        }

        // If hero_slides table is not created yet, check site_content.hero_bg_image fallback
        const { data: contentData } = await supabase
          .from('site_content')
          .select('hero_bg_image')
          .limit(1)
          .single();

        if (contentData?.hero_bg_image && contentData.hero_bg_image.startsWith('HERO_SLIDES_JSON:')) {
          try {
            const parsed = JSON.parse(contentData.hero_bg_image.replace('HERO_SLIDES_JSON:', ''));
            if (Array.isArray(parsed) && parsed.length > 0) {
              setLocal('hero_slides', parsed);
              preloadImages(parsed.map((h: any) => h.image));
              return parsed;
            }
          } catch (e) {
            console.warn('Failed to parse hero slides from site_content', e);
          }
        }
      } catch (err) {
        console.warn('Supabase getHeroSlides failed, using local store', err);
      }
    }

    const cached = getLocal<KalariHeroSlide[] | null>('hero_slides', null);
    if (cached !== null) {
      preloadImages(cached.map((h) => h.image));
      return cached;
    }

    preloadImages(SEED_HERO_SLIDES.map((h) => h.image));
    return SEED_HERO_SLIDES;
  },

  async saveHeroSlide(slide: Partial<KalariHeroSlide>): Promise<KalariHeroSlide> {
    const isNew = !slide.id;
    const item: KalariHeroSlide = {
      id: slide.id ? String(slide.id) : `slide-${Date.now()}`,
      titleLine1: slide.titleLine1 || 'Creating a',
      titleLine2: slide.titleLine2 || 'Martial Symphony',
      titleItalic: slide.titleItalic || 'for You',
      desc: slide.desc || '',
      badgeNum: slide.badgeNum || '5.0★',
      badgeText: slide.badgeText || 'RATED\nCVN\nKALARI',
      image: slide.image || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1920&auto=format&fit=crop',
      display_order: slide.display_order ?? 1,
    };

    const currentList = getLocal<KalariHeroSlide[]>('hero_slides', SEED_HERO_SLIDES);
    const updatedList = isNew ? [...currentList, item] : currentList.map((s) => (String(s.id) === String(item.id) ? item : s));

    if (isSupabaseConfigured && supabase) {
      try {
        const dbPayload = {
          id: item.id,
          title_line_1: item.titleLine1,
          title_line_2: item.titleLine2,
          title_italic: item.titleItalic,
          description: item.desc,
          badge_num: item.badgeNum,
          badge_text: item.badgeText,
          image: item.image,
          display_order: item.display_order,
        };

        const res = isNew
          ? await supabase.from('hero_slides').insert([dbPayload]).select().single()
          : await supabase.from('hero_slides').update(dbPayload).eq('id', item.id).select().single();

        // If hero_slides table does not exist in Supabase, fallback to syncing in site_content
        if (res.error) {
          await supabase
            .from('site_content')
            .upsert([{ id: 'primary_content', hero_bg_image: `HERO_SLIDES_JSON:${JSON.stringify(updatedList)}`, updated_at: new Date().toISOString() }]);
        }
      } catch (err) {
        console.warn('Supabase saveHeroSlide failed, updating local store', err);
      }
    }

    setLocal('hero_slides', updatedList);
    preloadImage(item.image);
    triggerLiveUpdate();
    return item;
  },

  async deleteHeroSlide(id: string | number): Promise<boolean> {
    const strId = String(id);
    const currentList = getLocal<KalariHeroSlide[]>('hero_slides', SEED_HERO_SLIDES);
    const updatedList = currentList.filter((s) => String(s.id) !== strId);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('hero_slides').delete().eq('id', strId);
        if (error) {
          await supabase
            .from('site_content')
            .upsert([{ id: 'primary_content', hero_bg_image: `HERO_SLIDES_JSON:${JSON.stringify(updatedList)}`, updated_at: new Date().toISOString() }]);
        }
      } catch (err) {
        console.warn('Supabase deleteHeroSlide failed, deleting locally', err);
      }
    }

    setLocal('hero_slides', updatedList);
    triggerLiveUpdate();
    return true;
  },

  // ── 10. PRELOAD ENTIRE SITE (Instantly caches media and all sections) ─────────
  async preloadEntireSite(): Promise<void> {
    if (typeof window === 'undefined') return;

    // Phase 1: Immediately warm browser memory/disk cache using local cache & seed media
    try {
      const cachedGl = this.getCachedGallery();
      const cachedBts = this.getCachedBatches();
      const cachedCrs = this.getCachedCourses();
      const cachedNws = this.getCachedNews();
      const cachedHsd = this.getCachedHeroSlides();
      const cachedContent = this.getCachedSiteContent();
      const cachedTreatment = this.getCachedTreatmentData();

      const initialUrls: (string | undefined)[] = [
        ...cachedGl.map((g) => g.url),
        ...cachedGl.map((g) => g.thumbnail_url),
        ...cachedBts.map((b) => b.photo_url),
        ...cachedCrs.map((c) => c.photo_url),
        ...cachedNws.map((n) => n.image_url),
        ...cachedHsd.map((h) => h.image),
        cachedContent.hero_bg_image?.startsWith('HERO_SLIDES_JSON:') ? undefined : cachedContent.hero_bg_image,
        cachedContent.home_about_photo,
        cachedContent.about_page_photo,
        cachedContent.home_guru_image,
        cachedContent.guru_page_image,
        cachedTreatment.photo_url,
        '/logo.png',
        '/logo-shield.png',
      ];
      preloadImages(initialUrls);
    } catch (e) {
      console.warn('Phase 1 cache preload notice:', e);
    }

    // Phase 2: In the background, fetch all tables from Supabase concurrently
    try {
      const results = await Promise.allSettled([
        this.getCourses(),
        this.getBatches(),
        this.getGallery(),
        this.getNews(),
        this.getHeroSlides(),
        this.getSiteContent(),
        this.getContactSettings(),
        this.getTreatmentData(),
      ]);

      // Phase 3: Warm browser cache with any freshly updated media URLs
      const freshUrls: (string | undefined)[] = [];
      results.forEach((res) => {
        if (res.status === 'fulfilled' && Array.isArray(res.value)) {
          res.value.forEach((item: any) => {
            if (item.url) freshUrls.push(item.url);
            if (item.thumbnail_url) freshUrls.push(item.thumbnail_url);
            if (item.photo_url) freshUrls.push(item.photo_url);
            if (item.image_url) freshUrls.push(item.image_url);
            if (item.image) freshUrls.push(item.image);
          });
        }
      });
      preloadImages(freshUrls);

      // Phase 4: Notify all listening components to reflect fresh data immediately
      triggerLiveUpdate();
    } catch (err) {
      console.warn('Phase 2 background preload notice:', err);
    }
  },
};

// Automatically initiate background preloading on boot in browser environments
if (typeof window !== 'undefined') {
  setTimeout(() => {
    kalariService.preloadEntireSite();
  }, 10);

  // Set up Supabase Realtime synchronization across all browser tabs and profiles
  if (isSupabaseConfigured && supabase) {
    try {
      supabase
        .channel('kalari-realtime-sync')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => {
          kalariService.preloadEntireSite();
        })
        .subscribe();
    } catch (e) {
      console.warn('Realtime sync setup notice:', e);
    }
  }
}
