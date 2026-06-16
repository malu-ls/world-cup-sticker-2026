import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { useBolao } from '../hooks/useBolao'
import MatchCard from '../components/bolao/MatchCard'
import GroupStandings from '../components/bolao/GroupStandings'
import KnockoutBracket from '../components/bolao/KnockoutBracket'
import Leaderboard from '../components/bolao/Leaderboard'
import styles from '../styles/BolaoHome.module.css'

const ADMIN_EMAIL = 'malulopes232510@gmail.com'

const TABS = [
  { id: 'jogos',   icon: '⚽', label: 'Jogos' },
  { id: 'grupos',  icon: '📊', label: 'Grupos' },
  { id: 'bracket', icon: '🏆', label: 'Bracket' },
  { id: 'ranking', icon: '🥇', label: 'Ranking' },
]

const GROUP_FILTERS = ['Todos','A','B','C','D','E','F','G','H','I','J','K','L']

export default function BolaoHome() {
  const { user, signOut } = useAuth()
  const bolao = useBolao()
  const navigate = useNavigate()
  const [tab, setTab] = useState('jogos')
  const [groupFilter, setGroupFilter] = useState('Todos')
  const [stageFilter, setStageFilter] = useState('group')
  const [menuOpen, setMenuOpen] = useState(false)

  const isAdmin = user?.email === ADMIN_EMAIL
  const module  = localStorage.getItem('worldcup_module') ?? 'bolao'

  const handleChangeModule = () => {
    localStorage.removeItem('worldcup_module')
    navigate('/modules')
  }

  if (bolao.loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Carregando bolão...</p>
      </div>
    )
  }

  // ─── Filtrar jogos ─────────────────────────────────────────────────────────
  const isGroupStage = stageFilter === 'group'
  const filteredMatches = bolao.matches.filter(m => {
    if (isGroupStage) {
      if (m.stage !== 'group') return false
      if (groupFilter !== 'Todos' && m.group_name !== groupFilter) return false
    } else {
      if (m.stage !== stageFilter) return false
    }
    return true
  })

  const totalPts = bolao.getTotalPts()

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.logo}>
            <span>⚽</span>
            <div>
              <div className={styles.logoTitle}>Bolão Copa 2026</div>
              <div className={styles.logoSub}>FIFA World Cup™</div>
            </div>
          </div>

          <div className={styles.headerRight}>
            {bolao.matches.length > 0 && (
              <div className={styles.ptsChip}>
                <span className={styles.ptsNum}>{totalPts}</span>
                <span className={styles.ptsLabel}>pts</span>
              </div>
            )}
            <button className={styles.avatarBtn} onClick={() => setMenuOpen(!menuOpen)}>
              {user?.user_metadata?.avatar_url
                ? <img src={user.user_metadata.avatar_url} alt="perfil" className={styles.avatar} />
                : <div className={styles.avatarPlaceholder}>{user?.email?.[0]?.toUpperCase()}</div>
              }
            </button>
          </div>

          {menuOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownUser}>{user?.user_metadata?.full_name || user?.email}</div>
              {module === 'both' && (
                <button className={styles.dropdownItem} onClick={() => navigate('/album')}>
                  📖 Álbum de Figurinhas
                </button>
              )}
              <button className={styles.dropdownItem} onClick={handleChangeModule}>
                🔄 Trocar módulo
              </button>
              {isAdmin && (
                <button className={styles.dropdownItem} onClick={() => navigate('/admin')}>
                  ⚙️ Painel Admin
                </button>
              )}
              <button className={styles.dropdownItem} onClick={signOut}>Sair</button>
            </div>
          )}
        </div>
      </header>

      {/* Conteúdo da tab */}
      <main className={styles.main}>
        {tab === 'jogos' && (
          <div className={styles.jogosContainer}>
            {/* Seletor de fase */}
            <div className={styles.stageRow}>
              {[
                { id: 'group', label: 'Grupos' },
                { id: 'r32',   label: '16 Avos' },
                { id: 'r16',   label: 'Oitavas' },
                { id: 'qf',    label: 'Quartas' },
                { id: 'sf',    label: 'Semis' },
                { id: 'final', label: 'Final' },
              ].map(s => (
                <button
                  key={s.id}
                  className={`${styles.stageBtn} ${stageFilter === s.id ? styles.stageBtnActive : ''}`}
                  onClick={() => setStageFilter(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Filtro de grupo (só na fase de grupos) */}
            {isGroupStage && (
              <div className={styles.groupRow}>
                {GROUP_FILTERS.map(g => (
                  <button
                    key={g}
                    className={`${styles.groupBtn} ${groupFilter === g ? styles.groupBtnActive : ''}`}
                    onClick={() => setGroupFilter(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}

            {filteredMatches.length === 0 ? (
              <div className={styles.noMatches}>
                <p>Nenhum jogo nessa fase ainda.</p>
              </div>
            ) : (
              <div className={styles.matchList}>
                {filteredMatches.map(m => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    myPred={bolao.getMyPred(m.id)}
                    onSave={bolao.savePrediction}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'grupos' && (
          <GroupStandings matches={bolao.matches} />
        )}

        {tab === 'bracket' && (
          <KnockoutBracket matches={bolao.matches} />
        )}

        {tab === 'ranking' && (
          <Leaderboard
            rows={bolao.getLeaderboard()}
            currentUserId={user?.id}
          />
        )}
      </main>

      {/* Bottom Nav */}
      <nav className={styles.nav}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.navItem} ${tab === t.id ? styles.navActive : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span className={styles.navIcon}>{t.icon}</span>
            <span className={styles.navLabel}>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
