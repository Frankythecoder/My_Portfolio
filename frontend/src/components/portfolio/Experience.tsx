import { ArrowUpRight, BriefcaseBusiness } from 'lucide-react';

const Experience = () => (
  <section id="experience" className="section section-anchor experience-section">
    <div className="shell">
      <div className="section-heading"><span className="section-index">EXPERIENCE</span><span className="section-line" /><span className="section-aside">LEARNING BY DOING</span></div>
      <div className="experience-grid">
        <div><span className="tiny-label">IN THE REAL WORLD</span><h2 className="display-heading">Building<br /><em>Products.</em></h2><p className="experience-intro">The best way to learn is to build something that matters.</p></div>
        <div className="experience-card"><div className="experience-card-top"><span className="experience-icon"><BriefcaseBusiness size={27} /></span><span className="experience-duration">MAR 02 — MAY 29, 2026</span></div><span className="tiny-label">SOFTWARE ENGINEERING INTERN · TECHJAYS</span><h3>Cortex — AI chat &amp; RAG assistant</h3><p>Built a Django web application with two complementary chat modes: OpenAI-powered conversations with text, code and image attachments, and document-grounded answers using isolated per-user FAISS vector indexes. Packaged the app for one-click deployment on Render.</p><div className="experience-footer"><span>DJANGO · OPENAI · FAISS · RENDER</span></div></div>
      </div>
    </div>
  </section>
);

export default Experience;
