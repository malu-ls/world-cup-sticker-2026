import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import styles from '../styles/ModuleSelector.module.css'

const MODULES = [
  {
    id:    'album',
    icon:  '📖',
    title: 'Álbum de Figurinhas',
    desc:  'Controle sua coleção, veja repetidas e gere cards de troca.',
    color: '#FFD700',
  },
  {
    id:    'bolao',
    icon:  '⚽',
    title: 'Bolão da Copa',
    desc:  'Faça palpites, acompanhe todos os jogos e dispute o ranking.',
    color: '#4ade80',
  },
  {
    id:    'both',
    icon:  '🏆',
    title: 'Os Dois',
    desc:  'Acesse o álbum e o bolão com navegação integrada.',
    color: '#c084fc',
  },
]

export default function ModuleSelector() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const select = (id) => {
    localStorage.setItem('worldcup_module', id)
    if (id === 'bolao') navigate('/bolao')
    else navigate('/album')
  }

  return (
    <div className={styles.container}>
      <div className={styles.bg}>
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className={styles.blob} style={{
            left: `${(i * 37) % 90}%`,
            top:  `${(i * 53) % 90}%`,
            animationDelay: `${i * 0.4}s`,
          }} />
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.badge}>FIFA WORLD CUP 2026™</div>
          <h1 className={styles.title}>O que você quer acessar?</h1>
          <p className={styles.sub}>
            Olá, {user?.user_metadata?.full_name?.split(' ')[0] ?? 'jogador'}!
            Escolha o módulo ou acesse os dois.
          </p>
        </div>

        <div className={styles.cards}>
          {MODULES.map(m => (
            <button
              key={m.id}
              className={styles.card}
              style={{ '--accent': m.color }}
              onClick={() => select(m.id)}
            >
              <span className={styles.cardIcon}>{m.icon}</span>
              <span className={styles.cardTitle}>{m.title}</span>
              <span className={styles.cardDesc}>{m.desc}</span>
              <span className={styles.cardArrow}>→</span>
            </button>
          ))}
        </div>

        <p className={styles.hint}>Você pode mudar depois pelo menu do perfil</p>
      </div>
    </div>
  )
}
