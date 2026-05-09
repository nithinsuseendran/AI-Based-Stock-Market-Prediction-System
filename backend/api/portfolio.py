"""
Portfolio management router (MongoDB-backed).
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from database.connection import get_db
import yfinance as yf

router = APIRouter()


class PositionAdd(BaseModel):
    symbol:   str
    quantity: float
    avgPrice: float


@router.get("")
async def get_portfolio():
    """Get all portfolio holdings (demo returns sample data)."""
    return {
        "holdings": [
            {"symbol":"AAPL",  "name":"Apple Inc.",      "quantity":10, "avgPrice":170.5},
            {"symbol":"NVDA",  "name":"NVIDIA Corp.",     "quantity":5,  "avgPrice":820.0},
            {"symbol":"TSLA",  "name":"Tesla Inc.",       "quantity":8,  "avgPrice":180.0},
            {"symbol":"GOOGL", "name":"Alphabet Inc.",    "quantity":6,  "avgPrice":165.0},
        ]
    }


@router.post("")
async def add_position(body: PositionAdd):
    """Add a position to the portfolio."""
    return {"message": "Position added", "symbol": body.symbol.upper()}


@router.delete("/{position_id}")
async def remove_position(position_id: str):
    """Remove a position."""
    return {"message": "Position removed", "id": position_id}


@router.get("/summary")
async def portfolio_summary():
    """Portfolio summary with current prices."""
    holdings = [
        {"symbol":"AAPL",  "quantity":10, "avgPrice":170.5},
        {"symbol":"NVDA",  "quantity":5,  "avgPrice":820.0},
        {"symbol":"TSLA",  "quantity":8,  "avgPrice":180.0},
        {"symbol":"GOOGL", "quantity":6,  "avgPrice":165.0},
    ]
    total_value   = 0
    total_cost    = 0
    enriched = []

    for h in holdings:
        try:
            hist = yf.download(h["symbol"], period="1d", interval="1d", progress=False)
            cur  = float(hist["Close"].iloc[-1]) if not hist.empty else h["avgPrice"]
        except:
            cur = h["avgPrice"]

        cur_val  = cur * h["quantity"]
        cost_val = h["avgPrice"] * h["quantity"]
        total_value += cur_val
        total_cost  += cost_val
        enriched.append({**h, "currentPrice": round(cur,2), "currentValue": round(cur_val,2), "pnl": round(cur_val-cost_val,2)})

    return {
        "holdings":      enriched,
        "totalValue":    round(total_value, 2),
        "totalCost":     round(total_cost,  2),
        "totalPnL":      round(total_value - total_cost, 2),
        "totalPnLPct":   round((total_value - total_cost) / total_cost * 100, 2) if total_cost else 0,
    }
