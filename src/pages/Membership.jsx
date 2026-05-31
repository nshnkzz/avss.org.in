import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import MembershipForm from '../components/forms/MembershipForm'
import styles from './Membership.module.css'
import { Helmet } from 'react-helmet-async'
import api from '../services/api'
import Loader from '../components/ui/Loader'

function PlanCard({ plan, featured, onJoin, t }) {
  return (
      <>
        <Helmet>
          <title>Become a Member | AVSS Singrauli NGO</title>
          <meta name="description" content="Aadarsh Viklang Sewa Sangh (AVSS) is an NGO in Singrauli, Madhya Pradesh helping Persons with Disabilities access UDID cards, government pensions, wheelchairs and legal aid. Free help in Hindi." />
          <meta name="keywords" content="Aadarsh Viklang Sewa Sangh, AVSS, NGO Singrauli, विकलांग सेवा संघ, PWD NGO Madhya Pradesh, disability NGO MP, UDID card Singrauli" />
          <link rel="canonical" href="https://avss.org.in" />

          {/* Open Graph — for WhatsApp/Facebook link previews */}
          <meta property="og:title" content="Aadarsh Viklang Sewa Sangh | NGO for PWD in Singrauli" />
          <meta property="og:description" content="Helping Persons with Disabilities in Singrauli, MP access government schemes, pensions and assistive devices." />
          <meta property="og:url" content="https://avss.org.in" />
          <meta property="og:type" content="website" />
        </Helmet>
        <div className={`${styles.card} ${featured ? styles.featured : ''}`}>
          {/* Badge sits INSIDE the card at the top — never clipped */}
          {plan.badge && (
            <div className={styles.badge}>{plan.badge}</div>
          )}

          <div className={styles.cardTop}>
            <p className={styles.planName}>{plan.name}</p>
            <div className={styles.price}>
              {plan.price}
              <span className={styles.period}> / {plan.period}</span>
            </div>
          </div>

          <ul className={styles.features}>
            {plan.features.map((f, i) => (
              <li key={i} className={styles.feature}>
                <span className={styles.check} aria-hidden="true">✓</span>
                {f}
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
      </>
  )
}

export default function Membership() {
  const { t, i18n } = useTranslation()
  const [pln, setPlan] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    api.get("/api/plans").then(
      data =>{ 
        setPlan(data)
        setLoading(false)
      }
    ).catch(error=> {
      console.log(error)
      setLoading(false)
    })
  }, [])


  const lang = i18n.language?.startsWith('hi') ? 'hi' : 'en'
  const plans = pln.map(p => ({ ...p.description[lang], status: p.status, id: p.id }))

  if (loading) return <Loader />

  const scrollToForm = () =>
    document.getElementById('join-form')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>{t('membership.title')}</h1>
          <p>{t('membership.subtitle')}</p>
        </div>
      </div>

      {/* Plans */}
      <section className="section section-alt">
        <div className="container">
          <div className={styles.plansGrid}>
            {plans.map((plan, i) => (
              <PlanCard
                key={plan.id ?? i}
                plan={plan}
                featured={plan.status === 'HIGHLIGHTED'}
                onJoin={scrollToForm}
                t={t}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table — visible on mobile too */}
      {plans.length >= 2 && <section className="section">
        <div className="container" style={{ maxWidth: 680 }}>
          <div className={styles.compareHeader}>
            <span className="tag tag-saffron">{t('membership.tag')}</span>
            <h2 className="section-title">
              {t('nav.home') === 'Home' ? 'What\'s included?' : 'क्या शामिल है?'}
            </h2>
          </div>

          <div className={styles.table}>
            {/* Header row */}
            <div className={`${styles.row} ${styles.tableHead}`}>
              <div className={styles.featureCol}>
                {t('nav.home') === 'Home' ? 'Benefit' : 'लाभ'}
              </div>
              <div className={styles.planCol}>{plans[0].name}</div>
              <div className={`${styles.planCol} ${styles.featuredCol}`}>{plans[1].name}</div>
            </div>

            {/* Feature rows — use the longer plan's features as base */}
            {plans[1].features.map((feat, i) => (
              <div key={i} className={`${styles.row} ${i % 2 === 0 ? styles.rowAlt : ''}`}>
                <div className={styles.featureCol}>{feat}</div>
                <div className={styles.planCol}>
                  {i < plans[0].features.length
                    ? <span className={styles.yes} aria-label="Included">✓</span>
                    : <span className={styles.no}  aria-label="Not included">—</span>}
                </div>
                <div className={`${styles.planCol} ${styles.featuredCol}`}>
                  <span className={styles.yes} aria-label="Included">✓</span>
                </div>
              </div>
            ))}

            {/* Price footer */}
            <div className={`${styles.row} ${styles.priceRow}`}>
              <div className={styles.featureCol}>
                {t('nav.home') === 'Home' ? 'Price' : 'कीमत'}
              </div>
              <div className={styles.planCol}>
                <strong>{plans[0].price}</strong>
                <span className={styles.period}> / {plans[0].period}</span>
              </div>
              <div className={`${styles.planCol} ${styles.featuredCol}`}>
                <strong>{plans[1].price}</strong>
                <span className={styles.period}> / {plans[1].period}</span>
              </div>
            </div>
          </div>

          <div className={styles.tableCta}>
            <button className="btn btn-primary btn-lg" onClick={scrollToForm}>
              {t('membership.join_btn')} ↓
            </button>
          </div>
        </div>
      </section>}

      {/* Form */}
      <section className="section section-alt" id="join-form">
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="section-header">
            <span className="tag tag-saffron">{t('membership.tag')}</span>
            <h2 className="section-title">{t('membership.form_title')}</h2>
          </div>
          <div className="notice">{t('membership.call_notice')}</div>
          <MembershipForm plans={pln}/>
        </div>
      </section>
    </>
  )
}
