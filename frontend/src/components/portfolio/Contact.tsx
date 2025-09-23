import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { api } from "@/lib/api";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api<{ success: boolean; info?: string; error?: string }>("/api/send-email", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. I'll get back to you soon!",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast({
        title: "Error",
        description: "Unable to connect to server. Please try again later.",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "diviyanfrankjeyasingh@gmail.com",
      href: "mailto:diviyanfrankjeyasingh@gmail.com"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 (893) 976-9590",
      href: "tel:+918939769590"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Chennai, TN",
      href: "#"
    }
  ];

  const socialLinks = [
    { icon: Github, href: "https://github.com/Frankythecoder", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/diviyan-frank-jeyasingh-28890b27b/", label: "LinkedIn" },
  ]

  return (
    <section id="contact" className="py-20 bg-section-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get In <span className="bg-hero-gradient bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have a project in mind or just want to chat? I'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="p-8 bg-card-gradient border-border/50 hover:shadow-glow-primary/10 transition-smooth">
            <h3 className="text-2xl font-semibold mb-6 text-primary">Send me a message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="bg-secondary/20 border-border/50 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="bg-secondary/20 border-border/50 focus:border-primary"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  required
                  className="bg-secondary/20 border-border/50 focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  rows={6}
                  required
                  className="bg-secondary/20 border-border/50 focus:border-primary resize-none"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-hero-gradient hover:opacity-90 transition-smooth shadow-glow-primary"
                size="lg"
              >
                Send Message
              </Button>
            </form>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="p-6 bg-card-gradient border-border/50">
              <h3 className="text-2xl font-semibold mb-6 text-primary">Contact Information</h3>
              
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <a
                    key={info.label}
                    href={info.href}
                    className="flex items-center p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-smooth group"
                  >
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-primary/30 transition-smooth">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{info.label}</div>
                      <div className="font-medium">{info.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-card-gradient border-border/50">
              <h3 className="text-2xl font-semibold mb-6 text-primary">Follow Me</h3>
              
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center hover:bg-primary/20 transition-smooth group"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-smooth" />
                  </a>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-card-gradient border-border/50">
              <h3 className="text-xl font-semibold mb-4 text-primary">Let's work together!</h3>
              <p className="text-muted-foreground leading-relaxed">
                I'm always interested in new opportunities and exciting projects. 
                Whether you have a question about my work or want to discuss a potential 
                collaboration, don't hesitate to reach out.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;