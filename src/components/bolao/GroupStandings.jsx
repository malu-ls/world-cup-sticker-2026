import { useState } from 'react'
import { getTeamName, getTeamFlag } from '../../lib/bolaoData'
import { calcGroupStandings } from '../../lib/bolaoUtils'
import styles from '../../styles/GroupStandings.module.css'

function GroupTable({ groupCode, matches }) {
  const rows = calcGroupStandings(groupCode, matches)

  return (
    <div className={styles.table}>
      <div className={styles.tableHead}>
        <span className={styles.colTeam}>Seleção</span>
        <span>P</span><span>V</span><span>E</span><span>D</span>
        <span>GP</span><span>GC</span><span>SG</span><span className={styles.colPts}>Pts</span>
      </div>
      {rows.map((r, i) => (
        <div
          key={r.code}
          className={`${styles.row} ${i < 2 ? styles.qualifies : i === 2 ? styles.maybe : ''}`}
        >
          <div className={styles.colTeam}>
            <span className={styles.pos}>{i + 1}</span>
            {getTeamFlag(r.code) && <img src={getTeamFlag(r.code)} alt="" className={styles.flag} />}
            <span className={styles.teamName}>{getTeamName(r.code)}</span>
          </div>
          <span>{r.P}</span>
          <span>{r.W}</span>
          <span>{r.D}</span>
          <span>{r.L}</span>
          <span>{r.GF}</span>
          <span>{r.GA}</span>
          <span>{r.GD > 0 ? `+${r.GD}` : r.GD}</span>
          <span className={styles.colPts}>{r.Pts}</span>
        </div>
      ))}
      <div className={styles.legend}>
        <span className={styles.dot} style={{background:'#4ade80'}} /> Classificado
        <span className={styles.dot} style={{background:'#fbbf24',marginLeft:'0.75rem'}} /> Possível 3º
      </div>
    </div>
  )
}

export default function GroupStandings({ matches }) {
  const [open, setOpen] = useState(null)
  const groups = ['A','B','C','D','E','F','G','H','I','J','K','L']

  return (
    <div className={styles.container}>
      {groups.map(g => {
        const gMatches = matches.filter(m => m.group_name === g)
        const done = gMatches.filter(m => m.status === 'finished').length
        const isOpen = open === g

        return (
          <div key={g} className={styles.group}>
            <button className={styles.groupHeader} onClick={() => setOpen(isOpen ? null : g)}>
              <span className={styles.groupBadge}>Grupo {g}</span>
              <span className={styles.groupProg}>{done}/{gMatches.length} jogos</span>
              <span className={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && <GroupTable groupCode={g} matches={gMatches} />}
          </div>
        )
      })}
    </div>
  )
}
