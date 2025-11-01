import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Features from '@/components/Features';
import BottomHero from '@/components/BottomHero';
import Footer from '@/components/Footer';

const Landing: React.FC = () => {

  return (
    <>
  <Navbar />
  <Hero />
  <About />
  <Features />
  <BottomHero />
  <Footer />
    </>
  );
};

export default Landing;
