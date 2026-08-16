'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './admin.module.css';

type Tab = 'projects' | 'films' | 'ads' | 'images' | 'resumes';

interface ContentItem {
  id: string;
  title?: string;
  description?: string;
  [key: string]: unknown;
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>('projects');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [filmSourceType, setFilmSourceType] = useState<'file' | 'url'>('file');
  const [mediaType, setMediaType] = useState<'video' | 'image'>('video');
  const [resumeType, setResumeType] = useState<'fullstack' | 'ai_creator'>('fullstack');

  const thumbRef = useRef<HTMLInputElement>(null);
  const mediaRef = useRef<HTMLInputElement>(null);
  const resumeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const ok = sessionStorage.getItem('nc_admin');
    if (!ok) { window.location.href = '/admin/login'; return; }
    setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetchItems();
  }, [tab, authed]);

  const apiPath = () => {
    if (tab === 'images') return '/api/images';
    if (tab === 'resumes') return '/api/resumes';
    return `/api/${tab}`;
  };

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch(apiPath());
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const uploadFile = async (file: File, folder: string, resourceType: string): Promise<string> => {
    const cleanName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `${folder}/${cleanName}`;

    // 1. Direct Supabase Storage Upload (handles all file sizes)
    try {
      const { data: uploadData, error: directError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file, {
          contentType: file.type || 'application/octet-stream',
          upsert: true,
        });

      if (!directError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from('portfolio')
          .getPublicUrl(uploadData.path);
        return publicUrlData.publicUrl;
      }
      if (directError) {
        console.error('Supabase direct upload error:', directError);
        throw new Error(`Supabase Storage: ${directError.message}`);
      }
    } catch (err) {
      console.error('Direct upload exception:', err);
      if (err instanceof Error && err.message.startsWith('Supabase Storage:')) {
        throw err;
      }
    }

    // 2. Signed URL Upload
    try {
      const urlRes = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder, fileName: file.name }),
      });

      if (urlRes.ok) {
        const { token, path, publicUrl } = await urlRes.json();
        const { error: signedError } = await supabase.storage
          .from('portfolio')
          .uploadToSignedUrl(path, token, file, {
            contentType: file.type || 'application/octet-stream',
            upsert: true,
          });

        if (!signedError) {
          return publicUrl;
        }
        console.error('Signed URL upload error:', signedError);
      }
    } catch (err) {
      console.error('Signed upload exception:', err);
    }

    // 3. Fallback to API route
    const form = new FormData();
    form.append('file', file);
    form.append('folder', folder);
    form.append('resourceType', resourceType);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (!res.ok) {
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        throw new Error(json.error || 'Upload failed');
      } catch {
        throw new Error('Upload failed. Please verify storage permissions or file size.');
      }
    }
    const data = await res.json();
    return data.url;
  };

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 5000);
  };

  const resetForm = () => {
    setTitle(''); setDescription(''); setTechStack('');
    setGithubUrl(''); setLiveUrl(''); setVideoLink('');
    setFilmSourceType('file'); setMediaType('video');
    if (thumbRef.current) thumbRef.current.value = '';
    if (mediaRef.current) mediaRef.current.value = '';
    if (resumeRef.current) resumeRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let payload: Record<string, unknown> = {};

      if (tab === 'projects') {
        let thumbnailUrl = '';
        if (thumbRef.current?.files?.[0]) {
          thumbnailUrl = await uploadFile(thumbRef.current.files[0], 'projects', 'image');
        }
        payload = { title, description, tech_stack: techStack.split(',').map(s => s.trim()).filter(Boolean), github_url: githubUrl, live_url: liveUrl, thumbnail_url: thumbnailUrl };
      }

      if (tab === 'films') {
        let finalVideoUrl = videoLink;
        if (filmSourceType === 'file' && mediaRef.current?.files?.[0]) {
          finalVideoUrl = await uploadFile(mediaRef.current.files[0], 'films', 'video');
        }
        let thumbUrl = '';
        if (thumbRef.current?.files?.[0]) {
          thumbUrl = await uploadFile(thumbRef.current.files[0], 'films', 'image');
        }
        payload = { title, description, video_url: finalVideoUrl, thumbnail_url: thumbUrl };
      }

      if (tab === 'ads') {
        let mediaUrl = '', thumbUrl = '';
        if (mediaRef.current?.files?.[0]) mediaUrl = await uploadFile(mediaRef.current.files[0], 'ads', mediaType);
        if (thumbRef.current?.files?.[0]) thumbUrl = await uploadFile(thumbRef.current.files[0], 'ads', 'image');
        payload = { title, description, media_url: mediaUrl, media_type: mediaType, thumbnail_url: thumbUrl };
      }

      if (tab === 'images') {
        let imageUrl = '';
        if (mediaRef.current?.files?.[0]) imageUrl = await uploadFile(mediaRef.current.files[0], 'ai-images', 'image');
        payload = { title, description, image_url: imageUrl };
      }

      if (tab === 'resumes') {
        let fileUrl = '';
        if (resumeRef.current?.files?.[0]) fileUrl = await uploadFile(resumeRef.current.files[0], 'resumes', 'raw');
        payload = { type: resumeType, file_url: fileUrl, updated_at: new Date().toISOString() };
      }

      const res = await fetch(apiPath(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Save failed');
      }

      showMsg('✅ Published successfully!', 'success');
      resetForm();
      fetchItems();
    } catch (err) {
      showMsg('❌ ' + (err instanceof Error ? err.message : 'Something went wrong'), 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    const res = await fetch(`${apiPath()}/${id}`, { method: 'DELETE' });
    if (res.ok) { showMsg('Deleted successfully', 'success'); fetchItems(); }
    else showMsg('Delete failed', 'error');
  };

  if (!authed) return null;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'projects', label: 'Projects', icon: '💻' },
    { id: 'films', label: 'AI Films', icon: '🎬' },
    { id: 'ads', label: 'AI Ads', icon: '📢' },
    { id: 'images', label: 'AI Images', icon: '🎨' },
    { id: 'resumes', label: 'Resumes', icon: '📄' },
  ];

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          Nexus<span>Creative</span>
          <span className={styles.adminBadge}>Admin</span>
        </div>

        <nav className={styles.sidebarNav}>
          {tabs.map(t => (
            <button
              key={t.id}
              className={`${styles.navBtn} ${tab === t.id ? styles.navBtnActive : ''}`}
              onClick={() => setTab(t.id)}
              id={`admin-tab-${t.id}`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <a href="/" className={styles.viewSiteBtn} target="_blank" rel="noopener noreferrer" id="admin-view-site">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            View Portfolio
          </a>
          <button
            className={styles.logoutBtn}
            onClick={() => { sessionStorage.removeItem('nc_admin'); window.location.href = '/admin/login'; }}
            id="admin-logout"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        {msg && <div className={`${styles.toast} ${msg.type === 'error' ? styles.toastError : styles.toastSuccess}`}>{msg.text}</div>}

        <div className={styles.mainHeader}>
          <h1>Manage {tabs.find(t => t.id === tab)?.label}</h1>
          <p className={styles.mainSubtitle}>Upload and manage your {tab} content below</p>
        </div>

        {/* Upload Form */}
        <section className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            + Add New {tabs.find(t => t.id === tab)?.label.replace(/s$/, '')}
          </h2>
          <form onSubmit={handleSubmit} className={styles.form}>

            {/* Resume type selector */}
            {tab === 'resumes' && (
              <div className={styles.field}>
                <label className={styles.label}>Resume Type</label>
                <select value={resumeType} onChange={e => setResumeType(e.target.value as 'fullstack' | 'ai_creator')} className={styles.input} id="admin-resume-type">
                  <option value="fullstack">Full Stack Developer</option>
                  <option value="ai_creator">AI Creator</option>
                </select>
              </div>
            )}

            {/* Title */}
            {tab !== 'resumes' && (
              <div className={styles.field}>
                <label className={styles.label}>Title *</label>
                <input
                  id="admin-title"
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder={`Enter ${tab} title`}
                  className={styles.input}
                  required
                />
              </div>
            )}

            {/* Description */}
            {tab !== 'resumes' && (
              <div className={styles.field}>
                <label className={styles.label}>Description</label>
                <textarea
                  id="admin-description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Enter a description..."
                  className={`${styles.input} ${styles.textarea}`}
                  rows={3}
                />
              </div>
            )}

            {/* Projects-specific fields */}
            {tab === 'projects' && (
              <>
                <div className={styles.field}>
                  <label className={styles.label}>Tech Stack (comma separated)</label>
                  <input id="admin-tech" type="text" value={techStack} onChange={e => setTechStack(e.target.value)} placeholder="React, Node.js, PostgreSQL" className={styles.input} />
                </div>
                <div className={styles.twoCol}>
                  <div className={styles.field}>
                    <label className={styles.label}>GitHub URL</label>
                    <input id="admin-github" type="url" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/..." className={styles.input} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Live URL</label>
                    <input id="admin-live" type="url" value={liveUrl} onChange={e => setLiveUrl(e.target.value)} placeholder="https://..." className={styles.input} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Thumbnail Image</label>
                  <input id="admin-thumb" type="file" accept="image/*" ref={thumbRef} className={styles.fileInput} />
                </div>
              </>
            )}

            {/* Films-specific */}
            {tab === 'films' && (
              <>
                <div className={styles.field}>
                  <label className={styles.label}>Video Input Method</label>
                  <select
                    value={filmSourceType}
                    onChange={e => setFilmSourceType(e.target.value as 'file' | 'url')}
                    className={styles.input}
                  >
                    <option value="file">📁 Upload Video File (MP4, WebM)</option>
                    <option value="url">🔗 Paste Video URL (Cloudinary, Drive, Direct Link)</option>
                  </select>
                </div>

                {filmSourceType === 'file' ? (
                  <div className={styles.field}>
                    <label className={styles.label}>Video File *</label>
                    <input id="admin-film-video" type="file" accept="video/*" ref={mediaRef} className={styles.fileInput} required />
                  </div>
                ) : (
                  <div className={styles.field}>
                    <label className={styles.label}>Direct Video URL *</label>
                    <input
                      type="url"
                      value={videoLink}
                      onChange={e => setVideoLink(e.target.value)}
                      placeholder="https://..."
                      className={styles.input}
                      required
                    />
                  </div>
                )}

                <div className={styles.field}>
                  <label className={styles.label}>Thumbnail Image (optional)</label>
                  <input id="admin-film-thumb" type="file" accept="image/*" ref={thumbRef} className={styles.fileInput} />
                </div>
              </>
            )}

            {/* Ads-specific */}
            {tab === 'ads' && (
              <>
                <div className={styles.field}>
                  <label className={styles.label}>Media Type</label>
                  <select value={mediaType} onChange={e => setMediaType(e.target.value as 'video' | 'image')} className={styles.input} id="admin-ad-type">
                    <option value="video">Video</option>
                    <option value="image">Image</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Upload {mediaType === 'video' ? 'Video' : 'Image'} *</label>
                  <input id="admin-ad-media" type="file" accept={mediaType === 'video' ? 'video/*' : 'image/*'} ref={mediaRef} className={styles.fileInput} required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Thumbnail (optional)</label>
                  <input id="admin-ad-thumb" type="file" accept="image/*" ref={thumbRef} className={styles.fileInput} />
                </div>
              </>
            )}

            {/* AI Images */}
            {tab === 'images' && (
              <div className={styles.field}>
                <label className={styles.label}>Image File *</label>
                <input id="admin-image-file" type="file" accept="image/*" ref={mediaRef} className={styles.fileInput} required />
              </div>
            )}

            {/* Resume */}
            {tab === 'resumes' && (
              <div className={styles.field}>
                <label className={styles.label}>Resume PDF *</label>
                <input id="admin-resume-file" type="file" accept=".pdf" ref={resumeRef} className={styles.fileInput} required />
              </div>
            )}

            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={uploading} id="admin-submit-btn">
              {uploading ? (
                <>
                  <span className={styles.spinner} />
                  Uploading & Publishing...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Publish to Portfolio
                </>
              )}
            </button>
          </form>
        </section>

        {/* Existing Items */}
        <section className={styles.listSection}>
          <h2 className={styles.sectionTitle}>Published ({items.length})</h2>
          {loading ? (
            <div className={styles.loadingRow}>
              {[1,2,3].map(i => <div key={i} className={`skeleton ${styles.skeletonRow}`} />)}
            </div>
          ) : items.length === 0 ? (
            <p className={styles.emptyMsg}>No {tab} published yet. Upload your first one above!</p>
          ) : (
            <div className={styles.list}>
              {items.map(item => (
                <div key={item.id} className={styles.listItem}>
                  <div className={styles.listInfo}>
                    <p className={styles.listTitle}>{item.title ?? (item.type as string)}</p>
                    <p className={styles.listDesc}>{(item.description as string) ?? ''}</p>
                  </div>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(item.id)}
                    id={`admin-delete-${item.id}`}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                    </svg>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
