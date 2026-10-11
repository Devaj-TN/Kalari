-- ==============================================================================
-- MADHURAKANDY C.V.N KALARI - SUPABASE DATABASE SCHEMA & SEED SCRIPT
-- ==============================================================================
-- Run this complete script in the Supabase SQL Editor (icon: >_ in sidebar)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. INQUIRIES & APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY DEFAULT ('inq-' || floor(extract(epoch from now()) * 1000)::text),
  type TEXT NOT NULL DEFAULT 'batch' CHECK (type IN ('batch', 'treatment', 'general')),
  name TEXT NOT NULL,
  age TEXT NOT NULL,
  phone TEXT NOT NULL,
  details TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. TRAINING BATCHES TABLE
CREATE TABLE IF NOT EXISTS public.batches (
  id TEXT PRIMARY KEY DEFAULT ('batch-' || floor(extract(epoch from now()) * 1000)::text),
  title TEXT NOT NULL,
  age_group TEXT NOT NULL DEFAULT 'All Ages (8+)',
  level TEXT NOT NULL DEFAULT 'All Levels',
  schedule TEXT NOT NULL,
  timing TEXT NOT NULL,
  fee_details TEXT DEFAULT '₹2,500 / month',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'filling_fast', 'closed')),
  max_capacity INTEGER DEFAULT 20,
  highlights TEXT[] DEFAULT '{}',
  photo_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY DEFAULT ('course-' || floor(extract(epoch from now()) * 1000)::text),
  title TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'BEGINNER',
  badge TEXT DEFAULT 'STAGE I',
  summary TEXT DEFAULT '',
  description TEXT DEFAULT '',
  highlights TEXT[] DEFAULT '{}',
  photo_url TEXT DEFAULT '',
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. TREATMENT DATA TABLE (Single row configuration)
CREATE TABLE IF NOT EXISTS public.treatment_data (
  id TEXT PRIMARY KEY DEFAULT 'primary_treatment',
  title TEXT NOT NULL DEFAULT 'Traditional Kalari Treatment',
  badge TEXT DEFAULT 'KALARI TREATMENT',
  tagline TEXT DEFAULT 'Healing',
  subtitle TEXT DEFAULT '🌿 Traditional Pain Relief & Body Care • By Prior Appointment',
  description TEXT DEFAULT 'Ancient Ayurvedic Marma Chikitsa and musculoskeletal healing under Gurukkal diagnosis.',
  photo_url TEXT DEFAULT 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop',
  highlights TEXT[] DEFAULT ARRAY[
    'Spine & Joint Alignment — Disc compression, chronic back pain & sciatica relief',
    'Sports & Musculoskeletal Care — Sprains, tendon strains & joint recovery',
    'Traditional Kalari Uzhichil — Deep herbal oil massage for nerve & muscle vigor',
    'Sacred Dhanwanthari Lineage — Direct diagnostic care & therapy under Gurukkal'
  ],
  timing_info TEXT DEFAULT 'By Prior Appointment',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY DEFAULT ('gal-' || floor(extract(epoch from now()) * 1000)::text),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Meythari',
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. NEWS & EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.news (
  id TEXT PRIMARY KEY DEFAULT ('news-' || floor(extract(epoch from now()) * 1000)::text),
  title TEXT NOT NULL,
  tag TEXT NOT NULL DEFAULT 'NEWS',
  date TEXT NOT NULL DEFAULT CURRENT_DATE::text,
  summary TEXT NOT NULL DEFAULT '',
  image_url TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. SITE VISUAL CONTENT & EDITABLE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_content (
  id TEXT PRIMARY KEY DEFAULT 'primary_content',
  marquee_line1 TEXT DEFAULT 'ANCIENT WARRIOR HERITAGE',
  marquee_line2 TEXT DEFAULT 'SACRED SUBTERRANEAN KUZHI KALARI ARENA',
  marquee_line3 TEXT DEFAULT 'AUTHENTIC VADAKKAN SAMPRADAYAM',
  hero_title_1 TEXT DEFAULT 'Creating a',
  hero_title_2 TEXT DEFAULT 'Martial Symphony for You',
  hero_tag TEXT DEFAULT 'TRADITIONAL NORTHERN KALARIPAYATTU • VENGERI, KOZHIKODE',
  hero_bg_image TEXT DEFAULT '',
  home_about_tag TEXT DEFAULT 'ABOUT MADHURAKANDY C.V.N KALARI',
  home_about_heading TEXT DEFAULT 'The Sacred Tradition of CVN Kalaripayattu',
  home_about_lead TEXT DEFAULT 'Located in Vengeri, Kozhikode, Madhurakandy C.V.N Kalari upholds the renowned Northern tradition (Vadakkan Sampradayam) of Kalaripayattu. From foundational body conditioning sequences (Meythari) and wooden weapon sparring (Kolthari) to master-level metal weaponry (Ankathari & Urumi), our Kalari offers authentic martial discipline and vital point science.',
  home_about_body TEXT DEFAULT 'Our consecrated earthen training arena (Kuzhi Kalari) is crafted with traditional red soil and medicinal herbs, fostering agility, breath mastery, and holistic healing under experienced Gurukkals.',
  home_about_photo TEXT DEFAULT 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop',
  about_page_tag TEXT DEFAULT 'MADHURAKANDY C.V.N KALARI • VENGERI, KOZHIKODE',
  about_page_title TEXT DEFAULT 'About Us',
  about_page_lead TEXT DEFAULT 'Located in Vengeri, Kozhikode, Madhurakandy C.V.N Kalari is a traditional centre dedicated to upholding the authentic Northern (Vadakkan) lineage of Kalaripayattu.',
  about_page_full_story TEXT DEFAULT 'Practicing inside our consecrated four-foot subterranean red-earth pit (Kuzhi Kalari), students of all ages receive comprehensive training in foundational bodily agility, high kicks, stance postures (Meythari), traditional wooden weaponry (Kolthari), advanced steel blades (Ankathari), and classical Ayurvedic Marma Chikitsa healing under dedicated Gurukkal guidance.',
  about_page_photo TEXT DEFAULT 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop',
  home_guru_tag TEXT DEFAULT 'MASTER OF THE LINEAGE',
  home_guru_title TEXT DEFAULT 'Chief Gurukkal',
  home_guru_subtitle TEXT DEFAULT 'Lineage Custodian & Master Healer',
  home_guru_bio TEXT DEFAULT 'Dedicated to preserving authentic Northern Kalaripayattu, guiding students through physical agility, weaponry discipline, and traditional Marma Chikitsa healing.',
  home_guru_image TEXT DEFAULT 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop',
  guru_page_title TEXT DEFAULT 'Our Gurukkal',
  guru_page_subtitle TEXT DEFAULT 'Master of Northern Kalaripayattu & Lineage Custodian',
  guru_page_full_bio TEXT DEFAULT 'The Gurukkal of Madhurakandy C.V.N Kalari is a life-long custodian of the authentic Vadakkan (Northern) tradition of Kalaripayattu, a lineage passed down through generations within the sacred walls of our consecrated earthen arena in Vengeri, Kozhikode. With decades of devoted practice and teaching, the Gurukkal guides students through every stage of the art — from foundational body conditioning and Meythari stances, through wooden and steel weaponry, to the deeply therapeutic science of Marma Chikitsa. Rooted in discipline, humility, and an unwavering respect for the ancient Gurukula system, every lesson taught here carries the weight of tradition and the warmth of genuine care for each practitioner''s growth — in body, mind, and spirit.',
  guru_page_image TEXT DEFAULT 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. CONTACT & LOCATION SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.contact_settings (
  id TEXT PRIMARY KEY DEFAULT 'primary_contact',
  primary_phone TEXT NOT NULL DEFAULT '+91 99471 39696',
  secondary_phone TEXT DEFAULT '+91 94471 39696',
  whatsapp TEXT NOT NULL DEFAULT '919947139696',
  email TEXT NOT NULL DEFAULT 'info@cvnkalari.com',
  primary_location TEXT NOT NULL DEFAULT 'Madhurakandy C.V.N Kalari',
  full_address TEXT NOT NULL DEFAULT 'Vengeri, Kozhikode, Kerala 673010, India',
  map_embed_url TEXT DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.186835706509!2d75.8016462!3d11.3040608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba65ea35d3d7589%3A0xe54d243b9df72ef4!2sMadhurakandy%20CVN%20Kalari!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access
DROP POLICY IF EXISTS "Public can view batches" ON public.batches;
CREATE POLICY "Public can view batches" ON public.batches FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view courses" ON public.courses;
CREATE POLICY "Public can view courses" ON public.courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view treatment_data" ON public.treatment_data;
CREATE POLICY "Public can view treatment_data" ON public.treatment_data FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view gallery" ON public.gallery;
CREATE POLICY "Public can view gallery" ON public.gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view news" ON public.news;
CREATE POLICY "Public can view news" ON public.news FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view site_content" ON public.site_content;
CREATE POLICY "Public can view site_content" ON public.site_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view contact_settings" ON public.contact_settings;
CREATE POLICY "Public can view contact_settings" ON public.contact_settings FOR SELECT USING (true);

-- Allow Public to Submit Inquiries
DROP POLICY IF EXISTS "Public can submit inquiries" ON public.inquiries;
CREATE POLICY "Public can submit inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

-- Allow Authenticated / Service Role full access to all tables
DROP POLICY IF EXISTS "Full access for all operations" ON public.inquiries;
CREATE POLICY "Full access for all operations" ON public.inquiries FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access for batches" ON public.batches;
CREATE POLICY "Full access for batches" ON public.batches FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access for courses" ON public.courses;
CREATE POLICY "Full access for courses" ON public.courses FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access for treatment_data" ON public.treatment_data;
CREATE POLICY "Full access for treatment_data" ON public.treatment_data FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access for gallery" ON public.gallery;
CREATE POLICY "Full access for gallery" ON public.gallery FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access for news" ON public.news;
CREATE POLICY "Full access for news" ON public.news FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access for site_content" ON public.site_content;
CREATE POLICY "Full access for site_content" ON public.site_content FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access for contact_settings" ON public.contact_settings;
CREATE POLICY "Full access for contact_settings" ON public.contact_settings FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Batches Seed
INSERT INTO public.batches (id, title, age_group, level, schedule, timing, fee_details, status, max_capacity, highlights)
VALUES
  ('batch-1', 'Morning Batch', 'All Ages (8+)', 'All Levels', 'Mon / Tue / Wed / Fri / Sat', '05:30 AM - 07:00 AM', '₹2,500 / month', 'open', 20, ARRAY['Brahmamuhurtham Meythari, high kicks & agility', 'Mon / Tue / Wed / Fri / Sat (05:30 AM – 07:00 AM)', 'Open for all age groups (8+) & all skill levels']),
  ('batch-2', 'Evening Batch', 'All Ages (8+)', 'All Levels', 'Mon / Tue / Wed / Fri / Sat', '05:30 PM - 07:00 PM', '₹2,500 / month', 'open', 20, ARRAY['Warrior stances, weapon drills & body control', 'Mon / Tue / Wed / Fri / Sat (05:30 PM – 07:00 PM)', 'Ideal for students & working professionals'])
ON CONFLICT (id) DO NOTHING;

-- Courses Seed
INSERT INTO public.courses (id, title, level, badge, summary, description, highlights, photo_url, display_order)
VALUES
  ('course-1', 'Meythari', 'BEGINNER', 'STAGE I', 'Physical body conditioning, flexibility & animal postures', 'The supreme foundation of Kalaripayattu focusing on flexibility, acrobatic footwork, high kicks and explosive muscular power.', ARRAY['Explosive kicking and jumping ability', 'Full-body muscular endurance', 'Acrobatic agility and spatial awareness'], 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop', 1),
  ('course-2', 'Kolthari', 'INTERMEDIATE', 'STAGE II', 'Mastery of traditional wooden weaponry', 'Training in traditional wooden weaponry starting with the long staff (Kettukari), curved stick (Otta), and short sticks (Cheruvadi).', ARRAY['Mastery of six traditional wooden weapons', 'Distance, reflex and timing perception', 'Partner drills and rapid combat sequences'], 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop', 2),
  ('course-3', 'Ankathari', 'ADVANCED', 'STAGE III', 'Mastery of sharp steel weapons & Urumi', 'Combat mastery with razor steel weapons including dagger (Kadthala), sword & shield (Valum Parichayum), spear, and flexible sword (Urumi).', ARRAY['Mastery of metal weapons including flexible Urumi', 'Advanced two-person duel combat sequences', 'Peak Kalari athleticism, focus and warrior discipline'], 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop', 3)
ON CONFLICT (id) DO NOTHING;

-- Treatment Seed
INSERT INTO public.treatment_data (id, title, badge, tagline, subtitle, description, photo_url, highlights, timing_info)
VALUES (
  'primary_treatment',
  'Traditional Kalari Treatment',
  'KALARI TREATMENT',
  'Healing',
  '🌿 Traditional Pain Relief & Body Care • By Prior Appointment',
  'Ancient Ayurvedic Marma Chikitsa and musculoskeletal healing under Gurukkal diagnosis.',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop',
  ARRAY[
    'Spine & Joint Alignment — Disc compression, chronic back pain & sciatica relief',
    'Sports & Musculoskeletal Care — Sprains, tendon strains & joint recovery',
    'Traditional Kalari Uzhichil — Deep herbal oil massage for nerve & muscle vigor',
    'Sacred Dhanwanthari Lineage — Direct diagnostic care & therapy under Gurukkal'
  ],
  'By Prior Appointment'
)
ON CONFLICT (id) DO NOTHING;

-- Gallery Seed
INSERT INTO public.gallery (id, title, category, media_type, url, thumbnail_url, caption, display_order)
VALUES
  ('gal-1', 'Gaja Vadivu (Sacred Elephant Stance)', 'Meythari', 'image', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop', 'Student demonstrating deep grounded stability and core power in the Kuzhi Kalari arena.', 1),
  ('gal-2', 'Otta & Kettukari Wooden Duel', 'Kolthari', 'image', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400&auto=format&fit=crop', 'Dynamic curved staff Otta combat practice under Gurukkal supervision.', 2),
  ('gal-3', 'Valum Parichayum (Sword & Shield)', 'Ankathari', 'image', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop', 'Senior practitioners in steel blade sequence inside the earthen arena.', 3)
ON CONFLICT (id) DO NOTHING;

-- News Seed
INSERT INTO public.news (id, title, tag, date, summary, image_url, is_featured)
VALUES
  ('news-1', 'New Daily Meythari Batches Open for Morning & Evening Sessions', 'ADMISSIONS', CURRENT_DATE::text, 'Admissions open for students (ages 8+) and working professionals for foundational Meythari stances, high kicks, and full-body conditioning at Madhurakandy C.V.N Kalari, Vengeri.', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop', true),
  ('news-2', 'Sacred Kuzhi Kalari Consecration & Traditional Poojas', 'RITUALS', CURRENT_DATE::text, 'Special annual Guruvandanam and Poothara offerings conducted under Gurukkal lineage blessings in our traditional subterranean earth arena.', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop', false)
ON CONFLICT (id) DO NOTHING;

-- Site Content Seed
INSERT INTO public.site_content (id)
VALUES ('primary_content')
ON CONFLICT (id) DO NOTHING;

-- Contact Settings Seed
INSERT INTO public.contact_settings (id)
VALUES ('primary_contact')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 9. HERO BANNER SLIDESHOW TABLE & SEED
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id TEXT PRIMARY KEY DEFAULT ('slide-' || floor(extract(epoch from now()) * 1000)::text),
  title_line_1 TEXT DEFAULT 'Creating a',
  title_line_2 TEXT DEFAULT 'Martial Symphony',
  title_italic TEXT DEFAULT 'for You',
  description TEXT DEFAULT '',
  badge_num TEXT DEFAULT '5.0★',
  badge_text TEXT DEFAULT 'RATED CVN KALARI',
  image TEXT NOT NULL,
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view hero_slides" ON public.hero_slides;
CREATE POLICY "Public can view hero_slides" ON public.hero_slides FOR SELECT USING (true);
DROP POLICY IF EXISTS "Full access for hero_slides" ON public.hero_slides;
CREATE POLICY "Full access for hero_slides" ON public.hero_slides FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.hero_slides (id, title_line_1, title_line_2, title_italic, description, badge_num, badge_text, image, display_order)
VALUES
  ('slide-1', 'Creating a', 'Martial Symphony', 'for You', 'With an enviable martial heritage rooted in Kozhikode, Madhurakandy C.V.N Kalari sets the standard in authentic Kalaripayattu and healing science.', '5.0★', 'RATED CVN KALARI', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1920&auto=format&fit=crop', 1),
  ('slide-2', 'Savor the', 'True Spirit of', 'Ancient Malabar', 'Immerse in authentic Vadakkan lineage training and sacred Kuzhi Kalari mud arena practice at Madhurakandy C.V.N Kalari, Vengeri.', '08', 'SACRED ANIMAL POSES', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1920&auto=format&fit=crop', 2),
  ('slide-3', 'Master the', 'Sacred Steel on', 'Your Path', 'Master traditional wooden and metal weaponry with authentic Vadakkan techniques under dedicated Gurukkal guidance.', '04', 'SACRED WEAPON STAGES', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1920&auto=format&fit=crop', 3),
  ('slide-4', 'Experience a', 'Martial Excellence', 'at its Finest', 'Immerse in warrior discipline, breath control, and core agility in our traditional Kozhikode Kuzhi Kalari setting.', 'DAILY', 'TRAINING BATCHES OPEN', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1920&auto=format&fit=crop', 4),
  ('slide-5', 'Ancient Healing', 'Moments That', 'Restore Life', 'With ancient Ayurvedic Marma Chikitsa and therapeutic joint realignment that have healed warriors for generations.', '108', 'VITAL MARMA POINTS', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1920&auto=format&fit=crop', 5),
  ('slide-6', 'Discover', 'Our Unique', 'Living Art', 'From high kicks to weapon dexterity, awaken the warrior within through the consecrated tradition of CVN Kalari.', 'VADAKKAN', 'HERITAGE LINEAGE ESTD', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1920&auto=format&fit=crop', 6)
ON CONFLICT (id) DO NOTHING;

