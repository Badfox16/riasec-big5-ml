from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from ..db.database import get_db
from ..db.models import User
from .deps import get_current_user
from .jwt import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

_pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ── Schemas ───────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name:     str      = Field(..., min_length=2, max_length=120)
    email:    EmailStr
    password: str      = Field(..., min_length=6, max_length=128)


class LoginRequest(BaseModel):
    email:    EmailStr
    password: str


class UserOut(BaseModel):
    id:         int
    name:       str
    email:      str
    created_at: str

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    token: str
    user:  UserOut


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/register", response_model=TokenResponse, status_code=201)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=409, detail="Email já registado.")
    user = User(
        name=body.name,
        email=body.email,
        hashed_password=_pwd.hash(body.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return TokenResponse(
        token=create_access_token(user.id),
        user=UserOut(id=user.id, name=user.name, email=user.email,
                     created_at=user.created_at.isoformat()),
    )


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not _pwd.verify(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciais inválidas.")
    return TokenResponse(
        token=create_access_token(user.id),
        user=UserOut(id=user.id, name=user.name, email=user.email,
                     created_at=user.created_at.isoformat()),
    )


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return UserOut(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        created_at=current_user.created_at.isoformat(),
    )
