/**
 * Mock data used when the backend is unavailable.
 * All values are realistic-looking demo data.
 */

export const POPULAR_STOCKS = [
  { symbol: 'AAPL',    name: 'Apple Inc.',              sector: 'Technology',    exchange: 'NASDAQ' },
  { symbol: 'TSLA',    name: 'Tesla, Inc.',             sector: 'Automotive',    exchange: 'NASDAQ' },
  { symbol: 'NVDA',    name: 'NVIDIA Corporation',      sector: 'Technology',    exchange: 'NASDAQ' },
  { symbol: 'GOOGL',   name: 'Alphabet Inc.',           sector: 'Technology',    exchange: 'NASDAQ' },
  { symbol: 'AMZN',    name: 'Amazon.com, Inc.',        sector: 'E-Commerce',    exchange: 'NASDAQ' },
  { symbol: 'MSFT',    name: 'Microsoft Corporation',   sector: 'Technology',    exchange: 'NASDAQ' },
  { symbol: 'META',    name: 'Meta Platforms, Inc.',    sector: 'Social Media',  exchange: 'NASDAQ' },
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries',sector: 'Conglomerate',  exchange: 'NSE'    },
  { symbol: 'TCS.NS',  name: 'Tata Consultancy Services',sector:'IT Services',  exchange: 'NSE'    },
  { symbol: 'INFY.NS', name: 'Infosys Limited',         sector: 'IT Services',  exchange: 'NSE'    },
]

export const MOCK_MARKET_OVERVIEW = {
  sp500:  { value: 5247.34, change: 12.45, pct: 0.24 },
  nasdaq: { value: 16431.2, change: -23.1, pct: -0.14 },
  dow:    { value: 38765.9, change: 87.3,  pct: 0.23  },
  vix:    { value: 14.23,   change: -0.87, pct: -5.76 },
}

export const MOCK_GAINERS = [
  { symbol:'NVDA',  name:'NVIDIA',   price:875.32, change:42.1,  pct:5.05 },
  { symbol:'TSLA',  name:'Tesla',    price:193.57, change:8.23,  pct:4.44 },
  { symbol:'AMD',   name:'AMD',      price:164.21, change:5.67,  pct:3.57 },
  { symbol:'PLTR',  name:'Palantir', price:22.48,  change:0.72,  pct:3.31 },
  { symbol:'COIN',  name:'Coinbase', price:208.73, change:6.45,  pct:3.18 },
]

export const MOCK_LOSERS = [
  { symbol:'INTC', name:'Intel',     price:31.24,  change:-2.45, pct:-7.27 },
  { symbol:'BIDU', name:'Baidu',     price:98.32,  change:-5.12, pct:-4.95 },
  { symbol:'NIO',  name:'NIO Inc.',  price:4.87,   change:-0.23, pct:-4.51 },
  { symbol:'SNAP', name:'Snap Inc.', price:10.54,  change:-0.48, pct:-4.36 },
  { symbol:'LYFT', name:'Lyft',      price:13.98,  change:-0.61, pct:-4.18 },
]

export const HEATMAP_DATA = [
  { sector:'Technology',   symbols:['AAPL','MSFT','NVDA','GOOGL','META'], changes:[1.2,-0.4,5.1,0.8,-1.2] },
  { sector:'Finance',      symbols:['JPM','BAC','GS','MS','WFC'],         changes:[-0.3,0.7,-0.9,0.2,1.1] },
  { sector:'Healthcare',   symbols:['JNJ','PFE','MRK','ABT','UNH'],       changes:[0.5,-1.3,0.8,-0.2,1.4] },
  { sector:'Energy',       symbols:['XOM','CVX','COP','SLB','EOG'],       changes:[2.1,1.8,-0.4,0.9,1.3] },
  { sector:'Consumer',     symbols:['AMZN','WMT','COST','HD','MCD'],      changes:[-0.7,0.3,1.1,-0.5,0.6] },
]

/**
 * Generate a realistic-looking price series for a given stock.
 * Used in demo mode when backend is unavailable.
 */
export function generatePriceSeries(startPrice, days = 90, volatility = 0.02) {
  const series = []
  let price = startPrice
  const now  = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    const change = (Math.random() - 0.48) * volatility * price
    price = Math.max(price + change, 1)

    const open  = price
    const close = price * (1 + (Math.random() - 0.5) * 0.01)
    const high  = Math.max(open, close) * (1 + Math.random() * 0.005)
    const low   = Math.min(open, close) * (1 - Math.random() * 0.005)

    series.push({
      date:   date.toISOString().split('T')[0],
      open:   +open.toFixed(2),
      high:   +high.toFixed(2),
      low:    +low.toFixed(2),
      close:  +close.toFixed(2),
      volume: Math.floor(Math.random() * 50_000_000 + 10_000_000),
    })
  }
  return series
}

export const MOCK_STOCK_PRICES = {
  AAPL:  185.0,
  TSLA:  193.0,
  NVDA:  875.0,
  GOOGL: 175.0,
  AMZN:  184.0,
  MSFT:  420.0,
  META:  510.0,
}

export const MOCK_NEWS = [
  {
    id:1, title:'NVIDIA Surpasses $2 Trillion Market Cap on AI Demand',
    source:'Bloomberg', time:'2h ago', sentiment:'positive',
    summary:'NVIDIA shares climbed 5% after reporting record quarterly earnings driven by data center AI chip demand.',
    url:'#', symbol:'NVDA',
  },
  {
    id:2, title:'Apple Vision Pro Sales Disappoint in First Quarter',
    source:'Reuters',   time:'4h ago', sentiment:'negative',
    summary:'Apple\'s mixed-reality headset sold only 200k units, well below analyst expectations of 800k.',
    url:'#', symbol:'AAPL',
  },
  {
    id:3, title:'Tesla Cuts Prices Again Amid Growing EV Competition',
    source:'CNBC',      time:'6h ago', sentiment:'negative',
    summary:'Tesla reduced prices in key markets by up to 8% as competition from Chinese EV makers intensifies.',
    url:'#', symbol:'TSLA',
  },
  {
    id:4, title:'Amazon AWS Revenue Beats Expectations in Q1 2025',
    source:'WSJ',       time:'8h ago', sentiment:'positive',
    summary:'Amazon Web Services revenue grew 17% year-over-year, significantly beating Wall Street estimates.',
    url:'#', symbol:'AMZN',
  },
  {
    id:5, title:'Federal Reserve Holds Interest Rates Steady',
    source:'FT',        time:'10h ago', sentiment:'neutral',
    summary:'The Fed maintained its benchmark rate at 5.25%–5.5%, signaling a cautious approach to rate cuts.',
    url:'#', symbol:null,
  },
]
