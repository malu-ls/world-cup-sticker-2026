import { getTeamName, getTeamFlag, STAGE_LABELS } from '../../lib/bolaoData'
import styles from '../../styles/KnockoutBracket.module.css'

function BracketMatch({ match, myPred, onSave }) {
  const done  = match?.status === 'finished'
  const home  = match?.home_team ?? 'TBD'
  const away  = match?.away_team ?? 'TBD'

  if (!match) {
    return (
      <div className={styles.match}>
        <div className={styles.teamSlot}><span className={styles.tbd}>TBD</span></div>
        <div className={styles.divider} />
        <div className={styles.teamSlot}><span className={styles.tbd}>TBD</span></div>
      </div>
    )
  }

  return (
    <div className={`${styles.match} ${done ? styles.done : ''}`}>
      <div className={`${styles.teamSlot} ${done && match.home_score > match.away_score ? styles.winner : ''}`}>
        {getTeamFlag(home) && <img src={getTeamFlag(home)} alt="" className={styles.flag} />}
        <span className={styles.teamName}>{getTeamName(home)}</span>
        {done && <span className={styles.gs}>{match.home_score}</span>}
      </div>
      <div className={styles.divider} />
      <div className={`${styles.teamSlot} ${done && match.away_score > match.home_score ? styles.winner : ''}`}>
        {getTeamFlag(away) && <img src={getTeamFlag(away)} alt="" className={styles.flag} />}
        <span className={styles.teamName}>{getTeamName(away)}</span>
        {done && <span className={styles.gs}>{match.away_score}</span>}
      </div>
    </div>
  )
}

export default function KnockoutBracket({ matches }) {
  const stages = ['r32','r16','qf','sf','final']

  const stageMatches = (s) => matches.filter(m => m.stage === s)
    .sort((a, b) => a.match_number - b.match_number)

  const r32 = stageMatches('r32')

  // Se não há jogos eliminatórios ainda
  if (r32.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🏆</span>
        <p>O bracket eliminatório será gerado assim que a fase de grupos terminar.</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {stages.map(stage => {
        const ms = stageMatches(stage)
        if (ms.length === 0 && stage !== 'r32') return null
        return (
          <div key={stage} className={styles.round}>
            <h3 className={styles.roundLabel}>{STAGE_LABELS[stage]}</h3>
            <div className={styles.matches}>
              {ms.length > 0
                ? ms.map(m => <BracketMatch key={m.id} match={m} />)
                : Array.from({ length: stageSlots(stage) }).map((_, i) =>
                    <BracketMatch key={i} match={null} />
                  )
              }
            </div>
          </div>
        )
      })}
    </div>
  )
}

function stageSlots(stage) {
  return { r32: 16, r16: 8, qf: 4, sf: 2, '3rd': 1, final: 1 }[stage] ?? 0
}
