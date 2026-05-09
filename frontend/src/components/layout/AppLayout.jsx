import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, TrendingUp, BrainCircuit, Briefcase,
  Newspaper, Info, LogOut, Menu, X, Moon, Sun, Bell, Search
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const NAV = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard'   },
  { to: '/prediction', icon: BrainCircuit,     label: 'AI Predict'  },
  { to: '/portfolio',  icon: Briefcase,        label: 'Portfolio'   },
  { to: '/news',       icon: Newspaper,        label: 'News'        },
  { to: '/about',      icon: Info,             label: 'About'       },
]

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
      {/* ── Sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative flex flex-col h-full bg-[var(--bg-secondary)] border-r border-white/5 z-20 shrink-0"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shrink-0">
            <TrendingUp size={18} className="text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-bold text-sm text-white whitespace-nowrap"
              >
                StockAI Pro
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                 ${isActive
                   ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                   : 'text-slate-400 hover:text-white hover:bg-white/5'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={`shrink-0 ${isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-white'}`} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="whitespace-nowrap"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-white/5 p-3 space-y-2">
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-2 py-2"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-white truncate">{user?.name || 'Demo User'}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || 'demo@stockai.com'}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => { logout(); navigate('/') }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={16} className="shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-[var(--bg-secondary)] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          {collapsed ? <Menu size={12} /> : <X size={12} />}
        </button>
      </motion.aside>

      {/* ── Main ── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4 bg-[var(--bg-secondary)] border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <Search size={16} className="text-slate-400 shrink-0" />
            <input
              placeholder="Search stocks… (AAPL, TSLA, NVDA)"
              className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const v = e.target.value.trim().toUpperCase()
                  if (v) navigate(`/stock/${v}`)
                }
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 transition-colors">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 transition-colors relative">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
