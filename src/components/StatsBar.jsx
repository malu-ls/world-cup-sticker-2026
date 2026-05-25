import styles from '../styles/StatsBar.module.css'

export default function StatsBar({ stats }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.numbers}>
        <div className={styles.stat}>
          <span className={styles.num} style={{ color: '#4ade80' }}>{stats.owned}</span>
          <span className={styles.label}>tenho</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.num} style={{ color: '#fbbf24' }}>{stats.duplicates}</span>
          <span className={styles.label}>repetidas</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.num}>{stats.missing}</span>
          <span className={styles.label}>faltando</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.num} style={{ color: '#60a5fa' }}>{stats.percent}%</span>
          <span className={styles.label}>completo</span>
        </div>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${stats.percent}%` }} />
      </div>
    </div>
  )
}
