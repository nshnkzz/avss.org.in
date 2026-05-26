import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styles from './Footer.module.css'

export default function Footer() {
  const { t } = useTranslation()
  const PAGES = [['/', 'home'], ['/about', 'about'], ['/membership', 'membership'],
                ['/schemes', 'schemes'], ['/gallery', 'gallery'], ['/contact', 'contact'], ['/circulars', 'circulars']]

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <h3>{t('nav.home') === 'Home' ? 'Aadarsh Viklang Sewa Sangh' : 'आदर्श विकलांग सेवा संघ'}</h3>
            <p>{t('footer.about')}</p>
            <Link to="/donate" className="btn btn-donate" style={{ marginTop: '1.25rem', display: 'inline-flex' }}>
              ❤ {t('nav.donate')}
            </Link>
          </div>

          <div className={styles.col}>
            <h4>{t('footer.links_title')}</h4>
            <ul>
              {PAGES.map(([path, key]) => (
                <li key={path}><Link to={path}>{t(`nav.${key}`)}</Link></li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h4>{t('footer.support_title')}</h4>
            <ul>
              {t('footer.support_links', { returnObjects: true }).map((item, i) => (
                <li key={i}><Link to="/schemes">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h4>{t('footer.legal_title')}</h4>
            <ul>
              {t('footer.legal_links', { returnObjects: true }).map((item, i) => (
                <li key={i}><a href="#">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>{t('footer.copyright')}</span>
          <span className={styles.badge}>{t('footer.reg')}</span>
        </div>
      </div>
    </footer>
  )
}
