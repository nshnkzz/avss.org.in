import { useTranslation } from 'react-i18next'
import DonateForm from '../components/forms/DonateForm'

export default function Donate() {
  const { t } = useTranslation()

  return (
    <>
      <div className="page-hero" style={{ borderBottomColor: 'var(--green)' }}>
        <div className="container">
          <h1>❤ {t('donate.title')}</h1>
          <p>{t('donate.subtitle')}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <DonateForm />
        </div>
      </section>
    </>
  )
}
