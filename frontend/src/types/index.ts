// ─── Core Types ───────────────────────────────────────────────────────────────

export interface Program {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  ageGroup: string;
  schedule: string;
  image: string;
  imageAlt: string;
  featured: boolean;
  category: ProgramCategory;
  benefits: string[];
  prerequisites: string;
}

export type ProgramCategory =
  | 'foundation'
  | 'body-conditioning'
  | 'weapons'
  | 'advanced-combat'
  | 'unarmed'
  | 'therapy'
  | 'kids'
  | 'womens';

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  whatsapp: string;
  email: string;
  mapUrl: string;
  embedUrl: string;
  hours: string;
  geoLat: number;
  geoLng: number;
  isPrimary: boolean;
}

export interface NewsPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: NewsCategory;
  publishedAt: string; // ISO date string
  image: string;
  imageAlt: string;
  tags: string[];
}

export type NewsCategory =
  | 'event'
  | 'workshop'
  | 'competition'
  | 'media'
  | 'achievement'
  | 'announcement';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  duration: string; // e.g., "3 years student"
  quote: string;
  avatar?: string;
  program: string;
}

export interface Guru {
  name: string;
  title: string;
  lineage: string;
  bio: string[];
  credentials: string[];
  image: string;
  imageAlt: string;
  yearsOfPractice: number;
  studentsTrainedCount: number;
}

export interface Affiliation {
  id: string;
  name: string;
  logoUrl?: string;
  url?: string;
}

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  program: string;
  message: string;
}
