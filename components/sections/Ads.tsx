'use client';

import { useEffect, useState } from 'react';
import { Ad } from '@/types';
import styles from './Ads.module.css';

function getMediaPoster(url?: string, thumb?: string): string {
  if (thumb) return thumb;
  if (!url) return '';
  
  // Google Drive auto-thumbnail
  const driveId = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1] || url.match(/id=([a-zA-Z0-9_-]+)/)?.[1];
  if (driveId) {
    return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1280`;
  }

  // YouTube auto-thumbnail
  const ytId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)?.[1];
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
  }

  return '';
}

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
            {ads.map((ad) => {
              const poster = getMediaPoster(ad.media_url, ad.thumbnail_url);
              const isDirectVideo = ad.media_type === 'video' && ad.media_url && !poster && !ad.media_url.includes('drive.google.com') && !ad.media_url.includes('youtube.com');

              return (
                <article key={ad.id} className={`card ${styles.card}`} id={`ad-${ad.id}`} onClick={() => setActive(ad)}>
                  <div className={styles.thumbnail}>
                    {poster ? (
                      <img src={poster} alt={ad.title} loading="lazy" />
                    ) : ad.media_type === 'image' && ad.media_url ? (
                      <img src={ad.media_url} alt={ad.title} loading="lazy" />
                    ) : isDirectVideo ? (
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
              );
            })}
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
                active.media_url?.includes('drive.google.com') ? (
                  <iframe
                    src={active.media_url.replace(/\/view.*$/, '/preview')}
                    className={styles.media}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : active.media_url?.includes('youtube.com') || active.media_url?.includes('youtu.be') ? (
                  <iframe
                    src={active.media_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                    className={styles.media}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <video src={active.media_url} controls autoPlay className={styles.media} playsInline />
                )
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
