import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  kalariService,
  KalariCourse,
  KalariBatch,
  KalariGalleryItem,
  KalariNewsItem,
  KalariHeroSlide,
  KalariInquiry,
} from '../../services/kalariService';
import SEO from '../../components/common/SEO';
import {
  validateRequired,
  validateMediaFile,
  sanitizeText,
  sanitizeUrl,
  getAdminSession,
  clearAdminSession,
} from '../../lib/security';

type AdminTab = 'services' | 'batches' | 'gallery' | 'news' | 'hero_slides' | 'inquiries';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('services');
  const [adminUser, setAdminUser] = useState<string>('Gurukkal Admin');
  const [toast, setToast] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(() => {
    return kalariService.getCachedCourses().length === 0 && kalariService.getCachedBatches().length === 0;
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const navigate = useNavigate();

  // Data states initialized from instant local cache
  const [services, setServices] = useState<KalariCourse[]>(() => kalariService.getCachedCourses());
  const [batches, setBatches] = useState<KalariBatch[]>(() => kalariService.getCachedBatches());
  const [gallery, setGallery] = useState<KalariGalleryItem[]>(() => kalariService.getCachedGallery());
  const [news, setNews] = useState<KalariNewsItem[]>(() => kalariService.getCachedNews());
  const [heroSlides, setHeroSlides] = useState<KalariHeroSlide[]>(() => kalariService.getCachedHeroSlides());
  const [inquiries, setInquiries] = useState<KalariInquiry[]>(() => kalariService.getCachedInquiries());

  // Sub-filter for Gallery & Inquiries
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'image' | 'video'>('all');
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'batch' | 'treatment'>('all');

  // Modals & Active Edit States
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<KalariCourse> | null>(null);

  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Partial<KalariBatch> | null>(null);

  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Partial<KalariGalleryItem> | null>(null);

  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<Partial<KalariNewsItem> | null>(null);

  const [heroSlideModalOpen, setHeroSlideModalOpen] = useState(false);
  const [editingHeroSlide, setEditingHeroSlide] = useState<Partial<KalariHeroSlide> | null>(null);

  // Authentication check
  useEffect(() => {
    const { isValid, session } = getAdminSession();
    if (!isValid) {
      navigate('/admin/login');
      return;
    }
    if (session?.user?.email) {
      setAdminUser(session.user.email);
    }
  }, [navigate]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const loadData = async (isInitial = false) => {
    // Only display full-screen loader on initial mount if state is empty
    if (isInitial && services.length === 0 && batches.length === 0) {
      setLoading(true);
    }
    try {
      const [crs, bts, gls, nws, hsd, inqs] = await Promise.all([
        kalariService.getCourses(),
        kalariService.getBatches(),
        kalariService.getGallery(),
        kalariService.getNews(),
        kalariService.getHeroSlides(),
        kalariService.getInquiries(),
      ]);
      setServices(crs);
      setBatches(bts);
      setGallery(gls);
      setNews(nws);
      setHeroSlides(hsd);
      setInquiries(inqs);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      showToast('⚠️ Failed to load some records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(true);
    const handleUpdate = () => loadData(false);
    window.addEventListener('kalari_content_updated', handleUpdate);
    return () => window.removeEventListener('kalari_content_updated', handleUpdate);
  }, []);

  const handleLogout = () => {
    clearAdminSession();
    navigate('/admin/login');
  };

  // ─── Image Upload Handler with Device Compression ──────────────────────────
  const handleFileUpload = (file: File, onUrl: (url: string) => void) => {
    const valid = validateMediaFile(file);
    if (!valid.isValid) {
      showToast(valid.error || 'Invalid file format');
      return;
    }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawUrl = e.target?.result as string;
        if (!rawUrl) return;

        const img = new Image();
        img.onload = () => {
          // Web-optimized dimensions: max 720px is razor-sharp 2x retina for all cards
          // Reduces payload size by ~90% (from 800KB down to ~35KB) for lightning fast saves
          const maxDim = 720;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, w, h);
            // Ultra-lightweight JPEG at 0.72 quality
            const compressed = canvas.toDataURL('image/jpeg', 0.72);
            onUrl(compressed);
            showToast('✓ Photo ready (optimized for fast upload)');
            return;
          }
          onUrl(rawUrl);
          showToast('✓ Photo loaded from device');
        };
        img.onerror = () => {
          onUrl(rawUrl);
          showToast('✓ File loaded successfully');
        };
        img.src = rawUrl;
      };
      reader.onerror = () => {
        showToast('Failed to read file');
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onUrl(result);
          showToast('✓ File loaded successfully');
        }
      };
      reader.onerror = () => {
        showToast('Failed to read file');
      };
      reader.readAsDataURL(file);
    }
  };

  // ─── 1. SERVICES HANDLERS ──────────────────────────────────────────────────
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title?.trim()) {
      showToast('Please enter a service title');
      return;
    }
    setIsSaving(true);
    const servicePayload: Partial<KalariCourse> = {
      ...editingService,
      title: sanitizeText(editingService.title),
      summary: sanitizeText(editingService.summary || ''),
      description: sanitizeText(editingService.description || ''),
      badge: sanitizeText(editingService.badge || 'SERVICE'),
      photo_url: sanitizeUrl(editingService.photo_url || ''),
    };

    // Immediate optimistic update in state:
    if (servicePayload.id) {
      setServices((prev) =>
        prev.map((s) => (s.id === servicePayload.id ? ({ ...s, ...servicePayload } as KalariCourse) : s))
      );
    } else {
      setServices((prev) => [
        { ...servicePayload, id: `course-${Date.now()}`, display_order: prev.length + 1 } as KalariCourse,
        ...prev,
      ]);
    }
    setServiceModalOpen(false);
    setEditingService(null);
    showToast('✓ Service saved successfully');

    try {
      await kalariService.saveCourse(servicePayload);
      loadData(false);
    } catch {
      showToast('Saved locally');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    setServices((prev) => prev.filter((s) => s.id !== id));
    try {
      await kalariService.deleteCourse(id);
      showToast('✓ Service removed');
      loadData(false);
    } catch {
      showToast('Failed to remove service');
    }
  };

  // ─── 2. BATCHES HANDLERS ───────────────────────────────────────────────────
  const handleSaveBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch?.title?.trim()) {
      showToast('Please enter a batch title');
      return;
    }
    setIsSaving(true);
    const batchPayload: Partial<KalariBatch> = {
      ...editingBatch,
      title: sanitizeText(editingBatch.title),
      age_group: sanitizeText(editingBatch.age_group || 'All Ages (8+)'),
      schedule: sanitizeText(editingBatch.schedule || 'Daily'),
      timing: sanitizeText(editingBatch.timing || '05:30 AM - 07:00 AM'),
      fee_details: sanitizeText(editingBatch.fee_details || '₹2,500 / month'),
      photo_url: sanitizeUrl(editingBatch.photo_url || ''),
      highlights: (editingBatch.highlights || []).map((h) => sanitizeText(h)).filter(Boolean),
    };

    // Immediate optimistic update in state:
    if (batchPayload.id) {
      setBatches((prev) =>
        prev.map((b) => (b.id === batchPayload.id ? ({ ...b, ...batchPayload } as KalariBatch) : b))
      );
    } else {
      setBatches((prev) => [
        { ...batchPayload, id: `batch-${Date.now()}`, status: 'open', max_capacity: 20 } as KalariBatch,
        ...prev,
      ]);
    }
    setBatchModalOpen(false);
    setEditingBatch(null);
    showToast('✓ Batch saved successfully');

    try {
      await kalariService.saveBatch(batchPayload);
      loadData(false);
    } catch {
      showToast('Saved locally');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBatch = async (id: string, title: string) => {
    if (!confirm(`Delete training batch "${title}"?`)) return;
    setBatches((prev) => prev.filter((b) => b.id !== id));
    try {
      await kalariService.deleteBatch(id);
      showToast('✓ Batch removed');
      loadData(false);
    } catch {
      showToast('Failed to remove batch');
    }
  };

  // ─── 3. GALLERY HANDLERS ───────────────────────────────────────────────────
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery?.title?.trim() || !editingGallery?.url?.trim()) {
      showToast('Please provide a title and media URL');
      return;
    }
    setIsSaving(true);
    const galleryPayload: Partial<KalariGalleryItem> = {
      ...editingGallery,
      title: sanitizeText(editingGallery.title),
      url: sanitizeUrl(editingGallery.url),
      caption: sanitizeText(editingGallery.caption || ''),
      media_type: editingGallery.media_type || 'image',
      category: 'General',
    };

    // Immediate optimistic update:
    if (galleryPayload.id) {
      setGallery((prev) =>
        prev.map((g) => (g.id === galleryPayload.id ? ({ ...g, ...galleryPayload } as KalariGalleryItem) : g))
      );
    } else {
      setGallery((prev) => [
        { ...galleryPayload, id: `gl-${Date.now()}` } as KalariGalleryItem,
        ...prev,
      ]);
    }
    setGalleryModalOpen(false);
    setEditingGallery(null);
    showToast('✓ Media saved to gallery');

    try {
      await kalariService.saveGalleryItem(galleryPayload);
      loadData(false);
    } catch {
      showToast('Saved locally');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Remove this media from the gallery?')) return;
    setGallery((prev) => prev.filter((g) => g.id !== id));
    try {
      await kalariService.deleteGalleryItem(id);
      showToast('✓ Media removed');
      loadData(false);
    } catch {
      showToast('Failed to remove item');
    }
  };

  // ─── 4. NEWS & EVENTS HANDLERS ─────────────────────────────────────────────
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews?.title?.trim()) {
      showToast('Please enter an article title');
      return;
    }
    try {
      await kalariService.saveNewsItem({
        ...editingNews,
        title: sanitizeText(editingNews.title),
        tag: sanitizeText(editingNews.tag || 'NEWS'),
        summary: sanitizeText(editingNews.summary || ''),
        image_url: sanitizeUrl(editingNews.image_url || ''),
      });
      setNewsModalOpen(false);
      setEditingNews(null);
      showToast('✓ News article saved');
      loadData();
    } catch {
      showToast('Failed to save article');
    }
  };

  const handleDeleteNews = async (id: string, title: string) => {
    if (!confirm(`Delete article "${title}"?`)) return;
    try {
      await kalariService.deleteNewsItem(id);
      showToast('✓ Article deleted');
      loadData();
    } catch {
      showToast('Failed to delete news');
    }
  };

  // ─── 5. HERO SLIDES HANDLERS ───────────────────────────────────────────────
  const handleSaveHeroSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHeroSlide?.image?.trim()) {
      showToast('Please provide an image URL');
      return;
    }
    try {
      await kalariService.saveHeroSlide({
        ...editingHeroSlide,
        image: sanitizeUrl(editingHeroSlide.image),
        titleLine1: sanitizeText(editingHeroSlide.titleLine1 || 'Creating a'),
        titleLine2: sanitizeText(editingHeroSlide.titleLine2 || 'Martial Symphony'),
        titleItalic: sanitizeText(editingHeroSlide.titleItalic || 'for You'),
        desc: sanitizeText(editingHeroSlide.desc || ''),
        badgeNum: sanitizeText(editingHeroSlide.badgeNum || '5.0★'),
        badgeText: sanitizeText(editingHeroSlide.badgeText || 'RATED CVN KALARI'),
      });
      setHeroSlideModalOpen(false);
      setEditingHeroSlide(null);
      showToast('✓ Hero slide updated');
      loadData();
    } catch {
      showToast('Failed to save slide');
    }
  };

  const handleDeleteHeroSlide = async (id: string | number) => {
    if (heroSlides.length <= 1) {
      showToast('Cannot delete the last remaining hero slide');
      return;
    }
    if (!confirm('Remove this slide from the hero carousel?')) return;
    try {
      await kalariService.deleteHeroSlide(id);
      showToast('✓ Slide removed');
      loadData();
    } catch {
      showToast('Failed to remove slide');
    }
  };

  // ─── 6. INQUIRY HANDLERS ───────────────────────────────────────────────────
  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Delete this inquiry record?')) return;
    try {
      await kalariService.deleteInquiry(id);
      showToast('✓ Inquiry deleted');
      loadData();
    } catch {
      showToast('Failed to delete inquiry');
    }
  };

  return (
    <>
      <SEO title="Admin Portal — Madhurakandy C.V.N Kalari" description="Simple, secure management portal for Madhurakandy C.V.N Kalari." />

      <div style={{ backgroundColor: '#080503', color: '#f5eee6', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top Navbar */}
        <header
          style={{
            backgroundColor: 'rgba(18, 11, 6, 0.95)',
            borderBottom: '1px solid rgba(201, 147, 42, 0.25)',
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.4rem' }}>⚔️</span>
            <div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-gold)', margin: 0, fontWeight: 700 }}>
                Madhurakandy C.V.N Kalari
              </h1>
              <span style={{ fontSize: '0.68rem', color: 'var(--color-text-dim)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Admin Management Console
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Logged in: <strong style={{ color: '#fff' }}>{adminUser}</strong>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-gold)',
                  textDecoration: 'none',
                  border: '1px solid rgba(201, 147, 42, 0.4)',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '4px',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                🌐 View Site ↗
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: 'rgba(224, 48, 54, 0.15)',
                  color: '#ff5555',
                  border: '1px solid rgba(224, 48, 54, 0.35)',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Toast Alert */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                position: 'fixed',
                top: '5rem',
                right: '2rem',
                zIndex: 100,
                backgroundColor: '#1b120a',
                border: '1px solid var(--color-gold)',
                color: '#fff',
                padding: '0.75rem 1.4rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
              }}
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigation Strip */}
        <div
          className="no-scrollbar"
          style={{
            backgroundColor: '#0d0805',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0 clamp(0.5rem, 2vw, 2rem)',
            display: 'flex',
            gap: '0.35rem',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {[
            { id: 'services', label: '⚔️ Services', count: services.length },
            { id: 'batches', label: '🗓️ Batches', count: batches.length },
            { id: 'gallery', label: '🖼️ Gallery Media', count: gallery.length },
            { id: 'news', label: '📰 News & Events', count: news.length },
            { id: 'hero_slides', label: '🌄 Hero Slides', count: heroSlides.length },
            { id: 'inquiries', label: '📬 Inquiries', count: inquiries.length },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                style={{
                  padding: '1rem 1.4rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--color-gold)' : '2px solid transparent',
                  color: isActive ? 'var(--color-gold)' : 'var(--color-text-dim)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s',
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    backgroundColor: isActive ? 'rgba(201, 147, 42, 0.2)' : 'rgba(255,255,255,0.06)',
                    color: isActive ? 'var(--color-gold)' : 'rgba(255,255,255,0.5)',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '10px',
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <main style={{ padding: 'clamp(1rem, 2.5vw, 2rem)', flex: 1, maxWidth: '1600px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--color-gold)' }}>
              Loading data...
            </div>
          ) : (
            <>
              {/* ────────────────────────────────────────────────────────────
                  1. SERVICES TAB
              ──────────────────────────────────────────────────────────── */}
              {activeTab === 'services' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#fff', margin: 0 }}>
                        Academy Services & Offerings
                      </h2>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)', margin: '0.3rem 0 0' }}>
                        Manage the 5 services displayed in the "Our Services" section on the website.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingService({
                          title: '',
                          badge: 'SERVICE',
                          level: 'ALL LEVELS',
                          summary: '',
                          description: '',
                          photo_url: '',
                          highlights: ['Foundational instruction', 'Personalized guidance'],
                          display_order: services.length + 1,
                        });
                        setServiceModalOpen(true);
                      }}
                      className="btn-kalari-gold"
                      style={{ padding: '0.65rem 1.4rem', fontSize: '0.82rem' }}
                    >
                      + Add New Service
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.5rem' }}>
                    {services.map((srv, idx) => (
                      <div
                        key={srv.id || idx}
                        style={{
                          backgroundColor: 'rgba(20, 13, 8, 0.95)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <div style={{ height: '170px', position: 'relative', overflow: 'hidden' }}>
                          <img
                            src={srv.photo_url || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop'}
                            alt={srv.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <span
                            style={{
                              position: 'absolute',
                              top: '0.75rem',
                              left: '0.75rem',
                              backgroundColor: 'var(--color-kalari-red)',
                              color: '#fff',
                              fontSize: '0.62rem',
                              fontWeight: 700,
                              letterSpacing: '0.1em',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '3px',
                            }}
                          >
                            {srv.badge || 'SERVICE'}
                          </span>
                        </div>

                        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#fff', margin: '0 0 0.4rem' }}>
                            {srv.title}
                          </h3>
                          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', lineHeight: 1.5, margin: '0 0 1rem', flex: 1 }}>
                            {srv.summary}
                          </p>

                          <div style={{ display: 'flex', gap: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.8rem' }}>
                            <button
                              onClick={() => {
                                setEditingService(srv);
                                setServiceModalOpen(true);
                              }}
                              style={{
                                flex: 1,
                                padding: '0.5rem',
                                backgroundColor: 'rgba(201, 147, 42, 0.15)',
                                color: 'var(--color-gold)',
                                border: '1px solid rgba(201, 147, 42, 0.4)',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteService(srv.id, srv.title)}
                              style={{
                                padding: '0.5rem 0.8rem',
                                backgroundColor: 'rgba(224, 48, 54, 0.1)',
                                color: '#ff6666',
                                border: '1px solid rgba(224, 48, 54, 0.3)',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────────
                  2. BATCHES TAB
              ──────────────────────────────────────────────────────────── */}
              {activeTab === 'batches' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#fff', margin: 0 }}>
                        Training Batches & Admissions
                      </h2>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)', margin: '0.3rem 0 0' }}>
                        Manage daily and weekend batches, timings, schedules, and capacity.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingBatch({
                          title: '',
                          age_group: 'All Ages (8+)',
                          level: 'All Levels',
                          schedule: 'Mon / Tue / Wed / Fri / Sat',
                          timing: '05:30 AM - 07:00 AM',
                          fee_details: '₹2,500 / month',
                          status: 'open',
                          max_capacity: 20,
                          photo_url: '',
                        });
                        setBatchModalOpen(true);
                      }}
                      className="btn-kalari-gold"
                      style={{ padding: '0.65rem 1.4rem', fontSize: '0.82rem' }}
                    >
                      + Add New Batch
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.5rem' }}>
                    {batches.map((batch) => (
                      <div
                        key={batch.id}
                        style={{
                          backgroundColor: 'rgba(20, 13, 8, 0.95)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          padding: '1.2rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.8rem',
                          overflow: 'hidden',
                        }}
                      >
                        {batch.photo_url && (
                          <div style={{ height: '120px', borderRadius: '4px', overflow: 'hidden', margin: '-0.2rem -0.2rem 0.4rem', backgroundColor: '#000' }}>
                            <img src={batch.photo_url} alt={batch.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--color-gold)', margin: 0 }}>
                            {batch.title}
                          </h3>
                          <span
                            style={{
                              fontSize: '0.65rem',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '3px',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              backgroundColor:
                                batch.status === 'open'
                                  ? 'rgba(37, 211, 102, 0.2)'
                                  : batch.status === 'filling_fast'
                                  ? 'rgba(255, 170, 0, 0.2)'
                                  : 'rgba(224, 48, 54, 0.2)',
                              color:
                                batch.status === 'open'
                                  ? '#25d366'
                                  : batch.status === 'filling_fast'
                                  ? '#ffaa00'
                                  : '#ff5555',
                            }}
                          >
                            {batch.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <div>⏰ <strong>Timing:</strong> {batch.timing}</div>
                          <div>📅 <strong>Days:</strong> {batch.schedule}</div>
                          <div>🥋 <strong>Target:</strong> {batch.age_group}</div>
                          <div>💰 <strong>Fee:</strong> {batch.fee_details || 'Contact'}</div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.6rem', marginTop: 'auto', paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                          <button
                            onClick={() => {
                              setEditingBatch(batch);
                              setBatchModalOpen(true);
                            }}
                            style={{
                              flex: 1,
                              padding: '0.5rem',
                              backgroundColor: 'rgba(201, 147, 42, 0.15)',
                              color: 'var(--color-gold)',
                              border: '1px solid rgba(201, 147, 42, 0.4)',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBatch(batch.id, batch.title)}
                            style={{
                              padding: '0.5rem 0.8rem',
                              backgroundColor: 'rgba(224, 48, 54, 0.1)',
                              color: '#ff6666',
                              border: '1px solid rgba(224, 48, 54, 0.3)',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────────
                  3. GALLERY TAB
              ──────────────────────────────────────────────────────────── */}
              {activeTab === 'gallery' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#fff', margin: 0 }}>
                        Photo & Video Gallery
                      </h2>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)', margin: '0.3rem 0 0' }}>
                        Add photo demonstrations, weapon spars, and video highlights to the gallery showcase.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                      <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', padding: '2px' }}>
                        {(['all', 'image', 'video'] as const).map((filter) => (
                          <button
                            key={filter}
                            onClick={() => setGalleryFilter(filter)}
                            style={{
                              padding: '0.35rem 0.8rem',
                              backgroundColor: galleryFilter === filter ? 'var(--color-gold)' : 'transparent',
                              color: galleryFilter === filter ? '#000' : 'rgba(255,255,255,0.7)',
                              border: 'none',
                              borderRadius: '3px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              textTransform: 'uppercase',
                            }}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setEditingGallery({
                            title: '',
                            category: 'General',
                            media_type: 'image',
                            url: '',
                            caption: '',
                            display_order: gallery.length + 1,
                          });
                          setGalleryModalOpen(true);
                        }}
                        className="btn-kalari-gold"
                        style={{ padding: '0.65rem 1.4rem', fontSize: '0.82rem' }}
                      >
                        + Add Media
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', gap: '1.2rem' }}>
                    {gallery
                      .filter((item) => galleryFilter === 'all' || item.media_type === galleryFilter)
                      .map((item) => (
                        <div
                          key={item.id}
                          style={{
                            backgroundColor: 'rgba(20, 13, 8, 0.95)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <div style={{ height: '170px', position: 'relative', backgroundColor: '#000' }}>
                            {item.media_type === 'video' && item.url.includes('embed') ? (
                              <iframe
                                src={item.url}
                                title={item.title}
                                style={{ width: '100%', height: '100%', border: 'none' }}
                              />
                            ) : (item.thumbnail_url || item.url) ? (
                              <img
                                src={item.thumbnail_url || item.url}
                                alt={item.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>
                                ⏳ Loading image...
                              </div>
                            )}
                            <span
                              style={{
                                position: 'absolute',
                                top: '0.6rem',
                                left: '0.6rem',
                                backgroundColor: item.media_type === 'video' ? 'var(--color-kalari-red)' : 'rgba(0,0,0,0.7)',
                                color: '#fff',
                                fontSize: '0.58rem',
                                fontWeight: 700,
                                padding: '0.18rem 0.5rem',
                                borderRadius: '3px',
                                letterSpacing: '0.1em',
                              }}
                            >
                              {item.media_type === 'video' ? '▶ VIDEO' : '📷 PHOTO'}
                            </span>
                          </div>

                          <div style={{ padding: '0.9rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem', color: '#fff', margin: '0.2rem 0 0.4rem', lineHeight: 1.3 }}>
                              {item.title}
                            </h4>
                            {item.caption && (
                              <p style={{ fontSize: '0.74rem', color: 'var(--color-text-dim)', margin: '0 0 0.8rem', lineHeight: 1.4, flex: 1 }}>
                                {item.caption}
                              </p>
                            )}

                            <button
                              onClick={() => handleDeleteGallery(item.id)}
                              style={{
                                marginTop: 'auto',
                                width: '100%',
                                padding: '0.45rem',
                                backgroundColor: 'rgba(224, 48, 54, 0.12)',
                                color: '#ff6666',
                                border: '1px solid rgba(224, 48, 54, 0.3)',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                cursor: 'pointer',
                              }}
                            >
                              Remove from Gallery
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────────
                  4. NEWS & EVENTS TAB
              ──────────────────────────────────────────────────────────── */}
              {activeTab === 'news' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#fff', margin: 0 }}>
                        News, Updates & Events
                      </h2>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)', margin: '0.3rem 0 0' }}>
                        Post academy announcements, stage show reports, and event stories.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingNews({
                          title: '',
                          tag: 'NEWS',
                          date: new Date().toISOString().split('T')[0],
                          summary: '',
                          image_url: '',
                        });
                        setNewsModalOpen(true);
                      }}
                      className="btn-kalari-gold"
                      style={{ padding: '0.65rem 1.4rem', fontSize: '0.82rem' }}
                    >
                      + Add News Story
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.5rem' }}>
                    {news.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          backgroundColor: 'rgba(20, 13, 8, 0.95)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        {item.image_url && (
                          <div style={{ height: '160px', overflow: 'hidden' }}>
                            <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        )}

                        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.68rem' }}>
                            <span style={{ color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.1em' }}>{item.tag}</span>
                            <span style={{ color: 'var(--color-text-dim)' }}>{item.date}</span>
                          </div>

                          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#fff', margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                            {item.title}
                          </h3>
                          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)', lineHeight: 1.5, margin: '0 0 1rem', flex: 1 }}>
                            {item.summary}
                          </p>

                          <div style={{ display: 'flex', gap: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.8rem' }}>
                            <button
                              onClick={() => {
                                setEditingNews(item);
                                setNewsModalOpen(true);
                              }}
                              style={{
                                flex: 1,
                                padding: '0.5rem',
                                backgroundColor: 'rgba(201, 147, 42, 0.15)',
                                color: 'var(--color-gold)',
                                border: '1px solid rgba(201, 147, 42, 0.4)',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteNews(item.id, item.title)}
                              style={{
                                padding: '0.5rem 0.8rem',
                                backgroundColor: 'rgba(224, 48, 54, 0.1)',
                                color: '#ff6666',
                                border: '1px solid rgba(224, 48, 54, 0.3)',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────────
                  5. HERO BANNER SLIDES TAB
              ──────────────────────────────────────────────────────────── */}
              {activeTab === 'hero_slides' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#fff', margin: 0 }}>
                        Hero Banner Slideshow
                      </h2>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)', margin: '0.3rem 0 0' }}>
                        Change the rotating background photos and titles in the main homepage banner.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingHeroSlide({
                          image: '',
                          titleLine1: 'Experience the',
                          titleLine2: 'Martial Spirit',
                          titleItalic: 'of Kalari',
                          desc: 'Authentic Vadakkan Kalaripayattu lineage and Kuzhi Kalari practice in Kozhikode.',
                          badgeNum: '5.0★',
                          badgeText: 'RATED CVN KALARI',
                          display_order: heroSlides.length + 1,
                        });
                        setHeroSlideModalOpen(true);
                      }}
                      className="btn-kalari-gold"
                      style={{ padding: '0.65rem 1.4rem', fontSize: '0.82rem' }}
                    >
                      + Add New Slide
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.5rem' }}>
                    {heroSlides.map((slide, idx) => (
                      <div
                        key={slide.id || idx}
                        style={{
                          backgroundColor: 'rgba(20, 13, 8, 0.95)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        {/* Slide Image Preview with Slide Number Badge */}
                        <div style={{ height: '200px', position: 'relative', overflow: 'hidden', backgroundColor: '#000' }}>
                          <img
                            src={slide.image}
                            alt={`Slide ${idx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <span
                            style={{
                              position: 'absolute',
                              top: '0.75rem',
                              left: '0.75rem',
                              backgroundColor: 'rgba(0,0,0,0.85)',
                              border: '1px solid var(--color-gold)',
                              color: 'var(--color-gold)',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              padding: '0.25rem 0.65rem',
                              borderRadius: '3px',
                            }}
                          >
                            Slide {idx + 1}
                          </span>
                          <span
                            style={{
                              position: 'absolute',
                              bottom: '0.75rem',
                              right: '0.75rem',
                              backgroundColor: 'var(--color-kalari-red)',
                              color: '#fff',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.6rem',
                              borderRadius: '3px',
                            }}
                          >
                            {slide.badgeNum}
                          </span>
                        </div>

                        {/* Slide Details */}
                        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#fff', margin: '0 0 0.35rem', lineHeight: 1.25 }}>
                            {slide.titleLine1} <span style={{ color: 'var(--color-gold)' }}>{slide.titleLine2}</span>{' '}
                            <span style={{ fontFamily: 'var(--font-script)', color: 'var(--color-kalari-red)' }}>{slide.titleItalic}</span>
                          </h4>
                          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', lineHeight: 1.5, margin: '0 0 1rem', flex: 1 }}>
                            {slide.desc}
                          </p>

                          <div style={{ display: 'flex', gap: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.8rem' }}>
                            <button
                              onClick={() => {
                                setEditingHeroSlide(slide);
                                setHeroSlideModalOpen(true);
                              }}
                              style={{
                                flex: 1,
                                padding: '0.5rem',
                                backgroundColor: 'rgba(201, 147, 42, 0.15)',
                                color: 'var(--color-gold)',
                                border: '1px solid rgba(201, 147, 42, 0.4)',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              Change Photo / Edit
                            </button>
                            <button
                              onClick={() => handleDeleteHeroSlide(slide.id)}
                              style={{
                                padding: '0.5rem 0.8rem',
                                backgroundColor: 'rgba(224, 48, 54, 0.1)',
                                color: '#ff6666',
                                border: '1px solid rgba(224, 48, 54, 0.3)',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────────
                  6. INQUIRIES TAB
              ──────────────────────────────────────────────────────────── */}
              {activeTab === 'inquiries' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#fff', margin: 0 }}>
                        Student & Patient Inquiries
                      </h2>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)', margin: '0.3rem 0 0' }}>
                        Messages submitted via batch registration, treatment inquiry, and consultation forms.
                      </p>
                    </div>

                    <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', padding: '2px' }}>
                      {(['all', 'batch', 'treatment'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setInquiryFilter(filter)}
                          style={{
                            padding: '0.35rem 0.8rem',
                            backgroundColor: inquiryFilter === filter ? 'var(--color-gold)' : 'transparent',
                            color: inquiryFilter === filter ? '#000' : 'rgba(255,255,255,0.7)',
                            border: 'none',
                            borderRadius: '3px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                          }}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  {inquiries.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-dim)' }}>
                      No inquiries recorded yet.
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)', color: 'var(--color-gold)' }}>
                            <th style={{ padding: '0.8rem' }}>Date</th>
                            <th style={{ padding: '0.8rem' }}>Type</th>
                            <th style={{ padding: '0.8rem' }}>Name</th>
                            <th style={{ padding: '0.8rem' }}>Age</th>
                            <th style={{ padding: '0.8rem' }}>Phone</th>
                            <th style={{ padding: '0.8rem' }}>Details</th>
                            <th style={{ padding: '0.8rem', textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inquiries
                            .filter((inq) => inquiryFilter === 'all' || inq.type === inquiryFilter)
                            .map((inq) => {
                              const cleanPhone = inq.phone.replace(/[^0-9]/g, '');
                              return (
                                <tr key={inq.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                  <td style={{ padding: '0.8rem', color: 'var(--color-text-dim)', fontSize: '0.78rem' }}>
                                    {new Date(inq.created_at).toLocaleDateString()}
                                  </td>
                                  <td style={{ padding: '0.8rem' }}>
                                    <span
                                      style={{
                                        fontSize: '0.65rem',
                                        padding: '0.15rem 0.5rem',
                                        borderRadius: '3px',
                                        fontWeight: 700,
                                        backgroundColor: inq.type === 'treatment' ? 'rgba(201, 147, 42, 0.2)' : 'rgba(224, 48, 54, 0.2)',
                                        color: inq.type === 'treatment' ? 'var(--color-gold)' : '#ff6666',
                                        textTransform: 'uppercase',
                                      }}
                                    >
                                      {inq.type}
                                    </span>
                                  </td>
                                  <td style={{ padding: '0.8rem', fontWeight: 600 }}>{inq.name}</td>
                                  <td style={{ padding: '0.8rem' }}>{inq.age}</td>
                                  <td style={{ padding: '0.8rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                      <a href={`tel:${cleanPhone}`} style={{ color: 'var(--color-gold)', textDecoration: 'none' }}>
                                        📞 {inq.phone}
                                      </a>
                                      <a
                                        href={`https://wa.me/${cleanPhone}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#25d366', textDecoration: 'none', fontSize: '0.8rem' }}
                                        title="Chat on WhatsApp"
                                      >
                                        💬
                                      </a>
                                    </div>
                                  </td>
                                  <td style={{ padding: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>
                                    <div>{inq.details}</div>
                                    {inq.message && <div style={{ fontSize: '0.74rem', color: 'var(--color-text-dim)', marginTop: '0.2rem' }}>"{inq.message}"</div>}
                                  </td>
                                  <td style={{ padding: '0.8rem', textAlign: 'right' }}>
                                    <button
                                      onClick={() => handleDeleteInquiry(inq.id)}
                                      style={{
                                        backgroundColor: 'transparent',
                                        color: '#ff6666',
                                        border: '1px solid rgba(224, 48, 54, 0.3)',
                                        padding: '0.3rem 0.6rem',
                                        borderRadius: '4px',
                                        fontSize: '0.7rem',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>

        {/* ═══════════════════════════════════════════════════════════════════════
            MODALS FOR DATA CREATION AND EDITING
        ═══════════════════════════════════════════════════════════════════════ */}

        {/* 1. SERVICE MODAL */}
        <AnimatePresence>
          {serviceModalOpen && editingService && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(10px)',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
              }}
              onClick={() => setServiceModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                style={{
                  backgroundColor: '#140c07',
                  border: '1px solid var(--color-gold)',
                  borderRadius: '10px',
                  maxWidth: '560px',
                  width: '100%',
                  maxHeight: '92vh',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div style={{ padding: '1.2rem 1.6rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--color-gold)', margin: 0 }}>
                    {editingService.id ? 'Edit Service' : 'Add New Service'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setServiceModalOpen(false)}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '1.3rem', cursor: 'pointer', lineHeight: 1 }}
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Body Form */}
                <form onSubmit={handleSaveService} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                  <div style={{ padding: '1.4rem 1.6rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--color-gold)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Service Title *</label>
                      <input
                        required
                        type="text"
                        value={editingService.title || ''}
                        onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                        placeholder="e.g. Kalarippayattu Training, Workshop, Stage Show"
                        style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', display: 'block', marginBottom: '0.35rem' }}>Badge Tag</label>
                        <input
                          type="text"
                          value={editingService.badge || ''}
                          onChange={(e) => setEditingService({ ...editingService, badge: e.target.value })}
                          placeholder="e.g. DAILY BATCHES, LIVE PERFORMANCE"
                          style={{ width: '100%', padding: '0.6rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', display: 'block', marginBottom: '0.35rem' }}>Level / Category</label>
                        <input
                          type="text"
                          value={editingService.level || ''}
                          onChange={(e) => setEditingService({ ...editingService, level: e.target.value })}
                          placeholder="e.g. ALL AGES, STAGE SHOW"
                          style={{ width: '100%', padding: '0.6rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--color-gold)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Short Summary (Card Preview) *</label>
                      <textarea
                        required
                        rows={2}
                        value={editingService.summary || ''}
                        onChange={(e) => setEditingService({ ...editingService, summary: e.target.value })}
                        placeholder="Brief 1-2 sentence description shown on front card..."
                        style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box', resize: 'vertical' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', display: 'block', marginBottom: '0.35rem' }}>Full Description (Modal Dialog)</label>
                      <textarea
                        rows={3}
                        value={editingService.description || ''}
                        onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                        placeholder="Detailed explanation of curriculum, schedule, or performance details..."
                        style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box', resize: 'vertical' }}
                      />
                    </div>

                    {/* Dedicated Image Upload Section */}
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,147,42,0.25)', borderRadius: '6px', padding: '1rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--color-gold)', display: 'block', marginBottom: '0.6rem', fontWeight: 600 }}>
                        Service Cover Photo
                      </label>
                      
                      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                        <input
                          id="service-file-upload"
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, (url) => setEditingService({ ...editingService, photo_url: url }));
                          }}
                        />
                        <label
                          htmlFor="service-file-upload"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.65rem 1.2rem',
                            backgroundColor: 'rgba(201, 147, 42, 0.2)',
                            border: '1px solid var(--color-gold)',
                            borderRadius: '4px',
                            color: 'var(--color-gold)',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          📁 Choose File from Device
                        </label>
                        <span style={{ fontSize: '0.74rem', color: 'var(--color-text-dim)' }}>or paste image link below</span>
                      </div>

                      <input
                        type="text"
                        value={editingService.photo_url || ''}
                        onChange={(e) => setEditingService({ ...editingService, photo_url: e.target.value })}
                        placeholder="https://images.unsplash.com/... or data:image..."
                        style={{ width: '100%', padding: '0.6rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box', fontSize: '0.8rem' }}
                      />

                      {editingService.photo_url && (
                        <div style={{ position: 'relative', marginTop: '0.8rem', height: '140px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(201,147,42,0.3)' }}>
                          <img src={editingService.photo_url} alt="Service Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            type="button"
                            onClick={() => setEditingService({ ...editingService, photo_url: '' })}
                            style={{
                              position: 'absolute',
                              top: '0.5rem',
                              right: '0.5rem',
                              backgroundColor: 'rgba(0,0,0,0.85)',
                              color: '#ff6666',
                              border: '1px solid rgba(255,100,100,0.4)',
                              borderRadius: '4px',
                              padding: '0.3rem 0.7rem',
                              fontSize: '0.72rem',
                              cursor: 'pointer',
                              fontWeight: 600,
                            }}
                          >
                            ✕ Remove Photo
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fixed Footer Actions */}
                  <div style={{ padding: '1rem 1.6rem', borderTop: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(15, 8, 4, 0.98)', display: 'flex', gap: '0.8rem' }}>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="btn-kalari-gold"
                      style={{ flex: 1, padding: '0.75rem', opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}
                    >
                      {isSaving ? 'Saving...' : 'Save Service'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setServiceModalOpen(false)}
                      style={{ padding: '0.75rem 1.4rem', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. BATCH MODAL */}
        <AnimatePresence>
          {batchModalOpen && editingBatch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(10px)',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
              }}
              onClick={() => setBatchModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                style={{
                  backgroundColor: '#140c07',
                  border: '1px solid var(--color-gold)',
                  borderRadius: '10px',
                  maxWidth: '560px',
                  width: '100%',
                  maxHeight: '92vh',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div style={{ padding: '1.2rem 1.6rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--color-gold)', margin: 0 }}>
                    {editingBatch.id ? 'Edit Batch' : 'Add New Training Batch'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setBatchModalOpen(false)}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '1.3rem', cursor: 'pointer', lineHeight: 1 }}
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Body Form */}
                <form onSubmit={handleSaveBatch} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                  <div style={{ padding: '1.4rem 1.6rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--color-gold)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Batch Title *</label>
                      <input
                        required
                        type="text"
                        value={editingBatch.title || ''}
                        onChange={(e) => setEditingBatch({ ...editingBatch, title: e.target.value })}
                        placeholder="e.g. Morning Batch, Weekend Intensive"
                        style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', display: 'block', marginBottom: '0.35rem' }}>Age Group / Level</label>
                        <input
                          type="text"
                          value={editingBatch.age_group || ''}
                          onChange={(e) => setEditingBatch({ ...editingBatch, age_group: e.target.value })}
                          placeholder="e.g. All Ages (8+)"
                          style={{ width: '100%', padding: '0.6rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', display: 'block', marginBottom: '0.35rem' }}>Status</label>
                        <select
                          value={editingBatch.status || 'open'}
                          onChange={(e) => setEditingBatch({ ...editingBatch, status: e.target.value as any })}
                          style={{ width: '100%', padding: '0.6rem', backgroundColor: '#1e130c', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                        >
                          <option value="open">Open for Admission</option>
                          <option value="filling_fast">Filling Fast</option>
                          <option value="closed">Closed / Full</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', color: 'var(--color-gold)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Schedule Days *</label>
                        <input
                          required
                          type="text"
                          value={editingBatch.schedule || ''}
                          onChange={(e) => setEditingBatch({ ...editingBatch, schedule: e.target.value })}
                          placeholder="e.g. Mon / Tue / Wed / Fri / Sat"
                          style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.78rem', color: 'var(--color-gold)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Timing *</label>
                        <input
                          required
                          type="text"
                          value={editingBatch.timing || ''}
                          onChange={(e) => setEditingBatch({ ...editingBatch, timing: e.target.value })}
                          placeholder="e.g. 05:30 AM - 07:00 AM"
                          style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>

                    {/* Batch Description / Highlights */}
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,147,42,0.2)', borderRadius: '6px', padding: '1rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--color-gold)', display: 'block', marginBottom: '0.6rem', fontWeight: 600 }}>
                        📝 Batch Description (3 Bullet Points)
                      </label>
                      <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginBottom: '0.8rem', lineHeight: 1.5 }}>
                        These 3 lines appear as bullet points on the website batch card (e.g. style, schedule, audience).
                      </p>
                      {[0, 1, 2].map((idx) => (
                        <div key={idx} style={{ marginBottom: '0.6rem' }}>
                          <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '0.25rem' }}>Point {idx + 1}</label>
                          <input
                            type="text"
                            value={(editingBatch.highlights || [])[idx] || ''}
                            onChange={(e) => {
                              const curr = [...(editingBatch.highlights || ['', '', ''])];
                              while (curr.length < 3) curr.push('');
                              curr[idx] = e.target.value;
                              setEditingBatch({ ...editingBatch, highlights: curr });
                            }}
                            placeholder={idx === 0 ? 'e.g. Brahmamuhurtham Meythari, high kicks & agility' : idx === 1 ? 'e.g. Mon / Tue / Wed / Fri / Sat (05:30 AM – 07:00 AM)' : 'e.g. Open for all age groups (8+) & all skill levels'}
                            style={{ width: '100%', padding: '0.6rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box', fontSize: '0.82rem' }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Dedicated Batch Image Upload Section */}
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,147,42,0.25)', borderRadius: '6px', padding: '1rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--color-gold)', display: 'block', marginBottom: '0.6rem', fontWeight: 600 }}>
                        Batch Cover Photo (Optional)
                      </label>
                      
                      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                        <input
                          id="batch-file-upload"
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, (url) => setEditingBatch({ ...editingBatch, photo_url: url }));
                          }}
                        />
                        <label
                          htmlFor="batch-file-upload"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.65rem 1.2rem',
                            backgroundColor: 'rgba(201, 147, 42, 0.2)',
                            border: '1px solid var(--color-gold)',
                            borderRadius: '4px',
                            color: 'var(--color-gold)',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          📁 Choose Photo from Device
                        </label>
                        <span style={{ fontSize: '0.74rem', color: 'var(--color-text-dim)' }}>or paste image link below</span>
                      </div>

                      <input
                        type="text"
                        value={editingBatch.photo_url || ''}
                        onChange={(e) => setEditingBatch({ ...editingBatch, photo_url: e.target.value })}
                        placeholder="https://images.unsplash.com/... or data:image..."
                        style={{ width: '100%', padding: '0.6rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box', fontSize: '0.8rem' }}
                      />

                      {editingBatch.photo_url && (
                        <div style={{ position: 'relative', marginTop: '0.8rem', height: '140px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(201,147,42,0.3)' }}>
                          <img src={editingBatch.photo_url} alt="Batch Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            type="button"
                            onClick={() => setEditingBatch({ ...editingBatch, photo_url: '' })}
                            style={{
                              position: 'absolute',
                              top: '0.5rem',
                              right: '0.5rem',
                              backgroundColor: 'rgba(0,0,0,0.85)',
                              color: '#ff6666',
                              border: '1px solid rgba(255,100,100,0.4)',
                              borderRadius: '4px',
                              padding: '0.3rem 0.7rem',
                              fontSize: '0.72rem',
                              cursor: 'pointer',
                              fontWeight: 600,
                            }}
                          >
                            ✕ Remove Photo
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fixed Footer Actions */}
                  <div style={{ padding: '1rem 1.6rem', borderTop: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(15, 8, 4, 0.98)', display: 'flex', gap: '0.8rem' }}>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="btn-kalari-gold"
                      style={{ flex: 1, padding: '0.75rem', opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}
                    >
                      {isSaving ? 'Saving...' : 'Save Batch'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBatchModalOpen(false)}
                      style={{ padding: '0.75rem 1.4rem', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. GALLERY MODAL */}
        <AnimatePresence>
          {galleryModalOpen && editingGallery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(10px)',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
              }}
              onClick={() => setGalleryModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                style={{
                  backgroundColor: '#140c07',
                  border: '1px solid var(--color-gold)',
                  borderRadius: '10px',
                  maxWidth: '560px',
                  width: '100%',
                  maxHeight: '92vh',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div style={{ padding: '1.2rem 1.6rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--color-gold)', margin: 0 }}>
                    {editingGallery.id ? 'Edit Media' : 'Add Photo / Video to Gallery'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setGalleryModalOpen(false)}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '1.3rem', cursor: 'pointer', lineHeight: 1 }}
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Body Form */}
                <form onSubmit={handleSaveGallery} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                  <div style={{ padding: '1.4rem 1.6rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--color-gold)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Title / Caption Heading *</label>
                      <input
                        required
                        type="text"
                        value={editingGallery.title || ''}
                        onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                        placeholder="e.g. Urumi Flexible Blade Sparring"
                        style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', display: 'block', marginBottom: '0.35rem' }}>Media Type</label>
                      <select
                        value={editingGallery.media_type || 'image'}
                        onChange={(e) => setEditingGallery({ ...editingGallery, media_type: e.target.value as any })}
                        style={{ width: '100%', padding: '0.6rem', backgroundColor: '#1e130c', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                      >
                        <option value="image">📷 Photo</option>
                        <option value="video">▶ Video Embed</option>
                      </select>
                    </div>

                    {editingGallery.media_type === 'image' ? (
                      /* Dedicated Image Upload Section */
                      <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,147,42,0.25)', borderRadius: '6px', padding: '1rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--color-gold)', display: 'block', marginBottom: '0.6rem', fontWeight: 600 }}>
                          Photo File
                        </label>
                        
                        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                          <input
                            id="gallery-file-upload"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, (url) => setEditingGallery({ ...editingGallery, url }));
                            }}
                          />
                          <label
                            htmlFor="gallery-file-upload"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.65rem 1.2rem',
                              backgroundColor: 'rgba(201, 147, 42, 0.2)',
                              border: '1px solid var(--color-gold)',
                              borderRadius: '4px',
                              color: 'var(--color-gold)',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            📁 Choose File from Device
                          </label>
                          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-dim)' }}>or paste link below</span>
                        </div>

                        <input
                          type="text"
                          value={editingGallery.url || ''}
                          onChange={(e) => setEditingGallery({ ...editingGallery, url: e.target.value })}
                          placeholder="https://images.unsplash.com/... or data:image..."
                          style={{ width: '100%', padding: '0.6rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box', fontSize: '0.8rem' }}
                        />

                        {editingGallery.url && (
                          <div style={{ position: 'relative', marginTop: '0.8rem', height: '140px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(201,147,42,0.3)' }}>
                            <img src={editingGallery.url} alt="Gallery Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                              type="button"
                              onClick={() => setEditingGallery({ ...editingGallery, url: '' })}
                              style={{
                                position: 'absolute',
                                top: '0.5rem',
                                right: '0.5rem',
                                backgroundColor: 'rgba(0,0,0,0.85)',
                                color: '#ff6666',
                                border: '1px solid rgba(255,100,100,0.4)',
                                borderRadius: '4px',
                                padding: '0.3rem 0.7rem',
                                fontSize: '0.72rem',
                                cursor: 'pointer',
                                fontWeight: 600,
                              }}
                            >
                              ✕ Remove Photo
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <label style={{ fontSize: '0.78rem', color: 'var(--color-gold)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                          YouTube Embed or Video URL *
                        </label>
                        <input
                          required
                          type="text"
                          value={editingGallery.url || ''}
                          onChange={(e) => setEditingGallery({ ...editingGallery, url: e.target.value })}
                          placeholder="https://www.youtube.com/embed/..."
                          style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                      </div>
                    )}

                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', display: 'block', marginBottom: '0.35rem' }}>Caption / Details</label>
                      <textarea
                        rows={2}
                        value={editingGallery.caption || ''}
                        onChange={(e) => setEditingGallery({ ...editingGallery, caption: e.target.value })}
                        placeholder="Brief note about the movement, stance, or event..."
                        style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box', resize: 'vertical' }}
                      />
                    </div>
                  </div>

                  {/* Fixed Footer Actions */}
                  <div style={{ padding: '1rem 1.6rem', borderTop: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(15, 8, 4, 0.98)', display: 'flex', gap: '0.8rem' }}>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="btn-kalari-gold"
                      style={{ flex: 1, padding: '0.75rem', opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}
                    >
                      {isSaving ? 'Saving...' : (editingGallery.id ? 'Save Media' : 'Add to Gallery')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setGalleryModalOpen(false)}
                      style={{ padding: '0.75rem 1.4rem', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. NEWS MODAL */}
        <AnimatePresence>
          {newsModalOpen && editingNews && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(10px)',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
              }}
              onClick={() => setNewsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                style={{
                  backgroundColor: '#140c07',
                  border: '1px solid var(--color-gold)',
                  borderRadius: '8px',
                  maxWidth: '520px',
                  width: '100%',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  padding: '2rem',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-gold)', margin: '0 0 1.2rem' }}>
                  {editingNews.id ? 'Edit News Article' : 'Publish New Story'}
                </h3>
                <form onSubmit={handleSaveNews} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', display: 'block', marginBottom: '0.3rem' }}>Article Title *</label>
                    <input
                      required
                      type="text"
                      value={editingNews.title || ''}
                      onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                      placeholder="e.g. New Term Admissions Open at Vengeri"
                      style={{ width: '100%', padding: '0.6rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', display: 'block', marginBottom: '0.3rem' }}>Category Tag</label>
                      <input
                        type="text"
                        value={editingNews.tag || ''}
                        onChange={(e) => setEditingNews({ ...editingNews, tag: e.target.value })}
                        placeholder="e.g. ADMISSIONS, WORKSHOP, EVENTS"
                        style={{ width: '100%', padding: '0.6rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', display: 'block', marginBottom: '0.3rem' }}>Publish Date</label>
                      <input
                        type="date"
                        value={editingNews.date || ''}
                        onChange={(e) => setEditingNews({ ...editingNews, date: e.target.value })}
                        style={{ width: '100%', padding: '0.6rem', backgroundColor: '#1e130c', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', display: 'block', marginBottom: '0.3rem' }}>Story Summary *</label>
                    <textarea
                      required
                      rows={3}
                      value={editingNews.summary || ''}
                      onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })}
                      placeholder="Full summary of the announcement, event, or report..."
                      style={{ width: '100%', padding: '0.6rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box', resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', display: 'block', marginBottom: '0.3rem' }}>Image URL (Optional)</label>
                    <input
                      type="text"
                      value={editingNews.image_url || ''}
                      onChange={(e) => setEditingNews({ ...editingNews, image_url: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      style={{ width: '100%', padding: '0.6rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, (url) => setEditingNews({ ...editingNews, image_url: url }));
                      }}
                      style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: 'var(--color-text-dim)' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn-kalari-gold" style={{ flex: 1, padding: '0.75rem' }}>
                      Publish Article
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewsModalOpen(false)}
                      style={{ padding: '0.75rem 1.2rem', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5. HERO SLIDE MODAL */}
        <AnimatePresence>
          {heroSlideModalOpen && editingHeroSlide && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(10px)',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
              }}
              onClick={() => setHeroSlideModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                style={{
                  backgroundColor: '#140c07',
                  border: '1px solid var(--color-gold)',
                  borderRadius: '8px',
                  maxWidth: '560px',
                  width: '100%',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  padding: '2rem',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-gold)', margin: '0 0 1.2rem' }}>
                  {editingHeroSlide.id ? 'Change Hero Slide Photo & Text' : 'Add New Hero Slide'}
                </h3>
                <form onSubmit={handleSaveHeroSlide} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', display: 'block', marginBottom: '0.3rem' }}>Slide Background Photo URL *</label>
                    <input
                      required
                      type="text"
                      value={editingHeroSlide.image || ''}
                      onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, image: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      style={{ width: '100%', padding: '0.6rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, (url) => setEditingHeroSlide({ ...editingHeroSlide, image: url }));
                      }}
                      style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: 'var(--color-text-dim)' }}
                    />
                    {editingHeroSlide.image && (
                      <div style={{ marginTop: '0.6rem', height: '140px', borderRadius: '4px', overflow: 'hidden' }}>
                        <img src={editingHeroSlide.image} alt="Slide Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', display: 'block', marginBottom: '0.3rem' }}>Headline Line 1</label>
                      <input
                        type="text"
                        value={editingHeroSlide.titleLine1 || ''}
                        onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, titleLine1: e.target.value })}
                        placeholder="e.g. Creating a"
                        style={{ width: '100%', padding: '0.6rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', display: 'block', marginBottom: '0.3rem' }}>Headline Line 2</label>
                      <input
                        type="text"
                        value={editingHeroSlide.titleLine2 || ''}
                        onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, titleLine2: e.target.value })}
                        placeholder="e.g. Martial Symphony"
                        style={{ width: '100%', padding: '0.6rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', display: 'block', marginBottom: '0.3rem' }}>Script Accent Words</label>
                    <input
                      type="text"
                      value={editingHeroSlide.titleItalic || ''}
                      onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, titleItalic: e.target.value })}
                      placeholder="e.g. for You, Ancient Malabar"
                      style={{ width: '100%', padding: '0.6rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', display: 'block', marginBottom: '0.3rem' }}>Slide Subtitle Narrative</label>
                    <textarea
                      rows={2}
                      value={editingHeroSlide.desc || ''}
                      onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, desc: e.target.value })}
                      placeholder="Short sentence description for this slide..."
                      style={{ width: '100%', padding: '0.6rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', display: 'block', marginBottom: '0.3rem' }}>Badge Number / Stat</label>
                      <input
                        type="text"
                        value={editingHeroSlide.badgeNum || ''}
                        onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, badgeNum: e.target.value })}
                        placeholder="e.g. 5.0★, 08, 108"
                        style={{ width: '100%', padding: '0.6rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', display: 'block', marginBottom: '0.3rem' }}>Badge Label</label>
                      <input
                        type="text"
                        value={editingHeroSlide.badgeText || ''}
                        onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, badgeText: e.target.value })}
                        placeholder="e.g. RATED CVN KALARI"
                        style={{ width: '100%', padding: '0.6rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn-kalari-gold" style={{ flex: 1, padding: '0.75rem' }}>
                      Save Slide
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroSlideModalOpen(false)}
                      style={{ padding: '0.75rem 1.2rem', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
