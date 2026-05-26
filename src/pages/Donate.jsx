import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import DonateForm from '../components/forms/DonateForm'

export default function Donate() {
  const { t } = useTranslation()

  return (
    <>
      <Helmet>
        <title>Support us | NGO for PWD in Singrauli MP</title>
        <meta name="description" content="Aadarsh Viklang Sewa Sangh (AVSS) is an NGO in Singrauli, Madhya Pradesh helping Persons with Disabilities access UDID cards, government pensions, wheelchairs and legal aid. Free help in Hindi." />
        <meta name="keywords" content="Aadarsh Viklang Sewa Sangh, AVSS, NGO Singrauli, विकलांग सेवा संघ, PWD NGO Madhya Pradesh, disability NGO MP, UDID card Singrauli" />
        <link rel="canonical" href="https://avss.org.in" />

        {/* Open Graph — for WhatsApp/Facebook link previews */}
        <meta property="og:title" content="Aadarsh Viklang Sewa Sangh | NGO for PWD in Singrauli" />
        <meta property="og:description" content="Helping Persons with Disabilities in Singrauli, MP access government schemes, pensions and assistive devices." />
        <meta property="og:url" content="https://avss.org.in" />
        <meta property="og:type" content="website" />
      </Helmet>
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
