'use client';

import { useEffect, useState } from 'react';
import { Resume } from '@/types';
import styles from './Resumes.module.css';

export default function Resumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);

  useEffect(() => {
    fetch('/api/resumes')
      .then(r => r.json())
      .then(data => setResumes(data))
      .catch(() => {});
  }, []);

  const getResume = (type: 'fullstack' | 'ai_creator') =>
    resumes.find(r => r.type === type);

  return (
    <section id="resumes" className={`section ${styles.resumes}`}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">Documents</span>
          <h2 className="section-title">Download My Resume</h2>
          <p className="section-subtitle">Two specialized resumes — one for each side of my craft.</p>
        </div>

        <div className={styles.cards}>
          {/* Full Stack Resume */}
          <div className={styles.resumeCard}>
            <div className={styles.cardIcon}>💻</div>
            <div className={styles.cardContent}>
              <h3>Full Stack Developer</h3>
              <p>Web projects, tech stack, and engineering experience</p>
            </div>
            {getResume('fullstack') ? (
              <a
                href={getResume('fullstack')!.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                id="download-fullstack-resume"
                download
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download PDF
              </a>
            ) : (
              <span className={styles.comingSoon}>Coming Soon</span>
            )}
          </div>

          {/* AI Creator Resume */}
          <div className={styles.resumeCard}>
            <div className={styles.cardIcon}>🤖</div>
            <div className={styles.cardContent}>
              <h3>AI Creator</h3>
              <p>AI films, advertisements, image generation, and creative tools</p>
            </div>
            {getResume('ai_creator') ? (
              <a
                href={getResume('ai_creator')!.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                id="download-ai-resume"
                download
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download PDF
              </a>
            ) : (
              <span className={styles.comingSoon}>Coming Soon</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
