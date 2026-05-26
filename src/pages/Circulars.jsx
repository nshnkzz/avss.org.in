import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import circulars from '../data/circulars'

export default function Circulars() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const isEnLang = i18n.language == "en"  // e.g. "en" or "hi"
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')   // all | policy | pension | legal | general
  const [sort, setSort]       = useState('newest') // newest | oldest
  const [page, setPage]       = useState(1)
  const searchRef = useRef(null)
  const handleSearchFocus = () => {
    setTimeout(() => searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300)
  }
  const PER_PAGE = 10
  const filtered = circulars
  .filter(c => filter === 'all' || c.category === filter)
  .filter(c => {
    const q = search.toLowerCase()
    return (
      c.title.toLowerCase().includes(q) ||
      c.title_hi.includes(q) ||
      c.date.includes(q)
    )
  })
  .sort((a, b) => {
    if (sort === 'newest') return new Date(b.date) - new Date(a.date)
    if (sort === 'oldest') return new Date(a.date) - new Date(b.date)
    if (sort === 'az')     return a.title.localeCompare(b.title)
  })

const totalPages = Math.ceil(filtered.length / PER_PAGE)
const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

useEffect(() => setPage(1), [search, filter, sort])
  return (
    <>
      <Helmet>
        <title>Circulars and government orders | AVSS Singrauli</title>
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
          <h1>{t('circulars.title')}</h1>
          <p>{t('circulars.subtitle')}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '2rem' }} role="group" aria-label="Filter cirulars">
            {[
              ['all',     t('circulars.filter_all')],
              ['policy', t('circulars.filter_policy')],
              ['pension',   t('circulars.filter_pension')],
              ['legal',   t('circulars.filter_legal')]
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

          {/* Search + Sort row */}
          <div className="search-sort-row">
            <form className="search_bar" onSubmit={e => e.preventDefault()}>
              <input
                ref={searchRef}
                type="text"
                placeholder={t(`circulars.search_placeholder`)}
                name="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={handleSearchFocus}
              />
              <button type="submit" aria-label="Search">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </form>

            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="form-input"
              style={{ width: 'auto', flexShrink: 0 }}
            >
              <option value="newest">{t('circulars.sort_newest')}</option>
              <option value="oldest">{t('circulars.sort_oldest')}</option>
              <option value="az">{t('circulars.sort_az')}</option>
            </select>
          </div>


          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('circulars.col_sno')}</th>
                  <th>{t('circulars.col_date')}</th>
                  <th>{t('circulars.col_title')}</th>
                  <th style={{ width: '5rem', textAlign: 'center' }}>{t('circulars.col_download')}</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      {t('circulars.no_results')}
                    </td>
                  </tr>
                ) : paginated.map((row, i) => (
                  <tr key={row.id}>
                    <td>{(page - 1) * PER_PAGE + i + 1}</td>
                    <td>{row.date}</td>
                    <td>{isEnLang ? row.title : row.title_hi}</td>
                    <td style={{ textAlign: 'center' }}>
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="circular-dl-btn"
                        aria-label={t('circulars.col_download')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Showing + Pagination */}
          {filtered.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginTop: '1.25rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
                {t('circulars.showing', {
                  from: (page - 1) * PER_PAGE + 1,
                  to: Math.min(page * PER_PAGE, filtered.length),
                  total: filtered.length
                })}
              </p>
              {totalPages > 1 && (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    className="filter-btn"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{ opacity: page === 1 ? 0.4 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                  >
                    {t('circulars.prev')}
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                    <button
                      key={num}
                      className={`filter-btn${num === page ? ' active' : ''}`}
                      onClick={() => setPage(num)}
                      aria-current={num === page ? 'page' : undefined}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    className="filter-btn"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={{ opacity: page === totalPages ? 0.4 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                  >
                    {t('circulars.next')}
                  </button>
                </div>
              )}
            </div>
          )}

          
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
                {t('circulars.help_title')}
              </strong>
              <span style={{ color: 'var(--text)', fontSize: '1rem' }}>{t('circulars.help_body')}</span>
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
