import { useAuth } from '../lib/AuthContext'
import Login from '../pages/Login'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a1f10'
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid rgba(255,215,0,0.2)',
          borderTopColor: '#FFD700',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    )
  }

  if (!user) return <Login />

  return children
}
