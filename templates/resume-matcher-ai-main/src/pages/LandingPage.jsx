import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import Services from '../components/Services';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <Services />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
