import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import PredictionPage from './pages/PredictionPage'
import PortfolioPage from './pages/PortfolioPage'
import NewsPage from './pages/NewsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AboutPage from './pages/AboutPage'
import StockDetailPage from './pages/StockDetailPage'
import './index.css'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0a1628',
                color: '#e2e8f0',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
              },
            }}
          />
          <Routes>
            {/* Public */}
            <Route path="/"         element={<HomePage />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about"    element={<AboutPage />} />

            {/* Protected — wrapped in sidebar layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard"          element={<DashboardPage />} />
                <Route path="/stock/:symbol"      element={<StockDetailPage />} />
                <Route path="/prediction"         element={<PredictionPage />} />
                <Route path="/portfolio"          element={<PortfolioPage />} />
                <Route path="/news"               element={<NewsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
