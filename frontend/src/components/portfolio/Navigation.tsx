import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [activeSection, setActiveSection] = useState('home');

  const navItems = useMemo(() => [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ], []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold bg-hero-gradient bg-clip-text text-transparent">
          Portfolio
        </div>
        
        <div className="hidden md:flex space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              onClick={() => scrollToSection(item.id)}
              className="relative transition-smooth"
            >
              {item.label}
              {activeSection === item.id && (
                <div className="absolute inset-0 bg-hero-gradient rounded-md -z-10 opacity-20" />
              )}
            </Button>
          ))}
        </div>

        {/* Mobile menu button */}
        <Button variant="ghost" size="sm" className="md:hidden">
          ☰
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;