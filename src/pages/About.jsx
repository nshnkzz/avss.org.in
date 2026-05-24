import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import team from '../data/team'

export default function About() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = i18n.language
  const badges = t('about.badges', { returnObjects: true })

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>{t('about.title')}</h1>
        </div>
      </div>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div>
              <span className="tag">{t('about.tag')}</span>
              <h2 className="section-title">{t('about.title')}</h2>
              <p style={{ color: 'var(--text)', marginBottom: '1.25rem', lineHeight: 1.8, fontSize: '1.05rem' }}>
                {t('about.body_1')}
              </p>
              <p style={{ color: 'var(--text)', lineHeight: 1.8, fontSize: '1.05rem' }}>
                {t('about.body_2')}
              </p>
              <div style={{ display: 'flex', gap: '0.85rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => navigate('/membership')}>
                  {t('membership.join_btn')}
                </button>
                <button className="btn btn-donate" onClick={() => navigate('/donate')}>
                  ❤ {t('nav.donate')}
                </button>
              </div>
            </div>
            {/* Placeholder illustration */}
            <div style={{
              background: 'linear-gradient(135deg, var(--saffron-light), var(--navy-light))',
              borderRadius: 'var(--radius)',
              padding: '3rem',
              textAlign: 'center',
              border: '2px solid var(--border)',
              minHeight: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '1rem',
            }} aria-hidden="true">
              <span style={{ fontSize: '5rem' }}>♿</span>
              <p style={{ color: 'var(--navy-mid)', fontWeight: 600 }}>Aadarsh Viklang Sewa Sangh</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header text-center">
            <span className="tag">{t('about.team_title')}</span>
            <h2 className="section-title">{t('about.team_title')}</h2>
          </div>
          <div className="card-grid grid-4" style={{ marginTop: '2.5rem' }}>
            {team.map((member, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  width: 90, height: 90,
                  borderRadius: '50%',
                  background: 'var(--saffron-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.5rem',
                  margin: '0 auto 1rem',
                  border: '3px solid var(--saffron)',
                }} aria-hidden="true">{member.emoji}</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.25rem' }}>
                  {lang === 'en' ? member.name_en : member.name_hi}
                </h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                  {lang === 'en' ? member.role_en : member.role_hi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section section-navy">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.9rem', marginBottom: '1rem', color: 'white' }}>{t('about.mission_title')}</h2>
          <p style={{ color: '#FFCFA8', maxWidth: 680, margin: '0 auto 2.5rem', lineHeight: 1.8, fontSize: '1.15rem', fontStyle: 'italic' }}>
            {t('about.mission_quote')}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            {badges.map((badge, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ color: '#FFB870', fontWeight: 700, fontSize: '1rem' }}>{badge}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
