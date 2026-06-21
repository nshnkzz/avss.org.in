import { useState, useEffect } from 'react'
import api from '../../services/api'
import styles from './Members.module.css'

const STATUS_COLORS = {
  ACTIVE:    'green',
  PENDING:   'orange',
  CANCELLED: 'red',
  EXPIRED:   'grey',
}

const EMPTY_FORM = { name: '', phone: '', email: '', planId: '' }

export default function Members() {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

  const [plans, setPlans]             = useState([])
  const [showForm, setShowForm]       = useState(false)
  const [form, setForm]               = useState(EMPTY_FORM)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError]     = useState(null)

  useEffect(() => {
    fetchSubscriptions()
    api.get('/api/plans').then(setPlans).catch(() => {})
  }, [])

  const fetchSubscriptions = () => {
    setLoading(true)
    api.get('/api/subscriptions')
      .then(data => { setSubscriptions(data); setLoading(false) })
      .catch(err => { console.error(err); setError('Could not load members.'); setLoading(false) })
  }

  const approve = async (id) => {
    setActionLoading(id)
    try {
      await api.patch(`/api/subscriptions/${id}/approve`)
      fetchSubscriptions()
    } catch {
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
    } catch {
      alert('Could not cancel. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleFormChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const addMember = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError(null)
    try {
      // Create customer — 409 means they already exist, which is fine
      try {
        await api.post('/api/users', {
          name: form.name.trim(),
          phoneNumber: form.phone.trim(),
          ...(form.email.trim() && { email: form.email.trim() }),
        })
      } catch (err) {
        if (err.message !== '409') throw err
      }

      // Create subscription (starts as PENDING)
      const sub = await api.post('/api/subscriptions', {
        phoneNumber: form.phone.trim(),
        planId: Number(form.planId),
        ...(form.email.trim() && { email: form.email.trim() }),
      })

      // Immediately approve — admin verified this person offline
      await api.patch(`/api/subscriptions/${sub.id}/approve`)

      setShowForm(false)
      setForm(EMPTY_FORM)
      fetchSubscriptions()
    } catch (err) {
      if (err.message === '409') {
        setFormError('This person already has an active or pending subscription.')
      } else {
        setFormError('Something went wrong. Please try again.')
      }
    } finally {
      setFormLoading(false)
    }
  }

  const closeForm = () => {
    if (formLoading) return
    setShowForm(false)
    setFormError(null)
    setForm(EMPTY_FORM)
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

      <button className={styles.fab} onClick={() => setShowForm(true)} aria-label="Add offline member">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
        Add Member
      </button>

      {showForm && (
        <div className={styles.overlay} onClick={closeForm}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Add Offline Member</h2>
              <button className={styles.closeBtn} onClick={closeForm} aria-label="Close">×</button>
            </div>

            <form onSubmit={addMember} className={styles.form} noValidate>
              <label className={styles.label}>
                Full Name <span className={styles.req}>*</span>
                <input
                  className={styles.input}
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Ramesh Kumar"
                  required
                  autoComplete="off"
                />
              </label>

              <label className={styles.label}>
                Phone Number <span className={styles.req}>*</span>
                <input
                  className={styles.input}
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  title="Enter a 10-digit phone number"
                  required
                />
              </label>

              <label className={styles.label}>
                Email <span className={styles.opt}>(optional)</span>
                <input
                  className={styles.input}
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleFormChange}
                  placeholder="member@example.com"
                />
              </label>

              <label className={styles.label}>
                Membership Plan <span className={styles.req}>*</span>
                <select
                  className={styles.input}
                  name="planId"
                  value={form.planId}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select a plan…</option>
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₹{Number(p.amount).toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </label>

              {formError && <p className={styles.formError}>{formError}</p>}

              <p className={styles.formNote}>
                Membership will be created and approved immediately.
              </p>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={closeForm}
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={formLoading || !form.name || !form.phone || !form.planId}
                >
                  {formLoading ? 'Adding…' : 'Add & Approve'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
