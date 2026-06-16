import styles from '../../styles/Leaderboard.module.css'

export default function Leaderboard({ rows, currentUserId }) {
  if (!rows || rows.length === 0) {
    return (
      <div className={styles.empty}>
        <span>🥇</span>
        <p>Nenhum palpite registrado ainda. Seja o primeiro!</p>
      </div>
    )
  }

  const medals = ['🥇','🥈','🥉']

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>Pos</span>
        <span className={styles.colName}>Jogador</span>
        <span>Exatos</span>
        <span>Certos</span>
        <span className={styles.colPts}>Pts</span>
      </div>
      {rows.map(r => (
        <div
          key={r.userId}
          className={`${styles.row} ${r.userId === currentUserId ? styles.me : ''}`}
        >
          <span className={styles.rank}>
            {r.rank <= 3 ? medals[r.rank - 1] : r.rank}
          </span>
          <div className={styles.colName}>
            {r.avatar
              ? <img src={r.avatar} alt="" className={styles.avatar} />
              : <div className={styles.avatarPlaceholder}>{r.name?.[0]?.toUpperCase()}</div>
            }
            <span className={styles.name}>
              {r.name}
              {r.userId === currentUserId && <span className={styles.meBadge}> você</span>}
            </span>
          </div>
          <span className={styles.num}>{r.exact}</span>
          <span className={styles.num}>{r.correct}</span>
          <span className={styles.pts}>{r.total}</span>
        </div>
      ))}
    </div>
  )
}
