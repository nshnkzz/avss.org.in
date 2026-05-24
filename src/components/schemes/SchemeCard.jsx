import { useTranslation } from 'react-i18next'
import styles from './SchemeCard.module.css'

export default function SchemeCard({ scheme }) {
  const { i18n, t } = useTranslation()
  const lang = i18n.language
  const d = scheme[lang] || scheme.en

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.icon} aria-hidden="true">{scheme.icon}</div>
        <div>
          <h3>{d.title}</h3>
          <p>{d.subtitle}</p>
        </div>
      </div>
      <div className={styles.body}>
        <ol className={styles.steps} aria-label="Steps">
          {d.steps.map((st, i) => (
            <li key={i} className={styles.step}>
              <div className={styles.stepNum} aria-hidden="true">{i + 1}</div>
              <div>
                <strong>{st.step}</strong>
                {st.detail && <span className={styles.stepDetail}>{st.detail}</span>}
              </div>
            </li>
          ))}
        </ol>
        <div className={styles.docs}>
          <p className={styles.docsTitle}>📄 {t('schemes.docs_label')}</p>
          <div className={styles.docTags}>
            {d.docs.map((doc, i) => (
              <span key={i} className={styles.docTag}>{doc}</span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
