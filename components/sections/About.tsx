'use client';

import { useEffect, useState } from 'react';
import styles from './About.module.css';

export default function About() {
  const [projectCount, setProjectCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProjectCount(data.length);
        }
      })
      .catch(() => setProjectCount(null));
  }, []);

  return (
    <section id="about" className={`section ${styles.about}`}>
      <div className="container">
        <div className={styles.grid}>
          {/* Text Side */}
          <div className={styles.textSide}>
            <span className="section-label">About Me</span>
            <h2 className={styles.title}>I build the web.<br />I create with AI.</h2>
            <div className="divider" style={{ margin: '24px 0' }} />
            <p className={styles.bio}>
              I&apos;m Amesha Rawat. I write code that powers products and prompt AI that creates worlds.
              Full stack developer, AI filmmaker, and visual storyteller — always building something
              that didn&apos;t exist before.
            </p>
            <p className={styles.bio}>
              My work sits at the intersection of engineering and imagination. Whether it&apos;s a
              full-stack web application or an AI-generated short film, I bring the same obsession
              for craft, detail, and impact to everything I create.
            </p>

            <div className={styles.statsRow}>
              <div className={styles.stat}>
                <span className={styles.statNum}>
                  {projectCount !== null ? (projectCount > 0 ? `${projectCount}+` : '0') : '3+'}
                </span>
                <span className={styles.statLabel}>Full Stack Projects</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>∞</span>
                <span className={styles.statLabel}>AI Creations</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>8+</span>
                <span className={styles.statLabel}>AI Tools Mastered</span>
              </div>
            </div>

            <div className={styles.actions}>
              <a href="#projects" className="btn btn-primary" id="about-projects-btn">See My Work</a>
              <a href="mailto:amesharawat45@gmail.com" className="btn btn-secondary" id="about-email-btn">Say Hello</a>
            </div>
          </div>

          {/* Visual Side */}
          <div className={styles.visualSide}>
            <div className={styles.avatarCard}>
              <div className={styles.avatarInner}>
                <div className={styles.initials}>AR</div>
              </div>
              <div className={styles.cardGlow} />
            </div>

            <div className={styles.identityPills}>
              <div className={styles.pill}>
                <span className={styles.pillIcon}>💻</span>
                Full Stack Developer
              </div>
              <div className={styles.pill}>
                <span className={styles.pillIcon}>🎬</span>
                AI Filmmaker
              </div>
              <div className={styles.pill}>
                <span className={styles.pillIcon}>🎨</span>
                AI Visual Creator
              </div>
              <div className={styles.pill}>
                <span className={styles.pillIcon}>📢</span>
                AI Ad Creator
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
