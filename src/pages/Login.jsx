import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import styles from '../styles/Login.module.css'

export default function Login() {
  const { signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      await signInWithGoogle()
    } catch (err) {
      setError('Erro ao entrar com Google. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.bg}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={styles.sticker} style={{
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 90}%`,
            animationDelay: `${i * 0.3}s`,
            opacity: 0.04 + (i % 5) * 0.015
          }} />
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.badge}>FIFA WORLD CUP 2026™</div>

        <div className={styles.trophy}>
          <svg viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" stroke="#FFD700" strokeWidth="1.5" strokeOpacity="0.3"/>
            <path d="M28 20h24v2H28z" fill="#FFD700" fillOpacity="0.9"/>
            <path d="M30 22h20v16c0 8.8-4.5 14-10 14s-10-5.2-10-14V22z" fill="#FFD700" fillOpacity="0.8"/>
            <path d="M22 24h8v10c0 2-1.5 3.5-4 4l-4-1V24z" fill="#FFD700" fillOpacity="0.5"/>
            <path d="M58 24h-8v10c0 2 1.5 3.5 4 4l4-1V24z" fill="#FFD700" fillOpacity="0.5"/>
            <path d="M34 52h12v4h-12z" fill="#FFD700" fillOpacity="0.7"/>
            <path d="M30 56h20v3H30z" fill="#FFD700" fillOpacity="0.6"/>
            <path d="M36 36l2 2 4-4" stroke="#0f2d18" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <h1 className={styles.title}>Álbum Copa 2026</h1>
        <p className={styles.subtitle}>
          Controle suas figurinhas, acompanhe seu progresso e troque repetidas com amigos
        </p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>980</span>
            <span className={styles.statLabel}>figurinhas</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>48</span>
            <span className={styles.statLabel}>seleções</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>68</span>
            <span className={styles.statLabel}>especiais</span>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.googleBtn} onClick={handleLogin} disabled={loading}>
          {loading ? (
            <span className={styles.spinner} />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          {loading ? 'Entrando...' : 'Entrar com Google'}
        </button>

        <p className={styles.terms}>
          Ao entrar, você concorda que seus dados de figurinhas ficam salvos na nuvem para sincronizar entre dispositivos.
        </p>
      </div>
    </div>
  )
}
