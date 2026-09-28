import { Award, GraduationCap, MapPin } from 'lucide-react';

const certifications = [
  'Advanced Learning Algorithms — Stanford / DeepLearning.AI',
  'Supervised ML: Regression & Classification — Stanford / DeepLearning.AI',
  'Programming in Python — Meta',
  'Artificial Intelligence — IIT Kanpur',
  'Django Web Framework — Meta',
  'Databases for Back-End Development — Meta',
];

const Education = () => (
  <section id="education" className="section section-anchor education-section">
    <div className="shell">
      <div className="section-heading">
        <span className="section-index">EDUCATION</span>
        <span className="section-line" />
        <span className="section-aside">THE FOUNDATION</span>
      </div>
      <div className="education-grid">
        <div>
          <span className="tiny-label">THE LEARNING NEVER STOPS</span>
          <h2 className="display-heading">Learning is a<br /><em>lifelong project.</em></h2>
          <p>Formal education is the foundation. Curiosity does the rest.</p>
        </div>
        <div className="education-list">
          <div className="education-card">
            <div className="education-icon"><GraduationCap size={28} /></div>
            <div className="education-content">
              <span className="tiny-label">2023 — 2027</span>
              <h3>B.Tech in Artificial Intelligence &amp; Machine Learning</h3>
              <p>St. Joseph's College of Engineering · CGPA 7.7 / 10</p>
              <span className="education-location"><MapPin size={15} /> Chennai, India</span>
            </div>
            <div className="education-year">'27</div>
          </div>
          <div className="certifications-card">
            <br></br>
            <br></br>
            <span className="tiny-label"><Award size={17} /> CERTIFICATIONS</span>
            <ul>
              {certifications.map((certificate) => <li key={certificate}>{certificate}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Education;
