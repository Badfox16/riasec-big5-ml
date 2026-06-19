from __future__ import annotations

from pydantic import BaseModel

from ..schemas import Big5Prediction, CareerSuggestion, CourseRecommendation, DimensionScore


class ExamCreateRequest(BaseModel):
    holland_code:  str
    riasec_scores: list[DimensionScore]
    big5:          Big5Prediction
    careers:       list[CareerSuggestion]
    courses:       list[CourseRecommendation]
    nota:          str = ""
    age:       int | None = None
    gender:    int | None = None
    education: int | None = None
    provincia:     str | None = None
    cidade:        str | None = None
    tipo_escola:   str | None = None
    classe_actual: str | None = None
    faixa_etaria:  str | None = None


class ExamOut(BaseModel):
    id:            int
    date:          str
    holland_code:  str
    riasec_scores: list[DimensionScore]
    big5:          Big5Prediction
    careers:       list[CareerSuggestion]
    courses:       list[CourseRecommendation]
    nota:          str
    age:       int | None = None
    gender:    int | None = None
    education: int | None = None
    provincia:     str | None = None
    cidade:        str | None = None
    tipo_escola:   str | None = None
    classe_actual: str | None = None
    faixa_etaria:  str | None = None
