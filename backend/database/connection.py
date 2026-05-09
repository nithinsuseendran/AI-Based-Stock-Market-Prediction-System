"""
MongoDB async connection using motor.
"""
import os
import motor.motor_asyncio

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME   = os.getenv("DB_NAME",   "stockai")

_client: motor.motor_asyncio.AsyncIOMotorClient = None
_db     = None


async def get_db():
    global _client, _db
    if _db is None:
        _client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
        _db     = _client[DB_NAME]
    return _db


async def close_db():
    global _client
    if _client:
        _client.close()
        _client = None
