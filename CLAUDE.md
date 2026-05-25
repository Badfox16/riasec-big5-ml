# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vocational prediction API built on the **Holland RIASEC model**, trained on ~145 k respondents. Given 30 questionnaire items (5 per dimension), the system predicts a Holland 3-letter code, Big Five personality traits, and returns career/course suggestions.

Two clients exist alongside the API: a vanilla web client (`src/web/`) served statically by FastAPI, and a React Native / Expo mobile app (`mobile/`).

---

## Commands

### API (Python)

```bash
# Create and activate virtual environment
python -m venv .env
.env\Scripts\activate          # Windows
source .env/bin/activate       # Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Run API in development
uvicorn src.api.main:app --reload --port 8000

# Run API in production
uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --workers 2

# Type checking and linting (install separately)
pip install pyright ruff
pyright src/api/
ruff check src/api/

# Update requirements after installing new packages
pip freeze > requirements.txt
```

### Model Training

The serialised model (`notebooks/models/riasec_tipi_et_tuned.pkl`) is not committed. Generate it by running all cells in `notebooks/riasec_tipi_regression.ipynb`. Training takes 5–20 minutes (includes RandomizedSearchCV on 30 k rows + refit on ~105 k rows).

```bash
# Option A — interactive
jupyter notebook notebooks/riasec_tipi_regression.ipynb

# Option B — headless
jupyter nbconvert --to notebook --execute notebooks/riasec_tipi_regression.ipynb \
  --output notebooks/riasec_tipi_regression_executed.ipynb
```

### Mobile (Expo / React Native)

```bash
cd mobile
npm install
npx expo start
```

---

## Architecture

### Inference Pipeline (`src/api/predict.py`)

The model was trained on all 48 RIASEC items but the API only collects 30 (5 per dimension). At inference time, missing items are **imputed by the per-dimension mean** of the 5 observed items before building the feature vector. The full feature order expected by the `ColumnTransformer` is:

```
48 RIASEC items → 6 dimension scores (score_R … score_C) → age, familysize → 10 categorical demographics → vcl_score
```

`predict.py` holds `_FEATURE_ORDER` as the canonical list. Any change to collected items must keep this contract intact.

### Career/Course Lookup (`src/api/career_map.py`)

`lookup_careers(holland_code)` does a hierarchical fallback: **3-letter → 2-letter → 1-letter** key in `CAREER_MAP`. This is the primary file to edit when adapting suggestions (careers → university courses, etc.). `DIMENSION_DESCRIPTIONS` is a separate dict used only for display labels.

### Schemas (`src/api/schemas.py`)

- `RiasecInput` — 30 Likert-5 fields (named after item codes, e.g. `R1`, `I4`) + optional demographics
- `PredictionResponse` — `holland_code`, `riasec_scores` (list of 6), `big5`, `careers` (list of `CareerSuggestion`)
- `Question` — returned by `GET /questions`; defined statically in `main.py`

### Model Singleton

`_load_model()` in `predict.py` is decorated with `@lru_cache(maxsize=1)` and called at startup via the FastAPI `lifespan` context. The `.pkl` file path is resolved relative to `predict.py`: `../../notebooks/models/riasec_tipi_et_tuned.pkl`.

### Static Web Client

`src/web/` contains `index.html`, `style.css`, and `app.js`. FastAPI mounts this directory at `/static` and serves `index.html` from the root route `GET /`. No build step — edit files directly.

### Data

- `RIASEC/data.csv` — original 145 k-row TSV dataset (training source)
- `data/processed_moz_students.csv` — 1 863-row Mozambican student dataset with RIASEC codes, Big Five predictions, and career descriptions (EN & PT)
- `data/dataset.csv` — source Indian student survey (same 1 863 rows, pre-processing)
