import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { useStickers } from '../hooks/useStickers'
import TeamSection from '../components/TeamSection'
import SpecialSection from '../components/SpecialSection'
import StatsBar from '../components/StatsBar'
import BottomNav from '../components/BottomNav'
import DuplicatesTab from '../components/DuplicatesTab'
import TradeCard from './TradeCard'
import styles from '../styles/Home.module.css'

export default function Home() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const stickers = useStickers()
  const [tab, setTab] = useState('album')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const module = localStorage.getItem('worldcup_module') ?? 'album'
  const handleChangeModule = () => {
    localStorage.removeItem('worldcup_module')
    navigate('/modules')
  }

  if (stickers.loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Carregando seu álbum...</p>
      </div>
    )
  }

  const hasSearch = search.trim() !== ''

  // Filtra seleções por busca e filtro
  const filteredTeams = stickers.TEAMS.filter(team =>
    !hasSearch ||
    team.name.toLowerCase().includes(search.toLowerCase()) ||
    team.code.toLowerCase().includes(search.toLowerCase())
  ).filter(team => {
    const ts = stickers.getTeamStats(team.code)
    if (filter === 'missing') return ts.owned < ts.total
    if (filter === 'complete') return ts.owned === ts.total
    return true
  })

  // Filtra seções especiais pelo mesmo critério
  const filteredSpecials = stickers.SPECIAL_SECTIONS.filter(section => {
    if (hasSearch) {
      return section.name.toLowerCase().includes(search.toLowerCase()) ||
        section.code.toLowerCase().includes(search.toLowerCase())
    }
    const owned = section.stickers.filter(s => (stickers.collection[s.code] || 0) > 0).length
    const total = section.stickers.length
    if (filter === 'missing') return owned < total
    if (filter === 'complete') return owned === total
    return true
  })

  const showGroupLabels = !hasSearch && filter === 'all'

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.logo}>
            <span className={styles.logoBall}>⚽</span>
            <div>
              <div className={styles.logoTitle}>Copa 2026</div>
              <div className={styles.logoSub}>FIFA World Cup™</div>
            </div>
          </div>
          <button className={styles.avatarBtn} onClick={() => setMenuOpen(!menuOpen)}>
            {user?.user_metadata?.avatar_url
              ? <img src={user.user_metadata.avatar_url} alt="perfil" className={styles.avatar} />
              : <div className={styles.avatarPlaceholder}>{user?.email?.[0]?.toUpperCase()}</div>
            }
          </button>
          {menuOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownUser}>{user?.user_metadata?.full_name || user?.email}</div>
              {module === 'both' && (
                <button className={styles.dropdownItem} onClick={() => navigate('/bolao')}>
                  ⚽ Bolão da Copa
                </button>
              )}
              <button className={styles.dropdownItem} onClick={handleChangeModule}>
                🔄 Trocar módulo
              </button>
              <button className={styles.dropdownItem} onClick={signOut}>Sair</button>
            </div>
          )}
        </div>
        {tab === 'album' && <StatsBar stats={stickers.stats} />}
      </header>

      {tab === 'album' && (
        <div className={styles.content}>
          <div className={styles.searchWrap}>
            <input
              className={styles.search}
              placeholder="Buscar seleção..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className={styles.filterRow}>
              {['all', 'missing', 'complete'].map(f => (
                <button key={f}
                  className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
                  onClick={() => setFilter(f)}>
                  {f === 'all' ? 'Todas' : f === 'missing' ? 'Faltando' : 'Completas'}
                </button>
              ))}
            </div>
          </div>

          {/* Especiais — sempre aparecem quando há resultado */}
          {filteredSpecials.length > 0 && (
            <div>
              <div className={styles.groupLabel}>⭐ Especiais</div>
              {filteredSpecials.map(section => (
                <SpecialSection
                  key={section.code}
                  section={section}
                  collection={stickers.collection}
                  onMarkOwned={stickers.markOwned}
                  onAddDuplicate={stickers.addDuplicate}
                  onRemoveDuplicate={stickers.removeDuplicate}
                />
              ))}
            </div>
          )}

          {/* Seleções agrupadas */}
          {filteredTeams.length > 0 && (
            <div>
              {showGroupLabels && <div className={styles.groupLabel}>🌍 Seleções por Grupo</div>}
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].map(grupo => {
                const teams = filteredTeams.filter(t => t.group === grupo)
                if (teams.length === 0) return null
                return (
                  <div key={grupo}>
                    {showGroupLabels && <div className={styles.groupChip}>Grupo {grupo}</div>}
                    {teams.map(team => (
                      <TeamSection
                        key={team.code}
                        team={team}
                        teamStats={stickers.getTeamStats(team.code)}
                        collection={stickers.collection}
                        onMarkOwned={stickers.markOwned}
                        onAddDuplicate={stickers.addDuplicate}
                        onRemoveDuplicate={stickers.removeDuplicate}
                      />
                    ))}
                  </div>
                )
              })}
            </div>
          )}

          {/* Nenhum resultado */}
          {filteredSpecials.length === 0 && filteredTeams.length === 0 && (
            <div className={styles.emptyFilter}>
              <div style={{ fontSize: 40 }}>
                {filter === 'complete' ? '🏆' : '🔍'}
              </div>
              <p>{filter === 'complete' ? 'Nenhuma seleção completa ainda.' : 'Nenhum resultado encontrado.'}</p>
            </div>
          )}
        </div>
      )}

      {tab === 'duplicates' && (
        <DuplicatesTab
          duplicates={stickers.getDuplicatesList()}
          TEAMS={stickers.TEAMS}
          SPECIAL_SECTIONS={stickers.SPECIAL_SECTIONS}
        />
      )}

      {tab === 'trade' && <TradeCard />}

      {stickers.saving && <div className={styles.savingToast}>Salvando...</div>}
      <BottomNav tab={tab} setTab={setTab} stats={stickers.stats} />
    </div>
  )
}
