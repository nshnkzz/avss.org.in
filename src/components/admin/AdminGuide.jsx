import styles from './AdminGuide.module.css'
import { IconClipboard } from './Icons'

export default function AdminGuide({ open, seen, onAcknowledge, onReopen, title, sections }) {
  return (
    <>
      {open && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="guide-title">
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <span className={styles.modalIcon}><IconClipboard size={22} /></span>
              <h2 className={styles.modalTitle} id="guide-title">{title}</h2>
            </div>

            <div className={styles.modalBody}>
              {sections.map((section, i) => (
                <div
                  key={i}
                  className={`${styles.section} ${section.variant === 'feature' ? styles.sectionFeature : ''}`}
                >
                  <h3 className={styles.sectionTitle}>
                    <span aria-hidden="true">{section.icon}</span>
                    {section.title}
                  </h3>
                  <ul className={styles.list}>
                    {section.items.map((item, j) => (
                      <li key={j} className={styles.item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.ackBtn} onClick={onAcknowledge}>
                I Understood — Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {seen && (
        <div className={styles.refPanel}>
          <div className={styles.refHeader}>
            <span className={styles.refHeading}>
              <IconClipboard size={14} /> {title}
            </span>
            <button className={styles.reviewBtn} onClick={onReopen}>
              Review again
            </button>
          </div>
          <div className={styles.refBody}>
            {sections.map((section, i) => (
              <div
                key={i}
                className={`${styles.refSection} ${section.variant === 'feature' ? styles.refSectionFeature : ''}`}
              >
                <h4 className={styles.refSectionTitle}>
                  <span aria-hidden="true">{section.icon}</span>
                  {section.title}
                </h4>
                <ul className={styles.refList}>
                  {section.items.map((item, j) => (
                    <li key={j} className={styles.refItem}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
