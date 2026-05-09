"""
Authentication router — JWT-based login and registration with MongoDB.
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from jose import jwt
import bcrypt
import os
from database.connection import get_db

router = APIRouter()

SECRET_KEY = os.getenv("JWT_SECRET", "stockai-super-secret-key-change-in-production")
ALGORITHM  = "HS256"
TOKEN_EXPIRE_HOURS = 24 * 7  # 7 days


# ── Schemas ────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    name:     str
    email:    EmailStr
    password: str

class LoginRequest(BaseModel):
    email:    EmailStr
    password: str


# ── Helpers ────────────────────────────────────────────────────────
def create_token(user_id: str, name: str, email: str) -> str:
    payload = {
        "sub":   str(user_id),
        "name":  name,
        "email": email,
        "exp":   datetime.utcnow() + timedelta(hours=TOKEN_EXPIRE_HOURS),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()


def verify_password(pw: str, hashed: str) -> bool:
    return bcrypt.checkpw(pw.encode(), hashed.encode())


# ── Routes ─────────────────────────────────────────────────────────
@router.post("/register")
async def register(body: RegisterRequest):
    db = await get_db()
    if await db.users.find_one({"email": body.email}):
        raise HTTPException(400, detail="Email already registered")

    user_doc = {
        "name":       body.name,
        "email":      body.email,
        "password":   hash_password(body.password),
        "created_at": datetime.utcnow(),
        "portfolio":  [],
        "watchlist":  [],
    }
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    token   = create_token(user_id, body.name, body.email)
    return {
        "token": token,
        "user": {"id": user_id, "name": body.name, "email": body.email},
    }


@router.post("/login")
async def login(body: LoginRequest):
    db   = await get_db()
    user = await db.users.find_one({"email": body.email})
    if not user or not verify_password(body.password, user["password"]):
        raise HTTPException(401, detail="Invalid credentials")

    user_id = str(user["_id"])
    token   = create_token(user_id, user["name"], user["email"])
    return {
        "token": token,
        "user": {"id": user_id, "name": user["name"], "email": user["email"]},
    }


@router.get("/me")
async def get_me():
    """Returns the authenticated user's profile (JWT validated by middleware)."""
    return {"message": "Implement with JWT dependency injection"}
