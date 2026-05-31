import { useState, useEffect } from 'react'
import api from '../../services/api'
import styles from './Members.module.css'

const STATUS_COLORS = {
  ACTIVE:    'green',
  PENDING:   'orange',
  CANCELLED: 'red',
  EXPIRED:   'grey',
}

export default function Members() {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const [actionLoading, setActionLoading] = useState(null) // id of row being acted on

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = () => {
    setLoading(true)
    api.get('/api/subscriptions')
      .then(data => {
        setSubscriptions(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError('Could not load members.')
        setLoading(false)
      })
  }

  const approve = async (id) => {
    setActionLoading(id)
    try {
      await api.patch(`/api/subscriptions/${id}/approve`)
      fetchSubscriptions() // refresh list
    } catch (err) {
      alert('Could not approve. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const cancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) return
    setActionLoading(id)
    try {
      await api.patch(`/api/subscriptions/${id}/cancel`)
      fetchSubscriptions()
    } catch (err) {
      alert('Could not cancel. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return <div className={styles.loading}>Loading members...</div>
  if (error)   return <div className={styles.error}>{error}</div>

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Members</h1>
        <p className={styles.sub}>{subscriptions.length} total subscriptions</p>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Applied</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.empty}>No subscriptions found.</td>
              </tr>
            ) : subscriptions.map((sub, i) => (
              <tr key={sub.id}>
                <td>{i + 1}</td>
                <td>{sub.customer?.name || '—'}</td>
                <td>{sub.customer?.phoneNumber || '—'}</td>
                <td>{sub.plan?.name || '—'}</td>
                <td>
                  <span className={`${styles.badge} ${styles[STATUS_COLORS[sub.status]]}`}>
                    {sub.status}
                  </span>
                </td>
                <td>{sub.startDate ? new Date(sub.startDate).toLocaleDateString('en-IN') : '—'}</td>
                <td>{sub.endDate   ? new Date(sub.endDate).toLocaleDateString('en-IN')   : '—'}</td>
                <td className={styles.actions}>
                  {sub.status === 'PENDING' && (
                    <button
                      className={`${styles.btn} ${styles.btnApprove}`}
                      onClick={() => approve(sub.id)}
                      disabled={actionLoading === sub.id}
                    >
                      {actionLoading === sub.id ? '...' : 'Approve'}
                    </button>
                  )}
                  {sub.status === 'ACTIVE' && (
                    <button
                      className={`${styles.btn} ${styles.btnCancel}`}
                      onClick={() => cancel(sub.id)}
                      disabled={actionLoading === sub.id}
                    >
                      {actionLoading === sub.id ? '...' : 'Cancel'}
                    </button>
                  )}
                  {(sub.status === 'CANCELLED' || sub.status === 'EXPIRED') && (
                    <span className={styles.noAction}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}