import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TrendingUp, BrainCircuit, Database, Globe, ArrowRight } from 'lucide-react'

// Inline GitHub SVG (lucide-react version may not include Github)
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
)

const TECH = [
  { group:'Frontend',  items:['React 18 + Vite', 'Tailwind CSS', 'Framer Motion', 'Recharts', 'Axios', 'React Router'] },
  { group:'Backend',   items:['Python FastAPI', 'JWT Auth', 'yFinance API', 'Pandas + NumPy', 'Scikit-learn', 'LSTM / TensorFlow'] },
  { group:'Database',  items:['MongoDB (Atlas)', 'Mongoose ODM', 'JWT Sessions', 'bcrypt Hashing'] },
  { group:'DevOps',    items:['GitHub Actions', 'Docker', 'Vercel (Frontend)', 'Render (Backend)'] },
]

const TEAM = [
  { name:'AI / ML Module',     desc:'LSTM neural network, Random Forest, Linear Regression models trained on historical stock data.' },
  { name:'Real-Time Data',     desc:'yFinance integration fetching live OHLCV data, company overviews, and financials.' },
  { name:'Authentication',     desc:'JWT-based auth with bcrypt password hashing and secure session management.' },
  { name:'Portfolio Engine',   desc:'Track holdings, compute P&L, allocation weights, and portfolio analytics.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white">
      {/* Minimal nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
            <TrendingUp size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg">StockAI Pro</span>
        </div>
        <Link to="/dashboard" className="btn-primary text-sm flex items-center gap-2">
          Open App <ArrowRight size={14} />
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-16 space-y-16">
        {/* Hero */}
        <motion.section initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-600/30">
            <BrainCircuit size={30} className="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            About StockAI Pro
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            A full-stack AI-powered stock market prediction system built with modern technologies.
            This project demonstrates the integration of deep learning models, real-time financial data,
            and a premium fintech user interface.
          </p>
        </motion.section>

        {/* Tech stack */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Database size={20} className="text-brand-400" /> Technology Stack
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {TECH.map(({ group, items }, i) => (
              <motion.div
                key={group}
                initial={{ opacity:0, x: i%2===0?-20:20 }}
                whileInView={{ opacity:1, x:0 }}
                transition={{ delay: i*0.1 }}
                className="glass-card p-5"
              >
                <h3 className="text-sm font-semibold text-brand-400 mb-3">{group}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map(item => (
                    <span key={item} className="px-2.5 py-1 rounded-full bg-white/5 text-xs text-slate-300 border border-white/5">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Globe size={20} className="text-brand-400" /> Key Modules
          </h2>
          <div className="space-y-3">
            {TEAM.map(({ name, desc }, i) => (
              <motion.div
                key={name}
                initial={{ opacity:0, x:-20 }}
                whileInView={{ opacity:1, x:0 }}
                transition={{ delay: i*0.08 }}
                className="glass-card p-5 flex gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold text-sm shrink-0">
                  {i+1}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="glass-card p-6 border border-amber-500/20">
          <h3 className="text-sm font-semibold text-amber-400 mb-2">⚠️ Disclaimer</h3>
          <p className="text-sm text-slate-400">
            StockAI Pro is an educational and research project. All predictions, charts, and analyses
            are generated using historical and simulated data. This is <strong className="text-white">not</strong> financial
            advice. Always consult a qualified financial advisor before making investment decisions.
          </p>
        </section>

        {/* GitHub */}
        <div className="text-center">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost inline-flex items-center gap-2 px-8 py-3"
          >
            <GithubIcon /> View on GitHub
          </a>
        </div>
      </div>
    </div>
  )
}
