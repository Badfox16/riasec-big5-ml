# RIASEC Vocational Prediction API

API de previsão vocacional baseada no **Modelo de Holland (RIASEC)**, treinada sobre 145 k respondentes. Dado um questionário de 18 perguntas, devolve o **Código Holland** do utilizador, os seus **traços Big Five** previstos e **sugestões de carreira** personalizadas.

> Para uma explicação detalhada da teoria, do modelo e das decisões de desenho, consulte [`docs/model_explainer.md`](docs/model_explainer.md).

---

## Estrutura do projeto

```
riasec-ml/
├── RIASEC/
│   ├── data.csv              # Dataset original (TSV, ~145 k respondentes)
│   └── codebook.txt          # Descrição de todas as colunas
├── data/
│   └── processed_moz_students.csv
├── docs/
│   ├── data_dictionary.md    # Dicionário do dataset de estudantes moçambicanos
│   └── model_explainer.md    # Explicação teórica e técnica do modelo
├── notebooks/
│   ├── riasec_tipi_regression.ipynb   # Treino do modelo principal
│   ├── multioutput_random_forest.ipynb
│   └── models/                        # Modelos serializados (.pkl) — gerado pelo notebook
│       └── riasec_tipi_et_tuned.pkl
├── src/
│   ├── preprocess.py
│   └── api/
│       ├── __init__.py
│       ├── main.py           # Aplicação FastAPI (endpoints)
│       ├── schemas.py        # Modelos Pydantic (input/output)
│       ├── predict.py        # Lógica de inferência
│       └── career_map.py     # Mapeamento Código Holland → carreiras (PT)
├── requirements.txt
└── README.md
```

---

## Pré-requisitos

- **Python 3.11+**
- O ficheiro `RIASEC/data.csv` (dataset original, não incluído no repositório se for de grande dimensão)

---

## Setup

### 1. Clonar o repositório

```bash
git clone <url-do-repositório>
cd riasec-ml
```

### 2. Criar e ativar o ambiente virtual

```bash
python -m venv .env
```

**Linux / macOS (bash/zsh):**
```bash
source .env/bin/activate
```

**Linux / macOS (fish shell):**
```fish
source .env/bin/activate.fish
```

**Windows:**
```bat
.env\Scripts\activate
```

### 3. Instalar dependências

```bash
pip install -r requirements.txt
```

---

## Treinar o modelo

O modelo serializado (`notebooks/models/riasec_tipi_et_tuned.pkl`) **não está incluído no repositório** (listado no `.gitignore`). É necessário gerá-lo executando o notebook de treino.

### Opção A — Jupyter no terminal

```bash
jupyter notebook notebooks/riasec_tipi_regression.ipynb
```

Execute todas as células por ordem. O ficheiro `.pkl` será guardado automaticamente em `notebooks/models/`.

### Opção B — Executar todas as células sem abrir o browser

```bash
jupyter nbconvert --to notebook --execute notebooks/riasec_tipi_regression.ipynb \
  --output notebooks/riasec_tipi_regression_executed.ipynb
```

> **Nota:** O treino completo demora ~5–20 minutos dependendo do hardware (inclui RandomizedSearchCV sobre 30 k linhas e retreino no conjunto completo de ~105 k linhas).

---

## Arrancar a API

```bash
uvicorn src.api.main:app --reload --port 8000
```

A flag `--reload` reinicia automaticamente o servidor quando os ficheiros fonte são alterados (útil em desenvolvimento; remover em produção).

Para produção:

```bash
uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --workers 2
```

---

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/health` | Estado da API e disponibilidade do modelo |
| `GET` | `/questions` | Lista das 18 perguntas com escala e labels |
| `POST` | `/predict` | Previsão do perfil vocacional |
| `GET` | `/docs` | Swagger UI interativo (gerado automaticamente) |
| `GET` | `/redoc` | Documentação ReDoc alternativa |

### `GET /health`

```bash
curl http://localhost:8000/health
```

```json
{
  "status": "ok",
  "modelo_carregado": true
}
```

---

### `GET /questions`

Retorna as 18 perguntas do questionário RIASEC (3 por dimensão), com código do item, dimensão, texto e labels da escala.

```bash
curl http://localhost:8000/questions
```

<details>
<summary>Exemplo de resposta (truncado)</summary>

```json
[
  {
    "id": 1,
    "code": "R2",
    "dimension": "R",
    "dimension_name": "Realista",
    "text": "Assentar tijolos ou azulejos",
    "scale_min": 1,
    "scale_max": 5,
    "scale_labels": {
      "1": "Não gostaria nada",
      "2": "Não gostaria",
      "3": "Neutro",
      "4": "Gostaria",
      "5": "Gostaria muito"
    }
  },
  ...
]
```
</details>

---

### `POST /predict`

Recebe as respostas ao questionário e demográficos opcionais. Retorna código Holland, scores RIASEC, previsão Big Five e sugestões de carreira.

**Body (application/json):**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `R2`, `R4`, `R6` | int (1–5) | ✅ | Dimensão Realista |
| `I1`, `I4`, `I7` | int (1–5) | ✅ | Dimensão Investigativa |
| `A2`, `A4`, `A6` | int (1–5) | ✅ | Dimensão Artística |
| `S1`, `S5`, `S7` | int (1–5) | ✅ | Dimensão Social |
| `E3`, `E5`, `E7` | int (1–5) | ✅ | Dimensão Empreendedora |
| `C1`, `C4`, `C5` | int (1–5) | ✅ | Dimensão Convencional |
| `age` | int (13–100) | ➖ | Idade (default: 25) |
| `gender` | int (1–3) | ➖ | 1=Masc, 2=Fem, 3=Outro (default: 1) |
| `education` | int (1–4) | ➖ | 1=<HS, 2=HS, 3=Licenciatura, 4=Pós-grad (default: 3) |

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "R2": 2, "R4": 2, "R6": 2,
    "I1": 5, "I4": 5, "I7": 5,
    "A2": 3, "A4": 3, "A6": 3,
    "S1": 3, "S5": 3, "S7": 3,
    "E3": 2, "E5": 2, "E7": 2,
    "C1": 4, "C4": 4, "C5": 5,
    "age": 22, "gender": 1, "education": 3
  }'
```

<details>
<summary>Exemplo de resposta</summary>

```json
{
  "holland_code": "ICA",
  "riasec_scores": [
    {
      "dimension": "Investigativo",
      "letter": "I",
      "score": 5.0,
      "description": "Investigativo — analítico, científico, orientado para a pesquisa e resolução de problemas."
    },
    {
      "dimension": "Convencional",
      "letter": "C",
      "score": 4.333,
      "description": "Convencional — organizado, detalhista, orientado para dados e procedimentos."
    }
  ],
  "big5": {
    "extraversion": 3.304,
    "agreeableness": 4.57,
    "conscientiousness": 4.851,
    "neuroticism": 3.551,
    "openness": 5.033
  },
  "careers": [
    {
      "titulo": "Médico / Biólogo",
      "descricao": "Aplica conhecimento científico na saúde ou investigação."
    },
    {
      "titulo": "Matemático / Estatístico",
      "descricao": "Resolve problemas complexos através de análise quantitativa."
    },
    {
      "titulo": "Programador / Desenvolvedor",
      "descricao": "Cria soluções de software para vários domínios."
    }
  ],
  "nota": "Previsão orientativa com base numa amostra de 145 k respondentes. Consulte um psicólogo vocacional para uma avaliação completa."
}
```
</details>

---

## Desenvolvimento

### Verificar erros de tipo/linting

```bash
# instalar ferramentas de dev (opcional)
pip install pyright ruff

pyright src/api/
ruff check src/api/
```

### Atualizar requirements após instalar novos pacotes

```bash
pip freeze > requirements.txt
```

---

## Notas técnicas

- **Imputação de itens**: a API coleta 3 itens por dimensão (18 no total) enquanto o modelo foi treinado com 48. Os 5 itens em falta por dimensão são imputados pela média dos 3 observados, mantendo a compatibilidade com o pipeline original. Ver [`docs/model_explainer.md`](docs/model_explainer.md#6-como-a-api-usa-o-modelo) para detalhes.

- **Modelo em memória**: o modelo é carregado uma única vez no arranque via `lru_cache` e reutilizado em todas as chamadas, evitando latência de I/O por pedido.

- **`.gitignore`**: o ficheiro `notebooks/models/` (artefacto treinado) e `.env/` (ambiente virtual) estão excluídos do repositório por serem pesados ou específicos da máquina.
