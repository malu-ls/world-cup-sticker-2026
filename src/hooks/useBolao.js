import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import { calcPoints, calcAllGroupStandings, calcLeaderboard } from '../lib/bolaoUtils'

export function useBolao() {
  const { user } = useAuth()
  const [matches, setMatches]         = useState([])
  const [predictions, setPredictions] = useState([]) // todos os palpites (para ranking)
  const [myPreds, setMyPreds]         = useState({}) // { matchId: { home_score, away_score } }
  const [profiles, setProfiles]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)

  // ─── Carrega tudo ────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const [{ data: matchData }, { data: predData }, { data: profileData }] = await Promise.all([
        supabase.from('bolao_matches').select('*').order('match_date'),
        supabase.from('bolao_predictions').select('*'),
        supabase.from('profiles').select('id, full_name, avatar_url'),
      ])

      setMatches(matchData ?? [])
      setPredictions(predData ?? [])
      setProfiles(profileData ?? [])

      // Índice rápido dos meus palpites
      const mine = {}
      for (const p of (predData ?? [])) {
        if (p.user_id === user.id) mine[p.match_id] = p
      }
      setMyPreds(mine)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { load() }, [load])

  // ─── Salvar / atualizar palpite ───────────────────────────────────────────
  const savePrediction = async (matchId, homeScore, awayScore) => {
    const payload = {
      user_id:    user.id,
      match_id:   matchId,
      home_score: homeScore,
      away_score: awayScore,
    }
    const { data, error: err } = await supabase
      .from('bolao_predictions')
      .upsert(payload, { onConflict: 'user_id,match_id' })
      .select()
      .single()
    if (err) throw err

    setMyPreds(prev => ({ ...prev, [matchId]: data }))
    setPredictions(prev => {
      const idx = prev.findIndex(p => p.user_id === user.id && p.match_id === matchId)
      if (idx >= 0) { const n = [...prev]; n[idx] = data; return n }
      return [...prev, data]
    })
    return data
  }

  // ─── Getters derivados ───────────────────────────────────────────────────────
  const getMyPred    = (matchId) => myPreds[matchId] ?? null
  const getPoints    = (matchId) => {
    const pred  = myPreds[matchId]
    const match = matches.find(m => m.id === matchId)
    return calcPoints(pred, match)
  }
  const getTotalPts  = () => matches.reduce((sum, m) => sum + (getPoints(m.id) ?? 0), 0)
  const getGroupMatches  = (g)     => matches.filter(m => m.group_name === g)
  const getKnockout      = (stage) => matches.filter(m => m.stage === stage)
  const getAllStandings   = ()      => calcAllGroupStandings(matches)
  const getLeaderboard   = ()      => calcLeaderboard(predictions, matches, profiles)

  return {
    matches,
    predictions,
    profiles,
    myPreds,
    loading,
    error,
    reload: load,
    savePrediction,
    getMyPred,
    getPoints,
    getTotalPts,
    getGroupMatches,
    getKnockout,
    getAllStandings,
    getLeaderboard,
  }
}
