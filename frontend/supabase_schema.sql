-- ==============================================================================
-- MADHURAKANDY C.V.N KALARI - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Run this complete script in your Supabase Project SQL Editor
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLES

-- Batches & Upcoming Enrollments Table
CREATE TABLE IF NOT EXISTS public.batches (
    id TEXT PRIMARY KEY DEFAULT ('batch-' || floor(extract(epoch from now()) * 1000)::text),
    title TEXT NOT NULL,
    age_group TEXT NOT NULL DEFAULT 'All Ages (8+)',
    level TEXT NOT NULL DEFAULT 'Beginner (Meythari)',
    schedule TEXT NOT NULL DEFAULT 'Mon / Tue / Wed / Fri / Sat',
    timing TEXT NOT NULL DEFAULT '05:30 AM - 07:00 AM',
    fee_details TEXT NOT NULL DEFAULT '₹2,500 / month',
    status TEXT NOT NULL DEFAULT 'open', -- 'open', 'filling_fast', 'closed'
    max_capacity INTEGER DEFAULT 20,
    photo_url TEXT DEFAULT '',
    highlights TEXT[] DEFAULT ARRAY['Daily training sessions', 'All skill levels welcome'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure photo_url column exists if table was created earlier without it
ALTER TABLE public.batches ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT '';

-- Photo & Video Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery (
    id TEXT PRIMARY KEY DEFAULT ('gal-' || floor(extract(epoch from now()) * 1000)::text),
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    media_type TEXT NOT NULL DEFAULT 'image', -- 'image', 'video'
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT DEFAULT '',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Services & Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY DEFAULT ('service-' || floor(extract(epoch from now()) * 1000)::text),
    title TEXT NOT NULL,
    level TEXT NOT NULL DEFAULT 'ALL LEVELS',
    badge TEXT NOT NULL DEFAULT 'SERVICE',
    summary TEXT DEFAULT '',
    description TEXT DEFAULT '',
    highlights TEXT[] DEFAULT ARRAY[]::TEXT[],
    photo_url TEXT DEFAULT '',
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- News & Events Table
CREATE TABLE IF NOT EXISTS public.news (
    id TEXT PRIMARY KEY DEFAULT ('news-' || floor(extract(epoch from now()) * 1000)::text),
    title TEXT NOT NULL,
    tag TEXT DEFAULT 'NEWS',
    date TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD'),
    summary TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Hero Banner Slides Table
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id TEXT PRIMARY KEY DEFAULT ('slide-' || floor(extract(epoch from now()) * 1000)::text),
    title_line_1 TEXT NOT NULL DEFAULT 'Creating a',
    title_line_2 TEXT NOT NULL DEFAULT 'Martial Symphony',
    title_italic TEXT NOT NULL DEFAULT 'for You',
    description TEXT DEFAULT '',
    badge_num TEXT DEFAULT '5.0★',
    badge_text TEXT DEFAULT 'RATED\nCVN\nKALARI',
    image TEXT NOT NULL,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inquiries & Appointments Table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id TEXT PRIMARY KEY DEFAULT ('inq-' || floor(extract(epoch from now()) * 1000)::text),
    type TEXT NOT NULL DEFAULT 'general', -- 'batch', 'treatment', 'general'
    name TEXT NOT NULL,
    age TEXT DEFAULT '',
    phone TEXT NOT NULL,
    details TEXT DEFAULT '',
    message TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Treatment Data Table (Single-row configuration)
CREATE TABLE IF NOT EXISTS public.treatment_data (
    id TEXT PRIMARY KEY DEFAULT 'primary_treatment',
    title TEXT NOT NULL DEFAULT 'Traditional Kalari Treatment',
    badge TEXT NOT NULL DEFAULT 'KALARI TREATMENT',
    tagline TEXT NOT NULL DEFAULT 'Healing',
    subtitle TEXT NOT NULL DEFAULT '🌿 Traditional Pain Relief & Body Care • By Prior Appointment',
    description TEXT DEFAULT '',
    photo_url TEXT DEFAULT '',
    highlights TEXT[] DEFAULT ARRAY[]::TEXT[],
    timing_info TEXT DEFAULT 'By Prior Appointment',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Site Visual Content Table (Single-row configuration)
CREATE TABLE IF NOT EXISTS public.site_content (
    id TEXT PRIMARY KEY DEFAULT 'primary_content',
    marquee_line1 TEXT DEFAULT 'AUTHENTIC VADAKKAN KALARIPAYATTU',
    marquee_line2 TEXT DEFAULT 'ESTD. VENGERI, KOZHIKODE',
    marquee_line3 TEXT DEFAULT 'SACRED WEAPONRY & AYURVEDIC MARMA CHIKITSA',
    hero_title_1 TEXT DEFAULT 'NORTHERN KALARIPAYATTU',
    hero_title_2 TEXT DEFAULT 'MADHURAKANDY C.V.N',
    hero_tag TEXT DEFAULT 'TRADITIONAL KUZHI KALARI',
    hero_bg_image TEXT DEFAULT '',
    home_about_tag TEXT DEFAULT 'SACRED LINEAGE & DISCIPLINE',
    home_about_heading TEXT DEFAULT 'A Timeless Sanctuary of Northern Kalari Warrior Arts',
    home_about_lead TEXT DEFAULT 'Preserving the uncompromised spirit of Vadakkan Kalarippayattu in its purest, sacred form.',
    home_about_body TEXT DEFAULT 'Rooted in Kozhikode, Madhurakandy C.V.N Kalari upholds centuries-old disciplines of bodily agility, breathwork, and sacred weapon mastery.',
    home_about_photo TEXT DEFAULT '',
    about_page_tag TEXT DEFAULT 'ABOUT MADHURAKANDY C.V.N KALARI',
    about_page_title TEXT DEFAULT 'The Living Lineage of Traditional Kalaripayattu',
    about_page_lead TEXT DEFAULT 'Preserving ancient martial wisdom and Marma healing heritage in Kozhikode, Kerala.',
    about_page_full_story TEXT DEFAULT '',
    about_page_photo TEXT DEFAULT '',
    home_guru_tag TEXT DEFAULT 'LINEAGE GURUKKAL',
    home_guru_title TEXT DEFAULT 'Sacred Knowledge Passed Hand to Hand',
    home_guru_subtitle TEXT DEFAULT 'Master of Northern Kalaripayattu & Traditional Marma Chikitsa',
    home_guru_bio TEXT DEFAULT 'Under the guidance of our revered Gurukkal, practitioners are initiated into physical prowess and profound mental serenity.',
    home_guru_image TEXT DEFAULT '',
    guru_page_title TEXT DEFAULT 'Our Gurukkal',
    guru_page_subtitle TEXT DEFAULT 'Master of Northern Kalaripayattu & Lineage Custodian',
    guru_page_full_bio TEXT DEFAULT '',
    guru_page_image TEXT DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Contact & Location Settings Table (Single-row configuration)
CREATE TABLE IF NOT EXISTS public.contact_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary_contact',
    primary_phone TEXT NOT NULL DEFAULT '+91 99471 39696',
    secondary_phone TEXT DEFAULT '099471 39696',
    whatsapp TEXT NOT NULL DEFAULT '+91 99471 39696',
    email TEXT NOT NULL DEFAULT 'info@madhurakandykalari.com',
    primary_location TEXT NOT NULL DEFAULT 'Madhurakandy C.V.N Kalari',
    full_address TEXT NOT NULL DEFAULT 'Madhura kandy, CVN KALARI, Vengeri, Kozhikode, Kerala 673010',
    map_embed_url TEXT NOT NULL DEFAULT 'https://maps.google.com/maps?q=Madhura+kandy+CVN+KALARI+Vengeri+Kozhikode+Kerala+673010&t=&z=15&ie=UTF8&iwloc=&output=embed',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES (Allow public reads and allow admin/portal writes)
DO $$
BEGIN
    -- Batches
    DROP POLICY IF EXISTS "Allow Read Batches" ON public.batches;
    DROP POLICY IF EXISTS "Allow Write Batches" ON public.batches;
    CREATE POLICY "Allow Read Batches" ON public.batches FOR SELECT TO anon, authenticated USING (true);
    CREATE POLICY "Allow Write Batches" ON public.batches FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    -- Gallery
    DROP POLICY IF EXISTS "Allow Read Gallery" ON public.gallery;
    DROP POLICY IF EXISTS "Allow Write Gallery" ON public.gallery;
    CREATE POLICY "Allow Read Gallery" ON public.gallery FOR SELECT TO anon, authenticated USING (true);
    CREATE POLICY "Allow Write Gallery" ON public.gallery FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    -- Courses
    DROP POLICY IF EXISTS "Allow Read Courses" ON public.courses;
    DROP POLICY IF EXISTS "Allow Write Courses" ON public.courses;
    CREATE POLICY "Allow Read Courses" ON public.courses FOR SELECT TO anon, authenticated USING (true);
    CREATE POLICY "Allow Write Courses" ON public.courses FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    -- News
    DROP POLICY IF EXISTS "Allow Read News" ON public.news;
    DROP POLICY IF EXISTS "Allow Write News" ON public.news;
    CREATE POLICY "Allow Read News" ON public.news FOR SELECT TO anon, authenticated USING (true);
    CREATE POLICY "Allow Write News" ON public.news FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    -- Hero Slides
    DROP POLICY IF EXISTS "Allow Read Hero Slides" ON public.hero_slides;
    DROP POLICY IF EXISTS "Allow Write Hero Slides" ON public.hero_slides;
    CREATE POLICY "Allow Read Hero Slides" ON public.hero_slides FOR SELECT TO anon, authenticated USING (true);
    CREATE POLICY "Allow Write Hero Slides" ON public.hero_slides FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    -- Inquiries
    DROP POLICY IF EXISTS "Allow Read Inquiries" ON public.inquiries;
    DROP POLICY IF EXISTS "Allow Write Inquiries" ON public.inquiries;
    CREATE POLICY "Allow Read Inquiries" ON public.inquiries FOR SELECT TO anon, authenticated USING (true);
    CREATE POLICY "Allow Write Inquiries" ON public.inquiries FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    -- Treatment Data
    DROP POLICY IF EXISTS "Allow Read Treatment" ON public.treatment_data;
    DROP POLICY IF EXISTS "Allow Write Treatment" ON public.treatment_data;
    CREATE POLICY "Allow Read Treatment" ON public.treatment_data FOR SELECT TO anon, authenticated USING (true);
    CREATE POLICY "Allow Write Treatment" ON public.treatment_data FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    -- Site Content
    DROP POLICY IF EXISTS "Allow Read Site Content" ON public.site_content;
    DROP POLICY IF EXISTS "Allow Write Site Content" ON public.site_content;
    CREATE POLICY "Allow Read Site Content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
    CREATE POLICY "Allow Write Site Content" ON public.site_content FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    -- Contact Settings
    DROP POLICY IF EXISTS "Allow Read Contact Settings" ON public.contact_settings;
    DROP POLICY IF EXISTS "Allow Write Contact Settings" ON public.contact_settings;
    CREATE POLICY "Allow Read Contact Settings" ON public.contact_settings FOR SELECT TO anon, authenticated USING (true);
    CREATE POLICY "Allow Write Contact Settings" ON public.contact_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
END $$;
