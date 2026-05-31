import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import styles from './Login.module.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [values, setValues]     = useState({ email: '', password: '' })
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)

  const set = (k) => (e) => setValues(v => ({ ...v, [k]: e.target.value }))

  const submit = async () => {
    setError(null)
    setLoading(true)
    try {
      const data = await api.post('/api/auth/login', {
        email: values.email,
        password: values.password,
      })
      login(data.token)
      navigate('/admin/dashboard')
    } catch (err) {
      if (err.message.includes('401')) {
        setError('Invalid email or password.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') submit()
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🤝</span>
          <h1 className={styles.logoText}>AVSS Admin</h1>
          <p className={styles.logoSub}>Aadarsh Viklang Sewa Sangh</p>
        </div>

        {error && (
          <div className={styles.error} role="alert">{error}</div>
        )}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className={styles.input}
            value={values.email}
            onChange={set('email')}
            onKeyDown={handleKeyDown}
            autoComplete="email"
            autoFocus
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className={styles.input}
            value={values.password}
            onChange={set('password')}
            onKeyDown={handleKeyDown}
            autoComplete="current-password"
          />
        </div>

        <button
          className={styles.btn}
          onClick={submit}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </div>
  )
}