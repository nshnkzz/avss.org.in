import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { IconEye } from '../../components/admin/Icons'
import styles from './Admins.module.css'

const ROLE_OPTIONS = [
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'STAFF',       label: 'Staff' },
  { value: 'DESIGNER',    label: 'Designer' },
]

const ROLE_COLORS = { SUPER_ADMIN: 'navy', STAFF: 'blue', DESIGNER: 'purple' }

const EMPTY_FORM = { email: '', password: '', role: 'STAFF' }

export default function Admins() {
  const { role: myRole, adminId } = useAuth()
  const [admins, setAdmins]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [showForm, setShowForm]       = useState(false)
  const [form, setForm]               = useState(EMPTY_FORM)
  const [formLoading, setFormLoading]   = useState(false)
  const [formError, setFormError]       = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)

  const [resetTarget, setResetTarget]       = useState(null)   // admin object being reset
  const [resetPwd, setResetPwd]             = useState('')
  const [showResetPwd, setShowResetPwd]     = useState(false)
  const [resetLoading, setResetLoading]     = useState(false)
  const [resetError, setResetError]         = useState(null)

  useEffect(() => { fetchAdmins() }, [])

  const fetchAdmins = () => {
    setLoading(true)
    api.get('/api/admins')
      .then(data => { setAdmins(data); setLoading(false) })
      .catch(err => { setError(`Could not load admins. (${err.message})`); setLoading(false) })
  }

  const handleFormChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const addAdmin = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError(null)
    try {
      await api.post('/api/admins', {
        email:    form.email.trim(),
        password: form.password,
        role:     form.role,
      })
      setShowForm(false)
      setForm(EMPTY_FORM)
      fetchAdmins()
    } catch (err) {
      if (err.message === '409') {
        setFormError('An admin with this email already exists.')
      } else {
        setFormError('Something went wrong. Please try again.')
      }
    } finally {
      setFormLoading(false)
    }
  }

  const changeRole = async (id, role) => {
    setActionLoading(id)
    try {
      await api.patch(`/api/admins/${id}/role`, { role })
      fetchAdmins()
    } catch (err) {
      alert(err.message === '400' ? 'Cannot change your own role.' : 'Could not update role.')
    } finally {
      setActionLoading(null)
    }
  }

  const deleteAdmin = async (id, email) => {
    if (!window.confirm(`Delete admin "${email}"? This cannot be undone.`)) return
    setActionLoading(id)
    try {
      await api.delete(`/api/admins/${id}`)
      fetchAdmins()
    } catch (err) {
      alert(err.message === '400' ? 'Cannot delete your own account.' : 'Could not delete admin.')
    } finally {
      setActionLoading(null)
    }
  }

  const openReset = (admin) => {
    setResetTarget(admin)
    setResetPwd('')
    setResetError(null)
    setShowResetPwd(false)
  }

  const closeReset = () => {
    if (resetLoading) return
    setResetTarget(null)
    setResetPwd('')
    setResetError(null)
    setShowResetPwd(false)
  }

  const submitReset = async (e) => {
    e.preventDefault()
    setResetLoading(true)
    setResetError(null)
    try {
      await api.patch(`/api/admins/${resetTarget.id}/password`, { newPassword: resetPwd })
      closeReset()
    } catch (err) {
      setResetError(err.message === '400' ? 'Password must be at least 8 characters.' : 'Something went wrong. Please try again.')
    } finally {
      setResetLoading(false)
    }
  }

  const closeForm = () => {
    if (formLoading) return
    setShowForm(false)
    setFormError(null)
    setForm(EMPTY_FORM)
    setShowPassword(false)
  }

  if (loading) return <div className={styles.loading}>Loading admins...</div>
  if (error)   return <div className={styles.error}>{error}</div>

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Users</h1>
        <p className={styles.sub}>{admins.length} admin{admins.length !== 1 ? 's' : ''}</p>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.empty}>No admins found.</td>
              </tr>
            ) : admins.map((admin, i) => {
              const isSelf = admin.id === adminId
              return (
              <tr key={admin.id}>
                <td>{i + 1}</td>
                <td className={styles.email}>
                  {admin.email}
                  {isSelf && <span className={styles.youBadge}>you</span>}
                </td>
                <td>
                  <span className={`${styles.badge} ${styles[ROLE_COLORS[admin.role]]}`}>
                    {ROLE_OPTIONS.find(r => r.value === admin.role)?.label ?? admin.role}
                  </span>
                </td>
                <td>{new Date(admin.createdAt).toLocaleDateString('en-IN')}</td>
                <td className={styles.actions}>
                  <select
                    className={styles.roleSelect}
                    value={admin.role}
                    onChange={e => changeRole(admin.id, e.target.value)}
                    disabled={actionLoading === admin.id || isSelf}
                    aria-label={`Change role for ${admin.email}`}
                    title={isSelf ? 'Cannot change your own role' : undefined}
                  >
                    {ROLE_OPTIONS.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                  <button
                    className={`${styles.btn} ${styles.btnReset}`}
                    onClick={() => openReset(admin)}
                    disabled={actionLoading === admin.id}
                  >
                    Reset Pwd
                  </button>
                  <button
                    className={`${styles.btn} ${styles.btnDelete}`}
                    onClick={() => deleteAdmin(admin.id, admin.email)}
                    disabled={actionLoading === admin.id || isSelf}
                    title={isSelf ? 'Cannot delete your own account' : undefined}
                  >
                    {actionLoading === admin.id ? '…' : 'Delete'}
                  </button>
                </td>
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <button className={styles.fab} onClick={() => setShowForm(true)} aria-label="Add admin">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
        Add Admin
      </button>

      {resetTarget && (
        <div className={styles.overlay} onClick={closeReset}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Reset Password</h2>
              <button className={styles.closeBtn} onClick={closeReset} aria-label="Close">×</button>
            </div>

            <form onSubmit={submitReset} className={styles.form} noValidate>
              <p className={styles.resetFor}>
                Setting new password for <strong>{resetTarget.email}</strong>
              </p>

              <label className={styles.label}>
                New Password <span className={styles.req}>*</span>
                <div className={styles.passwordWrap}>
                  <input
                    className={styles.input}
                    type={showResetPwd ? 'text' : 'password'}
                    value={resetPwd}
                    onChange={e => setResetPwd(e.target.value)}
                    placeholder="Minimum 8 characters"
                    minLength={8}
                    required
                    autoFocus
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onMouseDown={() => setShowResetPwd(true)}
                    onMouseUp={() => setShowResetPwd(false)}
                    onMouseLeave={() => setShowResetPwd(false)}
                    onTouchStart={e => { e.preventDefault(); setShowResetPwd(true) }}
                    onTouchEnd={() => setShowResetPwd(false)}
                    tabIndex={-1}
                    aria-label="Hold to reveal password"
                  >
                    <IconEye size={16} />
                  </button>
                </div>
              </label>

              {resetError && <p className={styles.formError}>{resetError}</p>}

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={closeReset} disabled={resetLoading}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={resetLoading || resetPwd.length < 8}
                >
                  {resetLoading ? 'Saving…' : 'Set Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showForm && (
        <div className={styles.overlay} onClick={closeForm}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Add Admin User</h2>
              <button className={styles.closeBtn} onClick={closeForm} aria-label="Close">×</button>
            </div>

            <form onSubmit={addAdmin} className={styles.form} noValidate>
              <label className={styles.label}>
                Email <span className={styles.req}>*</span>
                <input
                  className={styles.input}
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleFormChange}
                  placeholder="newadmin@avss.org"
                  required
                  autoComplete="off"
                />
              </label>

              <label className={styles.label}>
                Password <span className={styles.req}>*</span>
                <div className={styles.passwordWrap}>
                  <input
                    className={styles.input}
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleFormChange}
                    placeholder="Minimum 8 characters"
                    minLength={8}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onMouseDown={() => setShowPassword(true)}
                    onMouseUp={() => setShowPassword(false)}
                    onMouseLeave={() => setShowPassword(false)}
                    onTouchStart={e => { e.preventDefault(); setShowPassword(true) }}
                    onTouchEnd={() => setShowPassword(false)}
                    tabIndex={-1}
                    aria-label="Hold to reveal password"
                  >
                    <IconEye size={16} />
                  </button>
                </div>
              </label>

              <label className={styles.label}>
                Role <span className={styles.req}>*</span>
                <select
                  className={styles.input}
                  name="role"
                  value={form.role}
                  onChange={handleFormChange}
                  required
                >
                  {ROLE_OPTIONS.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </label>

              <p className={styles.roleHint}>
                {form.role === 'DESIGNER' && 'Can create and edit article drafts only.'}
                {form.role === 'STAFF'    && 'Can manage all sections except Members and Admin Users.'}
                {form.role === 'SUPER_ADMIN' && 'Full access to all sections including Members and Admin Users.'}
              </p>

              {formError && <p className={styles.formError}>{formError}</p>}

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={closeForm} disabled={formLoading}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={formLoading || !form.email || !form.password}
                >
                  {formLoading ? 'Creating…' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
