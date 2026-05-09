import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Plus, Trash2, Briefcase, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { POPULAR_STOCKS, MOCK_STOCK_PRICES } from '../data/mockData'
import toast from 'react-hot-toast'

const fmt = n => n?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '—'

const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#a855f7','#06b6d4','#f97316','#ec4899']

const DEFAULT_HOLDINGS = [
  { id:1, symbol:'AAPL',  name:'Apple Inc.',        qty:10, avgPrice:170.5 },
  { id:2, symbol:'NVDA',  name:'NVIDIA Corp.',       qty:5,  avgPrice:820.0 },
  { id:3, symbol:'TSLA',  name:'Tesla Inc.',         qty:8,  avgPrice:180.0 },
  { id:4, symbol:'GOOGL', name:'Alphabet Inc.',      qty:6,  avgPrice:165.0 },
]

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState(DEFAULT_HOLDINGS)
  const [form, setForm] = useState({ symbol: 'AAPL', qty: '', avgPrice: '' })
  const [showAdd, setShowAdd] = useState(false)

  const enriched = holdings.map(h => {
    const cur = MOCK_STOCK_PRICES[h.symbol] || h.avgPrice
    const curVal  = cur * h.qty
    const costVal = h.avgPrice * h.qty
    const pnl     = curVal - costVal
    const pnlPct  = (pnl / costVal) * 100
    return { ...h, cur, curVal, costVal, pnl, pnlPct }
  })

  const totalValue = enriched.reduce((s, h) => s + h.curVal, 0)
  const totalCost  = enriched.reduce((s, h) => s + h.costVal, 0)
  const totalPnL   = totalValue - totalCost
  const totalPnLPct = totalCost ? (totalPnL / totalCost) * 100 : 0

  const pieData = enriched.map(h => ({ name: h.symbol, value: h.curVal }))

  const addHolding = () => {
    if (!form.qty || !form.avgPrice) { toast.error('Fill all fields'); return }
    const info = POPULAR_STOCKS.find(s => s.symbol === form.symbol)
    setHoldings(hs => [...hs, {
      id: Date.now(),
      symbol: form.symbol,
      name: info?.name || form.symbol,
      qty: +form.qty,
      avgPrice: +form.avgPrice,
    }])
    setForm({ symbol: 'AAPL', qty: '', avgPrice: '' })
    setShowAdd(false)
    toast.success('Position added!')
  }

  const remove = id => {
    setHoldings(hs => hs.filter(h => h.id !== id))
    toast.success('Position removed')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase size={22} className="text-brand-400" /> Portfolio
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Track your holdings and P&amp;L</p>
        </div>
        <button onClick={() => setShowAdd(o=>!o)} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
          <Plus size={14} /> Add Position
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
            className="glass-card p-5 overflow-hidden"
          >
            <h3 className="text-sm font-semibold text-white mb-4">Add Position</h3>
            <div className="grid sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Symbol</label>
                <select
                  value={form.symbol}
                  onChange={e => setForm(f=>({...f, symbol: e.target.value}))}
                  className="input-field w-full"
                >
                  {POPULAR_STOCKS.map(s => <option key={s.symbol} value={s.symbol}>{s.symbol}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Quantity</label>
                <input
                  type="number" min="1"
                  value={form.qty}
                  onChange={e => setForm(f=>({...f, qty: e.target.value}))}
                  placeholder="10"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Avg. Buy Price ($)</label>
                <input
                  type="number" min="0" step="0.01"
                  value={form.avgPrice}
                  onChange={e => setForm(f=>({...f, avgPrice: e.target.value}))}
                  placeholder="150.00"
                  className="input-field w-full"
                />
              </div>
              <div className="flex items-end">
                <button onClick={addHolding} className="btn-primary w-full py-2.5 text-sm">Add</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'Portfolio Value', value:`$${fmt(totalValue)}`,    icon:DollarSign,  color:'text-white'                                            },
          { label:'Total Invested',  value:`$${fmt(totalCost)}`,     icon:Briefcase,   color:'text-slate-300'                                        },
          { label:'Total P&L',       value:`${totalPnL>=0?'+':''}$${fmt(Math.abs(totalPnL))}`, icon: totalPnL>=0?TrendingUp:TrendingDown, color:totalPnL>=0?'text-emerald-400':'text-red-400' },
          { label:'Overall Return',  value:`${totalPnLPct>=0?'+':''}${totalPnLPct.toFixed(2)}%`, icon:TrendingUp, color:totalPnLPct>=0?'text-emerald-400':'text-red-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} className="text-slate-400" />
              <span className="text-xs text-slate-400">{label}</span>
            </div>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table + Pie */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Holdings table */}
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs text-slate-400">
                <th className="text-left p-4">Symbol</th>
                <th className="text-right p-4">Qty</th>
                <th className="text-right p-4">Avg Price</th>
                <th className="text-right p-4">Current</th>
                <th className="text-right p-4">Value</th>
                <th className="text-right p-4">P&L</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {enriched.map((h, i) => (
                <motion.tr
                  key={h.id}
                  initial={{ opacity:0,x:-10 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.05 }}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors"
                >
                  <td className="p-4">
                    <p className="font-bold text-white">{h.symbol}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[120px]">{h.name}</p>
                  </td>
                  <td className="text-right p-4 text-slate-300">{h.qty}</td>
                  <td className="text-right p-4 text-slate-300">${fmt(h.avgPrice)}</td>
                  <td className="text-right p-4 text-white font-medium">${fmt(h.cur)}</td>
                  <td className="text-right p-4 text-white">${fmt(h.curVal)}</td>
                  <td className="text-right p-4">
                    <p className={`font-semibold text-xs ${h.pnl>=0?'text-emerald-400':'text-red-400'}`}>
                      {h.pnl>=0?'+':''}{fmt(h.pnl)}
                    </p>
                    <p className={`text-xs ${h.pnlPct>=0?'text-emerald-400/60':'text-red-400/60'}`}>
                      {h.pnlPct>=0?'+':''}{h.pnlPct.toFixed(2)}%
                    </p>
                  </td>
                  <td className="p-4">
                    <button onClick={() => remove(h.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pie chart */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Allocation</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip
                contentStyle={{ background:'#0f1a2e', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, fontSize:12 }}
                formatter={v => [`$${fmt(v)}`,'Value']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {enriched.map((h, i) => (
              <div key={h.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i%COLORS.length] }} />
                  <span className="text-slate-300">{h.symbol}</span>
                </div>
                <span className="text-slate-400">{((h.curVal/totalValue)*100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
