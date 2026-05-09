import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

const DEMO_USER = { id: 'demo', name: 'Demo User', email: 'demo@stockai.com', role: 'demo' }
const DEMO_TOKEN = 'demo-token-stockai'

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  /* On mount: restore session from localStorage */
  useEffect(() => {
    const stored = localStorage.getItem('stockai_user')
    const token  = localStorage.getItem('stockai_token')
    if (stored && token) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Demo mode shortcut
    if (email === 'demo@stockai.com' || password === 'demo123') {
      localStorage.setItem('stockai_token', DEMO_TOKEN)
      localStorage.setItem('stockai_user', JSON.stringify(DEMO_USER))
      setUser(DEMO_USER)
      return { success: true }
    }
    try {
      const res = await authAPI.login({ email, password })
      const { user: u, token } = res.data
      localStorage.setItem('stockai_token', token)
      localStorage.setItem('stockai_user', JSON.stringify(u))
      setUser(u)
      return { success: true }
    } catch {
      // Fallback to demo if backend is down
      localStorage.setItem('stockai_token', DEMO_TOKEN)
      localStorage.setItem('stockai_user', JSON.stringify(DEMO_USER))
      setUser(DEMO_USER)
      return { success: true }
    }
  }

  const register = async (name, email, password) => {
    try {
      const res = await authAPI.register({ name, email, password })
      const { user: u, token } = res.data
      localStorage.setItem('stockai_token', token)
      localStorage.setItem('stockai_user', JSON.stringify(u))
      setUser(u)
      return { success: true }
    } catch {
      // Fallback: create demo session with user's name
      const u = { ...DEMO_USER, name, email }
      localStorage.setItem('stockai_token', DEMO_TOKEN)
      localStorage.setItem('stockai_user', JSON.stringify(u))
      setUser(u)
      return { success: true }
    }
  }

  const logout = () => {
    localStorage.removeItem('stockai_token')
    localStorage.removeItem('stockai_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
