import { getFlagUrl } from './stickersData'

// ─── Equipes por grupo (mesma ordem do álbum) ─────────────────────────────────
export const GROUPS = {
  A: ['MEX','RSA','KOR','CZE'],
  B: ['CAN','BIH','QAT','SUI'],
  C: ['BRA','MAR','HAI','SCO'],
  D: ['USA','PAR','AUS','TUR'],
  E: ['GER','CUW','CIV','ECU'],
  F: ['NED','JPN','SWE','TUN'],
  G: ['BEL','EGY','IRN','NZL'],
  H: ['ESP','CPV','KSA','URU'],
  I: ['FRA','SEN','IRQ','NOR'],
  J: ['ARG','ALG','AUT','JOR'],
  K: ['POR','COD','UZB','COL'],
  L: ['ENG','CRO','GHA','PAN'],
}

// Metadados das seleções (nome exibido e ISO2 para bandeira)
export const TEAM_INFO = {
  MEX: { name: 'México',              iso2: 'mx' },
  RSA: { name: 'África do Sul',       iso2: 'za' },
  KOR: { name: 'Coreia do Sul',       iso2: 'kr' },
  CZE: { name: 'Tchéquia',            iso2: 'cz' },
  CAN: { name: 'Canadá',              iso2: 'ca' },
  BIH: { name: 'Bósnia e Herzegovina',iso2: 'ba' },
  QAT: { name: 'Catar',               iso2: 'qa' },
  SUI: { name: 'Suíça',               iso2: 'ch' },
  BRA: { name: 'Brasil',              iso2: 'br' },
  MAR: { name: 'Marrocos',            iso2: 'ma' },
  HAI: { name: 'Haiti',               iso2: 'ht' },
  SCO: { name: 'Escócia',             iso2: 'gb-sct' },
  USA: { name: 'Estados Unidos',      iso2: 'us' },
  PAR: { name: 'Paraguai',            iso2: 'py' },
  AUS: { name: 'Austrália',           iso2: 'au' },
  TUR: { name: 'Turquia',             iso2: 'tr' },
  GER: { name: 'Alemanha',            iso2: 'de' },
  CUW: { name: 'Curaçao',             iso2: 'cw' },
  CIV: { name: 'Costa do Marfim',     iso2: 'ci' },
  ECU: { name: 'Equador',             iso2: 'ec' },
  NED: { name: 'Holanda',             iso2: 'nl' },
  JPN: { name: 'Japão',               iso2: 'jp' },
  SWE: { name: 'Suécia',              iso2: 'se' },
  TUN: { name: 'Tunísia',             iso2: 'tn' },
  BEL: { name: 'Bélgica',             iso2: 'be' },
  EGY: { name: 'Egito',               iso2: 'eg' },
  IRN: { name: 'Irã',                 iso2: 'ir' },
  NZL: { name: 'Nova Zelândia',       iso2: 'nz' },
  ESP: { name: 'Espanha',             iso2: 'es' },
  CPV: { name: 'Cabo Verde',          iso2: 'cv' },
  KSA: { name: 'Arábia Saudita',      iso2: 'sa' },
  URU: { name: 'Uruguai',             iso2: 'uy' },
  FRA: { name: 'França',              iso2: 'fr' },
  SEN: { name: 'Senegal',             iso2: 'sn' },
  IRQ: { name: 'Iraque',              iso2: 'iq' },
  NOR: { name: 'Noruega',             iso2: 'no' },
  ARG: { name: 'Argentina',           iso2: 'ar' },
  ALG: { name: 'Argélia',             iso2: 'dz' },
  AUT: { name: 'Áustria',             iso2: 'at' },
  JOR: { name: 'Jordânia',            iso2: 'jo' },
  POR: { name: 'Portugal',            iso2: 'pt' },
  COD: { name: 'Congo DR',            iso2: 'cd' },
  UZB: { name: 'Uzbequistão',         iso2: 'uz' },
  COL: { name: 'Colômbia',            iso2: 'co' },
  ENG: { name: 'Inglaterra',          iso2: 'gb-eng' },
  CRO: { name: 'Croácia',             iso2: 'hr' },
  GHA: { name: 'Gana',                iso2: 'gh' },
  PAN: { name: 'Panamá',              iso2: 'pa' },
}

export function getTeamFlag(code) {
  const info = TEAM_INFO[code]
  return info ? getFlagUrl(info.iso2) : null
}

export function getTeamName(code) {
  return TEAM_INFO[code]?.name ?? code
}

// ─── Calendário da fase de grupos ─────────────────────────────────────────────
// MD1: dois jogos por grupo, distribuídos 2 grupos/dia (11-16 jun)
// MD2: dois jogos por grupo, distribuídos 2 grupos/dia (17-22 jun)
// MD3: dois jogos simultâneos, distribuídos 2 grupos/dia (24-29 jun)

const VENUES = {
  A: ['Estadio Azteca, Cidade do México', 'Estadio BBVA, Monterrey'],
  B: ['BC Place, Vancouver',              'BMO Field, Toronto'],
  C: ['SoFi Stadium, Los Angeles',        'Hard Rock Stadium, Miami'],
  D: ['AT&T Stadium, Arlington',          'Arrowhead Stadium, Kansas City'],
  E: ['MetLife Stadium, Nova York',       'Lincoln Financial Field, Filadélfia'],
  F: ['Levi\'s Stadium, San Francisco',   'Lumen Field, Seattle'],
  G: ['Rose Bowl, Pasadena',              'State Farm Stadium, Glendale'],
  H: ['Estadio Universitario, Monterrey', 'Estadio Akron, Guadalajara'],
  I: ['Gillette Stadium, Boston',         'NRG Stadium, Houston'],
  J: ['Mercedes-Benz Stadium, Atlanta',   'Bank of America Stadium, Charlotte'],
  K: ['Camping World Stadium, Orlando',   'Raymond James Stadium, Tampa'],
  L: ['SoFi Stadium, Los Angeles',        'BC Place, Vancouver'],
}

function dt(dateStr, hour) {
  return `${dateStr}T${hour}:00:00.000Z`
}

let matchNumber = 0
function buildGroupMatches() {
  const matches = []

  const schedule = [
    // [grupo, md1Date, md2Date, md3Date]
    ['A', '2026-06-11', '2026-06-17', '2026-06-24'],
    ['B', '2026-06-11', '2026-06-17', '2026-06-24'],
    ['C', '2026-06-12', '2026-06-18', '2026-06-25'],
    ['D', '2026-06-12', '2026-06-18', '2026-06-25'],
    ['E', '2026-06-13', '2026-06-19', '2026-06-26'],
    ['F', '2026-06-13', '2026-06-19', '2026-06-26'],
    ['G', '2026-06-14', '2026-06-20', '2026-06-27'],
    ['H', '2026-06-14', '2026-06-20', '2026-06-27'],
    ['I', '2026-06-15', '2026-06-21', '2026-06-28'],
    ['J', '2026-06-15', '2026-06-21', '2026-06-28'],
    ['K', '2026-06-16', '2026-06-22', '2026-06-29'],
    ['L', '2026-06-16', '2026-06-22', '2026-06-29'],
  ]

  for (const [g, d1, d2, d3] of schedule) {
    const [T1, T2, T3, T4] = GROUPS[g]
    const [v1, v2] = VENUES[g]

    // Matchday 1
    matches.push({ group: g, matchday: 1, home: T1, away: T2, date: dt(d1,'16'), venue: v1 })
    matches.push({ group: g, matchday: 1, home: T3, away: T4, date: dt(d1,'20'), venue: v2 })
    // Matchday 2
    matches.push({ group: g, matchday: 2, home: T1, away: T3, date: dt(d2,'16'), venue: v2 })
    matches.push({ group: g, matchday: 2, home: T2, away: T4, date: dt(d2,'20'), venue: v1 })
    // Matchday 3 (simultâneos)
    matches.push({ group: g, matchday: 3, home: T1, away: T4, date: dt(d3,'20'), venue: v1 })
    matches.push({ group: g, matchday: 3, home: T2, away: T3, date: dt(d3,'20'), venue: v2 })
  }

  return matches.map((m, i) => ({ ...m, matchNumber: i + 1 }))
}

export const GROUP_MATCHES = buildGroupMatches()

// Rótulos dos estágios
export const STAGE_LABELS = {
  group:  'Fase de Grupos',
  r32:    '16 Avos de Final',
  r16:    'Oitavas de Final',
  qf:     'Quartas de Final',
  sf:     'Semifinal',
  '3rd':  '3º Lugar',
  final:  'Final',
}
