import { ArrowUpRight, BrainCircuit, Code2, Sparkles } from 'lucide-react';

const About = () => (
  <section id="about" className="section section-anchor about-section">
    <div className="shell">
      <div className="section-heading"><span className="section-index">ABOUT</span><span className="section-line" /><span className="section-aside">THE PERSON BEHIND THE CODE</span></div>
      <div className="about-grid">
        <div>
          <h2 className="display-heading">Curious by nature.<br /><em>Builder</em> by choice.</h2>
          <div className="about-monogram" aria-hidden="true"><img className="monogram-logo" src="/fj-logo.png" alt="" width={362} height={320} loading="lazy" /><span className="monogram-caption">THINK / BUILD / REPEAT</span></div>
        </div>
        <div className="about-copy">
          <span className="tiny-label">A LITTLE ABOUT ME ↘</span>
          <p className="about-lead">I'm Diviyan Frank Jeyasingh, an aspiring AI engineer who believes the best technology makes difficult things feel simple.</p>
          <p>I'm pursuing a B.Tech in Artificial Intelligence &amp; Machine Learning at St. Joseph's College of Engineering, Chennai. My work sits at the intersection of agentic AI, full-stack development, and genuinely useful user experiences.</p>
          <p>From document intelligence to autonomous coding agents, I enjoy taking a problem from first principles to a working product — learning, iterating, and making it better along the way.</p>
          <a className="inline-link" href="#contact">Let's build something together <ArrowUpRight size={17} /></a>
          <div className="about-pillars">
            <div><BrainCircuit size={22} /><span>AI-FIRST THINKING</span></div>
            <div><Code2 size={22} /><span>HANDS-ON BUILDING</span></div>
            <div><Sparkles size={22} /><span>ALWAYS LEARNING</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;
