import styles from './AvsscLogo.module.css'

export default function AvsscLogo({ size = 52 }) {
  return (
    <span className={styles.wrap} style={{ width: size, height: size }}>
      <img src="/images/avss-logo.jpg" alt="AVSS Logo" className={styles.img} />
    </span>
  )
}
