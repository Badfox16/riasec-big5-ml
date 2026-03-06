"""
Schemas Pydantic para a API RIASEC Vocacional.
"""
from __future__ import annotations

from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Escala Likert 1‑5
# ---------------------------------------------------------------------------
Likert5 = int  # validação feita nos campos individuais com ge=1, le=5


class RiasecInput(BaseModel):
    """Input com 18 itens RIASEC (3 por dimensão) + demográficos básicos."""

    # ─── Realistic (R) ───────────────────────────────────────────────────────
    R2: Likert5 = Field(..., ge=1, le=5, description="Assentar tijolos ou azulejos")
    R4: Likert5 = Field(..., ge=1, le=5, description="Montar componentes eletrónicos")
    R6: Likert5 = Field(..., ge=1, le=5, description="Reparar uma torneira avariada")

    # ─── Investigative (I) ───────────────────────────────────────────────────
    I1: Likert5 = Field(..., ge=1, le=5, description="Estudar a estrutura do corpo humano")
    I4: Likert5 = Field(..., ge=1, le=5, description="Desenvolver um novo tratamento médico")
    I7: Likert5 = Field(..., ge=1, le=5, description="Trabalhar num laboratório de biologia")

    # ─── Artistic (A) ────────────────────────────────────────────────────────
    A2: Likert5 = Field(..., ge=1, le=5, description="Dirigir uma peça de teatro")
    A4: Likert5 = Field(..., ge=1, le=5, description="Compor uma música")
    A6: Likert5 = Field(..., ge=1, le=5, description="Tocar um instrumento musical")

    # ─── Social (S) ──────────────────────────────────────────────────────────
    S1: Likert5 = Field(..., ge=1, le=5, description="Dar orientação de carreira às pessoas")
    S5: Likert5 = Field(..., ge=1, le=5, description="Ajudar pessoas com problemas familiares")
    S7: Likert5 = Field(..., ge=1, le=5, description="Ensinar crianças a ler")

    # ─── Enterprising (E) ────────────────────────────────────────────────────
    E3: Likert5 = Field(..., ge=1, le=5, description="Gerir as operações de um hotel")
    E5: Likert5 = Field(..., ge=1, le=5, description="Dirigir um departamento numa grande empresa")
    E7: Likert5 = Field(..., ge=1, le=5, description="Vender imóveis")

    # ─── Conventional (C) ────────────────────────────────────────────────────
    C1: Likert5 = Field(..., ge=1, le=5, description="Gerar folhas de pagamento mensais")
    C4: Likert5 = Field(..., ge=1, le=5, description="Manter registos de funcionários")
    C5: Likert5 = Field(..., ge=1, le=5, description="Calcular e registar dados estatísticos e numéricos")

    # ─── Demográficos (opcionais) ─────────────────────────────────────────────
    age: int | None = Field(
        default=25, ge=13, le=100,
        description="Idade em anos (13‑100)"
    )
    gender: int | None = Field(
        default=1,
        description="Género: 1=Masculino, 2=Feminino, 3=Outro"
    )
    education: int | None = Field(
        default=3,
        description="Educação: 1=Menos que HS, 2=HS, 3=Licenciatura, 4=Pós-graduação"
    )

    model_config = {"json_schema_extra": {
        "example": {
            "R2": 3, "R4": 2, "R6": 3,
            "I1": 4, "I4": 4, "I7": 4,
            "A2": 2, "A4": 2, "A6": 3,
            "S1": 4, "S5": 4, "S7": 3,
            "E3": 3, "E5": 3, "E7": 2,
            "C1": 3, "C4": 3, "C5": 4,
            "age": 22, "gender": 1, "education": 3,
        }
    }}


# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------

class DimensionScore(BaseModel):
    dimension: str
    letter: str
    score: float = Field(..., description="Média dos 8 itens (1‑5)")
    description: str


class Big5Prediction(BaseModel):
    extraversion: float
    agreeableness: float
    conscientiousness: float
    neuroticism: float
    openness: float


class CareerSuggestion(BaseModel):
    titulo: str
    descricao: str


class PredictionResponse(BaseModel):
    holland_code: str = Field(..., description="Código Holland de 3 letras (ex: ISA)")
    riasec_scores: list[DimensionScore]
    big5: Big5Prediction
    careers: list[CareerSuggestion]
    nota: str = Field(
        default=(
            "Previsão orientativa com base numa amostra de 145 k respondentes. "
            "Consulte um psicólogo vocacional para uma avaliação completa."
        )
    )


# ---------------------------------------------------------------------------
# Perguntas (para GET /questions)
# ---------------------------------------------------------------------------

class Question(BaseModel):
    id: int
    code: str = Field(..., description="Código do item no dataset (ex: R2)")
    dimension: str = Field(..., description="Letra da dimensão RIASEC")
    dimension_name: str
    text: str
    scale_min: int = 1
    scale_max: int = 5
    scale_labels: dict[int, str] = {
        1: "Não gostaria nada",
        2: "Não gostaria",
        3: "Neutro",
        4: "Gostaria",
        5: "Gostaria muito",
    }
