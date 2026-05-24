import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GalleryGrid } from '../components/gallery/GalleryGrid'

export default function Gallery() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('all')

  const filters = [
    ['all',    t('gallery.filter_all')],
    ['camps',  t('gallery.filter_camps')],
    ['events', t('gallery.filter_events')],
    ['dist',   t('gallery.filter_dist')],
  ]

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>{t('gallery.title')}</h1>
          <p>{t('gallery.subtitle')}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '2rem' }} role="group" aria-label="Filter gallery">
            {filters.map(([val, label]) => (
              <button
                key={val}
                className={`filter-btn ${filter === val ? 'active' : ''}`}
                onClick={() => setFilter(val)}
                aria-pressed={filter === val}
              >
                {label}
              </button>
            ))}
          </div>
          <GalleryGrid filter={filter} />
        </div>
      </section>
    </>
  )
}
