import { useState } from 'react'
import { buildStickersFromTeams, getFlagUrl } from '../lib/stickersData'
import styles from '../styles/TeamSection.module.css'

const ALL_STICKERS = buildStickersFromTeams()

export default function TeamSection({ team, teamStats, collection, onMarkOwned, onAddDuplicate, onRemoveDuplicate }) {
  const [open, setOpen] = useState(false)
  const [modal, setModal] = useState(null) // { code, name }

  const teamStickers = ALL_STICKERS.filter(s => s.team === team.code)
  const flagUrl = getFlagUrl(team.iso2)
  const isComplete = teamStats.owned === teamStats.total

  const getStickerState = (code) => {
    const qty = collection[code] || 0
    if (qty === 0) return 'missing'
    if (qty === 1) return 'owned'
    return 'duplicate'
  }

  const handleClick = (sticker) => {
    const state = getStickerState(sticker.code)
    if (state === 'missing') {
      // 1 clique → marca como tenho
      onMarkOwned(sticker.code)
    } else {
      // já tem → abre modal
      setModal(sticker)
    }
  }

  const handleRemove = () => {
    onRemoveDuplicate(modal.code)
    setModal(null)
  }

  const handleDuplicate = () => {
    onAddDuplicate(modal.code)
    setModal(null)
  }

  return (
    <>
      <div className={styles.section}>
        <button className={styles.header} onClick={() => setOpen(!open)}>
          <div className={styles.headerLeft}>
            <div className={styles.flagWrap}>
              {flagUrl
                ? <img src={flagUrl} alt={team.name} className={styles.flagImg} />
                : <span className={styles.flagEmoji}>{team.flag}</span>
              }
            </div>
            <div>
              <div className={styles.teamName}>{team.name}</div>
              <div className={styles.teamSub}>Grupo {team.group} · {teamStats.owned}/{teamStats.total}</div>
            </div>
          </div>
          <div className={styles.headerRight}>
            {isComplete && <span className={styles.completeBadge}>✓</span>}
            <div className={styles.miniProgress}>
              <div className={styles.miniTrack}>
                <div className={styles.miniFill} style={{ width: `${teamStats.percent}%` }} />
              </div>
              <span className={styles.miniPct}>{teamStats.percent}%</span>
            </div>
            <span className={styles.chevron}>{open ? '▲' : '▼'}</span>
          </div>
        </button>

        {open && (
          <div className={styles.body}>
            <div className={styles.hint}>Toque para marcar · toque novamente para opções</div>
            <div className={styles.grid}>
              {teamStickers.map(sticker => {
                const state = getStickerState(sticker.code)
                const qty = collection[sticker.code] || 0
                return (
                  <button
                    key={sticker.code}
                    className={`${styles.sticker} ${styles[state]}`}
                    onClick={() => handleClick(sticker)}
                  >
                    {sticker.special && <span className={styles.starBadge}>★</span>}
                    {qty > 1 && <span className={styles.qtyBadge}>×{qty}</span>}
                    <span className={styles.stickerCode}>{sticker.code}</span>
                    <span className={styles.stickerName}>{sticker.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalTitle}>{modal.code}</div>
            <div className={styles.modalName}>{modal.name}</div>
            {modal.special && <div className={styles.modalSpecial}>figurinha especial ★</div>}
            <div className={styles.modalQty}>
              Você tem: <strong>{collection[modal.code] || 0}</strong>
              {(collection[modal.code] || 0) > 1 && ` (${collection[modal.code] - 1} repetida${collection[modal.code] - 1 > 1 ? 's' : ''})`}
            </div>
            <div className={styles.modalActions}>
              <button className={`${styles.modalBtn} ${styles.modalDup}`} onClick={handleDuplicate}>
                + Tenho repetida
              </button>
              <button className={`${styles.modalBtn} ${styles.modalRemove}`} onClick={handleRemove}>
                − Remover uma
              </button>
            </div>
            <button className={styles.modalCancel} onClick={() => setModal(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </>
  )
}
