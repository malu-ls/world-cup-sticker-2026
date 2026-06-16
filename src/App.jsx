import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import ModuleSelector from './pages/ModuleSelector'
import BolaoHome from './pages/BolaoHome'
import AdminPanel from './pages/AdminPanel'

// Redireciona / para o módulo salvo ou para a seleção
function RootRedirect() {
  const module = localStorage.getItem('worldcup_module')
  if (module === 'bolao') return <Navigate to="/bolao" replace />
  if (module === 'album' || module === 'both') return <Navigate to="/album" replace />
  return <Navigate to="/modules" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"   element={<Login />} />
          <Route path="/modules" element={<ProtectedRoute><ModuleSelector /></ProtectedRoute>} />
          <Route path="/album/*" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/bolao"   element={<ProtectedRoute><BolaoHome /></ProtectedRoute>} />
          <Route path="/admin"   element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          <Route path="/*"       element={<ProtectedRoute><RootRedirect /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
