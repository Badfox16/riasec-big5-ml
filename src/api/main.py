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
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .predict import _load_model, predict
from .schemas import PredictionResponse, Question, RiasecInput

_WEB_DIR = Path(__file__).parent.parent / "web"

# ---------------------------------------------------------------------------
# Lista estática de perguntas (30 itens, 5 por dimensão)
# ---------------------------------------------------------------------------

_QUESTIONS: list[Question] = [
    # ── Realistic ──────────────────────────────────────────────────────────
    Question(id=1,  code="R1", dimension="R", dimension_name="Realista",
             text="Verificar a qualidade de peças antes da expedição"),
    Question(id=2,  code="R2", dimension="R", dimension_name="Realista",
             text="Assentar tijolos ou azulejos"),
    Question(id=3,  code="R4", dimension="R", dimension_name="Realista",
             text="Montar componentes eletrónicos"),
    Question(id=4,  code="R6", dimension="R", dimension_name="Realista",
             text="Reparar uma torneira avariada"),
    Question(id=5,  code="R8", dimension="R", dimension_name="Realista",
             text="Instalar pavimento em casas"),
    # ── Investigative ──────────────────────────────────────────────────────
    Question(id=6,  code="I1", dimension="I", dimension_name="Investigativo",
             text="Estudar a estrutura do corpo humano"),
    Question(id=7,  code="I2", dimension="I", dimension_name="Investigativo",
             text="Estudar o comportamento animal"),
    Question(id=8,  code="I4", dimension="I", dimension_name="Investigativo",
             text="Desenvolver um novo tratamento médico"),
    Question(id=9,  code="I5", dimension="I", dimension_name="Investigativo",
             text="Conduzir investigação biológica"),
    Question(id=10, code="I7", dimension="I", dimension_name="Investigativo",
             text="Trabalhar num laboratório de biologia"),
    # ── Artistic ───────────────────────────────────────────────────────────
    Question(id=11, code="A2", dimension="A", dimension_name="Artístico",
             text="Dirigir uma peça de teatro"),
    Question(id=12, code="A3", dimension="A", dimension_name="Artístico",
             text="Criar ilustrações para revistas"),
    Question(id=13, code="A4", dimension="A", dimension_name="Artístico",
             text="Compor uma música"),
    Question(id=14, code="A5", dimension="A", dimension_name="Artístico",
             text="Escrever livros ou peças de teatro"),
    Question(id=15, code="A6", dimension="A", dimension_name="Artístico",
             text="Tocar um instrumento musical"),
    # ── Social ─────────────────────────────────────────────────────────────
    Question(id=16, code="S1", dimension="S", dimension_name="Social",
             text="Dar orientação de carreira às pessoas"),
    Question(id=17, code="S2", dimension="S", dimension_name="Social",
             text="Fazer voluntariado numa organização sem fins lucrativos"),
    Question(id=18, code="S5", dimension="S", dimension_name="Social",
             text="Ajudar pessoas com problemas familiares"),
    Question(id=19, code="S7", dimension="S", dimension_name="Social",
             text="Ensinar crianças a ler"),
    Question(id=20, code="S8", dimension="S", dimension_name="Social",
             text="Ajudar idosos nas suas atividades diárias"),
    # ── Enterprising ───────────────────────────────────────────────────────
    Question(id=21, code="E1", dimension="E", dimension_name="Empreendedor",
             text="Vender franchisings de restaurantes"),
    Question(id=22, code="E3", dimension="E", dimension_name="Empreendedor",
             text="Gerir as operações de um hotel"),
    Question(id=23, code="E5", dimension="E", dimension_name="Empreendedor",
             text="Dirigir um departamento numa grande empresa"),
    Question(id=24, code="E6", dimension="E", dimension_name="Empreendedor",
             text="Gerir uma loja de roupa"),
    Question(id=25, code="E7", dimension="E", dimension_name="Empreendedor",
             text="Vender imóveis"),
    # ── Conventional ───────────────────────────────────────────────────────
    Question(id=26, code="C1", dimension="C", dimension_name="Convencional",
             text="Gerar folhas de pagamento mensais"),
    Question(id=27, code="C2", dimension="C", dimension_name="Convencional",
             text="Fazer inventário de materiais com computador portátil"),
    Question(id=28, code="C4", dimension="C", dimension_name="Convencional",
             text="Manter registos de funcionários"),
    Question(id=29, code="C5", dimension="C", dimension_name="Convencional",
             text="Calcular e registar dados estatísticos e numéricos"),
    Question(id=30, code="C7", dimension="C", dimension_name="Convencional",
             text="Tratar de transações bancárias de clientes"),
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

app.mount("/static", StaticFiles(directory=_WEB_DIR), name="static")


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/", include_in_schema=False)
def root():
    """Serve o cliente web."""
    return FileResponse(_WEB_DIR / "index.html")


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
    Retorna as 30 perguntas do questionário RIASEC (5 por dimensão).

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
