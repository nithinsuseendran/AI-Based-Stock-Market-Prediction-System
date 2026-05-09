"""
Stock market data router using yFinance.
All endpoints return JSON-serializable data.
"""
from fastapi import APIRouter, HTTPException, Query
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta

router = APIRouter()

PERIOD_MAP = {
    "1W": ("7d",  "1d"),
    "1M": ("1mo", "1d"),
    "3M": ("3mo", "1d"),
    "6M": ("6mo", "1d"),
    "1Y": ("1y",  "1wk"),
    "5Y": ("5y",  "1mo"),
}


def _safe_val(v):
    """Convert numpy/pandas values to JSON-safe Python types."""
    if pd.isna(v): return None
    if hasattr(v, 'item'): return v.item()
    return v


@router.get("/quote/{symbol}")
async def get_quote(symbol: str):
    """Real-time stock quote."""
    try:
        t    = yf.Ticker(symbol.upper())
        info = t.fast_info
        hist = t.history(period="2d")
        if hist.empty:
            raise HTTPException(404, detail=f"No data for {symbol}")

        cur   = hist["Close"].iloc[-1]
        prev  = hist["Close"].iloc[0]
        chg   = cur - prev
        chgPct= (chg / prev) * 100

        return {
            "symbol":      symbol.upper(),
            "price":       round(float(cur), 2),
            "change":      round(float(chg), 2),
            "changePct":   round(float(chgPct), 2),
            "high":        round(float(hist["High"].iloc[-1]), 2),
            "low":         round(float(hist["Low"].iloc[-1]),  2),
            "volume":      int(hist["Volume"].iloc[-1]),
            "marketCap":   _safe_val(getattr(info, "market_cap", None)),
            "timestamp":   datetime.utcnow().isoformat(),
        }
    except Exception as e:
        raise HTTPException(500, detail=str(e))


@router.get("/history/{symbol}")
async def get_history(symbol: str, period: str = Query("3M")):
    """OHLCV history for charting."""
    try:
        yf_period, interval = PERIOD_MAP.get(period, ("3mo", "1d"))
        hist = yf.download(symbol.upper(), period=yf_period, interval=interval, progress=False)
        if hist.empty:
            raise HTTPException(404, detail=f"No history for {symbol}")

        records = []
        for idx, row in hist.iterrows():
            records.append({
                "date":   str(idx.date()),
                "open":   round(float(row["Open"]),   2),
                "high":   round(float(row["High"]),   2),
                "low":    round(float(row["Low"]),    2),
                "close":  round(float(row["Close"]),  2),
                "volume": int(row["Volume"]),
            })
        return {"symbol": symbol.upper(), "period": period, "data": records}
    except Exception as e:
        raise HTTPException(500, detail=str(e))


@router.get("/overview/{symbol}")
async def get_overview(symbol: str):
    """Company overview and fundamentals."""
    try:
        info = yf.Ticker(symbol.upper()).info
        return {
            "symbol":      symbol.upper(),
            "name":        info.get("longName"),
            "sector":      info.get("sector"),
            "industry":    info.get("industry"),
            "description": info.get("longBusinessSummary", "")[:500],
            "website":     info.get("website"),
            "employees":   info.get("fullTimeEmployees"),
            "country":     info.get("country"),
            "exchange":    info.get("exchange"),
            "currency":    info.get("currency"),
            "marketCap":   info.get("marketCap"),
            "pe":          info.get("trailingPE"),
            "eps":         info.get("trailingEps"),
            "dividendYield": info.get("dividendYield"),
            "52wHigh":     info.get("fiftyTwoWeekHigh"),
            "52wLow":      info.get("fiftyTwoWeekLow"),
            "avgVolume":   info.get("averageVolume"),
        }
    except Exception as e:
        raise HTTPException(500, detail=str(e))


@router.get("/search")
async def search_stocks(q: str = Query(..., min_length=1)):
    """Quick symbol search using yFinance ticker lookup."""
    symbols = [
        {"symbol": "AAPL",        "name": "Apple Inc.",                 "exchange": "NASDAQ"},
        {"symbol": "TSLA",        "name": "Tesla, Inc.",                "exchange": "NASDAQ"},
        {"symbol": "NVDA",        "name": "NVIDIA Corporation",         "exchange": "NASDAQ"},
        {"symbol": "GOOGL",       "name": "Alphabet Inc.",              "exchange": "NASDAQ"},
        {"symbol": "AMZN",        "name": "Amazon.com, Inc.",           "exchange": "NASDAQ"},
        {"symbol": "MSFT",        "name": "Microsoft Corporation",      "exchange": "NASDAQ"},
        {"symbol": "META",        "name": "Meta Platforms, Inc.",       "exchange": "NASDAQ"},
        {"symbol": "RELIANCE.NS", "name": "Reliance Industries",        "exchange": "NSE"},
        {"symbol": "TCS.NS",      "name": "Tata Consultancy Services",  "exchange": "NSE"},
        {"symbol": "INFY.NS",     "name": "Infosys Limited",            "exchange": "NSE"},
        {"symbol": "AMD",         "name": "Advanced Micro Devices",     "exchange": "NASDAQ"},
        {"symbol": "INTC",        "name": "Intel Corporation",          "exchange": "NASDAQ"},
        {"symbol": "JPM",         "name": "JPMorgan Chase & Co.",       "exchange": "NYSE"},
        {"symbol": "BRK-B",       "name": "Berkshire Hathaway",         "exchange": "NYSE"},
    ]
    q_up = q.upper()
    return [s for s in symbols if q_up in s["symbol"] or q_up in s["name"].upper()]


@router.get("/market")
async def market_overview():
    """Major index overview (S&P 500, NASDAQ, DOW, VIX)."""
    indices = {"^GSPC": "sp500", "^IXIC": "nasdaq", "^DJI": "dow", "^VIX": "vix"}
    result  = {}
    for ticker, key in indices.items():
        try:
            hist = yf.download(ticker, period="2d", interval="1d", progress=False)
            if not hist.empty:
                cur  = float(hist["Close"].iloc[-1])
                prev = float(hist["Close"].iloc[0])
                chg  = cur - prev
                pct  = (chg / prev) * 100
                result[key] = {"value": round(cur,2), "change": round(chg,2), "pct": round(pct,2)}
        except:
            pass
    return result


@router.get("/gainers")
async def top_gainers():
    symbols = ["NVDA","TSLA","AMD","PLTR","COIN","MSTR","SMCI","ARM"]
    return await _batch_quote(symbols)


@router.get("/losers")
async def top_losers():
    symbols = ["INTC","BIDU","NIO","SNAP","LYFT","F","GM","AAL"]
    return await _batch_quote(symbols)


async def _batch_quote(symbols):
    result = []
    for sym in symbols:
        try:
            hist = yf.download(sym, period="2d", interval="1d", progress=False)
            if not hist.empty:
                cur  = float(hist["Close"].iloc[-1])
                prev = float(hist["Close"].iloc[0])
                chg  = cur - prev
                pct  = (chg / prev) * 100
                result.append({"symbol": sym, "price": round(cur,2), "change": round(chg,2), "pct": round(pct,2)})
        except:
            pass
    result.sort(key=lambda x: x.get("pct", 0), reverse=True)
    return result[:5]
