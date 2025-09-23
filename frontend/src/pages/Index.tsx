import Navigation from '@/components/portfolio/Navigation';
import Hero from '@/components/portfolio/Hero';
import About from '@/components/portfolio/About';
import Skills from '@/components/portfolio/Skills';
import Education from '@/components/portfolio/Education';
import Projects from '@/components/portfolio/Projects';
import Contact from '@/components/portfolio/Contact';
import ChatBot from '@/components/portfolio/ChatBot';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <About />
      <Skills />
      <Education />
      <Projects />
      <Contact />
      <ChatBot />
    </div>
  );
};

export default Index;
