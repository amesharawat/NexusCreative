import styles from './Skills.module.css';

const webSkills = [
  { name: 'React / Next.js', level: 90 },
  { name: 'Node.js / Express', level: 85 },
  { name: 'TypeScript', level: 80 },
  { name: 'PostgreSQL / Supabase', level: 78 },
  { name: 'REST APIs', level: 88 },
  { name: 'CSS / Responsive Design', level: 85 },
];

const aiTools = [
  { name: 'Kling AI', icon: '🎬' },
  { name: 'Seedream', icon: '🌱' },
  { name: 'Seedance', icon: '💃' },
  { name: 'Nano Banana Pro', icon: '🍌' },
  { name: 'Midjourney', icon: '🖼️' },
  { name: 'Runway ML', icon: '🚀' },
  { name: 'Sora', icon: '🌐' },
  { name: 'Adobe Firefly', icon: '🔥' },
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

        <div className={styles.grid}>
          {/* Web Dev Skills */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <span className={styles.columnIcon}>💻</span>
              <h3>Web Development</h3>
            </div>
            <div className={styles.skillList}>
              {webSkills.map(skill => (
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

          {/* AI Tools */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <span className={styles.columnIcon}>🤖</span>
              <h3>AI Tools</h3>
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
      </div>
    </section>
  );
}
