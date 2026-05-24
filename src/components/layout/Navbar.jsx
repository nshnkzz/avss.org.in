import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import i18n from '../../i18n'
import styles from './Navbar.module.css'

const PAGES = ['/', '/about', '/membership', '/schemes', '/gallery', '/contact']
const KEYS  = ['home', 'about', 'membership', 'schemes', 'gallery', 'contact']

export default function Navbar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const switchLang = () => {
    const next = i18n.language === 'en' ? 'hi' : 'en'
    i18n.changeLanguage(next)
    localStorage.setItem('avss-lang', next)
    document.body.classList.toggle('lang-hi', next === 'hi')
    document.documentElement.lang = next
  }

  const close = () => setOpen(false)

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <NavLink to="/" className={styles.logo} aria-label="Aadarsh Viklang Sewa Sangh — Home" onClick={close}>
          <div className={styles.logoIcon} aria-hidden="true">आ</div>
          <div className={styles.logoText}>
            <span>{i18n.language === 'en' ? 'Aadarsh Viklang Sewa Sangh' : 'आदर्श विकलांग सेवा संघ'}</span>
            <small>NGO · {i18n.language === 'en' ? 'Singrauli, MP' : 'सिंगरौली, MP'}</small>
          </div>
        </NavLink>

        {/* Desktop links */}
        <div className={styles.links}>
          {PAGES.map((path, i) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            >
              {t(`nav.${KEYS[i]}`)}
            </NavLink>
          ))}
          <button className={styles.langBtn} onClick={switchLang} aria-label="Change language">
            {i18n.language === 'en' ? 'हिन्दी' : 'English'}
          </button>
          <button className={`${styles.donateBtn}`} onClick={() => navigate('/donate')}>
            ❤ {t('nav.donate')}
          </button>
        </div>

        {/* Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span className={styles.ham1} style={{ transform: open ? 'rotate(45deg) translate(6px,6px)' : '' }} />
          <span className={styles.ham2} style={{ opacity: open ? 0 : 1 }} />
          <span className={styles.ham3} style={{ transform: open ? 'rotate(-45deg) translate(6px,-6px)' : '' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className={styles.mobileMenu} id="mobile-menu">
          {PAGES.map((path, i) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.mobileActive : ''}`}
              onClick={close}
            >
              {t(`nav.${KEYS[i]}`)}
            </NavLink>
          ))}
          <button className={`${styles.mobileLink} ${styles.mobileDonate}`} onClick={() => { navigate('/donate'); close(); }}>
            ❤ {t('nav.donate')}
          </button>
          <button className={styles.mobileLang} onClick={() => { switchLang(); close(); }}>
            {i18n.language === 'en' ? 'हिन्दी में देखें' : 'View in English'}
          </button>
        </div>
      )}
    </nav>
  )
}
