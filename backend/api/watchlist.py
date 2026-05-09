from fastapi import APIRouter
router = APIRouter()

@router.get("")
async def get_watchlist():
    return {"watchlist": ["AAPL","NVDA","TSLA","GOOGL"]}

@router.post("")
async def add_to_watchlist(data: dict):
    return {"message": "Added", "symbol": data.get("symbol")}

@router.delete("/{symbol}")
async def remove_from_watchlist(symbol: str):
    return {"message": "Removed", "symbol": symbol}
