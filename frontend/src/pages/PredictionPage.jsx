import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { BrainCircuit, Zap, TrendingUp, TrendingDown, Loader2, ChevronDown } from 'lucide-react'
import { generatePriceSeries, POPULAR_STOCKS, MOCK_STOCK_PRICES } from '../data/mockData'
import toast from 'react-hot-toast'

const fmt = n => n?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '—'

const MODELS = [
  { id: 'lstm',       label: 'LSTM Neural Network',      badge: 'Deep Learning', desc: 'Best for long-term trends' },
  { id: 'random_forest', label: 'Random Forest',         badge: 'ML Ensemble',  desc: 'Robust, handles noise well' },
  { id: 'linear',    label: 'Linear Regression',         badge: 'Statistical',  desc: 'Simple baseline model'     },
]

const HORIZONS = [
  { value: 7,  label: '7 Days'  },
  { value: 14, label: '14 Days' },
  { value: 30, label: '30 Days' },
]

function generateForecast(lastPrice, days, modelId) {
  const noise = modelId === 'lstm' ? 0.012 : modelId === 'random_forest' ? 0.018 : 0.008
  const trend = (Math.random() - 0.45) * 0.003
  const forecast = []
  let price = lastPrice
  const today = new Date()
  for (let i = 1; i <= days; i++) {
    price *= (1 + trend + (Math.random() - 0.5) * noise)
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    forecast.push({
      date: d.toISOString().split('T')[0],
      predicted: +price.toFixed(2),
      upper: +(price * (1 + noise * 2)).toFixed(2),
      lower: +(price * (1 - noise * 2)).toFixed(2),
    })
  }
  return forecast
}

export default function PredictionPage() {
  const [symbol, setSymbol]   = useState('AAPL')
  const [modelId, setModelId] = useState('lstm')
  const [horizon, setHorizon] = useState(14)
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)
  const [dropOpen, setDropOpen] = useState(false)

  const runPrediction = async () => {
    setLoading(true)
    setResult(null)
    // Simulate API call latency
    await new Promise(r => setTimeout(r, 2200))
    const base  = MOCK_STOCK_PRICES[symbol] || 150
    const hist  = generatePriceSeries(base, 60)
    const fore  = generateForecast(hist[hist.length-1].close, horizon, modelId)
    const lastHistPrice = hist[hist.length - 1].close
    const lastForePrice = fore[fore.length - 1].predicted
    const changePct = ((lastForePrice - lastHistPrice) / lastHistPrice) * 100
    const conf = modelId === 'lstm' ? 87 + Math.random() * 7 : modelId === 'random_forest' ? 79 + Math.random()*8 : 68 + Math.random()*7

    setResult({ hist, fore, changePct, conf, lastHistPrice, lastForePrice })
    setLoading(false)
    toast.success('Prediction complete!')
  }

  const combined = result
    ? [
        ...result.hist.slice(-30).map(d => ({ date: d.date, actual: d.close, predicted: null, upper: null, lower: null })),
        ...result.fore.map(d => ({ date: d.date, actual: null, ...d })),
      ]
    : []

  const modelLabel = MODELS.find(m => m.id === modelId)?.label || modelId

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BrainCircuit size={24} className="text-brand-400" /> AI Prediction Engine
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">Deep-learning stock price forecasts powered by LSTM &amp; ML</p>
      </div>

      {/* Config panel */}
      <div className="glass-card p-6">
        <div className="grid sm:grid-cols-3 gap-5 mb-6">
          {/* Symbol */}
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-2">Stock Symbol</label>
            <div className="relative">
              <button
                onClick={() => setDropOpen(o => !o)}
                className="input-field w-full flex items-center justify-between"
              >
                <span className="font-semibold text-white">{symbol}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>
              <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{ opacity:0,y:-5 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-5 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-[#0f1a2e] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    {POPULAR_STOCKS.map(s => (
                      <button
                        key={s.symbol}
                        onClick={() => { setSymbol(s.symbol); setDropOpen(false) }}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-white/5 transition-colors"
                      >
                        <span className="font-semibold text-white">{s.symbol}</span>
                        <span className="text-slate-400 text-xs">{s.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Model */}
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-2">AI Model</label>
            <div className="space-y-2">
              {MODELS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setModelId(m.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all ${
                    modelId === m.id
                      ? 'bg-brand-600/20 border border-brand-500/40 text-brand-300'
                      : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="font-semibold">{m.label}</span>
                  <span className="ml-auto opacity-60">{m.badge}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Horizon */}
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-2">Forecast Horizon</label>
            <div className="space-y-2">
              {HORIZONS.map(h => (
                <button
                  key={h.value}
                  onClick={() => setHorizon(h.value)}
                  className={`w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    horizon === h.value
                      ? 'bg-brand-600 text-white'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={runPrediction}
          disabled={loading}
          className="btn-primary px-8 py-3 flex items-center gap-2 mx-auto"
        >
          {loading
            ? <><Loader2 size={16} className="animate-spin" /> Analyzing {symbol}…</>
            : <><Zap size={16} /> Run Prediction</>
          }
        </button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} className="space-y-5">
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label:'Current Price',   value:`$${fmt(result.lastHistPrice)}`,   color:'text-white'         },
                { label:'Target Price',    value:`$${fmt(result.lastForePrice)}`,   color: result.changePct>=0?'text-emerald-400':'text-red-400' },
                { label:'Expected Change', value:`${result.changePct>=0?'+':''}${result.changePct.toFixed(2)}%`, color: result.changePct>=0?'text-emerald-400':'text-red-400' },
                { label:'Model Confidence',value:`${result.conf.toFixed(1)}%`,      color:'text-brand-400'     },
              ].map(({ label, value, color }) => (
                <div key={label} className="glass-card p-4 text-center">
                  <p className="text-xs text-slate-400 mb-1">{label}</p>
                  <p className={`text-xl font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">{symbol} Price Forecast</h3>
                  <p className="text-xs text-slate-400">30-day history + {horizon}-day forecast · {modelLabel}</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-brand-400 rounded inline-block"/>Historical</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-amber-400 rounded inline-block"/>Predicted</span>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={combined} margin={{top:5,right:10,bottom:5,left:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={{fill:'#64748b',fontSize:10}} tickLine={false} axisLine={false} tickFormatter={d=>d.slice(5)} interval={Math.floor(combined.length/8)} />
                  <YAxis domain={['auto','auto']} tick={{fill:'#64748b',fontSize:10}} tickLine={false} axisLine={false} tickFormatter={v=>`$${v.toFixed(0)}`} width={55} />
                  <Tooltip
                    contentStyle={{ background:'#0f1a2e', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, fontSize:12 }}
                    labelStyle={{ color:'#94a3b8' }}
                    formatter={(v,n) => v != null ? [`$${fmt(v)}`, n==='actual'?'Historical':'Predicted'] : [null,null]}
                  />
                  <ReferenceLine x={combined.find(d=>d.predicted!=null)?.date} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" label={{value:'Today',fill:'#64748b',fontSize:10}} />
                  <Line type="monotone" dataKey="actual"    stroke="#60a5fa" strokeWidth={2} dot={false} connectNulls={false} />
                  <Line type="monotone" dataKey="predicted" stroke="#f59e0b" strokeWidth={2} dot={false} connectNulls={false} strokeDasharray="6 3" />
                  <Line type="monotone" dataKey="upper"     stroke="#f59e0b" strokeWidth={0.5} dot={false} connectNulls={false} strokeOpacity={0.3} />
                  <Line type="monotone" dataKey="lower"     stroke="#f59e0b" strokeWidth={0.5} dot={false} connectNulls={false} strokeOpacity={0.3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Signal */}
            <div className={`glass-card p-5 flex items-center gap-4 border ${result.changePct>=0?'border-emerald-500/20':'border-red-500/20'}`}>
              {result.changePct >= 0
                ? <TrendingUp size={32} className="text-emerald-400 shrink-0" />
                : <TrendingDown size={32} className="text-red-400 shrink-0" />}
              <div>
                <p className={`text-lg font-bold ${result.changePct>=0?'text-emerald-400':'text-red-400'}`}>
                  {result.changePct >= 0 ? '📈 BULLISH Signal' : '📉 BEARISH Signal'}
                </p>
                <p className="text-sm text-slate-400">
                  {modelLabel} predicts {symbol} will {result.changePct>=0?'rise':'fall'} by{' '}
                  <strong className={result.changePct>=0?'text-emerald-400':'text-red-400'}>
                    {Math.abs(result.changePct).toFixed(2)}%
                  </strong>{' '}
                  over the next {horizon} days with {result.conf.toFixed(1)}% confidence.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 text-center">
              ⚠️ Predictions are for educational purposes only and not financial advice.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
