"""
Lógica de inferência da API RIASEC.

O modelo foi treinado com todos os 48 itens RIASEC + scores por dimensão +
dados demográficos. Como a API recolhe apenas 3 itens por dimensão (18 no
total), os 5 itens em falta de cada dimensão são imputados pela média dos 3
itens observados.
"""
from __future__ import annotations

from functools import lru_cache
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from .career_map import DIMENSION_DESCRIPTIONS, lookup_careers
from .schemas import (
    Big5Prediction,
    CareerSuggestion,
    DimensionScore,
    PredictionResponse,
    RiasecInput,
)

# ---------------------------------------------------------------------------
# Caminhos
# ---------------------------------------------------------------------------
_HERE = Path(__file__).parent
_MODEL_PATH = _HERE.parent.parent / "notebooks" / "models" / "riasec_tipi_et_tuned.pkl"

# Nomes completos das dimensões
_DIM_NAMES: dict[str, str] = {
    "R": "Realista",
    "I": "Investigativo",
    "A": "Artístico",
    "S": "Social",
    "E": "Empreendedor",
    "C": "Convencional",
}

# Itens recolhidos pela API (5 por dimensão)
_API_ITEMS: dict[str, list[str]] = {
    "R": ["R1", "R2", "R4", "R6", "R8"],
    "I": ["I1", "I2", "I4", "I5", "I7"],
    "A": ["A2", "A3", "A4", "A5", "A6"],
    "S": ["S1", "S2", "S5", "S7", "S8"],
    "E": ["E1", "E3", "E5", "E6", "E7"],
    "C": ["C1", "C2", "C4", "C5", "C7"],
}

# Todos os 48 itens (ordem usada no treino)
_ALL_ITEMS: list[str] = [f"{d}{i}" for d in "RIASEC" for i in range(1, 9)]

# Colunas categóricas e numéricas (conforme o notebook)
_DEMO_CAT: list[str] = [
    "education", "urban", "gender", "engnat", "hand",
    "religion", "orientation", "race", "voted", "married",
]
_DEMO_NUM: list[str] = ["age", "familysize"]

# Valores neutros/modo para demográficos não pedidos pela API
_DEMO_DEFAULTS: dict[str, object] = {
    "education": "3",     # Licenciatura
    "urban":     "2",     # Suburban
    "gender":    "1",     # Masculino
    "engnat":    "1",     # Inglês nativo
    "hand":      "1",     # Dextro
    "religion":  "1",     # Agnóstico
    "orientation": "1",   # Heterossexual
    "race":      "1",
    "voted":     "1",
    "married":   "1",
    "age":       25,
    "familysize": 3,
}

# Ordem das colunas de feature tal como o ColumnTransformer espera
# (cat) + (num): ordenado pelos nomes das colunas categóricas (sort),
# depois pelas numéricas. Ver notebook: _cat_cols = sorted(...)
_FEATURE_ORDER: list[str] = (
    _ALL_ITEMS
    + [f"score_{d}" for d in "RIASEC"]
    + _DEMO_NUM
    + _DEMO_CAT
    + ["vcl_score"]
)

# Score VCL médio observado no dataset (≈ 6 palavras reais)
_VCL_DEFAULT: float = 6.0


# ---------------------------------------------------------------------------
# Singleton do modelo
# ---------------------------------------------------------------------------

@lru_cache(maxsize=1)
def _load_model():
    if not _MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Modelo não encontrado em {_MODEL_PATH}.\n"
            "Execute primeiro o notebook notebooks/riasec_tipi_regression.ipynb "
            "para gerar o artefacto."
        )
    return joblib.load(_MODEL_PATH)


# ---------------------------------------------------------------------------
# Função principal
# ---------------------------------------------------------------------------

def predict(payload: RiasecInput) -> PredictionResponse:
    model = _load_model()

    # 1. Expand 18 itens observados → 48 (imputar média por dimensão)
    raw = payload.model_dump()
    item_values: dict[str, float] = {}

    for dim, observed_keys in _API_ITEMS.items():
        observed_vals = [raw[k] for k in observed_keys]
        mean_val = float(np.mean(observed_vals))
        for i in range(1, 9):
            key = f"{dim}{i}"
            item_values[key] = float(raw[key]) if key in raw else mean_val

    # 2. Scores por dimensão (média dos 8 itens)
    score_values: dict[str, float] = {}
    for dim in "RIASEC":
        cols = [f"{dim}{i}" for i in range(1, 9)]
        score_values[f"score_{dim}"] = float(np.mean([item_values[c] for c in cols]))

    # 3. Demográficos
    demo: dict[str, object] = dict(_DEMO_DEFAULTS)
    if raw.get("age") is not None:
        demo["age"] = raw["age"]
    if raw.get("gender") is not None:
        demo["gender"] = str(raw["gender"])
    if raw.get("education") is not None:
        demo["education"] = str(raw["education"])

    # 4. Montar DataFrame com a ordem exacta de feature_cols do treino
    row: dict[str, object] = {**item_values, **score_values, "vcl_score": _VCL_DEFAULT}
    row["age"] = demo["age"]
    row["familysize"] = demo["familysize"]
    for c in _DEMO_CAT:
        row[c] = demo.get(c, _DEMO_DEFAULTS[c])

    X = pd.DataFrame([row])[_FEATURE_ORDER]

    # 5. Previsão Big Five
    y_hat = model.predict(X)[0]  # (5,)
    target_names = [
        "extraversion", "agreeableness", "conscientiousness",
        "neuroticism", "openness",
    ]
    big5_dict = {name: round(float(val), 3) for name, val in zip(target_names, y_hat)}

    # 6. Código Holland — ordenar dimensões por score decrescente
    dim_scores = {d: score_values[f"score_{d}"] for d in "RIASEC"}
    ranked = sorted(dim_scores.items(), key=lambda x: x[1], reverse=True)
    holland_code = "".join(d for d, _ in ranked[:3])

    # 7. Montar resposta
    riasec_scores = [
        DimensionScore(
            dimension=_DIM_NAMES[d],
            letter=d,
            score=round(score_values[f"score_{d}"], 3),
            description=DIMENSION_DESCRIPTIONS[d],
        )
        for d in "RIASEC"
    ]

    careers_raw = lookup_careers(holland_code)
    careers = [CareerSuggestion(**c) for c in careers_raw]

    return PredictionResponse(
        holland_code=holland_code,
        riasec_scores=riasec_scores,
        big5=Big5Prediction(**big5_dict),
        careers=careers,
    )
