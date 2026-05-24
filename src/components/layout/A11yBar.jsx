import { useTranslation } from 'react-i18next'
import { useA11y } from '../../context/A11yContext'
import styles from './A11yBar.module.css'

export default function A11yBar() {
  const { t } = useTranslation()
  const { textSize, setTextSize, contrast, setContrast, motion, setMotion } = useA11y()

  return (
    <div className={styles.bar} role="region" aria-label={t('a11y.label')}>
      <div className={`container ${styles.inner}`}>
        <span className={styles.label}>
          <span aria-hidden="true">♿</span> {t('a11y.label')}
        </span>
        <div className={styles.controls} role="group" aria-label="Accessibility controls">
          <span className={styles.groupLabel}>{t('a11y.text_size')}:</span>
          {['normal', 'large', 'xlarge'].map((size, i) => (
            <button
              key={size}
              className={`${styles.btn} ${textSize === size ? styles.on : ''}`}
              onClick={() => setTextSize(size)}
              aria-pressed={textSize === size}
              style={{ fontSize: `${0.82 + i * 0.12}rem` }}
            >
              A <span className={styles.ind}>{t(`a11y.${size}`)}</span>
            </button>
          ))}
          <button
            className={`${styles.btn} ${contrast ? styles.on : ''}`}
            onClick={() => setContrast(!contrast)}
            aria-pressed={contrast}
          >
            ◐ {t('a11y.contrast')}
          </button>
          <button
            className={`${styles.btn} ${!motion ? styles.on : ''}`}
            onClick={() => setMotion(!motion)}
            aria-pressed={!motion}
          >
            ⏸ {t('a11y.motion')}
          </button>
        </div>
      </div>
    </div>
  )
}
