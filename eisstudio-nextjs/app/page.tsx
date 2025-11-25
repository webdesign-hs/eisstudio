import Preloader from '@/components/Preloader';
import FilmGrain from '@/components/FilmGrain';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import StudioSection from '@/components/StudioSection';
import FaelleSection from '@/components/FaelleSection';
import ReportsSection from '@/components/ReportsSection';
import Footer from '@/components/Footer';
import AuthCheck from '@/components/AuthCheck';

export default function Home() {
  return (
    <>
      <AuthCheck />
      <Preloader />

      <div className="content-wrapper">
        <FilmGrain />
        <Navigation />

        <main>
          <HeroSection />
          <StudioSection />
          <FaelleSection />
          <ReportsSection />
          <Footer />
        </main>
      </div>
    </>
  );
}
