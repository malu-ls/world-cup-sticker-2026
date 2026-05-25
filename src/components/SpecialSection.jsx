import { useState } from 'react'
import styles from '../styles/TeamSection.module.css'
import sp from '../styles/SpecialSection.module.css'

export default function SpecialSection({ section, collection, onMarkOwned, onAddDuplicate, onRemoveDuplicate }) {
  const [open, setOpen] = useState(false)
  const [modal, setModal] = useState(null)

  const total = section.stickers.length
  const owned = section.stickers.filter(s => (collection[s.code] || 0) > 0).length
  const percent = Math.round((owned / total) * 100)
  const isComplete = owned === total

  const getStickerState = (code) => {
    const qty = collection[code] || 0
    if (qty === 0) return 'missing'
    if (qty === 1) return 'owned'
    return 'duplicate'
  }

  const handleClick = (sticker) => {
    if (getStickerState(sticker.code) === 'missing') {
      onMarkOwned(sticker.code)
    } else {
      setModal(sticker)
    }
  }

  return (
    <>
      <div className={`${styles.section} ${sp.special}`}>
        <button className={styles.header} onClick={() => setOpen(!open)}>
          <div className={styles.headerLeft}>
            <div className={sp.iconWrap}>
              <span className={sp.icon}>{section.icon}</span>
            </div>
            <div>
              <div className={`${styles.teamName} ${sp.sectionName}`}>{section.name}</div>
              <div className={styles.teamSub}>{owned}/{total} figurinhas especiais</div>
            </div>
          </div>
          <div className={styles.headerRight}>
            {isComplete && <span className={styles.completeBadge}>✓</span>}
            <div className={styles.miniProgress}>
              <div className={styles.miniTrack}>
                <div className={`${styles.miniFill} ${sp.specialFill}`} style={{ width: `${percent}%` }} />
              </div>
              <span className={styles.miniPct}>{percent}%</span>
            </div>
            <span className={styles.chevron}>{open ? '▲' : '▼'}</span>
          </div>
        </button>

        {open && (
          <div className={styles.body}>
            <div className={styles.hint}>Toque para marcar · toque novamente para opções</div>
            <div className={styles.grid}>
              {section.stickers.map(sticker => {
                const state = getStickerState(sticker.code)
                const qty = collection[sticker.code] || 0
                return (
                  <button
                    key={sticker.code}
                    className={`${styles.sticker} ${styles[state]} ${sp.specialSticker}`}
                    onClick={() => handleClick(sticker)}
                  >
                    <span className={styles.starBadge}>★</span>
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

      {modal && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalTitle}>{modal.code}</div>
            <div className={styles.modalName}>{modal.name}</div>
            <div className={styles.modalSpecial}>figurinha especial ★</div>
            <div className={styles.modalQty}>
              Você tem: <strong>{collection[modal.code] || 0}</strong>
              {(collection[modal.code] || 0) > 1 && ` (${collection[modal.code] - 1} repetida${collection[modal.code] - 1 > 1 ? 's' : ''})`}
            </div>
            <div className={styles.modalActions}>
              <button className={`${styles.modalBtn} ${styles.modalDup}`} onClick={() => { onAddDuplicate(modal.code); setModal(null) }}>
                + Tenho repetida
              </button>
              <button className={`${styles.modalBtn} ${styles.modalRemove}`} onClick={() => { onRemoveDuplicate(modal.code); setModal(null) }}>
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
