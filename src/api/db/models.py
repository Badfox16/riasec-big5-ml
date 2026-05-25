from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id:              Mapped[int]      = mapped_column(Integer, primary_key=True, index=True)
    name:            Mapped[str]      = mapped_column(String(120), nullable=False)
    email:           Mapped[str]      = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str]      = mapped_column(String(255), nullable=False)
    created_at:      Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    exams: Mapped[list["ExamResult"]] = relationship(
        "ExamResult", back_populates="owner", cascade="all, delete-orphan"
    )


class ExamResult(Base):
    __tablename__ = "exam_results"

    id:          Mapped[int]      = mapped_column(Integer, primary_key=True, index=True)
    user_id:     Mapped[int]      = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    date:        Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    holland_code: Mapped[str]   = mapped_column(String(3), nullable=False)

    extraversion:      Mapped[float] = mapped_column(Float)
    agreeableness:     Mapped[float] = mapped_column(Float)
    conscientiousness: Mapped[float] = mapped_column(Float)
    neuroticism:       Mapped[float] = mapped_column(Float)
    openness:          Mapped[float] = mapped_column(Float)

    riasec_scores_json: Mapped[str] = mapped_column(Text, default="[]")
    careers_json:       Mapped[str] = mapped_column(Text, default="[]")
    courses_json:       Mapped[str] = mapped_column(Text, default="[]")
    nota:               Mapped[str] = mapped_column(Text, default="")

    age:       Mapped[int | None] = mapped_column(Integer, nullable=True)
    gender:    Mapped[int | None] = mapped_column(Integer, nullable=True)
    education: Mapped[int | None] = mapped_column(Integer, nullable=True)

    owner: Mapped["User"] = relationship("User", back_populates="exams")
