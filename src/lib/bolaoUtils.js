import { GROUPS } from './bolaoData'

// ─── Pontuação ─────────────────────────────────────────────────────────────────
export function calcPoints(pred, match) {
  if (!pred || match.status !== 'finished') return null
  if (match.home_score == null || match.away_score == null) return null

  const predOutcome = getOutcome(pred.home_score, pred.away_score)
  const realOutcome = getOutcome(match.home_score, match.away_score)

  if (pred.home_score === match.home_score && pred.away_score === match.away_score) return 3
  if (predOutcome === realOutcome) return 1
  return 0
}

function getOutcome(home, away) {
  if (home > away) return 'home'
  if (away > home) return 'away'
  return 'draw'
}

// ─── Classificação do grupo ───────────────────────────────────────────────────
export function calcGroupStandings(groupCode, matches) {
  const teams = GROUPS[groupCode]
  const standings = {}

  for (const code of teams) {
    standings[code] = { code, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 }
  }

  for (const m of matches) {
    if (m.status !== 'finished' || m.home_score == null) continue
    const h = standings[m.home_team]
    const a = standings[m.away_team]
    if (!h || !a) continue

    h.P++; a.P++
    h.GF += m.home_score; h.GA += m.away_score
    a.GF += m.away_score; a.GA += m.home_score

    if (m.home_score > m.away_score) {
      h.W++; h.Pts += 3; a.L++
    } else if (m.home_score < m.away_score) {
      a.W++; a.Pts += 3; h.L++
    } else {
      h.D++; h.Pts += 1; a.D++; a.Pts += 1
    }
  }

  for (const s of Object.values(standings)) s.GD = s.GF - s.GA

  return Object.values(standings).sort((a, b) =>
    b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF || a.code.localeCompare(b.code)
  )
}

// Retorna { A: Standing[], B: Standing[], ... } para todos os grupos
export function calcAllGroupStandings(allMatches) {
  const result = {}
  for (const g of Object.keys(GROUPS)) {
    const gMatches = allMatches.filter(m => m.group_name === g)
    result[g] = calcGroupStandings(g, gMatches)
  }
  return result
}

// ─── Melhores 3ºs colocados ───────────────────────────────────────────────────
// Retorna os 8 melhores 3ºs, ordenados conforme regras FIFA
export function getBest3rds(allStandings) {
  const thirds = []
  for (const [g, rows] of Object.entries(allStandings)) {
    if (rows[2]) thirds.push({ ...rows[2], fromGroup: g })
  }
  return thirds
    .sort((a, b) => b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF)
    .slice(0, 8)
}

// ─── Ranking (leaderboard) ────────────────────────────────────────────────────
export function calcLeaderboard(predictions, matches, profiles) {
  const userMap = {}

  for (const pred of predictions) {
    const match = matches.find(m => m.id === pred.match_id)
    if (!match) continue
    const pts = calcPoints(pred, match) ?? 0
    const exact = (pts === 3) ? 1 : 0
    const correct = (pts >= 1) ? 1 : 0

    if (!userMap[pred.user_id]) {
      userMap[pred.user_id] = { userId: pred.user_id, total: 0, exact: 0, correct: 0, preds: 0 }
    }
    userMap[pred.user_id].total += pts
    userMap[pred.user_id].exact += exact
    userMap[pred.user_id].correct += correct
    userMap[pred.user_id].preds++
  }

  return Object.values(userMap)
    .sort((a, b) => b.total - a.total || b.exact - a.exact)
    .map((row, i) => {
      const profile = profiles.find(p => p.id === row.userId)
      return {
        ...row,
        rank: i + 1,
        name: profile?.full_name ?? 'Jogador',
        avatar: profile?.avatar_url ?? null,
      }
    })
}

// ─── Helpers de data ─────────────────────────────────────────────────────────
export function isPredictionOpen(matchDate) {
  return new Date(matchDate) > new Date()
}

export function formatMatchDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })
}

export function formatMatchTime(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
