'use client';

import { useEffect, useState } from 'react';
import { AIImage } from '@/types';
import styles from './Gallery.module.css';

export default function Gallery() {
  const [images, setImages] = useState<AIImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<AIImage | null>(null);

  useEffect(() => {
    fetch('/api/images')
      .then(r => r.json())
      .then(data => { setImages(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="gallery" className={`section ${styles.gallery}`}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">AI Visuals</span>
          <h2 className="section-title">AI Image Gallery</h2>
          <p className="section-subtitle">A collection of AI-generated images — from surreal worlds to photorealistic concepts.</p>
        </div>

        {loading ? (
          <div className={styles.masonryGrid}>
            {[1,2,3,4,5,6].map(i => <div key={i} className={`skeleton ${styles.skeletonItem}`} style={{ height: `${200 + (i % 3) * 80}px` }} />)}
          </div>
        ) : images.length === 0 ? (
          <div className={styles.empty}>
            <span>🎨</span>
            <p>AI Images coming soon!</p>
          </div>
        ) : (
          <div className={styles.masonryGrid}>
            {images.map((img) => (
              <article key={img.id} className={styles.item} id={`image-${img.id}`} onClick={() => setActive(img)}>
                <img src={img.image_url} alt={img.title} loading="lazy" />
                <div className={styles.itemOverlay}>
                  <p className={styles.itemTitle}>{img.title}</p>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                  </svg>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {active && (
        <div className={styles.modal} onClick={() => setActive(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setActive(null)} id="gallery-modal-close">✕</button>
            <img src={active.image_url} alt={active.title} className={styles.modalImg} />
            <div className={styles.modalInfo}>
              <h3>{active.title}</h3>
              {active.description && <p>{active.description}</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
