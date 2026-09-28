import { ArrowUpRight } from 'lucide-react';

const categories = [
  { title: 'Languages & frontend', description: 'Building the experience.', skills: ['Python', 'C++', 'TypeScript', 'JavaScript', 'SQL', 'React'] },
  { title: 'Backend & data', description: 'Making it all work.', skills: ['Django', 'Django REST', 'PostgreSQL', 'Celery', 'ChromaDB', 'AWS S3'] },
  { title: 'AI & tooling', description: 'The intelligence behind it.', skills: ['OpenAI API', 'LangChain', 'LangGraph', 'PyTorch', 'TensorFlow', 'Docker', 'Git', 'MCP', 'Playwright'] },
];

const Skills = () => (
  <section id="skills" className="section section-anchor skills-section">
    <div className="shell">
      <div className="section-heading"><span className="section-index">TOOLKIT</span><span className="section-line" /><span className="section-aside">WHAT I WORK WITH</span></div>
      <div className="section-title-row"><div><span className="tiny-label">A GROWING TOOLBOX</span><h2 className="display-heading">My <em>Techstack.</em></h2></div><p>Always exploring, always learning. Here are the technologies I reach for when it's time to build.</p></div>
      <div className="skills-grid">{categories.map((category) => <div className="skill-card"><h3>{category.title}</h3><p>{category.description}</p><div className="skill-tags">{category.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div>)}</div>
    </div>
  </section>
);

export default Skills;
