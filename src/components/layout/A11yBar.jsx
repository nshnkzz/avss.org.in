import { useTranslation } from 'react-i18next'
import { useA11y } from '../../context/A11yContext'
import styles from './A11yBar.module.css'

const IconSun = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4"/>
    <line x1="12" y1="2" x2="12" y2="5"/>
    <line x1="12" y1="19" x2="12" y2="22"/>
    <line x1="2" y1="12" x2="5" y2="12"/>
    <line x1="19" y1="12" x2="22" y2="12"/>
    <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
    <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
    <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
  </svg>
)

const IconMoon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

export default function A11yBar() {
  const { t } = useTranslation()
  const { textSize, setTextSize, contrast, setContrast, motion, setMotion, darkMode, setDarkMode } = useA11y()

  return (
    <div className={styles.bar} role="region" aria-label={t('a11y.label')} data-a11y-bar>
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
          <span className={styles.sep} aria-hidden="true" />
          <button
            className={`${styles.btn} ${styles.themeBtn} ${darkMode ? styles.on : ''}`}
            onClick={() => setDarkMode(!darkMode)}
            aria-pressed={darkMode}
            aria-label={t('a11y.dark')}
            title={t('a11y.dark')}
          >
            {darkMode ? <IconSun /> : <IconMoon />}
            <span className={styles.ind}>{t('a11y.dark')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
