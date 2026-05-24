import { useTranslation } from 'react-i18next'
import ContactForm from '../components/forms/ContactForm'
import styles from './Contact.module.css'

export default function Contact() {
  const { t } = useTranslation()

  const info = [
    { icon: '📍', label: t('contact.address_label'), value: t('contact.address') },
    { icon: '📞', label: t('contact.phone_label'),   value: t('contact.phone'),   href: `tel:${t('contact.phone').replace(/\s/g,'')}` },
    { icon: '✉️', label: t('contact.email_label'),   value: t('contact.email'),   href: `mailto:${t('contact.email')}` },
    { icon: '🕐', label: t('contact.hours_label'),   value: t('contact.hours') },
  ]

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>{t('contact.title')}</h1>
          <p>{t('contact.subtitle')}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className={styles.grid}>

            {/* ── Left: info panel ── */}
            <div className={styles.infoPanel}>
              <span className="tag">{t('contact.tag')}</span>
              <h2 className={styles.infoTitle}>{t('contact.title')}</h2>

              <div className={styles.infoCards}>
                {info.map(({ icon, label, value, href }) => (
                  <div key={label} className={styles.infoCard}>
                    <div className={styles.infoIcon} aria-hidden="true">{icon}</div>
                    <div className={styles.infoText}>
                      <h4>{label}</h4>
                      {href
                        ? <a href={href} className={styles.infoLink}>{value}</a>
                        : <p>{value}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick call CTA — big tap target, useful on mobile */}
              <a
                href={`tel:${t('contact.phone').replace(/\s/g,'')}`}
                className={`btn btn-primary ${styles.callBtn}`}
              >
                📞 {t('contact.phone_label')}: {t('contact.phone')}
              </a>
            </div>

            {/* ── Right: form ── */}
            <div className={styles.formPanel}>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
