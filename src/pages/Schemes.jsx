import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import schemes from '../data/schemes'
import SchemeCard from '../components/schemes/SchemeCard'

export default function Schemes() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? schemes : schemes.filter(s => s.cat === filter)

  return (
    <>
      <Helmet>
        <title>Government Schemes for PWD | AVSS Singrauli</title>
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
          <h1>{t('schemes.title')}</h1>
          <p>{t('schemes.subtitle')}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '2rem' }} role="group" aria-label="Filter schemes">
            {[
              ['all',     t('schemes.filter_all')],
              ['central', t('schemes.filter_central')],
              ['state',   t('schemes.filter_state')],
            ].map(([val, label]) => (
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

          {/* Cards */}
          <div className="card-grid grid-2">
            {filtered.map(scheme => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>

          {/* Help banner */}
          <div style={{
            marginTop: '3rem',
            background: 'var(--saffron-light)',
            border: '2px solid var(--saffron)',
            borderRadius: 'var(--radius)',
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: '3rem' }} aria-hidden="true">🤝</span>
            <div style={{ flex: 1, minWidth: 240 }}>
              <strong style={{ display: 'block', color: 'var(--navy)', marginBottom: '0.4rem', fontSize: '1.15rem' }}>
                {t('schemes.help_title')}
              </strong>
              <span style={{ color: 'var(--text)', fontSize: '1rem' }}>{t('schemes.help_body')}</span>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/contact')}>
              {t('schemes.help_btn')}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
