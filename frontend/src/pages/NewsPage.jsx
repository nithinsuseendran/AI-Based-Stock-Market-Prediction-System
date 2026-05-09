import { useState } from 'react'
import { motion } from 'framer-motion'
import { Newspaper, TrendingUp, TrendingDown, Minus, ExternalLink, Filter } from 'lucide-react'
import { MOCK_NEWS } from '../data/mockData'

const EXTRA_NEWS = [
  { id:6, title:'Microsoft Copilot AI Integration Boosts Enterprise Sales 35%', source:'Bloomberg', time:'12h ago', sentiment:'positive', summary:'Microsoft reports strong enterprise adoption of AI tools, with Copilot contributing significantly to subscription revenue growth.', url:'#', symbol:'MSFT' },
  { id:7, title:'Meta AI Research Lab Announces New Large Language Model', source:'TechCrunch', time:'14h ago', sentiment:'positive', summary:'Meta open-sources a new 70B parameter model outperforming GPT-4 on several benchmarks.', url:'#', symbol:'META' },
  { id:8, title:'Infosys Wins $2.3B Multi-Year Digital Transformation Contract', source:'ET Markets', time:'16h ago', sentiment:'positive', summary:'Infosys secures a massive deal with a Fortune 100 company for cloud and AI services.', url:'#', symbol:'INFY.NS' },
  { id:9, title:'TCS Q4 Results Beat Street Expectations on Strong Deal Wins', source:'Mint', time:'1d ago', sentiment:'positive', summary:'TCS reports 8.2% YoY growth in revenue amid strong deal pipeline exceeding $10B.', url:'#', symbol:'TCS.NS' },
  { id:10, title:'Reliance Retail Plans $3B Expansion Into Tier-2 Indian Cities', source:'Business Standard', time:'1d ago', sentiment:'neutral', summary:'Reliance Industries unveils ambitious retail expansion targeting 200 new cities.', url:'#', symbol:'RELIANCE.NS' },
]

const ALL_NEWS = [...MOCK_NEWS, ...EXTRA_NEWS]

const SENTIMENT_CFG = {
  positive: { color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', icon: TrendingUp,  label: 'Bullish' },
  negative: { color: 'text-red-400',     bg: 'bg-red-400/10 border-red-400/20',         icon: TrendingDown, label: 'Bearish' },
  neutral:  { color: 'text-slate-400',   bg: 'bg-slate-400/10 border-slate-400/20',     icon: Minus,        label: 'Neutral' },
}

const FILTERS = ['All', 'Bullish', 'Bearish', 'Neutral']

export default function NewsPage() {
  const [filter, setFilter] = useState('All')
  const [symbol, setSymbol] = useState('All')

  const symbols = ['All', ...new Set(ALL_NEWS.map(n=>n.symbol).filter(Boolean))]

  const visible = ALL_NEWS.filter(n => {
    const sentOk  = filter === 'All' || SENTIMENT_CFG[n.sentiment]?.label === filter
    const symOk   = symbol === 'All' || n.symbol === symbol || (symbol !== 'All' && !n.symbol)
    return sentOk && symOk
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Newspaper size={22} className="text-brand-400" /> Market News
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">AI-analyzed sentiment from global financial news sources</p>
      </div>

      {/* Sentiment summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Bullish Stories', count: ALL_NEWS.filter(n=>n.sentiment==='positive').length, color:'text-emerald-400', bg:'bg-emerald-400/10' },
          { label:'Bearish Stories', count: ALL_NEWS.filter(n=>n.sentiment==='negative').length, color:'text-red-400',     bg:'bg-red-400/10'     },
          { label:'Neutral Stories', count: ALL_NEWS.filter(n=>n.sentiment==='neutral').length,  color:'text-slate-300',   bg:'bg-slate-400/10'   },
        ].map(({ label, count, color, bg }) => (
          <div key={label} className={`glass-card p-4 text-center ${bg}`}>
            <p className={`text-2xl font-bold ${color}`}>{count}</p>
            <p className="text-xs text-slate-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Filter size={14} className="text-slate-500" />
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filter === f ? 'bg-brand-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-2">
          {symbols.slice(0,8).map(s => (
            <button
              key={s}
              onClick={() => setSymbol(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                symbol === s ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* News grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {visible.map((n, i) => {
          const cfg = SENTIMENT_CFG[n.sentiment]
          const Icon = cfg.icon
          return (
            <motion.article
              key={n.id}
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">{n.source}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-500">{n.time}</span>
                  {n.symbol && (
                    <>
                      <span className="text-slate-600">·</span>
                      <span className="text-brand-400 font-mono font-bold">{n.symbol}</span>
                    </>
                  )}
                </div>
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                  <Icon size={10} />
                  {cfg.label}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white leading-snug mb-2 line-clamp-2">{n.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{n.summary}</p>
              <a
                href={n.url}
                className="inline-flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 mt-3 transition-colors"
              >
                Read more <ExternalLink size={10} />
              </a>
            </motion.article>
          )
        })}
      </div>

      {visible.length === 0 && (
        <div className="text-center py-16 text-slate-500">No news matching your filters.</div>
      )}
    </div>
  )
}
