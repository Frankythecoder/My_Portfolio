import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend",
      icon: "🎨",
      skills: ["React", "TypeScript", "Tailwind CSS", "HTML", "CSS", "JavaScript"]
    },
    {
      title: "Backend",
      icon: "⚙️",
      skills: ["Node.js", "Python", "Express.js", "FastAPI", "PostgreSQL", "Django", "Redis"]
    },
    {
      title: "Tools, Cloud & Others",
      icon: "🛠️",
      skills: ["Git", "Docker", "AWS", "Maven", "Linux"]
    }
  ];

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            My <span className="bg-hero-gradient bg-clip-text text-transparent">Skills</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <Card 
              key={category.title}
              className="p-6 bg-card-gradient border-border/50 hover:shadow-glow-primary/10 transition-smooth"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-2xl font-semibold text-primary">{category.title}</h3>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {category.skills.map((skill) => (
                  <Badge 
                    key={skill}
                    variant="secondary"
                    className="bg-secondary/50 hover:bg-primary/20 transition-smooth cursor-default"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Skill bars for key technologies */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold mb-8 text-center">Proficiency Levels</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { skill: "React/TypeScript", level: 90 },
              { skill: "Django/Python", level: 95 },
              { skill: "Tools and Cloud", level: 85 },
              { skill: "Database", level: 80 }
            ].map((item) => (
              <div key={item.skill} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.skill}</span>
                  <span>{item.level}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-hero-gradient h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${item.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;