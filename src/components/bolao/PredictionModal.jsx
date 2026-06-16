import { useState } from 'react'
import { getTeamName, getTeamFlag } from '../../lib/bolaoData'
import styles from '../../styles/PredictionModal.module.css'

export default function PredictionModal({ match, existing, onSave, onClose }) {
  const [home, setHome] = useState(existing?.home_score ?? 0)
  const [away, setAway] = useState(existing?.away_score ?? 0)
  const [saving, setSaving] = useState(false)

  const adj = (setter, val, delta) => {
    const next = Math.max(0, val + delta)
    setter(next)
  }

  const handleSave = async () => {
    setSaving(true)
    try { await onSave(home, away) }
    finally { setSaving(false) }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.title}>Seu palpite</h3>
        <p className={styles.matchLabel}>
          {getTeamName(match.home_team)} × {getTeamName(match.away_team)}
        </p>

        <div className={styles.picker}>
          {/* Home */}
          <div className={styles.teamPick}>
            {getTeamFlag(match.home_team) &&
              <img src={getTeamFlag(match.home_team)} alt="" className={styles.flag} />}
            <span className={styles.teamName}>{getTeamName(match.home_team)}</span>
            <div className={styles.counter}>
              <button className={styles.btn} onClick={() => adj(setHome, home, -1)}>−</button>
              <span className={styles.score}>{home}</span>
              <button className={styles.btn} onClick={() => adj(setHome, home, +1)}>+</button>
            </div>
          </div>

          <span className={styles.vs}>×</span>

          {/* Away */}
          <div className={styles.teamPick}>
            {getTeamFlag(match.away_team) &&
              <img src={getTeamFlag(match.away_team)} alt="" className={styles.flag} />}
            <span className={styles.teamName}>{getTeamName(match.away_team)}</span>
            <div className={styles.counter}>
              <button className={styles.btn} onClick={() => adj(setAway, away, -1)}>−</button>
              <span className={styles.score}>{away}</span>
              <button className={styles.btn} onClick={() => adj(setAway, away, +1)}>+</button>
            </div>
          </div>
        </div>

        <div className={styles.legend}>
          <span>Placar exato = 3 pts</span>
          <span>Resultado certo = 1 pt</span>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose}>Cancelar</button>
          <button className={styles.save} onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar palpite'}
          </button>
        </div>
      </div>
    </div>
  )
}
