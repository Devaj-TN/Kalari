import KalariHeader from '../components/layout/KalariHeader';
import KalariHero from '../components/sections/KalariHero';
import KalariStripe from '../components/sections/KalariStripe';
import BidirectionalMarquee from '../components/animation/BidirectionalMarquee';
import KalariAbout from '../components/sections/KalariAbout';
import KalariPrograms from '../components/sections/KalariPrograms';

import KalariGuru from '../components/sections/KalariGuru';
import KalariTreatment from '../components/sections/KalariTreatment';
import KalariGallery from '../components/sections/KalariGallery';
import KalariNews from '../components/sections/KalariNews';
import KalariLocation from '../components/sections/KalariLocation';
import KalariFooter from '../components/sections/KalariFooter';
import SEO from '../components/common/SEO';

export default function Home() {
  return (
    <>
      <SEO
        title="Madhurakandy C.V.N Kalari — Traditional Kalaripayattu, Vengeri, Kozhikode"
        description="Experience authentic Vadakkan Kalaripayattu at Madhurakandy C.V.N Kalari in Vengeri, Kozhikode. Traditional Kuzhi Kalari training, daily batches, and Marma Chikitsa."
      />

      {/* 3-Line Hamburger Menu & Fullscreen Navigation Overlay */}
      <KalariHeader />

      {/* Continuous Unbroken Page Stream */}
      <main id="main-content" tabIndex={-1}>
        {/* 1. Hero Showcase Carousel */}
        <KalariHero />

        {/* 2. Heritage & Ornamental Ribbon */}
        <KalariStripe />

        {/* 3. Bidirectional Horizontal Scroll Headings */}
        <BidirectionalMarquee
          line1="A Legacy"
          line2="of"
          line3="Kalaripayattu"
        />

        {/* 4. Editorial Heritage Intro with Dual-Speed Parallax */}
        <KalariAbout />

        {/* 5. Discover Disciplines, Courses & Batches Carousel */}
        <KalariPrograms />



        {/* 8. Chief Gurukkal Master Spotlight */}
        <KalariGuru />

        {/* 8.5. Traditional Kalari Treatment & Chikitsa Inquiry */}
        <KalariTreatment />

        {/* 9. Photo & Video Gallery Showcase */}
        <KalariGallery />

        {/* 10. Latest News & Demonstrations Stream */}
        <KalariNews />

        {/* 11. Centres, Locations & Direct Inquiries */}
        <KalariLocation />

        {/* 12. Accreditations & Footer */}
        <KalariFooter />
      </main>
    </>
  );
}
