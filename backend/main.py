"""
FastAPI backend for AI-Based Stock Market Prediction System.
Run with: uvicorn main:app --reload --port 8000
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import auth, stocks, prediction, portfolio, watchlist, news

app = FastAPI(
    title="StockAI Pro API",
    description="AI-powered stock market prediction backend",
    version="1.0.0",
)

# ── CORS ─────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────
app.include_router(auth.router,       prefix="/api/auth",      tags=["Auth"])
app.include_router(stocks.router,     prefix="/api/stocks",    tags=["Stocks"])
app.include_router(prediction.router, prefix="/api/predict",   tags=["Prediction"])
app.include_router(portfolio.router,  prefix="/api/portfolio", tags=["Portfolio"])
app.include_router(watchlist.router,  prefix="/api/watchlist", tags=["Watchlist"])
app.include_router(news.router,       prefix="/api/news",      tags=["News"])


@app.get("/")
def root():
    return {"message": "StockAI Pro API is running", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "ok"}
