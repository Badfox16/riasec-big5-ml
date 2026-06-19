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
    """Input com 48 itens RIASEC (8 por dimensão) + demográficos básicos."""

    # ─── Realistic (R) ───────────────────────────────────────────────────────
    R1: Likert5 = Field(..., ge=1, le=5, description="Verificar a qualidade de peças antes da expedição")
    R2: Likert5 = Field(..., ge=1, le=5, description="Assentar tijolos ou azulejos")
    R3: Likert5 = Field(..., ge=1, le=5, description="Trabalhar num projeto de construção ao ar livre")
    R4: Likert5 = Field(..., ge=1, le=5, description="Montar componentes eletrónicos")
    R5: Likert5 = Field(..., ge=1, le=5, description="Conduzir um autocarro ou caminhão")
    R6: Likert5 = Field(..., ge=1, le=5, description="Reparar uma torneira avariada")
    R7: Likert5 = Field(..., ge=1, le=5, description="Reparar uma caldeira ou sistema de aquecimento")
    R8: Likert5 = Field(..., ge=1, le=5, description="Instalar pavimento em casas")

    # ─── Investigative (I) ───────────────────────────────────────────────────
    I1: Likert5 = Field(..., ge=1, le=5, description="Estudar a estrutura do corpo humano")
    I2: Likert5 = Field(..., ge=1, le=5, description="Estudar o comportamento animal")
    I3: Likert5 = Field(..., ge=1, le=5, description="Realizar levantamentos geológicos de campo")
    I4: Likert5 = Field(..., ge=1, le=5, description="Desenvolver um novo tratamento médico")
    I5: Likert5 = Field(..., ge=1, le=5, description="Conduzir investigação biológica")
    I6: Likert5 = Field(..., ge=1, le=5, description="Estudar formas de reduzir a poluição da água")
    I7: Likert5 = Field(..., ge=1, le=5, description="Trabalhar num laboratório de biologia")
    I8: Likert5 = Field(..., ge=1, le=5, description="Investigar a estrutura das moléculas")

    # ─── Artistic (A) ────────────────────────────────────────────────────────
    A1: Likert5 = Field(..., ge=1, le=5, description="Fazer esboços, desenhos ou pinturas")
    A2: Likert5 = Field(..., ge=1, le=5, description="Dirigir uma peça de teatro")
    A3: Likert5 = Field(..., ge=1, le=5, description="Criar ilustrações para revistas ou livros")
    A4: Likert5 = Field(..., ge=1, le=5, description="Compor uma música")
    A5: Likert5 = Field(..., ge=1, le=5, description="Escrever livros ou peças de teatro")
    A6: Likert5 = Field(..., ge=1, le=5, description="Tocar um instrumento musical")
    A7: Likert5 = Field(..., ge=1, le=5, description="Interpretar jazz ou música clássica em público")
    A8: Likert5 = Field(..., ge=1, le=5, description="Atuar num filme ou peça de teatro")

    # ─── Social (S) ──────────────────────────────────────────────────────────
    S1: Likert5 = Field(..., ge=1, le=5, description="Dar orientação de carreira às pessoas")
    S2: Likert5 = Field(..., ge=1, le=5, description="Fazer voluntariado numa organização sem fins lucrativos")
    S3: Likert5 = Field(..., ge=1, le=5, description="Ajudar pessoas com problemas de álcool ou drogas")
    S4: Likert5 = Field(..., ge=1, le=5, description="Dar aulas numa escola primária")
    S5: Likert5 = Field(..., ge=1, le=5, description="Ajudar pessoas com problemas familiares")
    S6: Likert5 = Field(..., ge=1, le=5, description="Prestar cuidados de enfermagem num hospital")
    S7: Likert5 = Field(..., ge=1, le=5, description="Ensinar crianças a ler")
    S8: Likert5 = Field(..., ge=1, le=5, description="Ajudar idosos nas suas atividades diárias")

    # ─── Enterprising (E) ────────────────────────────────────────────────────
    E1: Likert5 = Field(..., ge=1, le=5, description="Vender franchisings de restaurantes")
    E2: Likert5 = Field(..., ge=1, le=5, description="Gerir um estabelecimento comercial")
    E3: Likert5 = Field(..., ge=1, le=5, description="Gerir as operações de um hotel")
    E4: Likert5 = Field(..., ge=1, le=5, description="Gerir um salão de beleza ou barbearia")
    E5: Likert5 = Field(..., ge=1, le=5, description="Dirigir um departamento numa grande empresa")
    E6: Likert5 = Field(..., ge=1, le=5, description="Gerir uma loja de roupa")
    E7: Likert5 = Field(..., ge=1, le=5, description="Vender imóveis")
    E8: Likert5 = Field(..., ge=1, le=5, description="Vender serviços financeiros como seguros ou fundos")

    # ─── Conventional (C) ────────────────────────────────────────────────────
    C1: Likert5 = Field(..., ge=1, le=5, description="Gerar folhas de pagamento mensais")
    C2: Likert5 = Field(..., ge=1, le=5, description="Fazer inventário de materiais com computador portátil")
    C3: Likert5 = Field(..., ge=1, le=5, description="Registar dados numéricos num sistema de contabilidade")
    C4: Likert5 = Field(..., ge=1, le=5, description="Manter registos de expedições e receções")
    C5: Likert5 = Field(..., ge=1, le=5, description="Calcular e registar dados estatísticos e numéricos")
    C6: Likert5 = Field(..., ge=1, le=5, description="Configurar e manter registos usando um computador")
    C7: Likert5 = Field(..., ge=1, le=5, description="Tratar de transações bancárias de clientes")
    C8: Likert5 = Field(..., ge=1, le=5, description="Manter registos de contas a pagar e a receber")

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
    provincia: str | None = Field(
        default=None,
        description="Província de residência (ex: Maputo Cidade, Sofala). Usada apenas para anotar "
                     "empregabilidade por curso — não entra no modelo de ML."
    )

    model_config = {"json_schema_extra": {
        "example": {
            "R1": 2, "R2": 3, "R3": 2, "R4": 2, "R5": 2, "R6": 3, "R7": 2, "R8": 2,
            "I1": 4, "I2": 4, "I3": 3, "I4": 4, "I5": 5, "I6": 4, "I7": 4, "I8": 3,
            "A1": 3, "A2": 2, "A3": 3, "A4": 2, "A5": 3, "A6": 3, "A7": 2, "A8": 2,
            "S1": 4, "S2": 4, "S3": 3, "S4": 4, "S5": 4, "S6": 3, "S7": 3, "S8": 3,
            "E1": 2, "E2": 3, "E3": 3, "E4": 2, "E5": 3, "E6": 2, "E7": 2, "E8": 2,
            "C1": 3, "C2": 3, "C3": 3, "C4": 3, "C5": 4, "C6": 3, "C7": 4, "C8": 3,
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


class CourseRecommendation(BaseModel):
    titulo: str
    instituicao: str
    descricao: str
    empregabilidade_provincia: str = Field(
        default="Dados não disponíveis",
        description="Nível de empregabilidade (Alto/Médio/Baixo) deste curso na província do utilizador."
    )


class CareerSuggestion(BaseModel):
    titulo: str
    descricao: str


class PredictionResponse(BaseModel):
    holland_code: str = Field(..., description="Código Holland de 3 letras (ex: ISA)")
    riasec_scores: list[DimensionScore]
    big5: Big5Prediction
    courses: list[CourseRecommendation]
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
