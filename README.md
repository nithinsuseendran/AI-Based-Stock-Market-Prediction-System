# 🤖 AI-Based Stock Market Prediction System

A full-stack AI-powered stock market prediction platform with a premium fintech dashboard.

![Dashboard](docs/dashboard.png)

## 🚀 Features

- **AI Predictions** — LSTM Neural Network, Random Forest, Linear Regression models
- **Real-Time Data** — Live stock quotes via yFinance API (AAPL, TSLA, NVDA, GOOGL, AMZN, Reliance, TCS, Infosys & more)
- **Market Dashboard** — Interactive charts, top gainers/losers, market indices
- **Portfolio Tracker** — Track holdings, P&L, and asset allocation
- **News Sentiment** — Curated financial news with AI sentiment analysis
- **Authentication** — JWT-based login/register with demo mode
- **Dark/Light Mode** — Premium fintech-inspired UI

## 🛠 Tech Stack

| Layer     | Technology                                     |
|-----------|------------------------------------------------|
| Frontend  | React 18 + Vite, Tailwind CSS, Framer Motion, Recharts |
| Backend   | Python FastAPI, yFinance, scikit-learn         |
| Database  | MongoDB (via Motor async driver)               |
| Auth      | JWT + bcrypt                                   |
| ML        | LSTM (simulation), Random Forest, Linear Regression |

## 📦 Project Structure

```
AI-Based Stock Market Prediction System/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── pages/             # Dashboard, Prediction, Portfolio, News, etc.
│   │   ├── components/        # Layout, ProtectedRoute
│   │   ├── context/           # Auth & Theme context
│   │   ├── services/          # Axios API layer
│   │   └── data/              # Mock data for demo mode
│   └── tailwind.config.js
├── backend/                   # FastAPI backend
│   ├── api/                   # Route handlers (auth, stocks, prediction, etc.)
│   ├── database/              # MongoDB connection
│   ├── ml_models/             # Prediction engine
│   ├── main.py                # FastAPI entry point
│   └── requirements.txt
└── docs/                      # Documentation & screenshots
```

## ⚡ Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# API runs at http://localhost:8000
```

### Environment Variables
Create `backend/.env`:
```
MONGO_URI=mongodb://localhost:27017
DB_NAME=stockai
JWT_SECRET=your-secret-key
```

## 🎯 Demo Mode

The app works **fully without a backend**. Click **"Continue in Demo Mode"** on the login page to explore all features with realistic mock data.

## 📸 Screenshots

| Dashboard | AI Prediction |
|-----------|---------------|
| Market overview with live charts | LSTM/RF/LR forecast with confidence bands |

## 📄 License

MIT License — Built for educational purposes. Not financial advice.
