import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
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
      <Helmet>
        <title>AVSS Diaries | NGO for PWD in Singrauli MP</title>
        <meta name="description" content="Aadarsh Viklang Sewa Sangh (AVSS) is an NGO in Singrauli, Madhya Pradesh helping Persons with Disabilities access UDID cards, government pensions, wheelchairs and legal aid. Free help in Hindi." />
        <meta name="keywords" content="Aadarsh Viklang Sewa Sangh, AVSS, NGO Singrauli, विकलांग सेवा संघ, PWD NGO Madhya Pradesh, disability NGO MP, UDID card Singrauli" />
        <link rel="canonical" href="https://avss.org.in" />

        {/* Open Graph — for WhatsApp/Facebook link previews */}
        <meta property="og:title" content="Aadarsh Viklang Sewa Sangh | NGO for PWD in Singrauli" />
        <meta property="og:description" content="Helping Persons with Disabilities in Singrauli, MP access government schemes, pensions and assistive devices." />
        <meta property="og:url" content="https://avss.org.in" />
        <meta property="og:type" content="website" />
      </Helmet>
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
