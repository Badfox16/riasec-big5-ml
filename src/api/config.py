from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url:        str = "sqlite:///./riasec.db"
    secret_key:          str = "change-me-in-production"
    jwt_algorithm:       str = "HS256"
    jwt_expire_days:     int = 7
    allowed_origins_str: str = "*"

    model_config = {"env_file": ".env.local", "env_file_encoding": "utf-8"}

    @property
    def allowed_origins(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins_str.split(",") if o.strip()]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
