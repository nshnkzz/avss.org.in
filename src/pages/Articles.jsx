import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import styles from './Articles.module.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonImg} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonLine} style={{ width: '70%' }} />
        <div className={styles.skeletonLine} style={{ width: '90%' }} />
        <div className={styles.skeletonLine} style={{ width: '50%' }} />
      </div>
    </div>
  )
}

function ArticleCard({ article }) {
  const { t } = useTranslation()
  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null

  return (
    <Link to={`/articles/${article.slug}`} className={styles.card} aria-label={article.title}>
      {article.imagePath && (
        <div className={styles.imgWrap}>
          <img src={article.imagePath} alt={article.title} loading="lazy" decoding="async" />
        </div>
      )}
      <div className={styles.body}>
        {formattedDate && <time className={styles.date} dateTime={article.publishedAt}>{formattedDate}</time>}
        <h2 className={styles.title}>{article.title}</h2>
        {article.excerpt && <p className={styles.excerpt}>{article.excerpt}</p>}
        <span className={styles.read}>{t('articles.read_more')}</span>
      </div>
    </Link>
  )
}

export default function Articles() {
  const { t } = useTranslation()
  const [articles, setArticles] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/articles`)
      .then((r) => {
        if (!r.ok) throw new Error(`Server error ${r.status}`)
        return r.json()
      })
      .then((data) => {
        setArticles(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  return (
    <>
      <Helmet>
        <title>Articles | AVSS — Aadarsh Viklang Sewa Sangh</title>
        <meta name="description" content="Read articles from AVSS about disability rights, government schemes, UDID cards, and support for Persons with Disabilities in Singrauli, Madhya Pradesh." />
        <link rel="canonical" href="https://avss.org.in/articles" />
        <meta property="og:title" content="Articles | AVSS" />
        <meta property="og:url" content="https://avss.org.in/articles" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="page-hero">
        <div className="container">
          <h1>{t('articles.title')}</h1>
          <p>{t('articles.subtitle')}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {loading && (
            <div className={styles.grid}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {error && (
            <div className={styles.empty}>
              <span>⚠️</span>
              <p>{t('articles.error_load')}</p>
              <button className="filter-btn active" onClick={() => window.location.reload()}>{t('articles.retry')}</button>
            </div>
          )}

          {!loading && !error && articles.length === 0 && (
            <div className={styles.empty}>
              <span>📄</span>
              <p>{t('articles.empty')}</p>
            </div>
          )}

          {!loading && !error && articles.length > 0 && (
            <>
              <p className={styles.count}>{t('articles.count', { count: articles.length })}</p>
              <div className={styles.grid}>
                {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
