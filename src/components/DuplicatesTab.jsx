import styles from '../styles/DuplicatesTab.module.css'

export default function DuplicatesTab({ duplicates, TEAMS, onRemoveDuplicate }) {
  const getTeam = (code) => TEAMS.find(t => t.code === code)

  if (duplicates.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📦</div>
        <p>Nenhuma figurinha repetida ainda.</p>
        <p className={styles.emptySub}>Quando você tiver repetidas, elas aparecem aqui para organizar trocas.</p>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.summary}>
        <span>{duplicates.length} figurinhas · </span>
        <span>{duplicates.reduce((a, s) => a + s.extras, 0)} para trocar</span>
      </div>
      <div className={styles.list}>
        {duplicates.map(sticker => {
          const team = getTeam(sticker.team)
          return (
            <div key={sticker.code} className={styles.item}>
              <div className={styles.itemLeft}>
                <span className={styles.itemFlag}>{team?.flag}</span>
                <div>
                  <div className={styles.itemCode}>{sticker.code}</div>
                  <div className={styles.itemName}>{sticker.name}</div>
                </div>
              </div>
              <div className={styles.itemRightGroup}>
                <div className={styles.itemRight}>
                  <span className={styles.itemQty}>×{sticker.qty}</span>
                  <span className={styles.itemExtra}>+{sticker.extras} extra{sticker.extras > 1 ? 's' : ''}</span>
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => onRemoveDuplicate(sticker.code)}
                  aria-label={`Remover repetida de ${sticker.name}`}
                  title="Remover repetida"
                >
                  ✕
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
