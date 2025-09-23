import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';

const Projects = () => {
  const projects = [
    {
      title: "AI Handwritten Text Scanner",
      description: "A Django app that uses AWS textract api for OCR and processing handwritten text in PDFs.",
      technologies: ["React", "TypeScript", "Django", "Python", "AWS Textract"],
      github: "https://github.com/Frankythecoder/ai_exams.git",
      featured: true
    },
    {
      title: "AI Gemini Agent",
      description: "A real time Gemini agent that uses Google Gemini's api and acts as an agent for file and code editing in code editors.",
      technologies: ["Django", "HTML", "CSS", "Gemini API", "Python"],
      github: "https://github.com/Frankythecoder/ai_agent.git",
      featured: true
    },
    {
      title: "Hangman Game with Deep Learning Neural Network",
      description: "An implementation of the hangman word guessing game with deep learning neural network to make the AI guess the word.",
      technologies: ["Python tkinter", "Pytorch"],
      github: "https://github.com/Frankythecoder/Hangman-word-guessing-game.git",
      featured: false
    },
  ];

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);
  const allProjects = [...featuredProjects, ...otherProjects];

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            My <span className="bg-hero-gradient bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A showcase of my recent work and personal projects
          </p>
        </div>

        {/* Featured + Other Projects */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-8 text-center text-primary">Featured Projects</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {allProjects.map((project, index) => (
              <Card 
                key={project.title}
                className={`p-6 bg-card-gradient border-border/50 hover:shadow-glow-primary/10 transition-smooth group ${project.featured ? '' : 'md:col-span-1 p-4'}`}
              >
                <h4 className={`${project.featured ? 'text-2xl' : 'text-lg'} font-semibold mb-3 text-primary group-hover:text-accent transition-smooth`}>
                  {project.title}
                </h4>
                <p className={`text-muted-foreground mb-4 leading-relaxed ${project.featured ? '' : 'text-sm mb-3'}`}>
                  {project.description}
                </p>
                <div className={`flex flex-wrap gap-2 mb-6 ${project.featured ? '' : 'gap-1 mb-4'}`}>
                  {(project.featured ? project.technologies : project.technologies.slice(0, 3)).map((tech) => (
                    <Badge 
                      key={tech}
                      variant="secondary"
                      className={`${project.featured ? 'bg-secondary/50 hover:bg-primary/20 transition-smooth' : 'text-xs bg-secondary/50'}`}
                    >
                      {tech}
                    </Badge>
                  ))}
                  {!project.featured && project.technologies.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-secondary/50">
                      +{project.technologies.length - 3}
                    </Badge>
                  )}
                </div>
                <div className={`flex flex-wrap gap-2 mb-6 ${project.featured ? '' : 'gap-1 mb-4'}`}>
                  <Button 
                    asChild
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2 border-primary/30 hover:border-primary"
                  >
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4" />
                      Code
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;

