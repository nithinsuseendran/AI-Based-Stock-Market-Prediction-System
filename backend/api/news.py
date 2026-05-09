from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter()

NEWS_DB = [
    {"id":1, "title":"NVIDIA Surpasses $2 Trillion Market Cap on AI Demand", "source":"Bloomberg", "time":"2h ago", "sentiment":"positive", "summary":"NVIDIA shares climbed 5% on record quarterly earnings driven by data center AI chip demand.", "symbol":"NVDA"},
    {"id":2, "title":"Apple Vision Pro Sales Disappoint in First Quarter",    "source":"Reuters",   "time":"4h ago", "sentiment":"negative", "summary":"Apple's mixed-reality headset sold only 200k units, well below analyst expectations of 800k.", "symbol":"AAPL"},
    {"id":3, "title":"Tesla Cuts Prices Again Amid Growing EV Competition",    "source":"CNBC",      "time":"6h ago", "sentiment":"negative", "summary":"Tesla reduced prices in key markets by up to 8% as competition from Chinese EV makers intensifies.", "symbol":"TSLA"},
    {"id":4, "title":"Amazon AWS Revenue Beats Expectations in Q1 2025",       "source":"WSJ",       "time":"8h ago", "sentiment":"positive", "summary":"AWS revenue grew 17% year-over-year, significantly beating Wall Street estimates.", "symbol":"AMZN"},
    {"id":5, "title":"Federal Reserve Holds Interest Rates Steady",            "source":"FT",        "time":"10h ago","sentiment":"neutral",  "summary":"The Fed maintained its benchmark rate at 5.25%–5.5%, signaling a cautious approach.", "symbol":None},
    {"id":6, "title":"Microsoft Copilot AI Integration Boosts Enterprise Sales 35%", "source":"Bloomberg", "time":"12h ago","sentiment":"positive","summary":"Microsoft reports strong enterprise adoption of AI tools.", "symbol":"MSFT"},
    {"id":7, "title":"TCS Q4 Results Beat Street Expectations on Strong Deal Wins", "source":"Mint", "time":"1d ago", "sentiment":"positive","summary":"TCS reports 8.2% YoY growth in revenue amid strong deal pipeline exceeding $10B.", "symbol":"TCS.NS"},
]


@router.get("")
async def get_news(symbol: Optional[str] = Query(None)):
    if symbol:
        return [n for n in NEWS_DB if n.get("symbol") == symbol.upper() or n.get("symbol") is None]
    return NEWS_DB


@router.get("/sentiment/{symbol}")
async def get_sentiment(symbol: str):
    relevant = [n for n in NEWS_DB if n.get("symbol") == symbol.upper()]
    if not relevant:
        return {"symbol": symbol, "sentiment": "neutral", "score": 0}
    pos = sum(1 for n in relevant if n["sentiment"] == "positive")
    neg = sum(1 for n in relevant if n["sentiment"] == "negative")
    score = (pos - neg) / len(relevant)
    sentiment = "positive" if score > 0 else "negative" if score < 0 else "neutral"
    return {"symbol": symbol.upper(), "sentiment": sentiment, "score": round(score, 2), "articles": len(relevant)}
