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
    """Input com 30 itens RIASEC (5 por dimensão) + demográficos básicos."""

    # ─── Realistic (R) ───────────────────────────────────────────────────────
    R1: Likert5 = Field(..., ge=1, le=5, description="Verificar a qualidade de peças antes da expedição")
    R2: Likert5 = Field(..., ge=1, le=5, description="Assentar tijolos ou azulejos")
    R4: Likert5 = Field(..., ge=1, le=5, description="Montar componentes eletrónicos")
    R6: Likert5 = Field(..., ge=1, le=5, description="Reparar uma torneira avariada")
    R8: Likert5 = Field(..., ge=1, le=5, description="Instalar pavimento em casas")

    # ─── Investigative (I) ───────────────────────────────────────────────────
    I1: Likert5 = Field(..., ge=1, le=5, description="Estudar a estrutura do corpo humano")
    I2: Likert5 = Field(..., ge=1, le=5, description="Estudar o comportamento animal")
    I4: Likert5 = Field(..., ge=1, le=5, description="Desenvolver um novo tratamento médico")
    I5: Likert5 = Field(..., ge=1, le=5, description="Conduzir investigação biológica")
    I7: Likert5 = Field(..., ge=1, le=5, description="Trabalhar num laboratório de biologia")

    # ─── Artistic (A) ────────────────────────────────────────────────────────
    A2: Likert5 = Field(..., ge=1, le=5, description="Dirigir uma peça de teatro")
    A3: Likert5 = Field(..., ge=1, le=5, description="Criar ilustrações para revistas")
    A4: Likert5 = Field(..., ge=1, le=5, description="Compor uma música")
    A5: Likert5 = Field(..., ge=1, le=5, description="Escrever livros ou peças de teatro")
    A6: Likert5 = Field(..., ge=1, le=5, description="Tocar um instrumento musical")

    # ─── Social (S) ──────────────────────────────────────────────────────────
    S1: Likert5 = Field(..., ge=1, le=5, description="Dar orientação de carreira às pessoas")
    S2: Likert5 = Field(..., ge=1, le=5, description="Fazer voluntariado numa organização sem fins lucrativos")
    S5: Likert5 = Field(..., ge=1, le=5, description="Ajudar pessoas com problemas familiares")
    S7: Likert5 = Field(..., ge=1, le=5, description="Ensinar crianças a ler")
    S8: Likert5 = Field(..., ge=1, le=5, description="Ajudar idosos nas suas atividades diárias")

    # ─── Enterprising (E) ────────────────────────────────────────────────────
    E1: Likert5 = Field(..., ge=1, le=5, description="Vender franchisings de restaurantes")
    E3: Likert5 = Field(..., ge=1, le=5, description="Gerir as operações de um hotel")
    E5: Likert5 = Field(..., ge=1, le=5, description="Dirigir um departamento numa grande empresa")
    E6: Likert5 = Field(..., ge=1, le=5, description="Gerir uma loja de roupa")
    E7: Likert5 = Field(..., ge=1, le=5, description="Vender imóveis")

    # ─── Conventional (C) ────────────────────────────────────────────────────
    C1: Likert5 = Field(..., ge=1, le=5, description="Gerar folhas de pagamento mensais")
    C2: Likert5 = Field(..., ge=1, le=5, description="Fazer inventário de materiais com computador portátil")
    C4: Likert5 = Field(..., ge=1, le=5, description="Manter registos de funcionários")
    C5: Likert5 = Field(..., ge=1, le=5, description="Calcular e registar dados estatísticos e numéricos")
    C7: Likert5 = Field(..., ge=1, le=5, description="Tratar de transações bancárias de clientes")

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
            "R1": 2, "R2": 3, "R4": 2, "R6": 3, "R8": 2,
            "I1": 4, "I2": 4, "I4": 4, "I5": 5, "I7": 4,
            "A2": 2, "A3": 3, "A4": 2, "A5": 3, "A6": 3,
            "S1": 4, "S2": 4, "S5": 4, "S7": 3, "S8": 3,
            "E1": 2, "E3": 3, "E5": 3, "E6": 2, "E7": 2,
            "C1": 3, "C2": 3, "C4": 3, "C5": 4, "C7": 4,
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
