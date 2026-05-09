import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, BrainCircuit, ShieldCheck, Zap, ArrowRight, BarChart2, Globe } from 'lucide-react'

const FEATURES = [
  { icon: BrainCircuit, color: 'from-brand-500 to-violet-600', title: 'AI-Powered Predictions', desc: 'LSTM neural networks trained on 10+ years of market data for accurate forecasts.' },
  { icon: BarChart2,    color: 'from-emerald-500 to-teal-600', title: 'Real-Time Data',         desc: 'Live stock quotes, charts, and market depth powered by yFinance API.'          },
  { icon: ShieldCheck,  color: 'from-amber-500 to-orange-600', title: 'Portfolio Tracking',     desc: 'Monitor your holdings, P&L, and diversification in one unified dashboard.'      },
  { icon: Globe,        color: 'from-pink-500 to-rose-600',    title: 'Global Markets',          desc: 'US, Indian, and global exchanges — NASDAQ, NSE, BSE, NYSE covered.'             },
]

const STATS = [
  { value: '10M+',  label: 'Data Points Analyzed' },
  { value: '94.2%', label: 'Prediction Accuracy'  },
  { value: '500+',  label: 'Stocks Covered'        },
  { value: '< 1s',  label: 'Response Time'         },
]

const TICKERS = ['AAPL ▲2.1%','TSLA ▲4.4%','NVDA ▲5.1%','GOOGL ▼0.3%','AMZN ▲1.8%','MSFT ▲0.9%','META ▲2.7%','RELIANCE ▲1.3%','TCS ▼0.5%','INFY ▲1.1%']

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white overflow-x-hidden">
      {/* ── Ticker Banner ── */}
      <div className="bg-[var(--bg-secondary)] border-b border-white/5 overflow-hidden py-2">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {[...TICKERS, ...TICKERS].map((t, i) => (
            <span key={i} className={`text-xs font-mono font-medium px-2 ${t.includes('▲') ? 'text-emerald-400' : 'text-red-400'}`}>
              {t}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5 backdrop-blur-sm sticky top-0 z-50 bg-[var(--bg-primary)]/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
            <TrendingUp size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg">StockAI Pro</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
          <Link to="/register" className="btn-primary text-sm">Get Started</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-brand-600/15 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-violet-600/15 blur-[120px] pointer-events-none" />

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-600/10 text-brand-400 text-xs font-semibold mb-6">
            <Zap size={12} /> Powered by Deep Learning
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight bg-gradient-to-r from-white via-brand-200 to-violet-400 bg-clip-text text-transparent mb-6">
            Predict the Market<br />Before It Moves
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
            AI-powered stock predictions using LSTM neural networks, real-time data, 
            and advanced analytics — your edge in the financial markets.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register" className="btn-primary text-base px-8 py-3 flex items-center gap-2">
              Start Free <ArrowRight size={16} />
            </Link>
            <Link to="/dashboard" className="btn-ghost text-base px-8 py-3">
              Live Demo
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="px-8 py-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card text-center py-6"
            >
              <p className="text-3xl font-extrabold text-white mb-1">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-8 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3">Everything You Need</h2>
        <p className="text-slate-400 text-center mb-12">A complete platform for data-driven investing</p>
        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map(({ icon: Icon, color, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card flex gap-4 p-6"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                <Icon size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{title}</h3>
                <p className="text-sm text-slate-400">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-8 py-20 text-center">
        <div className="glass-card max-w-2xl mx-auto p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Get an Edge?</h2>
          <p className="text-slate-400 mb-8">Join thousands of traders using StockAI Pro every day.</p>
          <Link to="/register" className="btn-primary px-10 py-3 text-base">
            Create Free Account
          </Link>
        </div>
      </section>

      <footer className="text-center py-8 text-slate-600 text-sm border-t border-white/5">
        © 2025 StockAI Pro · Built with ❤️ and AI
      </footer>
    </div>
  )
}
