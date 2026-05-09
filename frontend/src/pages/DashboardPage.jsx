import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  TrendingUp, TrendingDown, Activity, DollarSign,
  ArrowUpRight, RefreshCw
} from 'lucide-react'
import {
  MOCK_MARKET_OVERVIEW, MOCK_GAINERS, MOCK_LOSERS,
  POPULAR_STOCKS, generatePriceSeries, MOCK_STOCK_PRICES
} from '../data/mockData'

/* ── helpers ── */
const fmt = n => typeof n === 'number' ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'
const fmtPct = n => (n > 0 ? '+' : '') + n.toFixed(2) + '%'

function StatCard({ label, value, change, pct, Icon }) {
  const up = pct >= 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-400 font-medium">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
          <Icon size={14} className="text-slate-300" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{fmt(value)}</p>
      <span className={`text-xs font-semibold ${up ? 'text-emerald-400' : 'text-red-400'}`}>
        {up ? '▲' : '▼'} {fmtPct(pct)}
      </span>
    </motion.div>
  )
}

function MiniChart({ data, color }) {
  return (
    <ResponsiveContainer width="100%" height={60}>
      <AreaChart data={data.slice(-30)}>
        <defs>
          <linearGradient id={`g-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="close" stroke={color} strokeWidth={1.5} fill={`url(#g-${color})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default function DashboardPage() {
  const [chartSymbol, setChartSymbol] = useState('AAPL')
  const [chartData, setChartData] = useState([])
  const [period, setPeriod] = useState('3M')
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const PERIODS = { '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365 }

  useEffect(() => {
    const price = MOCK_STOCK_PRICES[chartSymbol] || 150
    setChartData(generatePriceSeries(price, PERIODS[period]))
  }, [chartSymbol, period])

  const mkt = MOCK_MARKET_OVERVIEW
  const currentPrice = chartData[chartData.length - 1]?.close || 0
  const startPrice   = chartData[0]?.close || 0
  const priceChange  = currentPrice - startPrice
  const changePct    = startPrice ? (priceChange / startPrice) * 100 : 0
  const positive     = changePct >= 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Market Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => setLastUpdate(new Date())}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm transition-colors"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="S&P 500"   value={mkt.sp500.value}  pct={mkt.sp500.pct}  Icon={Activity}     />
        <StatCard label="NASDAQ"    value={mkt.nasdaq.value} pct={mkt.nasdaq.pct} Icon={TrendingUp}   />
        <StatCard label="DOW JONES" value={mkt.dow.value}    pct={mkt.dow.pct}    Icon={DollarSign}   />
        <StatCard label="VIX"       value={mkt.vix.value}    pct={mkt.vix.pct}    Icon={TrendingDown} />
      </div>

      {/* Main chart + sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          {/* Symbol selector */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {['AAPL','TSLA','NVDA','GOOGL','AMZN','MSFT'].map(sym => (
              <button
                key={sym}
                onClick={() => setChartSymbol(sym)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  chartSymbol === sym
                    ? 'bg-brand-600 text-white'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>

          {/* Price info */}
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-3xl font-bold text-white">${fmt(currentPrice)}</span>
            <span className={`text-sm font-semibold ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
              {positive ? '+' : ''}{fmt(priceChange)} ({fmtPct(changePct)})
            </span>
          </div>
          <p className="text-slate-500 text-xs mb-4">{chartSymbol} · {period} Performance</p>

          {/* Period tabs */}
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

          {/* Area chart */}
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={positive ? '#10b981' : '#ef4444'} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={positive ? '#10b981' : '#ef4444'} stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={d => d.slice(5)}
                interval={Math.floor(chartData.length / 6)}
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => `$${v.toFixed(0)}`}
                width={55}
              />
              <Tooltip
                contentStyle={{ background: '#0f1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: positive ? '#10b981' : '#ef4444' }}
                formatter={v => [`$${fmt(v)}`, 'Price']}
              />
              <Area
                type="monotone"
                dataKey="close"
                stroke={positive ? '#10b981' : '#ef4444'}
                strokeWidth={2}
                fill="url(#colorClose)"
                dot={false}
                activeDot={{ r: 4, fill: positive ? '#10b981' : '#ef4444' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gainers / Losers */}
        <div className="space-y-4">
          {/* Gainers */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp size={14} className="text-emerald-400" /> Top Gainers
            </h3>
            <div className="space-y-2">
              {MOCK_GAINERS.map(s => (
                <Link
                  key={s.symbol}
                  to={`/stock/${s.symbol}`}
                  className="flex items-center justify-between py-1.5 hover:opacity-80 transition-opacity"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{s.symbol}</p>
                    <p className="text-xs text-slate-500">${fmt(s.price)}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                    +{s.pct.toFixed(2)}%
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Losers */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingDown size={14} className="text-red-400" /> Top Losers
            </h3>
            <div className="space-y-2">
              {MOCK_LOSERS.map(s => (
                <Link
                  key={s.symbol}
                  to={`/stock/${s.symbol}`}
                  className="flex items-center justify-between py-1.5 hover:opacity-80 transition-opacity"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{s.symbol}</p>
                    <p className="text-xs text-slate-500">${fmt(s.price)}</p>
                  </div>
                  <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">
                    {s.pct.toFixed(2)}%
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Watchlist */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Popular Stocks</h3>
          <Link to="/prediction" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
            Run AI Prediction <ArrowUpRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {POPULAR_STOCKS.slice(0, 10).map(s => {
            const price  = MOCK_STOCK_PRICES[s.symbol] || 100
            const series = generatePriceSeries(price, 14)
            const pct    = ((series[series.length-1].close - series[0].close) / series[0].close) * 100
            const up     = pct >= 0
            return (
              <Link
                key={s.symbol}
                to={`/stock/${s.symbol}`}
                className="glass-card p-3 hover:border-brand-500/40 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">{s.symbol}</span>
                  <span className={`text-xs font-semibold ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                    {up ? '+' : ''}{pct.toFixed(1)}%
                  </span>
                </div>
                <MiniChart data={series} color={up ? '#10b981' : '#ef4444'} />
                <p className="text-xs text-slate-400 mt-1 truncate">{s.name}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
