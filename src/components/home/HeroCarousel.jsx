import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useA11y } from '../../context/A11yContext'
import styles from './HeroCarousel.module.css'

// Slides — replace backgroundImage with real photo paths when available
const SLIDES = [
  {
    bg: 'linear-gradient(135deg, #152748 0%, #2D4A7A 60%, #3A5A9A 100%)',
    image: null, // replace with '/images/hero-1.jpg'
    emoji: '🤝',
    caption_en: 'Building inclusive communities across Singrauli',
    caption_hi: 'सिंगरौली में समावेशी समुदाय बना रहे हैं',
  },
  {
    bg: 'linear-gradient(135deg, #1F6F2A 0%, #2D7A3A 60%, #3A8A50 100%)',
    image: null,
    emoji: '🦽',
    caption_en: 'Free assistive devices for those who need them',
    caption_hi: 'जरूरतमंदों के लिए मुफ्त सहायक उपकरण',
  },
  {
    bg: 'linear-gradient(135deg, #9F3F0F 0%, #D85A1F 60%, #E87030 100%)',
    image: null,
    emoji: '🏘️',
    caption_en: 'Awareness camps reaching every village',
    caption_hi: 'हर गाँव तक पहुँचते जागरूकता शिविर',
  },
]

export default function HeroCarousel() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { motion } = useA11y()
  const timerRef = useRef(null)
  const currentRef = useRef(0)
  const [cur, setCur] = useState(0)

  const goTo = (i) => {
    setCur(i)
    currentRef.current = i
  }
  const next = () => goTo((currentRef.current + 1) % SLIDES.length)

  useEffect(() => {
    if (!motion) return
    timerRef.current = setInterval(next, 5500)
    return () => clearInterval(timerRef.current)
  }, [motion])

  const slide = SLIDES[cur]
  const lang = i18n.language

  return (
    <section
      className={styles.hero}
      style={{ background: slide.image ? `url(${slide.image}) center/cover` : slide.bg }}
      aria-label="Welcome"
    >
      {/* Overlay */}
      <div className={styles.overlay} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        <span className={styles.eyebrow}>{t('hero.eyebrow')}</span>

        <h1 className={styles.title}>
          {t('hero.title_1')}
          <span className={styles.highlight}>{t('hero.title_bold')}</span>
          {t('hero.title_2')}
        </h1>

        <p className={styles.subtitle} aria-hidden="true">{t('hero.subtitle')}</p>
        <p className={styles.body}>{t('hero.body')}</p>

        <div className={styles.btns}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/membership')}>
            ✦ {t('hero.btn_join')}
          </button>
          <button className="btn btn-donate btn-lg" onClick={() => navigate('/donate')}>
            ❤ {t('hero.btn_donate')}
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => navigate('/contact')}>
            {t('hero.btn_help')} →
          </button>
        </div>

        {/* Slide caption */}
        <p className={styles.slideCaption} aria-live="polite">
          <span aria-hidden="true">{slide.emoji}</span>{' '}
          {lang === 'en' ? slide.caption_en : slide.caption_hi}
        </p>

        {/* Dots */}
        <div className={styles.dots} role="tablist" aria-label="Carousel slides">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === cur ? styles.dotActive : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              aria-selected={i === cur}
              role="tab"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
