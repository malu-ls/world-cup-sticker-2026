import { useRef, useState, useEffect } from 'react'
import { toPng } from 'html-to-image'
import { useAuth } from '../lib/AuthContext'
import { useStickers } from '../hooks/useStickers'
import styles from '../styles/TradeCard.module.css'

// Converte URL de imagem para base64 para evitar bloqueio CORS no html-to-image
async function toBase64(url) {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

export default function TradeCard() {
  const { user } = useAuth()
  const stickers = useStickers()
  const cardRef = useRef(null)
  const [generating, setGenerating] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [avatarBase64, setAvatarBase64] = useState(null)
  const [showMissing, setShowMissing] = useState(false)

  // Pré-carrega avatar como base64 assim que o componente monta
  useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      toBase64(user.user_metadata.avatar_url).then(setAvatarBase64)
    }
  }, [user])

  const duplicates = stickers.getDuplicatesList()

  // Agrupa repetidas por seleção
  const byTeam = {}
  duplicates.forEach(s => {
    if (!byTeam[s.team]) byTeam[s.team] = []
    byTeam[s.team].push(s)
  })

  const teamGroups = Object.entries(byTeam).map(([code, stks]) => {
    const team = stickers.TEAMS.find(t => t.code === code)
    const special = stickers.SPECIAL_SECTIONS.find(s => s.code === code)
    return { code, label: team?.name || special?.name || code, flag: team?.iso2, stickers: stks }
  })

  const totalExtras = duplicates.reduce((a, s) => a + s.extras, 0)
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'Colecionador'

  // Agrupa figurinhas faltando por seleção
  const missing = stickers.getMissingList()
  const missingByTeam = {}
  missing.forEach(s => {
    if (!missingByTeam[s.team]) missingByTeam[s.team] = []
    missingByTeam[s.team].push(s)
  })
  const missingGroups = Object.entries(missingByTeam).map(([code, stks]) => {
    const team = stickers.TEAMS.find(t => t.code === code)
    const special = stickers.SPECIAL_SECTIONS.find(s => s.code === code)
    return { code, label: team?.name || special?.name || code, flag: team?.iso2, stickers: stks }
  })

  async function generateCard() {
    if (!cardRef.current) return
    setGenerating(true)
    setImageUrl(null)
    try {
      const url = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#0a1f10',
        skipFonts: false,
        // Não tenta buscar recursos externos — tudo já está inline
        fetchRequestInit: { mode: 'cors' },
      })
      setImageUrl(url)
    } catch (e) {
      console.error('Erro ao gerar card:', e)
    }
    setGenerating(false)
  }

  function buildShareText() {
    const lines = []
    lines.push(`📋 *Minhas repetidas — Copa 2026*`)
    lines.push(`👤 ${userName} · ${stickers.stats.percent}% do álbum completo`)
    lines.push(``)

    teamGroups.forEach(group => {
      const flag = group.flag ? `🏳️ ` : ''
      const chips = group.stickers
        .map(s => s.extras > 1 ? `${s.code} ×${s.extras}` : s.code)
        .join('  ·  ')
      lines.push(`*${group.label}* (${group.stickers.length})`)
      lines.push(chips)
      lines.push(``)
    })

    lines.push(`📊 ${duplicates.length} figurinhas · ${totalExtras} disponíveis para troca`)
    return lines.join('\n')
  }

  async function shareAsText() {
    const text = buildShareText()
    if (navigator.share) {
      await navigator.share({ text, title: 'Minhas repetidas — Copa 2026' })
    } else {
      await navigator.clipboard.writeText(text)
      alert('Texto copiado! Cole no WhatsApp 👍')
    }
  }

  function buildMissingShareText() {
    const lines = []
    lines.push(`🔎 *Figurinhas que estou buscando — Copa 2026*`)
    lines.push(`👤 ${userName} · ${stickers.stats.percent}% do álbum completo`)
    lines.push(``)

    missingGroups.forEach(group => {
      const chips = group.stickers.map(s => s.code).join('  ·  ')
      lines.push(`*${group.label}* (${group.stickers.length})`)
      lines.push(chips)
      lines.push(``)
    })

    lines.push(`📊 ${missing.length} figurinhas faltando`)
    return lines.join('\n')
  }

  async function shareMissingList() {
    const text = buildMissingShareText()
    if (navigator.share) {
      await navigator.share({ text, title: 'Figurinhas que estou buscando — Copa 2026' })
    } else {
      await navigator.clipboard.writeText(text)
      alert('Texto copiado! Cole no WhatsApp 👍')
    }
  }

  async function shareCard() {
    if (!imageUrl) return
    const blob = await (await fetch(imageUrl)).blob()
    const file = new File([blob], 'minhas-repetidas-copa2026.png', { type: 'image/png' })
    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'Minhas figurinhas repetidas — Copa 2026' })
    } else {
      const a = document.createElement('a')
      a.href = imageUrl
      a.download = 'minhas-repetidas-copa2026.png'
      a.click()
    }
  }

  const missingModal = showMissing && (
    <div className={styles.modalOverlay} onClick={() => setShowMissing(false)}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <div className={styles.modalTitle}>Faltando</div>
            <div className={styles.modalSub}>{missing.length} figurinhas para completar o álbum</div>
          </div>
          <button className={styles.modalClose} onClick={() => setShowMissing(false)}>✕</button>
        </div>
        <div className={styles.modalBody}>
          {missingGroups.length === 0 ? (
            <p className={styles.modalEmpty}>Você já tem todas as figurinhas! 🎉</p>
          ) : (
            missingGroups.map(group => (
              <div key={group.code} className={styles.missingGroup}>
                <div className={styles.missingGroupHeader}>
                  {group.flag && (
                    <img
                      src={`https://flagcdn.com/w20/${group.flag}.png`}
                      alt={group.label}
                      className={styles.missingGroupFlag}
                    />
                  )}
                  <span className={styles.missingGroupName}>{group.label}</span>
                  <span className={styles.missingGroupCount}>{group.stickers.length}</span>
                </div>
                <div className={styles.missingChips}>
                  {group.stickers.map(s => (
                    <span key={s.code} className={`${styles.missingChip} ${s.special ? styles.missingChipSpecial : ''}`}>
                      {s.code}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        {missingGroups.length > 0 && (
          <div className={styles.modalFooter}>
            <button className={styles.modalShareBtn} onClick={shareMissingList}>
              💬 Compartilhar lista
            </button>
          </div>
        )}
      </div>
    </div>
  )

  if (duplicates.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🔄</div>
        <p>Nenhuma repetida ainda.</p>
        <p className={styles.emptySub}>Quando tiver figurinhas repetidas elas aparecem aqui para gerar o card de troca.</p>
        <button className={styles.missingBtn} onClick={() => setShowMissing(true)}>
          📋 Ver figurinhas faltando
        </button>
        {missingModal}
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.topBar}>
        <div className={styles.topInfo}>
          <span className={styles.topCount}>{duplicates.length} figurinhas</span>
          <span className={styles.topSep}>·</span>
          <span className={styles.topExtras}>{totalExtras} para trocar</span>
        </div>
        <div className={styles.topActions}>
          <button className={styles.missingBtn} onClick={() => setShowMissing(true)}>
            📋 Faltando
          </button>
          <button className={styles.textBtn} onClick={shareAsText}>
            💬 Compartilhar texto
          </button>
          <button className={styles.generateBtn} onClick={generateCard} disabled={generating}>
            {generating ? 'Gerando...' : '📸 Imagem'}
          </button>
          {imageUrl && (
            <button className={styles.shareBtn} onClick={shareCard}>
              📤
            </button>
          )}
        </div>
      </div>

      {imageUrl && (
        <div className={styles.resultWrap}>
          <img src={imageUrl} alt="card de troca" className={styles.resultImg} />
          <p className={styles.resultHint}>Toque em compartilhar para mandar no WhatsApp</p>
        </div>
      )}

      {/* Card fora da tela para captura */}
      <div className={styles.cardOuter}>
        <div ref={cardRef} className={styles.card}>
          {/* Header */}
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              {/* Usa base64 em vez da URL do Google para evitar 429 */}
              {avatarBase64 && (
                <img src={avatarBase64} alt="avatar" className={styles.cardAvatar} />
              )}
              <div>
                <div className={styles.cardName}>{userName}</div>
                <div className={styles.cardSub}>minhas repetidas para troca</div>
              </div>
            </div>
            <div className={styles.cardBadge}>
              <div className={styles.cardBadgeTop}>WC</div>
              <div className={styles.cardBadgeYear}>2026</div>
            </div>
          </div>

          {/* Stats */}
          <div className={styles.cardStats}>
            <div className={styles.cardStat}>
              <span className={styles.cardStatNum}>{duplicates.length}</span>
              <span className={styles.cardStatLabel}>figurinhas</span>
            </div>
            <div className={styles.cardStatDiv} />
            <div className={styles.cardStat}>
              <span className={styles.cardStatNum}>{totalExtras}</span>
              <span className={styles.cardStatLabel}>disponíveis</span>
            </div>
            <div className={styles.cardStatDiv} />
            <div className={styles.cardStat}>
              <span className={styles.cardStatNum}>{teamGroups.length}</span>
              <span className={styles.cardStatLabel}>seleções</span>
            </div>
            <div className={styles.cardStatDiv} />
            <div className={styles.cardStat}>
              <span className={styles.cardStatNum}>{stickers.stats.percent}%</span>
              <span className={styles.cardStatLabel}>completo</span>
            </div>
          </div>

          {/* Grupos por seleção */}
          <div className={styles.cardTeams}>
            {teamGroups.map(group => (
              <div key={group.code} className={styles.cardTeam}>
                <div className={styles.cardTeamHeader}>
                  {group.flag && (
                    <img
                      src={`https://flagcdn.com/w20/${group.flag}.png`}
                      alt={group.label}
                      className={styles.cardTeamFlag}
                      crossOrigin="anonymous"
                    />
                  )}
                  <span className={styles.cardTeamName}>{group.label}</span>
                  <span className={styles.cardTeamCount}>{group.stickers.length} fig.</span>
                </div>

                <div className={styles.cardStickerGrid}>
                  {group.stickers.map(s => (
                    <div key={s.code} className={`${styles.cardStickerChip} ${s.special ? styles.chipSpecial : ''}`}>
                      <span className={styles.chipCode}>{s.code}</span>
                      {s.extras > 1 && <span className={styles.chipQty}>×{s.extras}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className={styles.cardFooter}>
            <span className={styles.cardFooterText}>Copa do Mundo FIFA 2026™ · Panini</span>
            <span className={styles.cardFooterText}>gerado em {new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>

      {missingModal}
    </div>
  )
}
