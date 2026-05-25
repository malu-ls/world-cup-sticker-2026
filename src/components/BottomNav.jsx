import styles from '../styles/BottomNav.module.css'

const TABS = [
  { id: 'album',      icon: '📖', label: 'Álbum' },
  { id: 'duplicates', icon: '🔄', label: 'Repetidas' },
  { id: 'trade',      icon: '🃏', label: 'Card Troca' },
]

export default function BottomNav({ tab, setTab, stats }) {
  return (
    <nav className={styles.nav}>
      {TABS.map(t => (
        <button
          key={t.id}
          className={`${styles.item} ${tab === t.id ? styles.active : ''}`}
          onClick={() => setTab(t.id)}
        >
          <span className={styles.icon}>{t.icon}</span>
          <span className={styles.label}>{t.label}</span>
          {t.id === 'duplicates' && stats.duplicates > 0 && (
            <span className={styles.badge}>{stats.duplicates}</span>
          )}
        </button>
      ))}
    </nav>
  )
}
