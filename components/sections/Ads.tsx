'use client';

import { useEffect, useState } from 'react';
import { Ad } from '@/types';
import styles from './Ads.module.css';

export default function Ads() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Ad | null>(null);

  useEffect(() => {
    fetch('/api/ads')
      .then(r => r.json())
      .then(data => { setAds(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="ads" className={`section ${styles.ads}`}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">AI Advertising</span>
          <h2 className="section-title">AI Advertisements</h2>
          <p className="section-subtitle">Brand stories and commercial visuals crafted entirely with AI tools.</p>
        </div>

        {loading ? (
          <div className={`grid-3 ${styles.grid}`}>
            {[1,2,3].map(i => <div key={i} className={`skeleton ${styles.skeletonCard}`} />)}
          </div>
        ) : ads.length === 0 ? (
          <div className={styles.empty}>
            <span>📢</span>
            <p>AI Advertisements coming soon!</p>
          </div>
        ) : (
          <div className={`grid-3 ${styles.grid}`}>
            {ads.map((ad) => (
              <article key={ad.id} className={`card ${styles.card}`} id={`ad-${ad.id}`} onClick={() => setActive(ad)}>
                <div className={styles.thumbnail}>
                  {ad.thumbnail_url ? (
                    <img src={ad.thumbnail_url} alt={ad.title} loading="lazy" />
                  ) : ad.media_type === 'image' && ad.media_url ? (
                    <img src={ad.media_url} alt={ad.title} loading="lazy" />
                  ) : ad.media_type === 'video' && ad.media_url ? (
                    <video
                      src={`${ad.media_url}#t=0.1`}
                      preload="metadata"
                      muted
                      playsInline
                      className={styles.videoPoster}
                    />
                  ) : (
                    <div className={styles.cinemaPlaceholder}>
                      <span className={styles.adBadgeIcon}>📢</span>
                      <span className={styles.adBadgeText}>COMMERCIAL AD</span>
                    </div>
                  )}
                  <div className={styles.hoverOverlay}>
                    {ad.media_type === 'video' ? (
                      <div className={styles.playIconCircle}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                      </div>
                    ) : (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 6s4-6 11-6 11 6 11 6-4 6-11 6-11-6-11-6z"/>
                        <circle cx="12" cy="6" r="2"/>
                      </svg>
                    )}
                  </div>
                  <div className={styles.typeBadge}>
                    {ad.media_type === 'video' ? '🎥 Video Commercial' : '🖼️ Image Ad'}
                  </div>
                </div>
                <div className={styles.body}>
                  <h3 className={styles.cardTitle}>{ad.title}</h3>
                  <p className={styles.cardDesc}>{ad.description}</p>
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
            <button className={styles.closeBtn} onClick={() => setActive(null)} id="ad-modal-close">✕</button>
            <div className={styles.mediaWrap}>
              {active.media_type === 'video' ? (
                <video src={active.media_url} controls autoPlay className={styles.media} playsInline />
              ) : (
                <img src={active.media_url} alt={active.title} className={styles.mediaImg} />
              )}
            </div>
            <div className={styles.modalInfo}>
              <h3>{active.title}</h3>
              <p>{active.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
