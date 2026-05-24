import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

// ── What We Do ────────────────────────────────────────────────────────────────
export function WhatWeDo() {
  const { t } = useTranslation()
  const items = t('services.items', { returnObjects: true })

  return (
    <section className="section">
      <div className="container">
        <div className="section-header text-center">
          <span className="tag tag-saffron">{t('services.tag')}</span>
          <h2 className="section-title">{t('services.title')}</h2>
          <p className="section-sub">{t('services.subtitle')}</p>
        </div>
        <div className="card-grid grid-3" style={{ marginTop: '2.5rem' }}>
          {items.map((item, i) => (
            <article key={i} className="card">
              <div style={iconStyle} aria-hidden="true">{item.icon}</div>
              <h3 style={cardH3}>{item.title}</h3>
              <p style={cardP}>{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Impact Stats ──────────────────────────────────────────────────────────────
export function ImpactStats() {
  const { t } = useTranslation()
  const stats = t('impact.stats', { returnObjects: true })

  return (
    <section className="section section-alt">
      <div className="container">
        <div className="section-header text-center">
          <span className="tag">{t('impact.tag')}</span>
          <h2 className="section-title">{t('impact.title')}</h2>
          <p className="section-sub">{t('impact.subtitle')}</p>
        </div>
        <div className="card-grid grid-4" style={{ marginTop: '2.5rem' }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-tile">
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Donate CTA ────────────────────────────────────────────────────────────────
export function DonateCTA() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <section className="section section-saffron">
      <div className="container text-center">
        <span className="tag tag-green">{t('donate.tag')}</span>
        <h2 className="section-title" style={{ marginBottom: '0.65rem' }}>{t('donate.title')}</h2>
        <p className="section-sub" style={{ margin: '0 auto 2rem' }}>{t('donate.subtitle')}</p>
        <button className="btn btn-donate btn-lg" onClick={() => navigate('/donate')}>
          ❤ {t('donate.submit')}
        </button>
        <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: 'var(--saffron-dark)', fontWeight: 500 }}>
          ✓ {t('donate.tax_note')}
        </p>
      </div>
    </section>
  )
}

// ── Membership Preview ────────────────────────────────────────────────────────
export function MembershipPreview() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const plans = t('membership.plans', { returnObjects: true })

  return (
    <section className="section">
      <div className="container">
        <div className="section-header text-center">
          <span className="tag">{t('membership.tag')}</span>
          <h2 className="section-title">{t('membership.title')}</h2>
          <p className="section-sub">{t('membership.subtitle')}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,300px),1fr))", gap:"1.5rem", maxWidth:760, width:"100%" }}>
            {plans.map((plan, i) => (
              <PlanCard key={i} plan={plan} featured={i === 1} onJoin={() => navigate('/membership')} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── PlanCard (shared, used on Home page preview) ──────────────────────────────
export function PlanCard({ plan, featured, onJoin }) {
  const { t } = useTranslation()
  return (
    <div style={{
      background: 'white',
      borderRadius: 'var(--radius)',
      border: `3px solid ${featured ? 'var(--saffron)' : 'var(--border)'}`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',          /* badge strip won't clip */
      boxShadow: featured ? '0 10px 36px rgba(216,90,31,0.15)' : 'var(--shadow)',
    }}>
      {/* Badge — full-width strip inside card, never clips */}
      {plan.badge && (
        <div style={{
          background: 'var(--saffron)', color: 'white',
          padding: '0.5rem 1rem', fontSize: '0.82rem', fontWeight: 700,
          textAlign: 'center',
        }}>{plan.badge}</div>
      )}
      <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.5rem' }}>{plan.name}</p>
        <div style={{ fontSize: '2.6rem', fontWeight: 700, color: 'var(--saffron)', lineHeight: 1, marginBottom: '1.25rem' }}>
          {plan.price} <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ {plan.period}</span>
        </div>
        <ul style={{ listStyle: 'none', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginBottom: '1.75rem', flex: 1 }}>
          {plan.features.map((f, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', padding: '0.55rem 0', fontSize: '0.98rem', color: 'var(--text)', borderBottom: '1px solid var(--border)', lineHeight: 1.45 }}>
              <span style={{ color: 'var(--green)', fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
            </li>
          ))}
        </ul>
        <button
          className={`btn btn-full ${featured ? 'btn-primary' : 'btn-outline'}`}
          onClick={onJoin}
        >
          {t('membership.join_btn')}
        </button>
      </div>
    </div>
  )
}

// Shared mini styles
const iconStyle = {
  width: 64, height: 64,
  borderRadius: 'var(--radius-sm)',
  background: 'var(--saffron-light)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '2rem', marginBottom: '1.25rem',
  border: '2px solid var(--saffron)',
}
const cardH3 = { fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.6rem', lineHeight: 1.3 }
const cardP  = { color: 'var(--text)', fontSize: '0.98rem', lineHeight: 1.7 }
