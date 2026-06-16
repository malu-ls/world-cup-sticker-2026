import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'
import { getTeamName } from '../lib/bolaoData'
import { GROUP_MATCHES } from '../lib/bolaoData'
import { STAGE_LABELS } from '../lib/bolaoData'
import { formatMatchDate, formatMatchTime } from '../lib/bolaoUtils'
import styles from '../styles/AdminPanel.module.css'

const ADMIN_EMAIL = 'malulopes232510@gmail.com'

export default function AdminPanel() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [saving, setSaving] = useState(null)
  const [filter, setFilter] = useState('all')
  const [editId, setEditId] = useState(null)
  const [editVals, setEditVals] = useState({ home: '', away: '', status: 'finished' })
  const [msg, setMsg] = useState(null)
  const [newMatch, setNewMatch] = useState({ stage:'r32', home:'', away:'', date:'', venue:'' })
  const [addingKnockout, setAddingKnockout] = useState(false)

  const isAdmin = user?.email === ADMIN_EMAIL

  const load = useCallback(async () => {
    if (!isAdmin) return
    setLoading(true)
    const { data } = await supabase.from('bolao_matches').select('*').order('match_date')
    setMatches(data ?? [])
    setLoading(false)
  }, [isAdmin])

  useEffect(() => { load() }, [load])

  if (!isAdmin) {
    return (
      <div className={styles.denied}>
        <p>Acesso restrito ao administrador.</p>
        <button onClick={() => navigate(-1)}>Voltar</button>
      </div>
    )
  }

  // ─── Semear jogos da fase de grupos ────────────────────────────────────────
  const seedMatches = async () => {
    setSeeding(true)
    setMsg(null)
    try {
      const rows = GROUP_MATCHES.map(m => ({
        stage:        'group',
        group_name:   m.group,
        matchday:     m.matchday,
        match_number: m.matchNumber,
        home_team:    m.home,
        away_team:    m.away,
        match_date:   m.date,
        venue:        m.venue,
        city:         m.venue.split(',').slice(-1)[0].trim(),
        status:       'scheduled',
      }))
      const { error } = await supabase.from('bolao_matches').insert(rows)
      if (error) throw error
      setMsg({ type: 'ok', text: `${rows.length} jogos inseridos com sucesso!` })
      await load()
    } catch (e) {
      setMsg({ type: 'err', text: e.message })
    } finally {
      setSeeding(false)
    }
  }

  // ─── Atualizar resultado ────────────────────────────────────────────────────
  const startEdit = (m) => {
    setEditId(m.id)
    setEditVals({
      home:   m.home_score ?? '',
      away:   m.away_score ?? '',
      status: m.status === 'finished' ? 'finished' : 'live',
    })
  }

  const saveResult = async (matchId) => {
    setSaving(matchId)
    setMsg(null)
    try {
      const { error } = await supabase.from('bolao_matches').update({
        home_score: Number(editVals.home),
        away_score: Number(editVals.away),
        status:     editVals.status,
      }).eq('id', matchId)
      if (error) throw error
      setMsg({ type: 'ok', text: 'Resultado salvo!' })
      setEditId(null)
      await load()
    } catch (e) {
      setMsg({ type: 'err', text: e.message })
    } finally {
      setSaving(null)
    }
  }

  const resetMatch = async (matchId) => {
    if (!confirm('Resetar este jogo para "agendado"?')) return
    await supabase.from('bolao_matches').update({
      home_score: null, away_score: null, status: 'scheduled'
    }).eq('id', matchId)
    await load()
  }

  // ─── Adicionar jogo eliminatório ─────────────────────────────────────────
  const saveNewKnockout = async () => {
    if (!newMatch.home || !newMatch.away || !newMatch.date) {
      setMsg({ type: 'err', text: 'Preencha os dois times e a data.' }); return
    }
    setSaving('new')
    try {
      const existing = matches.filter(m => m.stage === newMatch.stage)
      const { error } = await supabase.from('bolao_matches').insert({
        stage:        newMatch.stage,
        home_team:    newMatch.home.toUpperCase(),
        away_team:    newMatch.away.toUpperCase(),
        match_date:   new Date(newMatch.date).toISOString(),
        venue:        newMatch.venue || null,
        match_number: existing.length + 1,
        status:       'scheduled',
      })
      if (error) throw error
      setMsg({ type: 'ok', text: 'Jogo eliminatório adicionado!' })
      setNewMatch({ stage:'r32', home:'', away:'', date:'', venue:'' })
      setAddingKnockout(false)
      await load()
    } catch (e) {
      setMsg({ type: 'err', text: e.message })
    } finally {
      setSaving(null)
    }
  }

  const groupCount  = matches.filter(m => m.stage === 'group').length
  const knockCount  = matches.filter(m => m.stage !== 'group').length
  const finishedCnt = matches.filter(m => m.status === 'finished').length

  const filtered = matches.filter(m => {
    if (filter === 'pending')  return m.status === 'scheduled' || m.status === 'live'
    if (filter === 'done')     return m.status === 'finished'
    if (filter === 'knockout') return m.stage !== 'group'
    return true
  })

  if (loading) return <div className={styles.loading}><div className={styles.spinner} /></div>

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/bolao')}>← Voltar</button>
        <h1 className={styles.title}>Painel Admin</h1>
      </header>

      {msg && (
        <div className={`${styles.msg} ${msg.type === 'ok' ? styles.msgOk : styles.msgErr}`}>
          {msg.text}
          <button className={styles.msgClose} onClick={() => setMsg(null)}>✕</button>
        </div>
      )}

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.stat}><span>{matches.length}</span><small>Total</small></div>
        <div className={styles.stat}><span>{finishedCnt}</span><small>Concluídos</small></div>
        <div className={styles.stat}><span>{groupCount}</span><small>Fase grupos</small></div>
        <div className={styles.stat}><span>{knockCount}</span><small>Eliminatórias</small></div>
      </div>

      {/* Semear jogos */}
      {groupCount === 0 && (
        <div className={styles.seedBox}>
          <p>Nenhum jogo cadastrado. Carregue a fase de grupos:</p>
          <button className={styles.seedBtn} onClick={seedMatches} disabled={seeding}>
            {seeding ? 'Inserindo...' : '⚡ Semear 72 jogos da fase de grupos'}
          </button>
        </div>
      )}

      {/* Adicionar eliminatório */}
      <div className={styles.section}>
        <button
          className={styles.addBtn}
          onClick={() => setAddingKnockout(!addingKnockout)}
        >
          {addingKnockout ? '✕ Cancelar' : '+ Adicionar jogo eliminatório'}
        </button>

        {addingKnockout && (
          <div className={styles.addForm}>
            <select
              value={newMatch.stage}
              onChange={e => setNewMatch(p => ({ ...p, stage: e.target.value }))}
              className={styles.input}
            >
              {['r32','r16','qf','sf','3rd','final'].map(s => (
                <option key={s} value={s}>{STAGE_LABELS[s]}</option>
              ))}
            </select>
            <div className={styles.row2}>
              <input
                className={styles.input}
                placeholder="Time casa (ex: BRA)"
                value={newMatch.home}
                onChange={e => setNewMatch(p => ({ ...p, home: e.target.value }))}
              />
              <input
                className={styles.input}
                placeholder="Time fora (ex: ARG)"
                value={newMatch.away}
                onChange={e => setNewMatch(p => ({ ...p, away: e.target.value }))}
              />
            </div>
            <input
              className={styles.input}
              type="datetime-local"
              value={newMatch.date}
              onChange={e => setNewMatch(p => ({ ...p, date: e.target.value }))}
            />
            <input
              className={styles.input}
              placeholder="Estádio (opcional)"
              value={newMatch.venue}
              onChange={e => setNewMatch(p => ({ ...p, venue: e.target.value }))}
            />
            <button
              className={styles.saveNewBtn}
              onClick={saveNewKnockout}
              disabled={saving === 'new'}
            >
              {saving === 'new' ? 'Salvando...' : 'Adicionar jogo'}
            </button>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className={styles.filters}>
        {[['all','Todos'],['pending','Pendentes'],['done','Concluídos'],['knockout','Eliminatórias']].map(([v,l]) => (
          <button
            key={v}
            className={`${styles.filterBtn} ${filter === v ? styles.filterActive : ''}`}
            onClick={() => setFilter(v)}
          >{l}</button>
        ))}
      </div>

      {/* Lista de jogos */}
      <div className={styles.list}>
        {filtered.map(m => (
          <div key={m.id} className={`${styles.matchRow} ${m.status === 'finished' ? styles.done : ''}`}>
            <div className={styles.matchInfo}>
              <span className={styles.matchMeta}>
                {m.group_name ? `Grupo ${m.group_name} · R${m.matchday}` : (STAGE_LABELS[m.stage] ?? m.stage)}
                {' · '}{formatMatchDate(m.match_date)} {formatMatchTime(m.match_date)}
              </span>
              <span className={styles.matchTeams}>
                {getTeamName(m.home_team)} × {getTeamName(m.away_team)}
              </span>
              {m.status === 'finished' && (
                <span className={styles.matchResult}>
                  Resultado: {m.home_score} – {m.away_score}
                </span>
              )}
            </div>

            {editId === m.id ? (
              <div className={styles.editForm}>
                <input
                  className={styles.scoreInput}
                  type="number" min="0"
                  value={editVals.home}
                  onChange={e => setEditVals(p => ({ ...p, home: e.target.value }))}
                  placeholder="Casa"
                />
                <span className={styles.dash}>–</span>
                <input
                  className={styles.scoreInput}
                  type="number" min="0"
                  value={editVals.away}
                  onChange={e => setEditVals(p => ({ ...p, away: e.target.value }))}
                  placeholder="Fora"
                />
                <select
                  className={styles.statusSelect}
                  value={editVals.status}
                  onChange={e => setEditVals(p => ({ ...p, status: e.target.value }))}
                >
                  <option value="live">Ao vivo</option>
                  <option value="finished">Encerrado</option>
                </select>
                <button
                  className={styles.saveBtn}
                  onClick={() => saveResult(m.id)}
                  disabled={saving === m.id}
                >
                  {saving === m.id ? '...' : '✓'}
                </button>
                <button className={styles.cancelBtn} onClick={() => setEditId(null)}>✕</button>
              </div>
            ) : (
              <div className={styles.actions}>
                <button className={styles.editBtn} onClick={() => startEdit(m)}>Editar</button>
                {m.status === 'finished' && (
                  <button className={styles.resetBtn} onClick={() => resetMatch(m.id)}>Reset</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
