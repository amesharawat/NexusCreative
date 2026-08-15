import styles from './Skills.module.css';

const frontendSkills = [
  { name: 'HTML & CSS', level: 95 },
  { name: 'JavaScript', level: 88 },
  { name: 'React', level: 85 },
  { name: 'Tailwind CSS', level: 87 },
  { name: 'Bootstrap', level: 85 },
  { name: 'Next.js', level: 60 },
];

const backendSkills = [
  { name: 'Node.js', level: 83 },
  { name: 'Express.js', level: 82 },
  { name: 'RESTful APIs', level: 85 },
  { name: 'Socket.IO', level: 72 },
  { name: 'MongoDB', level: 80 },
  { name: 'MySQL / PostgreSQL', level: 75 },
];

const languages = ['Python', 'Java', 'C++', 'JavaScript'];

const aiTools = [
  { name: 'Kling 3.0', icon: '🎬' },
  { name: 'Seedream', icon: '🌱' },
  { name: 'Seedance 2.0', icon: '💃' },
  { name: 'Nano Banana Pro', icon: '🍌' },
  { name: 'Higgsfield', icon: '⚡' },
  { name: 'Veo 3.1', icon: '🎥' },
  { name: 'Omni Flash', icon: '🌟' },
  { name: 'Adobe Premiere Pro', icon: '🎞️' },
];

export default function Skills() {
  return (
    <section id="skills" className={`section ${styles.skills}`}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">Expertise</span>
          <h2 className="section-title">Skills & Tools</h2>
          <p className="section-subtitle">The technologies I build with and the AI tools I create with.</p>
        </div>

        <div className={styles.topGrid}>
          {/* Frontend */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <span className={styles.columnIcon}>🖥️</span>
              <h3>Frontend</h3>
            </div>
            <div className={styles.skillList}>
              {frontendSkills.map(skill => (
                <div key={skill.name} className={styles.skillItem}>
                  <div className={styles.skillTop}>
                    <span className={styles.skillName}>{skill.name}</span>
                    <span className={styles.skillPct}>{skill.level}%</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Backend */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <span className={styles.columnIcon}>⚙️</span>
              <h3>Backend & Databases</h3>
            </div>
            <div className={styles.skillList}>
              {backendSkills.map(skill => (
                <div key={skill.name} className={styles.skillItem}>
                  <div className={styles.skillTop}>
                    <span className={styles.skillName}>{skill.name}</span>
                    <span className={styles.skillPct}>{skill.level}%</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Languages row */}
        <div className={styles.languagesRow}>
          <div className={styles.columnHeader} style={{ marginBottom: '16px' }}>
            <span className={styles.columnIcon}>💻</span>
            <h3>Programming Languages</h3>
          </div>
          <div className={styles.langPills}>
            {languages.map(lang => (
              <div key={lang} className={styles.langPill}>{lang}</div>
            ))}
          </div>
        </div>

        {/* AI Tools */}
        <div className={styles.aiSection}>
          <div className={styles.columnHeader} style={{ marginBottom: '24px' }}>
            <span className={styles.columnIcon}>🤖</span>
            <h3>AI Image & Video Tools</h3>
          </div>
          <div className={styles.aiGrid}>
            {aiTools.map(tool => (
              <div key={tool.name} className={styles.aiTool}>
                <span className={styles.toolIcon}>{tool.icon}</span>
                <span className={styles.toolName}>{tool.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
