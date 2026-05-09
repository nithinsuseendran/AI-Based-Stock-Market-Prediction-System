/**
 * Centralized Axios API service layer.
 * All backend calls go through here so we can intercept tokens globally.
 */
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

/* ── Attach JWT to every request ── */
api.interceptors.request.use(config => {
  const token = localStorage.getItem('stockai_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/* ── Global error handling ── */
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('stockai_token')
      localStorage.removeItem('stockai_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

/* ────────────────────────────────────────────────────────────
   Auth Endpoints
──────────────────────────────────────────────────────────── */
export const authAPI = {
  login:    data => api.post('/api/auth/login',    data),
  register: data => api.post('/api/auth/register', data),
  profile:  ()   => api.get('/api/auth/me'),
}

/* ────────────────────────────────────────────────────────────
   Stock Endpoints
──────────────────────────────────────────────────────────── */
export const stockAPI = {
  getQuote:      symbol         => api.get(`/api/stocks/quote/${symbol}`),
  getHistory:    (symbol, period) => api.get(`/api/stocks/history/${symbol}?period=${period}`),
  getOverview:   symbol         => api.get(`/api/stocks/overview/${symbol}`),
  getMarketData: ()             => api.get('/api/stocks/market'),
  getGainers:    ()             => api.get('/api/stocks/gainers'),
  getLosers:     ()             => api.get('/api/stocks/losers'),
  search:        query          => api.get(`/api/stocks/search?q=${query}`),
  getHeatmap:    ()             => api.get('/api/stocks/heatmap'),
}

/* ────────────────────────────────────────────────────────────
   Prediction Endpoints
──────────────────────────────────────────────────────────── */
export const predictionAPI = {
  predict:    (symbol, horizon, model) =>
    api.post('/api/predict', { symbol, horizon, model }),
  getHistory: symbol => api.get(`/api/predict/history/${symbol}`),
}

/* ────────────────────────────────────────────────────────────
   Portfolio Endpoints
──────────────────────────────────────────────────────────── */
export const portfolioAPI = {
  getAll:  ()     => api.get('/api/portfolio'),
  add:     data   => api.post('/api/portfolio', data),
  remove:  id     => api.delete(`/api/portfolio/${id}`),
  getSummary: ()  => api.get('/api/portfolio/summary'),
}

/* ────────────────────────────────────────────────────────────
   Watchlist Endpoints
──────────────────────────────────────────────────────────── */
export const watchlistAPI = {
  getAll:  () => api.get('/api/watchlist'),
  add:     symbol => api.post('/api/watchlist', { symbol }),
  remove:  symbol => api.delete(`/api/watchlist/${symbol}`),
}

/* ────────────────────────────────────────────────────────────
   News Endpoints
──────────────────────────────────────────────────────────── */
export const newsAPI = {
  getAll:   (symbol) => api.get(`/api/news${symbol ? `?symbol=${symbol}` : ''}`),
  getSentiment: symbol => api.get(`/api/news/sentiment/${symbol}`),
}

export default api
