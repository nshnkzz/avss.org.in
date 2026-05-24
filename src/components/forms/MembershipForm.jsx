import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import FormGroup from './FormGroup'

export default function MembershipForm() {
  const { t } = useTranslation()
  const f = t('membership.fields', { returnObjects: true })
  const districts = t('membership.fields.districts', { returnObjects: true })
  const disabilities = t('membership.fields.disabilities', { returnObjects: true })

  const [values, setValues] = useState({ name:'', phone:'', email:'', district:'', plan:'', disability:'' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const set = (k) => (e) => setValues(v => ({ ...v, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!values.name.trim())     e.name     = f.error_name
    if (!values.phone.trim())    e.phone    = f.error_phone
    if (!values.district)        e.district = f.error_district
    if (!values.plan)            e.plan     = f.error_plan
    return e
  }

  const submit = () => {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    setSuccess(true)
    setTimeout(() => setSuccess(false), 9000)
  }

  return (
    <div className="form-box">
      {success && (
        <div className="success-msg" role="status" aria-live="polite">{f.success}</div>
      )}

      <div className="form-row">
        <FormGroup id="m_name" label={f.name} required error={errors.name}>
          <input
            id="m_name" type="text" className={`form-input ${errors.name ? 'error' : ''}`}
            autoComplete="name" value={values.name} onChange={set('name')}
            placeholder={t('nav.home') === 'Home' ? 'Ramesh Kumar' : 'रमेश कुमार'}
            aria-describedby={errors.name ? 'm_name-error' : undefined}
          />
        </FormGroup>
        <FormGroup id="m_phone" label={f.phone} hint={f.phone_hint} required error={errors.phone}>
          <input
            id="m_phone" type="tel" className={`form-input ${errors.phone ? 'error' : ''}`}
            autoComplete="tel" inputMode="tel" value={values.phone} onChange={set('phone')}
            placeholder="+91 98765 43210"
            aria-describedby={`m_phone-hint${errors.phone ? ' m_phone-error' : ''}`}
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

      <div className="form-row">
        <FormGroup id="m_district" label={f.district} required error={errors.district}>
          <select
            id="m_district" className={`form-input ${errors.district ? 'error' : ''}`}
            value={values.district} onChange={set('district')}
            aria-describedby={errors.district ? 'm_district-error' : undefined}
          >
            <option value="">{t('nav.home') === 'Home' ? 'Select district' : 'जिला चुनें'}</option>
            {districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </FormGroup>
        <FormGroup id="m_plan" label={f.plan} required error={errors.plan}>
          <select
            id="m_plan" className={`form-input ${errors.plan ? 'error' : ''}`}
            value={values.plan} onChange={set('plan')}
            aria-describedby={errors.plan ? 'm_plan-error' : undefined}
          >
            <option value="">{t('nav.home') === 'Home' ? 'Select plan' : 'योजना चुनें'}</option>
            <option value="monthly">{f.plan_monthly}</option>
            <option value="yearly">{f.plan_yearly}</option>
          </select>
        </FormGroup>
      </div>

      <FormGroup id="m_disability" label={f.disability}>
        <select id="m_disability" className="form-input" value={values.disability} onChange={set('disability')}>
          <option value="">{t('nav.home') === 'Home' ? 'Select (optional)' : 'चुनें (वैकल्पिक)'}</option>
          {disabilities.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </FormGroup>

      <button className="btn btn-primary btn-full" style={{ marginTop: '0.5rem', fontSize: '1.05rem', padding: '1rem' }} onClick={submit}>
        {f.submit}
      </button>
    </div>
  )
}
