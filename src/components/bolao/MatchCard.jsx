import { useState } from 'react'
import { getTeamName, getTeamFlag } from '../../lib/bolaoData'
import { calcPoints, isPredictionOpen, formatMatchDate, formatMatchTime } from '../../lib/bolaoUtils'
import PredictionModal from './PredictionModal'
import styles from '../../styles/MatchCard.module.css'

export default function MatchCard({ match, myPred, onSave }) {
  const [modalOpen, setModalOpen] = useState(false)

  const open  = isPredictionOpen(match.match_date)
  const pts   = myPred ? calcPoints(myPred, match) : null
  const done  = match.status === 'finished'
  const live  = match.status === 'live'

  const homeFlag = getTeamFlag(match.home_team)
  const awayFlag = getTeamFlag(match.away_team)

  return (
    <>
      <div className={`${styles.card} ${done ? styles.done : ''} ${live ? styles.live : ''}`}>
        {/* Status badge */}
        <div className={styles.meta}>
          <span className={styles.date}>{formatMatchDate(match.match_date)}</span>
          <span className={styles.time}>{formatMatchTime(match.match_date)}</span>
          {live && <span className={styles.liveBadge}>AO VIVO</span>}
          {done && pts !== null && (
            <span className={`${styles.ptsBadge} ${pts === 3 ? styles.pts3 : pts === 1 ? styles.pts1 : styles.pts0}`}>
              {pts} pt{pts !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Placar */}
        <div className={styles.score}>
          <div className={styles.team}>
            {homeFlag && <img src={homeFlag} alt="" className={styles.flag} />}
            <span className={styles.teamName}>{getTeamName(match.home_team)}</span>
          </div>

          <div className={styles.middle}>
            {done ? (
              <span className={styles.result}>{match.home_score} — {match.away_score}</span>
            ) : live ? (
              <span className={styles.result}>{match.home_score ?? '-'} — {match.away_score ?? '-'}</span>
            ) : (
              <span className={styles.vs}>×</span>
            )}
          </div>

          <div className={`${styles.team} ${styles.teamRight}`}>
            <span className={styles.teamName}>{getTeamName(match.away_team)}</span>
            {awayFlag && <img src={awayFlag} alt="" className={styles.flag} />}
          </div>
        </div>

        {/* Palpite */}
        <div className={styles.footer}>
          <span className={styles.venue}>{match.city ?? match.venue?.split(',')[1]?.trim() ?? ''}</span>

          {open && !live && (
            <button className={styles.predBtn} onClick={() => setModalOpen(true)}>
              {myPred ? `Meu palpite: ${myPred.home_score}–${myPred.away_score}` : '+ Palpite'}
            </button>
          )}
          {!open && myPred && (
            <span className={styles.predLocked}>
              Palpite: {myPred.home_score}–{myPred.away_score}
              {pts === 3 && ' ✓✓'}
              {pts === 1 && ' ✓'}
              {pts === 0 && ' ✗'}
            </span>
          )}
          {!open && !myPred && !done && (
            <span className={styles.noPred}>Sem palpite</span>
          )}
        </div>
      </div>

      {modalOpen && (
        <PredictionModal
          match={match}
          existing={myPred}
          onSave={async (h, a) => { await onSave(match.id, h, a); setModalOpen(false) }}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}
