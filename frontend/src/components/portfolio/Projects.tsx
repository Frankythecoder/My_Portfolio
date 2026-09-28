import { ArrowUpRight, Bot, HeartPulse, ShieldCheck } from 'lucide-react';

const projects = [
  {
    title: 'Javelin AI Agent',
    type: 'AUTONOMOUS AI OPERATOR',
    description: 'A local-first AI operator with 40+ tools, dry-run planning and per-tool approval. LangGraph state machines and MCP servers connect code execution, documents, multimedia, GitHub, browser automation, Gmail and flight booking.',
    stack: ['Python', 'LangGraph', 'MCP', 'GPT-4o Vision'],
    Icon: Bot,
    className: 'project-indigo',
  },
  {
    title: 'Fraud Detection using ML',
    type: 'TRANSACTION ANOMALY SCORING',
    description: 'An unsupervised fraud detection service with eight anomaly detectors and four-model voting. A FastAPI service on Cloud Run explains verdicts with SHAP, alongside a React dashboard for single, batch and CSV scoring.',
    stack: ['Python', 'FastAPI', 'SHAP', 'React', 'Cloud Run'],
    Icon: ShieldCheck,
    className: 'project-amber',
  },
  {
    title: 'Health Monitoring Bot',
    type: 'AI HEALTHCARE PLATFORM',
    description: 'A freelance full-stack healthcare platform with an AI Doctor chat, GPT-4 streaming responses, context-aware medical report injection and semantic document search powered by ChromaDB.',
    stack: ['GPT-4', 'ChromaDB', 'Semantic Search'],
    Icon: HeartPulse,
    className: 'project-mint',
  },
];

const Projects = () => (
  <section id="projects" className="section section-anchor projects-section">
    <div className="shell">
      <div className="section-heading"><span className="section-index">SELECTED WORK</span><span className="section-line" /><span className="section-aside">IDEAS TO IMPACT</span></div>
      <div className="section-title-row"><div><span className="tiny-label">A FEW THINGS I'VE MADE</span><h2 className="display-heading">Top <em>Projects.</em></h2></div><p>Real problems. Thoughtful solutions. A little bit of AI magic.</p></div>
      <div className="projects-grid">
        {projects.map(({ title, type, description, stack, Icon, className }) => (
          <article className={`project-card ${className}`}>
            <div className="project-visual"><Icon className="project-art" strokeWidth={1} aria-hidden="true" /><span className="visual-caption">{type}</span></div>
            <div className="project-body"><div className="project-topline"><span>{type}</span></div><h3>{title}</h3><p>{description}</p><div className="project-tags">{stack.map((item) => <span key={item}>{item}</span>)}</div></div>
          </article>
        ))}
      </div>
      <a className="all-work" href="https://github.com/Frankythecoder" target="_blank" rel="noopener noreferrer">More projects on GitHub <ArrowUpRight size={18} /></a>
    </div>
  </section>
);

export default Projects;
