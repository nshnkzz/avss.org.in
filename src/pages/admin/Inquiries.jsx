import { useState, useEffect } from 'react'
import api from '../../services/api'
import styles from './Inquiries.module.css'
import { IconPhone, IconMail, IconChevronUp, IconChevronDown, IconCheck } from '../../components/admin/Icons'

export default function Inquiries() {
  const [inquiries, setInquiries]         = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const [filter, setFilter]               = useState('all')
  const [actionLoading, setActionLoading] = useState(null)
  const [expanded, setExpanded]           = useState(null)

  useEffect(() => { fetchInquiries() }, [filter])

  const fetchInquiries = () => {
    setLoading(true)
    const query = filter === 'all' ? '' : `?resolved=${filter === 'resolved'}`
    api.get(`/api/contact${query}`)
      .then(data => { setInquiries(data); setLoading(false) })
      .catch(err => { console.error(err); setError('Could not load inquiries.'); setLoading(false) })
  }

  const resolve = async (id) => {
    setActionLoading(id)
    try {
      await api.patch(`/api/contact/${id}/resolve`)
      fetchInquiries()
    } catch {
      alert('Could not resolve. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this inquiry permanently?')) return
    setActionLoading(id)
    try {
      await api.delete(`/api/contact/${id}`)
      fetchInquiries()
    } catch {
      alert('Could not delete. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const toggleExpand = (id) => setExpanded(e => e === id ? null : id)

  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Inquiries</h1>
          <p className={styles.sub}>{inquiries.length} {filter === 'all' ? 'total' : filter}</p>
        </div>

        <div className={styles.tabs}>
          {[['all', 'All'], ['unresolved', 'Unresolved'], ['resolved', 'Resolved']].map(([val, label]) => (
            <button
              key={val}
              className={`${styles.tab} ${filter === val ? styles.tabActive : ''}`}
              onClick={() => setFilter(val)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading inquiries...</div>
      ) : inquiries.length === 0 ? (
        <div className={styles.empty}>No inquiries found.</div>
      ) : (
        <div className={styles.list}>
          {inquiries.map(inq => (
            <div key={inq.id} className={`${styles.card} ${inq.resolved ? styles.cardResolved : ''}`}>
              <div className={styles.cardTop} onClick={() => toggleExpand(inq.id)}>
                <div className={styles.cardLeft}>
                  <span className={`${styles.badge} ${inq.resolved ? styles.badgeResolved : styles.badgePending}`}>
                    {inq.resolved ? 'Resolved' : 'Unresolved'}
                  </span>
                  <span className={styles.name}>{inq.name}</span>
                  {inq.subject && <span className={styles.subject}>— {inq.subject}</span>}
                </div>
                <div className={styles.cardRight}>
                  <span className={styles.date}>
                    {new Date(inq.createdAt).toLocaleDateString('en-IN')}
                  </span>
                  <span className={styles.chevron}>
                    {expanded === inq.id ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                  </span>
                </div>
              </div>

              {expanded === inq.id && (
                <div className={styles.cardBody}>
                  <div className={styles.meta}>
                    {inq.phone && <span><IconPhone size={13} /> {inq.phone}</span>}
                    {inq.email && <span><IconMail  size={13} /> {inq.email}</span>}
                  </div>
                  <p className={styles.message}>{inq.message}</p>
                  {inq.resolvedAt && (
                    <p className={styles.resolvedAt}>
                      Resolved on {new Date(inq.resolvedAt).toLocaleDateString('en-IN')}
                    </p>
                  )}
                  <div className={styles.cardActions}>
                    {!inq.resolved && (
                      <button
                        className={`${styles.btn} ${styles.btnResolve}`}
                        onClick={() => resolve(inq.id)}
                        disabled={actionLoading === inq.id}
                      >
                        {actionLoading === inq.id ? '...' : <><IconCheck size={14} /> Mark Resolved</>}
                      </button>
                    )}
                    <button
                      className={`${styles.btn} ${styles.btnDelete}`}
                      onClick={() => remove(inq.id)}
                      disabled={actionLoading === inq.id}
                    >
                      {actionLoading === inq.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
