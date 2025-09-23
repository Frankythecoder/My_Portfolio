import { Card } from '@/components/ui/card';

const About = () => {
  return (
    <section id="about" className="py-20 bg-section-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="bg-hero-gradient bg-clip-text text-transparent">Me</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            I'm a passionate developer who loves turning complex problems and tiring tasks into autonomous and simple solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="w-80 h-80 mx-auto bg-card-gradient rounded-2xl shadow-glow-primary/20 flex items-center justify-center">
              <div className="w-64 h-64 bg-hero-gradient rounded-full opacity-20"></div>
              {/* Placeholder for profile image */}
              <div className="absolute inset-0 flex items-center justify-center text-6xl">
                👨‍💻
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-card-gradient border-border/50">
              <h3 className="text-2xl font-semibold mb-4 text-primary">My Story</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                I am a 3rd year B.Tech student in Artificial Intelligence and Machine Learning, passionate about building intelligent systems that go beyond traditional AI. My journey started with a curiosity about how machines think, which evolved into a passion for crafting adaptive, agentic AI solutions. I specialize in designing and developing autonomous agents that can reason, plan, and act — creating innovative digital experiences powered by modern AI technologies.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                I believe in writing clean, maintainable code and staying up-to-date with 
                the latest industry trends. When I'm not coding, you can find me exploring 
                new technologies.
              </p>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-card-gradient border-border/50 text-center">
                <div className="text-3xl font-bold text-primary mb-2">3</div>
                <div className="text-sm text-muted-foreground">Projects Done</div>
              </Card>
              <Card className="p-4 bg-card-gradient border-border/50 text-center">
                <div className="text-3xl font-bold text-accent mb-2">Internship</div>
                <div className="text-sm text-muted-foreground">2 Months</div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;