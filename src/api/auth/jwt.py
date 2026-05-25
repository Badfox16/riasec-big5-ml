from __future__ import annotations

from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt

from ..config import get_settings

settings = get_settings()


def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=settings.jwt_expire_days)
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> int:
    data = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
    sub = data.get("sub")
    if sub is None:
        raise JWTError("sub ausente")
    return int(sub)
