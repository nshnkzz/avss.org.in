import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import FormGroup from './FormGroup'
import api from '../../services/api'

export default function MembershipForm({ plans = [] }) {
  const { t, i18n } = useTranslation()
  const f = t('membership.fields', { returnObjects: true })
  const lang = i18n.language?.startsWith('hi') ? 'hi' : 'en'

  const [values, setValues]         = useState({ name: '', phone: '', email: '', planId: '' })
  const [errors, setErrors]         = useState({})
  const [success, setSuccess]       = useState(false)
  const [loading, setLoading]       = useState(false)
  const [serverError, setServerError] = useState(null)
  const [activeSub, setActiveSub]   = useState(null)

  const set = (k) => (e) => setValues(v => ({ ...v, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!values.name.trim())  e.name   = f.error_name
    if (!values.phone.trim()) e.phone  = f.error_phone
    if (!values.planId)       e.planId = f.error_plan
    return e
  }

  const submit = async () => {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return

    setLoading(true)
    setServerError(null)

    try {
      // Step 1 — check if user exists, create if not
      const existing = await api.get(`/api/users/search?name=${encodeURIComponent(values.name)}&phoneNumber=${encodeURIComponent(values.phone)}`)
      let userId
      if (existing) {
        userId = existing.id
      } else {
        const newUser = await api.post('/api/users', {
          name: values.name,
          phoneNumber: values.phone,
          ...(values.email && { email: values.email }),
        })
        userId = newUser.id
      }

      // Step 2 — check if already has active subscription
      const status = await api.get(`/api/subscriptions/status/${values.phone}`)
      if (status.active) {
        setActiveSub(status.subscription)
        setLoading(false)
        return
      }

      // Step 3 — create subscription
      await api.post('/api/subscriptions', {
        phoneNumber: values.phone,
        planId: Number(values.planId),
        ...(values.email && { email: values.email }),
      })

      setSuccess(true)
      setValues({ name: '', phone: '', email: '', planId: '' })
      setTimeout(() => setSuccess(false), 9000)

    } catch (err) {
      console.error(err)
      setServerError(f.error_server || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (activeSub) {
    const planName = activeSub.plan?.description?.[lang]?.name ?? activeSub.plan?.name ?? '—'
    const expiry   = activeSub.endDate ? new Date(activeSub.endDate).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null
    return (
      <div className="form-box" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
        <h3 style={{ color: 'var(--green)', fontWeight: 700, fontSize: '1.3rem', marginBottom: '0.4rem' }}>
          {lang === 'hi' ? 'आप पहले से सदस्य हैं!' : 'You\'re already a member!'}
        </h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          {lang === 'hi' ? 'इस नंबर पर पहले से एक सक्रिय सदस्यता है।' : 'An active membership already exists for this phone number.'}
        </p>

        <div style={{
          background: 'var(--green-light)',
          border: '2px solid var(--green)',
          borderRadius: 'var(--radius)',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          textAlign: 'left',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--green)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                {lang === 'hi' ? 'वर्तमान योजना' : 'Current Plan'}
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)' }}>{planName}</div>
            </div>
            <span style={{
              background: 'var(--green)',
              color: 'white',
              borderRadius: '999px',
              padding: '0.25rem 0.9rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}>
              {activeSub.status}
            </span>
          </div>
          {expiry && (
            <div style={{ marginTop: '0.85rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {lang === 'hi' ? '📅 समाप्ति:' : '📅 Expires:'} <strong style={{ color: 'var(--text)' }}>{expiry}</strong>
            </div>
          )}
        </div>

        <button
          className="btn btn-outline btn-full"
          onClick={() => { setActiveSub(null); setValues({ name: '', phone: '', email: '', planId: '' }) }}
        >
          {lang === 'hi' ? '← वापस जाएं' : '← Go back'}
        </button>
      </div>
    )
  }

  return (
    <div className="form-box">
      {success && (
        <div className="success-msg" role="status" aria-live="polite">{f.success}</div>
      )}
      {serverError && (
        <div className="error-msg" role="alert" aria-live="polite">{serverError}</div>
      )}

      <div className="form-row">
        <FormGroup id="m_name" label={f.name} required error={errors.name}>
          <input
            id="m_name" type="text" className={`form-input ${errors.name ? 'error' : ''}`}
            autoComplete="name" value={values.name} onChange={set('name')}
            placeholder={lang === 'en' ? 'Ramesh Kumar' : 'रमेश कुमार'}
          />
        </FormGroup>
        <FormGroup id="m_phone" label={f.phone} hint={f.phone_hint} required error={errors.phone}>
          <input
            id="m_phone" type="tel" className={`form-input ${errors.phone ? 'error' : ''}`}
            autoComplete="tel" inputMode="tel" value={values.phone} onChange={set('phone')}
            placeholder="+91 94243 48178"
          />
        </FormGroup>
      </div>

      <FormGroup id="m_email" label={f.email}>
        <input
          id="m_email" type="email" className="form-input"
          autoComplete="email" value={values.email} onChange={set('email')}
          placeholder="email@example.com"
        />
      </FormGroup>

      <FormGroup id="m_plan" label={f.plan} required error={errors.planId}>
        <select
          id="m_plan" className={`form-input ${errors.planId ? 'error' : ''}`}
          value={values.planId} onChange={set('planId')}
        >
          <option value="">{lang === 'en' ? 'Select plan' : 'योजना चुनें'}</option>
          {plans.map(plan => (
            <option key={plan.id} value={plan.id}>
              {plan.description[lang]?.name} — {plan.description[lang]?.price}
            </option>
          ))}
        </select>
      </FormGroup>

      <button
        className="btn btn-primary btn-full"
        style={{ marginTop: '0.5rem', fontSize: '1.05rem', padding: '1rem', opacity: loading ? 0.7 : 1 }}
        onClick={submit}
        disabled={loading}
      >
        {loading ? (f.submitting || 'Submitting...') : f.submit}
      </button>
    </div>
  )
}