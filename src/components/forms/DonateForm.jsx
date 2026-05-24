import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import FormGroup from './FormGroup'
import styles from './DonateForm.module.css'

export default function DonateForm() {
  const { t } = useTranslation()
  const presets = t('donate.presets', { returnObjects: true })
  const impact  = t('donate.impact',  { returnObjects: true })
  const bank    = t('donate.bank',    { returnObjects: true })

  const [amount, setAmount]   = useState(1000)
  const [custom, setCustom]   = useState('')
  const [freq, setFreq]       = useState('one')
  const [values, setValues]   = useState({ name:'', phone:'', email:'', pan:'' })
  const [errors, setErrors]   = useState({})
  const [success, setSuccess] = useState(false)

  const set = (k) => (e) => setValues(v => ({ ...v, [k]: e.target.value }))
  const effectiveAmount = custom ? parseInt(custom) || 0 : amount

  const validate = () => {
    const e = {}
    if (!values.name.trim())  e.name  = t('donate.error_name')
    if (!values.phone.trim()) e.phone = t('donate.error_phone')
    if (effectiveAmount < 10) e.amount = t('donate.error_amount')
    return e
  }

  const submit = () => {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    setSuccess(true)
    setTimeout(() => setSuccess(false), 10000)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'start' }}>

      {/* ── Left: form ── */}
      <div className="form-box">
        <h3 style={{ color: 'var(--navy)', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
          💝 {t('donate.submit')}
        </h3>

        {/* Frequency */}
        <div className="form-group">
          <span className="form-label">{t('donate.freq_label')}</span>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.45rem' }}>
            {[['one', t('donate.freq_one')], ['monthly', t('donate.freq_monthly')]].map(([val, label]) => (
              <button
                key={val}
                className={`${styles.freqBtn} ${freq === val ? styles.freqActive : ''}`}
                onClick={() => setFreq(val)}
                aria-pressed={freq === val}
              >
                {val === 'one' ? '📅' : '🔄'} {label}
              </button>
            ))}
          </div>
        </div>

        {/* Preset amounts */}
        <div className="form-group">
          <span className="form-label">{t('donate.amount_label')}</span>
          <div className={styles.presets}>
            {presets.map(p => (
              <button
                key={p}
                className={`${styles.preset} ${amount === p && !custom ? styles.presetActive : ''}`}
                onClick={() => { setAmount(p); setCustom('') }}
                aria-pressed={amount === p && !custom}
              >
                ₹{p.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
          <label htmlFor="d_custom" className="form-label" style={{ marginTop: '1rem', fontWeight: 500, fontSize: '0.95rem' }}>
            {t('donate.custom_label')}
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span style={currencyBadge}>₹</span>
            <input
              id="d_custom"
              type="number"
              inputMode="numeric"
              className="form-input"
              placeholder="500"
              value={custom}
              onChange={e => { setCustom(e.target.value); setAmount(0) }}
              style={{ flex: 1 }}
            />
          </div>
          {errors.amount && <p className="form-error" role="alert">⚠ {errors.amount}</p>}
        </div>

        <div className="form-row">
          <FormGroup id="d_name" label={t('donate.name_label')} required error={errors.name}>
            <input id="d_name" type="text" className={`form-input ${errors.name?'error':''}`} autoComplete="name" value={values.name} onChange={set('name')} />
          </FormGroup>
          <FormGroup id="d_phone" label={t('donate.phone_label')} required error={errors.phone}>
            <input id="d_phone" type="tel" className={`form-input ${errors.phone?'error':''}`} autoComplete="tel" inputMode="tel" value={values.phone} onChange={set('phone')} placeholder="+91 ..." />
          </FormGroup>
        </div>
        <FormGroup id="d_email" label={t('donate.email_label')}>
          <input id="d_email" type="email" className="form-input" autoComplete="email" value={values.email} onChange={set('email')} placeholder="email@example.com" />
        </FormGroup>
        <FormGroup id="d_pan" label={t('donate.pan_label')} hint={t('donate.pan_hint')}>
          <input id="d_pan" type="text" className="form-input" maxLength={10} value={values.pan} onChange={set('pan')} placeholder="ABCDE1234F" style={{ textTransform: 'uppercase' }} aria-describedby="d_pan-hint" />
        </FormGroup>

        {success && <div className="success-msg" role="status" aria-live="polite">{t('donate.success')}</div>}

        <button className="btn btn-donate btn-full" style={{ fontSize: '1.05rem', padding: '1rem' }} onClick={submit}>
          ❤ {t('donate.submit')} ₹{effectiveAmount.toLocaleString('en-IN')}
          {freq === 'monthly' ? ` ${t('donate.month_suffix')}` : ''}
        </button>
        <p style={{ textAlign: 'center', marginTop: '0.85rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          ✓ {t('donate.tax_note')} &nbsp;·&nbsp; 🔒 {t('donate.secure')}
        </p>
      </div>

      {/* ── Right: impact + bank ── */}
      <div>
        <div className="form-box" style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ color: 'var(--navy)', marginBottom: '1rem', fontSize: '1.05rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            🎯 {t('donate.impact_title')}
          </h4>
          <ul style={{ listStyle: 'none' }}>
            {impact.map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: '0.85rem', padding: '0.65rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.98rem', alignItems: 'flex-start' }}>
                <strong style={{ color: 'var(--green)', fontWeight: 700, flexShrink: 0, minWidth: 70 }}>{item.amount}</strong>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="form-box">
          <h4 style={{ color: 'var(--navy)', marginBottom: '1rem', fontSize: '1.05rem' }}>🏦 {t('donate.bank_title')}</h4>
          <div style={{ background: 'var(--navy-light)', borderRadius: 'var(--radius-sm)', padding: '1rem', fontFamily: 'monospace', fontSize: '0.92rem', color: 'var(--navy)', lineHeight: 2, border: '2px dashed var(--navy-mid)' }}>
            <b style={{ fontFamily: 'inherit', color: 'var(--saffron-dark)' }}>Name:</b> {bank.name}<br/>
            <b style={{ fontFamily: 'inherit', color: 'var(--saffron-dark)' }}>A/C:</b> {bank.account}<br/>
            <b style={{ fontFamily: 'inherit', color: 'var(--saffron-dark)' }}>IFSC:</b> {bank.ifsc}<br/>
            <b style={{ fontFamily: 'inherit', color: 'var(--saffron-dark)' }}>Branch:</b> {bank.branch}<br/>
            <b style={{ fontFamily: 'inherit', color: 'var(--saffron-dark)' }}>UPI:</b> {bank.upi}
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.85rem', lineHeight: 1.65 }}>
            {t('donate.bank_note')}
          </p>
        </div>
      </div>
    </div>
  )
}

const currencyBadge = {
  background: 'var(--navy-light)', padding: '0 1rem',
  display: 'flex', alignItems: 'center',
  borderRadius: 'var(--radius-sm)', fontWeight: 700,
  fontSize: '1.1rem', color: 'var(--navy)',
  border: '2px solid var(--border)',
}
