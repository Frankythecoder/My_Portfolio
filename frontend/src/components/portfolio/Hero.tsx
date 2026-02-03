import { Button } from '@/components/ui/button';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';

const Hero = () => {
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-hero-gradient opacity-10" />
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 text-center relative z-10 flex flex-col items-center justify-center">
        <div className="animate-fade-in-up">
          <br></br>
          <h2 className="text-2xl md:text-6xl font-bold mb-6">
            <span className="bg-hero-gradient bg-clip-text text-transparent">
              Agentic AI Engineering aspiring
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Passionate about building intelligent, autonomous systems that go beyond static responses.
            I aspire to specialize in Agentic AI — designing agents that can reason, plan, and act with purpose.
            I bring ideas to life by orchestrating AI, tools, and design into seamless, adaptive experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-hero-gradient hover:opacity-90 transition-smooth shadow-glow-primary"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View My Work
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-primary/30 hover:border-primary transition-smooth"
            >
              Get In Touch
            </Button>
          </div>

          <div className="flex justify-center space-x-6 mb-12">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="hover:text-primary transition-smooth"
            >
              <a
                href="https://github.com/Frankythecoder"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-6 w-6" />
              </a>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="hover:text-primary transition-smooth"
            >
              <a
                href="https://www.linkedin.com/in/diviyan-frank-jeyasingh-28890b27b"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="hover:text-primary transition-smooth"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <a
                href="mailto:your@email.com"
                aria-label="Email"
              >
                <Mail className="h-6 w-6" />
              </a>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={scrollToAbout}
            className="rounded-full hover:bg-primary/10"
          >
            <ArrowDown className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;