import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './GalleryGrid.module.css'

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

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// ── Skeleton card ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonImg} />
      <div className={styles.skeletonCaption} />
    </div>
  )
}

// ── Lightbox ───────────────────────────────────────────────────────────────
function Lightbox({ item, caption, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  return (
    <div className={styles.lightboxOverlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Image viewer">
      <button className={styles.lightboxClose} onClick={onClose} aria-label="Close">✕</button>

      <button
        className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        aria-label="Previous image"
      >‹</button>

      <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
        <img src={item.imagePath} alt={caption || 'Gallery image'} />
        {(caption || item.eventDate) && (
          <div className={styles.lightboxMeta}>
            {caption && <p className={styles.lightboxCaption}>{caption}</p>}
            {item.eventDate && <span className={styles.lightboxDate}>{fmtDate(item.eventDate)}</span>}
          </div>
        )}
      </div>

      <button
        className={`${styles.lightboxNav} ${styles.lightboxNext}`}
        onClick={(e) => { e.stopPropagation(); onNext() }}
        aria-label="Next image"
      >›</button>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export function GalleryGrid({ filter }) {
  const { i18n } = useTranslation()
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [lightbox, setLightbox] = useState(null) // index into items[]

  const getCaption = (item) => {
    if (i18n.language === 'hi') return item.captionHi || item.caption || null
    return item.caption || item.captionHi || null
  }

  // Fetch whenever filter changes
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    const FILTER_MAP = { camps: 'Camps', events: 'Events', dist: 'Distribution' }
    const category = FILTER_MAP[filter]
    const url = category
      ? `${API_BASE}/api/gallery?category=${encodeURIComponent(category)}`
      : `${API_BASE}/api/gallery`

    fetch(url, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`Server error ${r.status}`)
        return r.json()
      })
      .then((data) => {
        setItems(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError('Could not load gallery. Please try again.')
        setLoading(false)
      })

    return () => controller.abort()
  }, [filter])

  const openLightbox  = (idx) => setLightbox(idx)
  const closeLightbox = useCallback(() => setLightbox(null), [])
  const prevImage     = useCallback(() => setLightbox((i) => (i - 1 + items.length) % items.length), [items.length])
  const nextImage     = useCallback(() => setLightbox((i) => (i + 1) % items.length), [items.length])

  // ── Loading state ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  // ── Error state ────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>⚠️</span>
        <p>{error}</p>
        <button className="filter-btn active" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    )
  }

  // ── Empty state ────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🖼️</span>
        <p>No photos in this category yet.</p>
      </div>
    )
  }

  // ── Grid ───────────────────────────────────────────────────────────────
  return (
    <>
      <p className={styles.count}>{items.length} photo{items.length !== 1 ? 's' : ''}</p>

      <div className={styles.grid}>
        {items.map((item, idx) => {
          const caption = getCaption(item)
          return (
            <button
              key={item.id}
              className={styles.card}
              onClick={() => openLightbox(idx)}
              aria-label={caption || `Gallery image ${idx + 1}`}
            >
              <div className={styles.imgWrap}>
                <img
                  src={item.imagePath}
                  alt={caption || ''}
                  loading="lazy"
                  decoding="async"
                />
                <div className={styles.overlay}>
                  <span className={styles.zoom}>🔍</span>
                </div>
              </div>
              {(caption || item.eventDate) && (
                <div className={styles.cardFooter}>
                  {caption && <p className={styles.caption}>{caption}</p>}
                  {item.eventDate && <span className={styles.date}>{fmtDate(item.eventDate)}</span>}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {lightbox !== null && (
        <Lightbox
          item={items[lightbox]}
          caption={getCaption(items[lightbox])}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </>
  )
}
