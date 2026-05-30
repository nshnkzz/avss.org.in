import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import FormGroup from './FormGroup'
import api from '../../services/api'

export default function ContactForm() {
  const { t } = useTranslation()
  const [values, setValues]   = useState({ name: '', phone: '', message: '' })
  const [errors, setErrors]   = useState({})
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState(null)

  const set = (k) => (e) => setValues(v => ({ ...v, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!values.name.trim())    e.name    = t('contact.error_name')
    if (!values.phone.trim())   e.phone   = t('contact.error_phone')
    if (!values.message.trim()) e.message = t('contact.error_message')
    return e
  }

  const submit = async () => {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return

    setLoading(true)
    setServerError(null)

    try {
      await api.post('/api/contact', {
        name:    values.name,
        phone:   values.phone,
        message: values.message,
      })
      setSuccess(true)
      setValues({ name: '', phone: '', message: '' })
      setTimeout(() => setSuccess(false), 8000)
    } catch (err) {
      setServerError(t('contact.error_server') || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-box">
      <h3 style={{ color: 'var(--navy)', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
        ✉️ {t('contact.form_title')}
      </h3>

      {success && (
        <div className="success-msg" role="status" aria-live="polite">
          {t('contact.success')}
        </div>
      )}
      {serverError && (
        <div className="error-msg" role="alert" aria-live="polite">
          {serverError}
        </div>
      )}

      <FormGroup id="c_name" label={t('contact.name_label')} required error={errors.name}>
        <input id="c_name" type="text" className={`form-input ${errors.name ? 'error' : ''}`} autoComplete="name" value={values.name} onChange={set('name')} />
      </FormGroup>
      <FormGroup id="c_phone" label={t('contact.phone_field')} required error={errors.phone}>
        <input id="c_phone" type="tel" className={`form-input ${errors.phone ? 'error' : ''}`} autoComplete="tel" inputMode="tel" value={values.phone} onChange={set('phone')} placeholder="+91 ..." />
      </FormGroup>
      <FormGroup id="c_message" label={t('contact.message_label')} required error={errors.message}>
        <textarea id="c_message" className={`form-input ${errors.message ? 'error' : ''}`} rows={5} style={{ resize: 'vertical' }} value={values.message} onChange={set('message')} />
      </FormGroup>

      <button
        className="btn btn-primary btn-full"
        style={{ fontSize: '1.05rem', padding: '1rem', opacity: loading ? 0.7 : 1 }}
        onClick={submit}
        disabled={loading}
      >
        {loading ? (t('contact.submitting') || 'Sending...') : t('contact.submit')}
      </button>
    </div>
  )
}