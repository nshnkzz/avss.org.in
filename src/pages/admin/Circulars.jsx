import { useState, useEffect, useRef } from 'react'
import api from '../../services/api'
import styles from './Circulars.module.css'
import useAdminGuide from '../../hooks/useAdminGuide'
import AdminGuide from '../../components/admin/AdminGuide'
import { IconUpload, IconDocument } from '../../components/admin/Icons'

const CIRCULARS_GUIDE = [
  {
    icon: <IconDocument size={15} />,
    title: 'Before Uploading a Circular',
    items: [
      'Upload only official documents received from recognised government or legal bodies.',
      'Keep PDF file size under 5 MB; compress larger files using a PDF compressor before uploading.',
      'Verify the document date and category before submitting — these cannot be edited after upload.',
      'Provide accurate, clear titles in both English and Hindi — members search by title.',
      'Check the existing list before uploading to avoid duplicate entries.',
    ],
  },
]

export default function AdminCirculars() {
  const [circulars, setCirculars]         = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [uploading, setUploading]         = useState(false)
  const [uploadError, setUploadError]     = useState(null)
  const fileRef = useRef(null)

  const guide = useAdminGuide('circulars')
  const [form, setForm] = useState({
    title_en: '', title_hi: '', category: '', date: '', file: null
  })

  useEffect(() => { fetchCirculars() }, [])

  const fetchCirculars = () => {
    setLoading(true)
    api.get('/api/circulars?limit=200')
      .then(res => {
        setCirculars(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load circulars.')
        setLoading(false)
      })
  }

  const setField = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const upload = async () => {
    if (!form.title_en.trim() || !form.title_hi.trim() || !form.file) {
      setUploadError('Title (English), Title (Hindi) and PDF file are required.')
      return
    }
    setUploading(true)
    setUploadError(null)

    const body = new FormData()
    body.append('title_en',  form.title_en)
    body.append('title_hi',  form.title_hi)
    body.append('category',  form.category)
    body.append('file',      form.file)
    body.append('date', form.date)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/circulars`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('avss_token')}` },
        body,
      })
      if (!res.ok) throw new Error(res.status)
      setForm({ title_en: '', title_hi: '', category: '', date: '', file: null })
      if (fileRef.current) fileRef.current.value = ''
      fetchCirculars()
    } catch {
      setUploadError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this circular permanently?')) return
    setActionLoading(id)
    try {
      await api.delete(`/api/circulars/${id}`)
      fetchCirculars()
    } catch {
      alert('Could not delete. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Circulars</h1>
        <p className={styles.sub}>{circulars.length} total</p>
      </div>

      {/* Upload form */}
      <div className={styles.uploadCard} onClick={guide.trigger}>
        <h2 className={styles.uploadTitle}>Upload New Circular</h2>
        {uploadError && <div className={styles.uploadError}>{uploadError}</div>}

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Title (English) *</label>
            <input className={styles.input} value={form.title_en} onChange={setField('title_en')} placeholder="RTI Notice" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Title (Hindi) *</label>
            <input className={styles.input} value={form.title_hi} onChange={setField('title_hi')} placeholder="आरटीआई नोटिस" />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <select className={styles.input} value={form.category} onChange={setField('category')}>
              <option value="">— None —</option>
              <option value="Policy">Policy</option>
              <option value="Legal">Legal</option>
              <option value="Pension">Pension</option>
              <option value="General">General</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Date</label>
            <input
                type="date"
                className={styles.input}
                value={form.date}
                onChange={setField('date')}
            />
            </div>
          <div className={styles.field}>
            <label className={styles.label}>PDF File *</label>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              className={styles.input}
              onChange={e => setForm(f => ({ ...f, file: e.target.files[0] }))}
            />
          </div>
        </div>

        <button
          className={styles.uploadBtn}
          onClick={upload}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : <><IconUpload size={15} /> Upload Circular</>}
        </button>
      </div>

      {/* Circulars table */}
      {loading ? (
        <div className={styles.loading}>Loading circulars...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Title (EN)</th>
                <th>Title (HI)</th>
                <th>Category</th>
                <th>Date</th>
                <th>File</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {circulars.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.empty}>No circulars found.</td>
                </tr>
              ) : circulars.map((c, i) => (
                <tr key={c.id}>
                  <td>{i + 1}</td>
                  <td>{c.title?.en || '—'}</td>
                  <td>{c.title?.hi || '—'}</td>
                  <td>{c.category || '—'}</td>
                  <td>{c.date ? new Date(c.date).toLocaleDateString('en-IN') : '—'}</td>
                  <td>
                    <a href={c.filePath} target="_blank" rel="noopener noreferrer" className={styles.viewLink}>
                      View PDF
                    </a>
                  </td>
                  <td>
                    <button
                      className={`${styles.btn} ${styles.btnDelete}`}
                      onClick={() => remove(c.id)}
                      disabled={actionLoading === c.id}
                    >
                      {actionLoading === c.id ? '...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminGuide
        open={guide.open}
        seen={guide.seen}
        onAcknowledge={guide.acknowledge}
        onReopen={guide.reopen}
        title="Circulars Guidelines"
        sections={CIRCULARS_GUIDE}
      />
    </div>
  )
}