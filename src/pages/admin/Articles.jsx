import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import api from '../../services/api'
import styles from './Articles.module.css'
import useAdminGuide from '../../hooks/useAdminGuide'
import AdminGuide from '../../components/admin/AdminGuide'
import { IconPencil, IconStarFill, IconStarLine, IconPlus, IconXMark } from '../../components/admin/Icons'

const ARTICLES_GUIDE = [
  {
    icon: <IconPencil size={15} />,
    title: 'Writing Guidelines',
    items: [
      'All content must be original — never copy-paste from websites, circulars, or publications without proper rewriting.',
      'Proofread carefully before publishing; errors on live articles are publicly visible.',
      'Write a concise excerpt (2–3 sentences) — it appears on article listing cards.',
      'Cover image URL must point to an AVSS-owned or public-domain image only.',
      'New articles are saved as Drafts automatically — review before clicking Publish.',
    ],
  },
  {
    icon: <IconStarLine size={15} />,
    title: 'Home Page — Feature Button',
    variant: 'feature',
    items: [
      '☆ Home / ★ On Home — click it on any published article to show it in the Latest Articles section on the Home page.',
      'Maximum 6 articles can be featured at the same time; attempting a 7th will show an error.',
      '"★ On Home" means the article is currently featured — click again to remove it from the Home page.',
      'An article must be published before it can be featured.',
    ],
  },
]

const generateSlug = (title) =>
  title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function AdminArticles() {
  const [articles, setArticles]           = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [saving, setSaving]               = useState(false)
  const [saveError, setSaveError]         = useState(null)
  const [showForm, setShowForm]           = useState(false)
  const [preview, setPreview]             = useState(null)

  const guide = useAdminGuide('articles')
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', imagePath: ''
  })

  useEffect(() => { fetchArticles() }, [])

  const fetchArticles = () => {
    setLoading(true)
    api.get('/api/articles/all')
      .then(data => {
        setArticles(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load articles.')
        setLoading(false)
      })
  }

  const setField = (k) => (e) => {
    const val = e.target.value
    setForm(f => ({
      ...f,
      [k]: val,
      ...(k === 'title' ? { slug: generateSlug(val) } : {})
    }))
  }

  const save = async () => {
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      setSaveError('Title, slug and content are required.')
      return
    }
    setSaving(true)
    setSaveError(null)
    try {
      await api.post('/api/articles', {
        title:     form.title,
        slug:      form.slug,
        excerpt:   form.excerpt,
        content:   form.content,
        ...(form.imagePath && { imagePath: form.imagePath }),
      })
      setForm({ title: '', slug: '', excerpt: '', content: '', imagePath: '' })
      setShowForm(false)
      fetchArticles()
    } catch (err) {
      if (err.message.includes('409')) {
        setSaveError('Slug already in use. Change the title or edit the slug.')
      } else {
        setSaveError('Could not save article. Please try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  const publish = async (slug) => {
    setActionLoading(slug)
    try {
      await api.patch(`/api/articles/${slug}/publish`)
      fetchArticles()
    } catch {
      alert('Could not publish. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const feature = async (slug) => {
    setActionLoading(slug)
    try {
      await api.patch(`/api/articles/${slug}/feature`)
      fetchArticles()
    } catch (err) {
      alert(err.message?.includes('409') ? 'Maximum 6 articles can be featured on the home page.' : 'Could not update. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const unfeature = async (slug) => {
    setActionLoading(slug)
    try {
      await api.patch(`/api/articles/${slug}/unfeature`)
      fetchArticles()
    } finally {
      setActionLoading(null)
    }
  }

  const unpublish = async (slug) => {
    setActionLoading(slug)
    try {
      await api.patch(`/api/articles/${slug}/unpublish`)
      fetchArticles()
    } catch {
      alert('Could not unpublish. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const remove = async (slug) => {
    if (!window.confirm('Delete this article permanently?')) return
    setActionLoading(slug)
    try {
      await api.delete(`/api/articles/${slug}`)
      fetchArticles()
    } catch {
      alert('Could not delete. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Articles</h1>
          <p className={styles.sub}>{articles.length} total</p>
        </div>
        <button
          className={styles.newBtn}
          onClick={() => { guide.trigger(); setShowForm(f => !f) }}
        >
          {showForm ? <><IconXMark size={15} /> Cancel</> : <><IconPlus size={15} /> New Article</>}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>New Article</h2>
          {saveError && <div className={styles.formError}>{saveError}</div>}

          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label}>Title *</label>
              <input
                className={styles.input}
                value={form.title}
                onChange={setField('title')}
                placeholder="UDID Card — Complete Guide"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Slug *</label>
              <input
                className={styles.input}
                value={form.slug}
                onChange={setField('slug')}
                placeholder="udid-card-complete-guide"
              />
            </div>
          </div>

          <div className={styles.field} style={{ marginBottom: '1rem' }}>
            <label className={styles.label}>Excerpt (shown in listing)</label>
            <input
              className={styles.input}
              value={form.excerpt}
              onChange={setField('excerpt')}
              placeholder="Short summary shown in article listings..."
            />
          </div>

          <div className={styles.field} style={{ marginBottom: '1rem' }}>
            <label className={styles.label}>Cover Image URL (optional)</label>
            <input
              className={styles.input}
              value={form.imagePath}
              onChange={setField('imagePath')}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className={styles.field} style={{ marginBottom: '1.5rem' }}>
            <label className={styles.label}>Content *</label>
            <ReactQuill
              theme="snow"
              value={form.content}
              onChange={(val) => setForm(f => ({ ...f, content: val }))}
              className={styles.quill}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link'],
                  ['clean']
                ]
              }}
            />
          </div>

          <button
            className={styles.saveBtn}
            onClick={save}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save as Draft'}
          </button>
        </div>
      )}

      {/* Articles list */}
      {loading ? (
        <div className={styles.loading}>Loading articles...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : articles.length === 0 ? (
        <div className={styles.empty}>No articles yet. Create your first one above.</div>
      ) : (
        <div className={styles.list}>
          {articles.map(article => (
            <div key={article.slug} className={styles.card}>
              {article.imagePath && (
                <img src={article.imagePath} alt={article.title} className={styles.cardImg} />
              )}
              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <div>
                    <span className={`${styles.badge} ${article.published ? styles.badgePublished : styles.badgeDraft}`}>
                      {article.published ? 'Published' : 'Draft'}
                    </span>
                    <h3 className={styles.cardTitle}>{article.title}</h3>
                    <p className={styles.cardSlug}>/{article.slug}</p>
                    {article.excerpt && <p className={styles.cardExcerpt}>{article.excerpt}</p>}
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      className={`${styles.btn} ${styles.btnPreview}`}
                      onClick={() => setPreview(article)}
                    >
                      Preview
                    </button>
                    {article.featuredOnHome ? (
                      <button
                        className={`${styles.btn} ${styles.btnFeatured}`}
                        onClick={() => unfeature(article.slug)}
                        disabled={actionLoading === article.slug}
                        title="Remove from home page"
                      >
                        {actionLoading === article.slug ? '...' : <><IconStarFill size={14} /> On Home</>}
                      </button>
                    ) : (
                      <button
                        className={`${styles.btn} ${styles.btnFeature}`}
                        onClick={() => feature(article.slug)}
                        disabled={actionLoading === article.slug}
                        title="Show on home page (max 6)"
                      >
                        {actionLoading === article.slug ? '...' : <><IconStarLine size={14} /> Home</>}
                      </button>
                    )}
                    {article.published ? (
                      <button
                        className={`${styles.btn} ${styles.btnUnpublish}`}
                        onClick={() => unpublish(article.slug)}
                        disabled={actionLoading === article.slug}
                      >
                        {actionLoading === article.slug ? '...' : 'Unpublish'}
                      </button>
                    ) : (
                      <button
                        className={`${styles.btn} ${styles.btnPublish}`}
                        onClick={() => publish(article.slug)}
                        disabled={actionLoading === article.slug}
                      >
                        {actionLoading === article.slug ? '...' : 'Publish'}
                      </button>
                    )}
                    <button
                      className={`${styles.btn} ${styles.btnDelete}`}
                      onClick={() => remove(article.slug)}
                      disabled={actionLoading === article.slug}
                    >
                      Delete
                    </button>
                  </div>
                </div>
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
        title="Articles Guidelines"
        sections={ARTICLES_GUIDE}
      />

      {preview && (
        <div className={styles.modalOverlay} onClick={() => setPreview(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <span className={`${styles.badge} ${preview.published ? styles.badgePublished : styles.badgeDraft}`}>
                  {preview.published ? 'Published' : 'Draft'}
                </span>
                <h2 className={styles.modalTitle}>{preview.title}</h2>
                {preview.excerpt && <p className={styles.modalExcerpt}>{preview.excerpt}</p>}
              </div>
              <button className={styles.modalClose} onClick={() => setPreview(null)}>✕</button>
            </div>
            {preview.imagePath && (
              <img src={preview.imagePath} alt={preview.title} className={styles.modalImg} />
            )}
            <div
              className={`${styles.modalBody} ql-editor`}
              dangerouslySetInnerHTML={{ __html: preview.content }}
            />
          </div>
        </div>
      )}
    </div>
  )
}