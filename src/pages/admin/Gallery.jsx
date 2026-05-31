import { useState, useEffect, useRef } from 'react'
import useAdminGuide from '../../hooks/useAdminGuide'
import AdminGuide from '../../components/admin/AdminGuide'
import { IconUpload, IconTrash, IconStarFill, IconStarLine, IconPhoto } from '../../components/admin/Icons'

const GALLERY_GUIDE = [
  {
    icon: <IconPhoto size={15} />,
    title: 'Before Uploading Images',
    items: [
      'Use only AVSS-owned photos — never use images from Google, social media, or any copyrighted source.',
      'Keep each file under 2 MB for fast loading; compress larger files before uploading.',
      'Minimum resolution: 800 × 600 px. Higher is better — images display in a responsive grid.',
      'Preferred formats: JPG or WebP. PNG is acceptable but produces larger files.',
      'Crop tightly — avoid blank borders, logos of other organisations, or overlaid watermarks.',
      'Add captions in both English and Hindi where possible — visitors browse in both languages.',
    ],
  },
  {
    icon: <IconStarLine size={15} />,
    title: 'Hero Carousel — Star Feature',
    variant: 'feature',
    items: [
      '☆ / ★  Star an image to include it in the Hero Carousel shown at the top of the Home page.',
      'Minimum 3 images must be starred; if fewer than 3 are starred, colour-gradient placeholder slides fill the remaining slots automatically.',
      'Maximum 6 images can be starred — images beyond the first 6 are ignored.',
    ],
  },
]

const ordinal = (n) => {
  const v = n % 100
  if (v >= 11 && v <= 13) return `${n}th`
  switch (n % 10) {
    case 1: return `${n}st`
    case 2: return `${n}nd`
    case 3: return `${n}rd`
    default: return `${n}th`
  }
}
const fmtDate = (d) => {
  const dt = new Date(d)
  const month = dt.toLocaleDateString('en-US', { month: 'long' })
  return `${ordinal(dt.getDate())} ${month} ${dt.getFullYear()}`
}
import api from '../../services/api'
import styles from './Gallery.module.css'

export default function AdminGallery() {
  const [items, setItems]                 = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [uploading, setUploading]         = useState(false)
  const [uploadError, setUploadError]     = useState(null)
  const fileRef = useRef(null)

  const guide = useAdminGuide('gallery')
  const [form, setForm] = useState({ caption: '', captionHi: '', category: '', date: '', file: null })

  useEffect(() => { fetchGallery() }, [])

  const fetchGallery = () => {
    setLoading(true)
    api.get('/api/gallery')
      .then(data => {
        setItems(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load gallery.')
        setLoading(false)
      })
  }

  const setField = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const upload = async () => {
    if (!form.file) {
      setUploadError('Please select an image file.')
      return
    }
    setUploading(true)
    setUploadError(null)

    const body = new FormData()
    body.append('file',      form.file)
    body.append('caption',   form.caption)
    body.append('captionHi', form.captionHi)
    body.append('category',  form.category)
    body.append('date',      form.date)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/gallery`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('avss_token')}` },
        body,
      })
      if (!res.ok) throw new Error(res.status)
      setForm({ caption: '', captionHi: '', category: '', date: '', file: null })
      if (fileRef.current) fileRef.current.value = ''
      fetchGallery()
    } catch {
      setUploadError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this image permanently?')) return
    setActionLoading(id)
    try {
      await api.delete(`/api/gallery/${id}`)
      fetchGallery()
    } catch {
      alert('Could not delete. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const toggleHero = async (item) => {
    setActionLoading(`hero-${item.id}`)
    try {
      const updated = await api.patch(`/api/gallery/${item.id}`, { showInHero: !item.showInHero })
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, showInHero: updated.showInHero } : i))
    } catch {
      alert('Could not update hero status.')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Gallery</h1>
        <p className={styles.sub}>{items.length} images</p>
      </div>

      {/* Upload form */}
      <div className={styles.uploadCard} onClick={guide.trigger}>
        <h2 className={styles.uploadTitle}>Upload New Image</h2>
        {uploadError && <div className={styles.uploadError}>{uploadError}</div>}

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Caption (English)</label>
            <input className={styles.input} value={form.caption} onChange={setField('caption')} placeholder="Annual meeting 2026" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Caption (Hindi · वैकल्पिक)</label>
            <input className={styles.input} value={form.captionHi} onChange={setField('captionHi')} placeholder="वार्षिक बैठक 2026" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <select className={styles.input} value={form.category} onChange={setField('category')}>
              <option value="">— None —</option>
              <option value="Events">Events</option>
              <option value="Camps">Camps</option>
              <option value="Distribution">Distribution</option>
              <option value="Awards">Awards</option>
              <option value="General">General</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Event Date</label>
            <input type="date" className={styles.input} value={form.date} onChange={setField('date')} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Image File *</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className={styles.input}
              onChange={e => setForm(f => ({ ...f, file: e.target.files[0] }))}
            />
          </div>
        </div>

        <button className={styles.uploadBtn} onClick={upload} disabled={uploading}>
          {uploading ? 'Uploading...' : <><IconUpload size={15} /> Upload Image</>}
        </button>
      </div>

      {/* Gallery grid */}
      {loading ? (
        <div className={styles.loading}>Loading gallery...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : items.length === 0 ? (
        <div className={styles.empty}>No images uploaded yet.</div>
      ) : (
        <div className={styles.grid}>
          {items.map(item => (
            <div key={item.id} className={styles.card}>
              <img
                src={item.imagePath}
                alt={item.caption || item.captionHi || 'Gallery image'}
                className={styles.img}
              />
              <div className={styles.cardBody}>
                <div className={styles.cardMeta}>
                  {item.caption && <span className={styles.caption}>{item.caption}</span>}
                  {item.captionHi && <span className={styles.caption} style={{ color: 'var(--clr-primary, #555)', fontStyle: 'italic' }}>{item.captionHi}</span>}
                  {item.category && <span className={styles.category}>{item.category}</span>}
                  {item.eventDate && (
                    <span className={styles.date}>{fmtDate(item.eventDate)}</span>
                  )}
                </div>
                <button
                  className={`${styles.heroBtn} ${item.showInHero ? styles.heroBtnActive : ''}`}
                  onClick={() => toggleHero(item)}
                  disabled={actionLoading === `hero-${item.id}`}
                  title={item.showInHero ? 'Remove from hero' : 'Show in hero'}
                >
                  {actionLoading === `hero-${item.id}` ? '…' : item.showInHero ? <IconStarFill size={15} /> : <IconStarLine size={15} />}
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => remove(item.id)}
                  disabled={actionLoading === item.id}
                >
                  {actionLoading === item.id ? '...' : <IconTrash size={15} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminGuide
        open={guide.open}
        seen={guide.seen}
        onAcknowledge={guide.acknowledge}
        onReopen={guide.reopen}
        title="Gallery Guidelines"
        sections={GALLERY_GUIDE}
      />
    </div>
  )
}