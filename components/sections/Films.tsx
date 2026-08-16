'use client';

import { useEffect, useState } from 'react';
import { Film } from '@/types';
import styles from './Films.module.css';

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

export default function Films() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Film | null>(null);

  useEffect(() => {
    fetch('/api/films')
      .then(r => r.json())
      .then(data => { setFilms(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="films" className={`section ${styles.films}`}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">AI Filmmaking</span>
          <h2 className="section-title">AI Short Films</h2>
          <p className="section-subtitle">Cinematic short films crafted entirely with AI — from script to screen.</p>
        </div>

        {loading ? (
          <div className={`grid-2 ${styles.grid}`}>
            {[1,2].map(i => <div key={i} className={`skeleton ${styles.skeletonCard}`} />)}
          </div>
        ) : films.length === 0 ? (
          <div className={styles.empty}>
            <span>🎬</span>
            <p>AI Short Films coming soon!</p>
          </div>
        ) : (
          <div className={`grid-2 ${styles.grid}`}>
            {films.map((f) => {
              const poster = getMediaPoster(f.video_url, f.thumbnail_url);
              const isDirectVideo = f.video_url && !poster && !f.video_url.includes('drive.google.com') && !f.video_url.includes('youtube.com');

              return (
                <article key={f.id} className={`card ${styles.card}`} id={`film-${f.id}`}>
                  <div className={styles.thumbnail} onClick={() => setActive(f)}>
                    {poster ? (
                      <img src={poster} alt={f.title} loading="lazy" />
                    ) : isDirectVideo ? (
                      <video
                        src={`${f.video_url}#t=0.1`}
                        preload="metadata"
                        muted
                        playsInline
                        className={styles.videoPoster}
                      />
                    ) : (
                      <div className={styles.cinemaPlaceholder}>
                        <div className={styles.filmGlow} />
                        <div className={styles.filmSlate}>
                          <span className={styles.slateClap}>CINEMA // AI 4K</span>
                          <div className={styles.filmIcon}>🎬</div>
                        </div>
                      </div>
                    )}
                    <div className={styles.playBtn}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                    </div>
                    <div className={styles.filmBadge}>4K Short Film</div>
                  </div>
                  <div className={styles.body}>
                    <h3 className={styles.cardTitle}>{f.title}</h3>
                    <p className={styles.cardDesc}>{f.description}</p>
                    <button className="btn btn-ghost" onClick={() => setActive(f)} style={{ padding: '8px 0', fontSize: '0.85rem' }} id={`film-watch-${f.id}`}>
                      Watch Film →
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {active && (
        <div className={styles.modal} onClick={() => setActive(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setActive(null)} id="film-modal-close">✕</button>
            <div className={styles.videoWrap}>
              {active.video_url?.includes('drive.google.com') ? (
                <iframe
                  src={active.video_url.replace(/\/view.*$/, '/preview')}
                  className={styles.video}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : active.video_url?.includes('youtube.com') || active.video_url?.includes('youtu.be') ? (
                <iframe
                  src={active.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  className={styles.video}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <video
                  src={active.video_url}
                  controls
                  autoPlay
                  className={styles.video}
                  playsInline
                />
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
