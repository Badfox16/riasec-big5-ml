"""
API FastAPI — Previsão Vocacional RIASEC / Modelo de Holland
============================================================
Endpoints:
  GET  /questions  → lista das 48 perguntas RIASEC
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

from passlib.context import CryptContext
from sqlalchemy import inspect, text

from .auth.router import router as auth_router
from .config import get_settings
from .db.database import SessionLocal, engine
from .db.models import Base, User
from .exams.router import router as exams_router
from .predict import _load_model, predict
from .schemas import PredictionResponse, Question, RiasecInput

_pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

_DEMO_EMAIL    = "demo@eivocacao.co.mz"
_DEMO_PASSWORD = "demo1234"
_DEMO_NAME     = "Conta Demo"

settings = get_settings()

_WEB_DIR = Path(__file__).parent.parent / "web"

# ---------------------------------------------------------------------------
# Lista estática de perguntas (48 itens, 8 por dimensão)
# ---------------------------------------------------------------------------

_QUESTIONS: list[Question] = [
    # ── Realistic ──────────────────────────────────────────────────────────
    Question(id=1,  code="R1", dimension="R", dimension_name="Realista",
             text="Verificar a qualidade de peças antes da expedição"),
    Question(id=2,  code="R2", dimension="R", dimension_name="Realista",
             text="Assentar tijolos ou azulejos"),
    Question(id=3,  code="R3", dimension="R", dimension_name="Realista",
             text="Trabalhar num projeto de construção ao ar livre"),
    Question(id=4,  code="R4", dimension="R", dimension_name="Realista",
             text="Montar componentes eletrónicos"),
    Question(id=5,  code="R5", dimension="R", dimension_name="Realista",
             text="Conduzir um autocarro ou caminhão"),
    Question(id=6,  code="R6", dimension="R", dimension_name="Realista",
             text="Reparar uma torneira avariada"),
    Question(id=7,  code="R7", dimension="R", dimension_name="Realista",
             text="Reparar uma caldeira ou sistema de aquecimento"),
    Question(id=8,  code="R8", dimension="R", dimension_name="Realista",
             text="Instalar pavimento em casas"),
    # ── Investigative ──────────────────────────────────────────────────────
    Question(id=9,  code="I1", dimension="I", dimension_name="Investigativo",
             text="Estudar a estrutura do corpo humano"),
    Question(id=10, code="I2", dimension="I", dimension_name="Investigativo",
             text="Estudar o comportamento animal"),
    Question(id=11, code="I3", dimension="I", dimension_name="Investigativo",
             text="Realizar levantamentos geológicos de campo"),
    Question(id=12, code="I4", dimension="I", dimension_name="Investigativo",
             text="Desenvolver um novo tratamento médico"),
    Question(id=13, code="I5", dimension="I", dimension_name="Investigativo",
             text="Conduzir investigação biológica"),
    Question(id=14, code="I6", dimension="I", dimension_name="Investigativo",
             text="Estudar formas de reduzir a poluição da água"),
    Question(id=15, code="I7", dimension="I", dimension_name="Investigativo",
             text="Trabalhar num laboratório de biologia"),
    Question(id=16, code="I8", dimension="I", dimension_name="Investigativo",
             text="Investigar a estrutura das moléculas"),
    # ── Artistic ───────────────────────────────────────────────────────────
    Question(id=17, code="A1", dimension="A", dimension_name="Artístico",
             text="Fazer esboços, desenhos ou pinturas"),
    Question(id=18, code="A2", dimension="A", dimension_name="Artístico",
             text="Dirigir uma peça de teatro"),
    Question(id=19, code="A3", dimension="A", dimension_name="Artístico",
             text="Criar ilustrações para revistas ou livros"),
    Question(id=20, code="A4", dimension="A", dimension_name="Artístico",
             text="Compor uma música"),
    Question(id=21, code="A5", dimension="A", dimension_name="Artístico",
             text="Escrever livros ou peças de teatro"),
    Question(id=22, code="A6", dimension="A", dimension_name="Artístico",
             text="Tocar um instrumento musical"),
    Question(id=23, code="A7", dimension="A", dimension_name="Artístico",
             text="Interpretar jazz ou música clássica em público"),
    Question(id=24, code="A8", dimension="A", dimension_name="Artístico",
             text="Atuar num filme ou peça de teatro"),
    # ── Social ─────────────────────────────────────────────────────────────
    Question(id=25, code="S1", dimension="S", dimension_name="Social",
             text="Dar orientação de carreira às pessoas"),
    Question(id=26, code="S2", dimension="S", dimension_name="Social",
             text="Fazer voluntariado numa organização sem fins lucrativos"),
    Question(id=27, code="S3", dimension="S", dimension_name="Social",
             text="Ajudar pessoas com problemas de álcool ou drogas"),
    Question(id=28, code="S4", dimension="S", dimension_name="Social",
             text="Dar aulas numa escola primária"),
    Question(id=29, code="S5", dimension="S", dimension_name="Social",
             text="Ajudar pessoas com problemas familiares"),
    Question(id=30, code="S6", dimension="S", dimension_name="Social",
             text="Prestar cuidados de enfermagem num hospital"),
    Question(id=31, code="S7", dimension="S", dimension_name="Social",
             text="Ensinar crianças a ler"),
    Question(id=32, code="S8", dimension="S", dimension_name="Social",
             text="Ajudar idosos nas suas atividades diárias"),
    # ── Enterprising ───────────────────────────────────────────────────────
    Question(id=33, code="E1", dimension="E", dimension_name="Empreendedor",
             text="Vender franchisings de restaurantes"),
    Question(id=34, code="E2", dimension="E", dimension_name="Empreendedor",
             text="Gerir um estabelecimento comercial"),
    Question(id=35, code="E3", dimension="E", dimension_name="Empreendedor",
             text="Gerir as operações de um hotel"),
    Question(id=36, code="E4", dimension="E", dimension_name="Empreendedor",
             text="Gerir um salão de beleza ou barbearia"),
    Question(id=37, code="E5", dimension="E", dimension_name="Empreendedor",
             text="Dirigir um departamento numa grande empresa"),
    Question(id=38, code="E6", dimension="E", dimension_name="Empreendedor",
             text="Gerir uma loja de roupa"),
    Question(id=39, code="E7", dimension="E", dimension_name="Empreendedor",
             text="Vender imóveis"),
    Question(id=40, code="E8", dimension="E", dimension_name="Empreendedor",
             text="Vender serviços financeiros como seguros ou fundos"),
    # ── Conventional ───────────────────────────────────────────────────────
    Question(id=41, code="C1", dimension="C", dimension_name="Convencional",
             text="Gerar folhas de pagamento mensais"),
    Question(id=42, code="C2", dimension="C", dimension_name="Convencional",
             text="Fazer inventário de materiais com computador portátil"),
    Question(id=43, code="C3", dimension="C", dimension_name="Convencional",
             text="Registar dados numéricos num sistema de contabilidade"),
    Question(id=44, code="C4", dimension="C", dimension_name="Convencional",
             text="Manter registos de expedições e receções"),
    Question(id=45, code="C5", dimension="C", dimension_name="Convencional",
             text="Calcular e registar dados estatísticos e numéricos"),
    Question(id=46, code="C6", dimension="C", dimension_name="Convencional",
             text="Configurar e manter registos usando um computador"),
    Question(id=47, code="C7", dimension="C", dimension_name="Convencional",
             text="Tratar de transações bancárias de clientes"),
    Question(id=48, code="C8", dimension="C", dimension_name="Convencional",
             text="Manter registos de contas a pagar e a receber"),
]

# ---------------------------------------------------------------------------
# Lifespan (pré-carregamento do modelo)
# ---------------------------------------------------------------------------

def _seed_demo_user() -> None:
    db = SessionLocal()
    try:
        if not db.query(User).filter(User.email == _DEMO_EMAIL).first():
            db.add(User(
                name=_DEMO_NAME,
                email=_DEMO_EMAIL,
                hashed_password=_pwd.hash(_DEMO_PASSWORD),
            ))
            db.commit()
            print("[OK] Conta demo criada.")
    finally:
        db.close()


def _ensure_exam_columns() -> None:
    """Adiciona colunas novas a exam_results sem apagar dados já gravados.

    create_all() só cria tabelas em falta — não altera tabelas já existentes.
    Como o projecto não usa Alembic, esta migração simples e idempotente
    cobre o caso de adicionar colunas opcionais a uma tabela existente.
    """
    inspector = inspect(engine)
    if "exam_results" not in inspector.get_table_names():
        return
    existing = {col["name"] for col in inspector.get_columns("exam_results")}
    new_columns = {
        "provincia":     "VARCHAR(50)",
        "cidade":        "VARCHAR(80)",
        "tipo_escola":   "VARCHAR(20)",
        "classe_actual": "VARCHAR(40)",
        "faixa_etaria":  "VARCHAR(10)",
    }
    with engine.begin() as conn:
        for name, col_type in new_columns.items():
            if name not in existing:
                conn.execute(text(f"ALTER TABLE exam_results ADD COLUMN {name} {col_type}"))


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Pré-carrega o modelo e inicializa a base de dados no arranque."""
    Base.metadata.create_all(bind=engine)
    _ensure_exam_columns()
    _seed_demo_user()
    try:
        _load_model()
        print("[OK] Modelo RIASEC carregado com sucesso.")
    except FileNotFoundError as exc:
        print(f"[AVISO] {exc}")
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
    allow_origins=settings.allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=_WEB_DIR), name="static")

app.include_router(auth_router)
app.include_router(exams_router)


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
    summary="Obter as 48 perguntas RIASEC",
)
def get_questions():
    """
    Retorna as 48 perguntas do questionário RIASEC (8 por dimensão).

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
    Recebe as respostas às 48 perguntas RIASEC e dados demográficos opcionais,
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
