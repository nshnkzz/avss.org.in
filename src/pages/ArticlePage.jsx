import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import styles from './ArticlePage.module.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function ArticleSkeleton() {
  return (
    <div>
      <div className={styles.skHero} />
      <div className={styles.skBody}>
        <div className={styles.skLine} style={{ width: '80%', height: '2rem' }} />
        <div className={styles.skLine} style={{ width: '30%', height: '0.75rem' }} />
        <div className={styles.skLine} />
        <div className={styles.skLine} style={{ width: '95%' }} />
        <div className={styles.skLine} style={{ width: '88%' }} />
        <div className={styles.skLine} style={{ width: '60%' }} />
      </div>
    </div>
  )
}

export default function ArticlePage() {
  const { slug }              = useParams()
  const { t }                 = useTranslation()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetch(`${API_BASE}/api/articles/${slug}`)
      .then((r) => {
        if (r.status === 404) throw new Error('not_found')
        if (!r.ok) throw new Error('server_error')
        return r.json()
      })
      .then((data) => {
        setArticle(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message === 'not_found' ? 'not_found' : 'server_error')
        setLoading(false)
      })
  }, [slug])

  if (loading) return <ArticleSkeleton />

  if (error === 'not_found') {
    return (
      <div className={styles.error}>
        <h2>{t('articles.not_found_title')}</h2>
        <p>{t('articles.not_found_body')}</p>
        <Link to="/articles" className={styles.backBtn}>{t('articles.back_link')}</Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>{t('articles.error_title')}</h2>
        <p>{t('articles.error_body')}</p>
        <button className={styles.backBtn} onClick={() => window.location.reload()}>{t('articles.retry')}</button>
      </div>
    )
  }

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null

  return (
    <>
      <Helmet>
        <title>{article.title} | AVSS</title>
        <meta name="description" content={article.excerpt || `Read ${article.title} on AVSS.`} />
        <link rel="canonical" href={`https://avss.org.in/articles/${article.slug}`} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt || ''} />
        <meta property="og:url" content={`https://avss.org.in/articles/${article.slug}`} />
        <meta property="og:type" content="article" />
        {article.imagePath && <meta property="og:image" content={article.imagePath} />}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": article.title,
          "description": article.excerpt || '',
          "image": article.imagePath || '',
          "datePublished": article.publishedAt || '',
          "publisher": {
            "@type": "Organization",
            "name": "Aadarsh Viklang Sewa Sangh",
            "url": "https://avss.org.in"
          }
        })}</script>
      </Helmet>

      <article>
        {article.imagePath && (
          <div className={styles.cover}>
            <img src={article.imagePath} alt={article.title} />
          </div>
        )}

        <div className="container">
          <div className={styles.inner}>
            <Link to="/articles" className={styles.backLink}>{t('articles.back_all')}</Link>

            <header className={styles.header}>
              {formattedDate && (
                <time className={styles.date} dateTime={article.publishedAt}>
                  {formattedDate}
                </time>
              )}
              <h1 className={styles.title}>{article.title}</h1>
              {article.excerpt && (
                <p className={styles.excerpt}>{article.excerpt}</p>
              )}
            </header>

            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            <div className={styles.pageFooter}>
              <Link to="/articles" className={styles.backBtn}>{t('articles.back_link')}</Link>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
