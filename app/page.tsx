import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Films from '@/components/sections/Films';
import Ads from '@/components/sections/Ads';
import Gallery from '@/components/sections/Gallery';
import Skills from '@/components/sections/Skills';
import Resumes from '@/components/sections/Resumes';
import Contact from '@/components/sections/Contact';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Films />
        <Ads />
        <Gallery />
        <Skills />
        <Resumes />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
