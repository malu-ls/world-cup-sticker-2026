import styles from '../styles/StatsBar.module.css'

function getCompletionStatus(stats) {
  if (stats.missing === 0) {
    return { type: 'success', icon: '🏆', text: 'Álbum completo! Parabéns!' }
  }
  if (stats.duplicates >= stats.missing) {
    return {
      type: 'success',
      icon: '🔄',
      text: 'Você já tem figurinhas suficientes para completar o álbum, só falta trocar!',
    }
  }
  const falta = stats.missing - stats.duplicates
  return {
    type: 'info',
    icon: '📬',
    text: `Você tem ${stats.duplicates} repetida${stats.duplicates === 1 ? '' : 's'} para trocar. Para completar o álbum, ainda faltam ${falta} figurinha${falta === 1 ? '' : 's'}.`,
  }
}

export default function StatsBar({ stats }) {
  const status = getCompletionStatus(stats)

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
      <div className={`${styles.status} ${status.type === 'success' ? styles.statusSuccess : styles.statusInfo}`}>
        <span className={styles.statusIcon}>{status.icon}</span>
        <span>{status.text}</span>
      </div>
    </div>
  )
}
