"""
API FastAPI — Previsão Vocacional RIASEC / Modelo de Holland
============================================================
Endpoints:
  GET  /questions  → lista das 18 perguntas RIASEC
  POST /predict    → previsão de perfil vocacional (código Holland + Big Five + carreiras)
  GET  /health     → estado da API e disponibilidade do modelo
"""
from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .predict import _load_model, predict
from .schemas import PredictionResponse, Question, RiasecInput

# ---------------------------------------------------------------------------
# Lista estática de perguntas (18 itens, 3 por dimensão)
# ---------------------------------------------------------------------------

_QUESTIONS: list[Question] = [
    # ── Realistic ──────────────────────────────────────────────────────────
    Question(id=1,  code="R2", dimension="R", dimension_name="Realista",
             text="Assentar tijolos ou azulejos"),
    Question(id=2,  code="R4", dimension="R", dimension_name="Realista",
             text="Montar componentes eletrónicos"),
    Question(id=3,  code="R6", dimension="R", dimension_name="Realista",
             text="Reparar uma torneira avariada"),
    # ── Investigative ──────────────────────────────────────────────────────
    Question(id=4,  code="I1", dimension="I", dimension_name="Investigativo",
             text="Estudar a estrutura do corpo humano"),
    Question(id=5,  code="I4", dimension="I", dimension_name="Investigativo",
             text="Desenvolver um novo tratamento médico"),
    Question(id=6,  code="I7", dimension="I", dimension_name="Investigativo",
             text="Trabalhar num laboratório de biologia"),
    # ── Artistic ───────────────────────────────────────────────────────────
    Question(id=7,  code="A2", dimension="A", dimension_name="Artístico",
             text="Dirigir uma peça de teatro"),
    Question(id=8,  code="A4", dimension="A", dimension_name="Artístico",
             text="Compor uma música"),
    Question(id=9,  code="A6", dimension="A", dimension_name="Artístico",
             text="Tocar um instrumento musical"),
    # ── Social ─────────────────────────────────────────────────────────────
    Question(id=10, code="S1", dimension="S", dimension_name="Social",
             text="Dar orientação de carreira às pessoas"),
    Question(id=11, code="S5", dimension="S", dimension_name="Social",
             text="Ajudar pessoas com problemas familiares"),
    Question(id=12, code="S7", dimension="S", dimension_name="Social",
             text="Ensinar crianças a ler"),
    # ── Enterprising ───────────────────────────────────────────────────────
    Question(id=13, code="E3", dimension="E", dimension_name="Empreendedor",
             text="Gerir as operações de um hotel"),
    Question(id=14, code="E5", dimension="E", dimension_name="Empreendedor",
             text="Dirigir um departamento numa grande empresa"),
    Question(id=15, code="E7", dimension="E", dimension_name="Empreendedor",
             text="Vender imóveis"),
    # ── Conventional ───────────────────────────────────────────────────────
    Question(id=16, code="C1", dimension="C", dimension_name="Convencional",
             text="Gerar folhas de pagamento mensais"),
    Question(id=17, code="C4", dimension="C", dimension_name="Convencional",
             text="Manter registos de funcionários"),
    Question(id=18, code="C5", dimension="C", dimension_name="Convencional",
             text="Calcular e registar dados estatísticos e numéricos"),
]

# ---------------------------------------------------------------------------
# Lifespan (pré-carregamento do modelo)
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Pré-carrega o modelo no arranque para evitar latência na primeira chamada."""
    try:
        _load_model()
        print("✓ Modelo RIASEC carregado com sucesso.")
    except FileNotFoundError as exc:
        print(f"⚠  {exc}")
    yield


# ---------------------------------------------------------------------------
# Aplicação
# ---------------------------------------------------------------------------

app = FastAPI(
    title="API Vocacional RIASEC",
    description=(
        "Previsão de perfil vocacional com base no Modelo de Holland (RIASEC). "
        "Retorna o Código Holland, traços Big Five e sugestões de carreira."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/health", tags=["Utilitários"])
def health():
    """Verifica se a API está em funcionamento e se o modelo está disponível."""
    try:
        _load_model()
        model_ok = True
    except Exception:
        model_ok = False
    return {"status": "ok", "modelo_carregado": model_ok}


@app.get(
    "/questions",
    response_model=list[Question],
    tags=["Questionário"],
    summary="Obter as 18 perguntas RIASEC",
)
def get_questions():
    """
    Retorna as 18 perguntas do questionário RIASEC (3 por dimensão).

    Cada pergunta deve ser avaliada numa escala de 1 a 5:
    - **1** = Não gostaria nada
    - **2** = Não gostaria
    - **3** = Neutro
    - **4** = Gostaria
    - **5** = Gostaria muito
    """
    return _QUESTIONS


@app.post(
    "/predict",
    response_model=PredictionResponse,
    tags=["Previsão"],
    summary="Prever perfil vocacional",
)
def predict_profile(payload: RiasecInput) -> PredictionResponse:
    """
    Recebe as respostas às 18 perguntas RIASEC e dados demográficos opcionais,
    e retorna:

    - **holland_code**: Código Holland de 3 letras (ex: `ISA`, `RCE`)
    - **riasec_scores**: Score médio (1‑5) para cada uma das 6 dimensões
    - **big5**: Previsão dos 5 traços de personalidade Big Five (TIPI, escala 1‑7)
    - **careers**: Sugestões de carreira alinhadas com o perfil Holland
    """
    try:
        return predict(payload)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Erro interno: {exc}") from exc
