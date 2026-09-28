import { ArrowDownRight, ArrowUpRight, Github, Linkedin, MapPin } from 'lucide-react';

const Hero = () => (
  <section id="home" className="hero section-anchor">
    <div className="hero-glow" aria-hidden="true" />
    <div className="shell hero-inner">
      <div className="hero-main">
        <p className="eyebrow"><span className="status-dot" /> OPEN TO OPPORTUNITIES <span className="eyebrow-rule" /> PORTFOLIO</p>
        <h1>Building things<br />that <em>think .</em><span className="hero-asterisk">✳</span></h1>
        <p className="hero-description">Hey, I'm <strong>Frank</strong> — an AI &amp; ML engineering student turning complex ideas into useful, human-centered software. I build intelligent agents, practical tools, and the interfaces that bring them to life.</p>
        <div className="hero-actions">
          <a className="button-primary" href="#projects">Explore my work <ArrowUpRight size={18} /></a>
          <a className="button-text" href="#contact">Get in touch <ArrowUpRight size={17} /></a>
        </div>
      </div>
      <div className="hero-bottom">
        <a href="#about" className="scroll-cue"><span className="scroll-icon"><ArrowDownRight size={21} /></span><span>SCROLL TO EXPLORE</span></a>
        <div className="hero-meta"><MapPin size={15} /> CHENNAI, INDIA <span className="meta-divider">/</span> B.TECH AIML '27</div>
        <div className="hero-socials">
          <a href="https://github.com/Frankythecoder" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={19} /></a>
          <a href="https://www.linkedin.com/in/diviyan-frank-jeyasingh-28890b27b/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={19} /></a>
        </div>
      </div>
    </div>
    <span className="hero-side-note" aria-hidden="true">ENGINEERING WITH INTENT</span>
  </section>
);

export default Hero;
