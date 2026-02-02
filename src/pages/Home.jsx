import Hero from '../components/Hero';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Features from './landing/Features';
import About from './landing/About';
import Faq from './landing/Faq';
import DashboardPreview from './landing/DashboardPreview';
import AppPromo from './landing/AppPromo';
import Steps from './landing/Steps';

const Home = () => {
  return (
    <main>
      <Hero />
      <Services /> 
      <DashboardPreview />
      <Features />
      <AppPromo />
      <About />
      <Testimonials />
      <Steps />
      <Faq />
      <Contact />
    </main>
  );
};

export default Home;
