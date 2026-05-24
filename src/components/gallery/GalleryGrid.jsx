import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import galleryItems from '../../data/gallery'
import styles from './Gallery.module.css'

// Placeholder SVG shown when no real image is available
function PlaceholderImg({ bg, emoji }) {
  return (
    <div style={{ width:'100%', height:'100%', background: bg || '#EDF1F8', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
      <span style={{ fontSize: '3.5rem' }}>{emoji || '🖼️'}</span>
    </div>
  )
}

const EMOJIS = { camps:'🏕️', dist:'🦽', events:'🎉' }

export function GalleryGrid({ filter }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [lightbox, setLightbox] = useState(null)

  const filtered = filter === 'all' ? galleryItems : galleryItems.filter(g => g.cat === filter)

  return (
    <>
      <div className={styles.grid}>
        {filtered.map((item) => (
          <button
            key={item.id}
            className={styles.item}
            onClick={() => setLightbox(item)}
            aria-label={`Open: ${lang === 'en' ? item.title_en : item.title_hi}`}
          >
            <div className={styles.imgWrap}>
              <PlaceholderImg bg={item.placeholderBg} emoji={EMOJIS[item.cat]} />
            </div>
            <div className={styles.caption}>
              <h4>{lang === 'en' ? item.title_en : item.title_hi}</h4>
              <p>{item.date}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className={styles.lightboxOverlay}
          role="dialog"
          aria-modal="true"
          aria-label={t('gallery.close')}
          onClick={() => setLightbox(null)}
        >
          <div className={styles.lightboxInner} onClick={e => e.stopPropagation()}>
            <div className={styles.lightboxImg}>
              <PlaceholderImg bg={lightbox.placeholderBg} emoji={EMOJIS[lightbox.cat]} />
            </div>
            <div className={styles.lightboxInfo}>
              <h3>{lang === 'en' ? lightbox.title_en : lightbox.title_hi}</h3>
              <p>{lightbox.date}</p>
            </div>
            <button
              className={styles.lightboxClose}
              onClick={() => setLightbox(null)}
              aria-label={t('gallery.close')}
            >✕</button>
          </div>
        </div>
      )}
    </>
  )
}
