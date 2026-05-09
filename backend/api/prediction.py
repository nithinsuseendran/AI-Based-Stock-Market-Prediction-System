"""
AI Prediction router — LSTM + ML models via scikit-learn.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import numpy as np
import yfinance as yf
from ml_models.predictor import StockPredictor

router    = APIRouter()
predictor = StockPredictor()


class PredictRequest(BaseModel):
    symbol:  str
    horizon: int   = 14    # days to predict
    model:   str   = "lstm" # "lstm" | "random_forest" | "linear"


@router.post("")
async def predict(body: PredictRequest):
    """Run an AI prediction for a given symbol."""
    symbol  = body.symbol.upper()
    horizon = max(1, min(body.horizon, 90))

    try:
        hist = yf.download(symbol, period="2y", interval="1d", progress=False)
        if hist.empty or len(hist) < 60:
            raise HTTPException(404, detail=f"Insufficient data for {symbol}")

        prices = hist["Close"].values.flatten()
        result = predictor.predict(prices, horizon=horizon, model=body.model)

        last_price = float(prices[-1])
        last_pred  = float(result["predictions"][-1])
        change_pct = (last_pred - last_price) / last_price * 100

        return {
            "symbol":     symbol,
            "model":      body.model,
            "horizon":    horizon,
            "lastPrice":  round(last_price, 2),
            "targetPrice": round(last_pred, 2),
            "changePct":  round(change_pct, 2),
            "confidence": round(result["confidence"], 1),
            "predictions": [round(p, 2) for p in result["predictions"]],
            "upper":       [round(p, 2) for p in result["upper"]],
            "lower":       [round(p, 2) for p in result["lower"]],
            "signal":      "bullish" if change_pct > 0 else "bearish",
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, detail=str(e))


@router.get("/history/{symbol}")
async def prediction_history(symbol: str):
    """Returns past predictions from DB (stub)."""
    return {"symbol": symbol.upper(), "history": []}
