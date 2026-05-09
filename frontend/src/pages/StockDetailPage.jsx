import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { ArrowLeft, TrendingUp, TrendingDown, BrainCircuit, Plus } from 'lucide-react'
import { generatePriceSeries, MOCK_STOCK_PRICES, POPULAR_STOCKS } from '../data/mockData'
import toast from 'react-hot-toast'

const fmt  = n => n?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '—'
const fmtB = n => n >= 1e12 ? (n/1e12).toFixed(2)+'T' : n >= 1e9 ? (n/1e9).toFixed(2)+'B' : (n/1e6).toFixed(0)+'M'

export default function StockDetailPage() {
  const { symbol } = useParams()
  const [data, setData]     = useState([])
  const [period, setPeriod] = useState('3M')
  const [inWL, setInWL]     = useState(false)

  const PERIODS = { '1W':7,'1M':30,'3M':90,'6M':180,'1Y':365 }
  const info     = POPULAR_STOCKS.find(s => s.symbol === symbol) || { name: symbol, sector:'—', exchange:'—' }
  const basePrice = MOCK_STOCK_PRICES[symbol] || 150

  useEffect(() => {
    setData(generatePriceSeries(basePrice, PERIODS[period]))
  }, [symbol, period])

  const latest = data[data.length - 1] || {}
  const start  = data[0]?.close || basePrice
  const pctChg = data.length ? ((latest.close - start) / start) * 100 : 0
  const positive = pctChg >= 0

  const high52 = basePrice * 1.35
  const low52  = basePrice * 0.65
  const mktCap = basePrice * (Math.random() * 5e9 + 2e9)
  const pe     = (15 + Math.random() * 20).toFixed(1)
  const eps    = (basePrice / pe).toFixed(2)
  const divYld = (Math.random() * 2).toFixed(2) + '%'

  const OVERVIEW = [
    { label:'Open',         value:`$${fmt(latest.open)}`  },
    { label:'High',         value:`$${fmt(latest.high)}`  },
    { label:'Low',          value:`$${fmt(latest.low)}`   },
    { label:'Volume',       value:latest.volume?.toLocaleString() ?? '—' },
    { label:'52W High',     value:`$${fmt(high52)}`       },
    { label:'52W Low',      value:`$${fmt(low52)}`        },
    { label:'Market Cap',   value:fmtB(mktCap)            },
    { label:'P/E Ratio',    value:pe                      },
    { label:'EPS',          value:`$${eps}`               },
    { label:'Dividend Yld', value:divYld                  },
    { label:'Sector',       value:info.sector             },
    { label:'Exchange',     value:info.exchange           },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowLeft size={16} className="text-slate-300" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{symbol}</h1>
            <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-slate-400">{info.exchange}</span>
          </div>
          <p className="text-slate-400 text-sm">{info.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setInWL(w => !w); toast.success(inWL ? 'Removed from watchlist' : 'Added to watchlist') }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              inWL ? 'bg-brand-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Plus size={14} /> {inWL ? 'Watching' : 'Watch'}
          </button>
          <Link
            to="/prediction"
            className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
          >
            <BrainCircuit size={14} /> AI Predict
          </Link>
        </div>
      </div>

      {/* Price + chart */}
      <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} className="glass-card p-6">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-4xl font-extrabold text-white">${fmt(latest.close)}</span>
          <span className={`text-base font-semibold ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
            {positive ? <TrendingUp size={16} className="inline mr-1" /> : <TrendingDown size={16} className="inline mr-1" />}
            {positive ? '+' : ''}{pctChg.toFixed(2)}%
          </span>
        </div>
        <p className="text-slate-500 text-xs mb-4">{period} Performance · Demo Mode</p>

        <div className="flex gap-1 mb-4">
          {Object.keys(PERIODS).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                period === p ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top:5, right:10, bottom:5, left:0 }}>
            <defs>
              <linearGradient id="sd-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={positive?'#10b981':'#ef4444'} stopOpacity={0.25}/>
                <stop offset="95%" stopColor={positive?'#10b981':'#ef4444'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" tick={{fill:'#64748b',fontSize:10}} tickLine={false} axisLine={false} tickFormatter={d=>d.slice(5)} interval={Math.floor(data.length/6)} />
            <YAxis domain={['auto','auto']} tick={{fill:'#64748b',fontSize:10}} tickLine={false} axisLine={false} tickFormatter={v=>`$${v.toFixed(0)}`} width={55} />
            <Tooltip
              contentStyle={{ background:'#0f1a2e', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, fontSize:12 }}
              labelStyle={{ color:'#94a3b8' }}
              formatter={v=>[`$${fmt(v)}`,'Price']}
            />
            <Area type="monotone" dataKey="close" stroke={positive?'#10b981':'#ef4444'} strokeWidth={2} fill="url(#sd-grad)" dot={false} activeDot={{r:4}} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Volume + Overview */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Volume chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Volume</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data.slice(-30)} margin={{top:0,right:0,bottom:0,left:0}}>
              <XAxis dataKey="date" tick={{fill:'#64748b',fontSize:9}} tickLine={false} axisLine={false} tickFormatter={d=>d.slice(5)} interval={4} />
              <YAxis tick={{fill:'#64748b',fontSize:9}} tickLine={false} axisLine={false} tickFormatter={v=>(v/1e6).toFixed(0)+'M'} width={45} />
              <Tooltip contentStyle={{background:'#0f1a2e',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,fontSize:12}} formatter={v=>[v.toLocaleString(),'Volume']} />
              <Bar dataKey="volume" fill="#3b82f6" opacity={0.7} radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Key stats */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Key Statistics</h3>
          <div className="space-y-2.5">
            {OVERVIEW.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{label}</span>
                <span className="text-white font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
