'use client';

import { useEffect, useState } from 'react';
import { Project } from '@/types';
import styles from './Projects.module.css';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => { setProjects(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className={`section ${styles.projects}`}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">Full Stack Work</span>
          <h2 className="section-title">Projects I&apos;ve Built</h2>
          <p className="section-subtitle">Real-world applications built with modern tech stacks, from concept to deployment.</p>
        </div>

        {loading ? (
          <div className={`grid-3 ${styles.grid}`}>
            {[1,2,3].map(i => <div key={i} className={`skeleton ${styles.skeletonCard}`} />)}
          </div>
        ) : projects.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🚀</span>
            <p>Projects coming soon — check back shortly!</p>
          </div>
        ) : (
          <div className={`grid-3 ${styles.grid}`}>
            {projects.map((p) => (
              <article key={p.id} className={`card ${styles.card}`} id={`project-${p.id}`}>
                <div className={styles.thumbnail}>
                  {p.thumbnail_url ? (
                    <img src={p.thumbnail_url} alt={p.title} loading="lazy" />
                  ) : (
                    <div className={styles.thumbnailPlaceholder}>
                      <div className={styles.placeholderGlow} />
                      <div className={styles.terminalHeader}>
                        <div className={styles.terminalDots}>
                          <span className={styles.dotRed} />
                          <span className={styles.dotYellow} />
                          <span className={styles.dotGreen} />
                        </div>
                        <span className={styles.terminalTag}>PROJECT // {p.tech_stack?.[0] || 'APP'}</span>
                      </div>
                      <div className={styles.placeholderBody}>
                        <div className={styles.codeIconWrap}>
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="16 18 22 12 16 6"/>
                            <polyline points="8 6 2 12 8 18"/>
                          </svg>
                        </div>
                        <h4 className={styles.placeholderTitle}>{p.title}</h4>
                        <div className={styles.codeLines}>
                          <span className={styles.codeLine}>&gt; system.init(v2.0)</span>
                          <span className={styles.codeLine}>&gt; status: active [OK]</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className={styles.overlay}>
                    <div className={styles.overlayLinks}>
                      {p.github_url && (
                        <a href={p.github_url} target="_blank" rel="noopener noreferrer" className={styles.overlayBtn} id={`project-github-${p.id}`}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                          </svg>
                          GitHub
                        </a>
                      )}
                      {p.live_url && (
                        <a href={p.live_url} target="_blank" rel="noopener noreferrer" className={styles.overlayBtn} id={`project-live-${p.id}`}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.body}>
                  <h3 className={styles.cardTitle}>{p.title}</h3>
                  <p className={styles.cardDesc}>{p.description}</p>
                  <div className={styles.techStack}>
                    {p.tech_stack?.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
