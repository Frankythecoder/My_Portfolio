import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Calendar } from 'lucide-react';

const Education = () => {
  const educationData = [
    {
      degree: "12th grade",
      school: "Alpha Matriculation Higher Secondary School, Sembakkam",
      period: "2021 passed out",
      description: "Successfully completed 12th grade with 75% of overall marks"
    },
    {
      degree: "Bachelor of Technology in Artificial Intelligence and Machine Learning (AIML)",
      school: "St.Joseph's College of Engineering, Chennai OMR",
      period: "2023 - 2027",
      gpa: "3.6/4.0",
      internships: "Done 2 months internship on an AI agent based project of building a real time health monitoring system that uses openAI functions to make it act as an agent in processing patient's info and docs and provide health tips and a health report.",
      description: "Foundation in computer science fundamentals including algorithms, data structures, and software development."
    }
  ];

  const certifications = [
    "Supervised Machine Learning - Coursera",
    "Unsupervised Machine Learning - Coursera",
    "Meta Backend Developer Professional",
    "Python Certified",
  ];

  return (
    <section id="education" className="py-20 bg-section-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-hero-gradient bg-clip-text text-transparent">Education</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            My academic journey and continuous learning path
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Education Timeline */}
          <div className="space-y-8 mb-16">
            {educationData.map((edu, index) => (
              <Card 
                key={index}
                className="p-6 bg-card-gradient border-border/50 hover:shadow-glow-primary/10 transition-smooth"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-hero-gradient rounded-full flex items-center justify-center">
                      <GraduationCap className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-semibold text-primary mb-2">{edu.degree}</h3>
                        <h4 className="text-lg text-muted-foreground mb-2">{edu.school}</h4>
                      </div>
                      <div className="flex flex-col items-start md:items-end">
                        <div className="flex items-center text-accent mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{edu.period}</span>
                        </div>
                        {edu.gpa && (
                          <Badge variant="secondary" className="bg-primary/20 text-primary">
                            GPA: {edu.gpa}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {edu.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {edu.internships}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Certifications */}
          <Card className="p-6 bg-card-gradient border-border/50">
            <h3 className="text-2xl font-semibold text-primary mb-6 text-center">
              Certifications & Additional Training
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {certifications.map((cert) => (
                <div 
                  key={cert}
                  className="flex items-center p-3 bg-secondary/20 rounded-lg"
                >
                  <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                  <span className="text-foreground">{cert}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Education;