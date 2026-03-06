"""Preprocess the SMIT dataset for Mozambican secondary-school guidance use."""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, TypedDict

import re
import unicodedata

import pandas as pd
import numpy as np

RAW_DATA = Path("dataset.csv")
OUTPUT_DATA = Path("data/processed_moz_students.csv")
LIKERT_MAX = 5

class BFIItem(TypedDict):
    column: str
    name: str
    trait: str
    reverse: bool


BFI_ITEMS: List[BFIItem] = [
    {"column": "1", "name": "BFI_E1_reserved", "trait": "Extraversion", "reverse": True},
    {"column": "2", "name": "BFI_A1_forgiving", "trait": "Agreeableness", "reverse": False},
    {"column": "3", "name": "BFI_C1_lazy", "trait": "Conscientiousness", "reverse": True},
    {"column": "4", "name": "BFI_N1_relaxed", "trait": "Neuroticism", "reverse": True},
    {"column": "5", "name": "BFI_O1_artistic", "trait": "Openness", "reverse": True},
    {"column": "6", "name": "BFI_E2_outgoing", "trait": "Extraversion", "reverse": False},
    {"column": "7", "name": "BFI_A2_faultfinding", "trait": "Agreeableness", "reverse": True},
    {"column": "8", "name": "BFI_C2_thorough", "trait": "Conscientiousness", "reverse": False},
    {"column": "9", "name": "BFI_N2_nervous", "trait": "Neuroticism", "reverse": False},
    {"column": "10", "name": "BFI_O2_imagination", "trait": "Openness", "reverse": False},
]

REGION_DEFAULT_LABEL = "Internacional / Fora de Moçambique"

REGION_ALIASES = {
    "cidade de maputo": "Cidade de Maputo",
    "maputo cidade": "Cidade de Maputo",
    "maputo city": "Cidade de Maputo",
    "maputo": "Província de Maputo",
    "maputo provincia": "Província de Maputo",
    "maputo province": "Província de Maputo",
    "gaza": "Gaza",
    "inhambane": "Inhambane",
    "sofala": "Sofala",
    "manica": "Manica",
    "tete": "Tete",
    "zambezia": "Zambézia",
    "zambezia province": "Zambézia",
    "nampula": "Nampula",
    "niassa": "Niassa",
    "cabo delgado": "Cabo Delgado",
    "cabodelgado": "Cabo Delgado",
    "palma": "Cabo Delgado",
    "pemba": "Cabo Delgado",
    "quelimane": "Zambézia",
    "beira": "Sofala",
    "chimoio": "Manica",
    "matola": "Província de Maputo",
    "north india": REGION_DEFAULT_LABEL,
    "northeast india": REGION_DEFAULT_LABEL,
    "east india": REGION_DEFAULT_LABEL,
    "west india": REGION_DEFAULT_LABEL,
    "south india": REGION_DEFAULT_LABEL,
    "international": REGION_DEFAULT_LABEL,
    "outside mozambique": REGION_DEFAULT_LABEL,
    "foreign": REGION_DEFAULT_LABEL,
}

SEMESTER_DEFAULT_LABEL = "Adulto / Fora do Ensino Secundário"

SEMESTER_ALIASES = {
    "1st semester": "10ª Classe",
    "first semester": "10ª Classe",
    "semester 1": "10ª Classe",
    "2nd semester": "10ª Classe",
    "second semester": "10ª Classe",
    "semester 2": "10ª Classe",
    "3rd semester": "11ª Classe",
    "third semester": "11ª Classe",
    "semester 3": "11ª Classe",
    "4th semester": "11ª Classe",
    "fourth semester": "11ª Classe",
    "semester 4": "11ª Classe",
    "5th semester": "12ª Classe",
    "fifth semester": "12ª Classe",
    "semester 5": "12ª Classe",
    "6th semester": "12ª Classe",
    "sixth semester": "12ª Classe",
    "semester 6": "12ª Classe",
    "grade 10": "10ª Classe",
    "grade 11": "11ª Classe",
    "grade 12": "12ª Classe",
    "form 10": "10ª Classe",
    "form 11": "11ª Classe",
    "form 12": "12ª Classe",
    "7th semester": "Pré-universitário / Ano Zero",
    "seventh semester": "Pré-universitário / Ano Zero",
    "semester 7": "Pré-universitário / Ano Zero",
    "8th semester": "Pré-universitário / Ano Zero",
    "eighth semester": "Pré-universitário / Ano Zero",
    "semester 8": "Pré-universitário / Ano Zero",
    "final semester": "Pré-universitário / Ano Zero",
    "pre university": "Pré-universitário / Ano Zero",
    "pre-university": "Pré-universitário / Ano Zero",
    "ano zero": "Pré-universitário / Ano Zero",
}

SEMESTER_NUMBER_TO_LABEL = {
    1: "10ª Classe",
    2: "10ª Classe",
    3: "11ª Classe",
    4: "11ª Classe",
    5: "12ª Classe",
    6: "12ª Classe",
    7: "Pré-universitário / Ano Zero",
    8: "Pré-universitário / Ano Zero",
}

MOZ_PROVINCE_WEIGHTS = {
    "Cidade de Maputo": 0.04,
    "Província de Maputo": 0.07,
    "Gaza": 0.05,
    "Inhambane": 0.06,
    "Sofala": 0.08,
    "Manica": 0.08,
    "Tete": 0.09,
    "Zambézia": 0.17,
    "Nampula": 0.18,
    "Niassa": 0.06,
    "Cabo Delgado": 0.07,
}

PROVINCE_TO_MACRO = {
    "Cidade de Maputo": "Sul",
    "Província de Maputo": "Sul",
    "Gaza": "Sul",
    "Inhambane": "Sul",
    "Sofala": "Centro",
    "Manica": "Centro",
    "Tete": "Centro",
    "Zambézia": "Centro",
    "Nampula": "Norte",
    "Niassa": "Norte",
    "Cabo Delgado": "Norte",
}

SYNTHETIC_REGION_SEED = 42
SCHOOL_TYPE_PUBLIC = "Escola Pública"
SCHOOL_TYPE_PRIVATE = "Escola Privada"
PUBLIC_SCHOOL_SHARE = 0.85
SYNTHETIC_SCHOOL_SEED = 314


RIASEC_MAP: Dict[str, Dict[str, str]] = {
    "organized, detail-oriented, disciplined (eg. developer / engineer)": {
        "letters": "C-R",
        "en": (
            "Structured builder who keeps systems reliable for Mozambique's roads, ports, and "
            "digital infrastructure."
        ),
        "pt": (
            "Profissional estruturado que garante sistemas fiáveis nas obras, portos e redes "
            "digitais de Moçambique."
        ),
        "examples_en": "Civil engineer on the Maputo-KaTembe corridor; industrial maintenance technician in Matola",
        "examples_pt": "Engenheiro civil na KaTembe; Técnico de manutenção industrial na Matola",
    },
    "curious, creative, loves learning new concepts (eg. research / innovation)": {
        "letters": "I-A",
        "en": (
            "Investigator who thrives on experiments, data, and innovation hubs from agrotech to "
            "renewables in Mozambique."
        ),
        "pt": (
            "Investigador(a) que vibra com experiências, dados e hubs de inovação em agrotech "
            "ou energias renováveis em Moçambique."
        ),
        "examples_en": "Research intern at Eduardo Mondlane labs; data scientist exploring climate-smart farming",
        "examples_pt": "Estagiário de investigação na UEM; Cientista de dados para agricultura inteligente",
    },
    "empathetic, cooperative, user-focused (eg. design / human interaction)": {
        "letters": "S-A",
        "en": (
            "Human-centered shaper who codes, designs, or facilitates services for public health, "
            "education, and fintech users."
        ),
        "pt": (
            "Profissional centrado nas pessoas que desenha experiências digitais ou serviços para "
            "saúde, educação e fintech locais."
        ),
        "examples_en": "UX designer improving gov.mo portals; service designer for community clinics",
        "examples_pt": "Designer UX para portais gov.mz; Service designer em clínicas comunitárias",
    },
    "outgoing, social, good communicator (eg. manager / coordination)": {
        "letters": "E-S",
        "en": (
            "Persuasive coordinator who mobilizes teams for entrepreneurship clubs, cooperatives, or "
            "social enterprises across provinces."
        ),
        "pt": (
            "Coordenador(a) persuasivo(a) que mobiliza equipas em clubes de empreendedorismo, "
            "cooperativas ou negócios sociais pelo país."
        ),
        "examples_en": "Startup club lead in Beira; operations coordinator for youth NGOs",
        "examples_pt": "Líder de hub empreendedor em Beira; Coordenador de operações em ONGs juvenis",
    },
    "calm under pressure, resilient (eg. cybersecurity analyst)": {
        "letters": "R-I",
        "en": (
            "Systems guardian who enjoys troubleshooting networks, energy grids, or cybersecurity "
            "incidents when pressure is high."
        ),
        "pt": (
            "Guardião(ã) de sistemas que gosta de resolver falhas em redes, energia ou "
            "cibersegurança mesmo sob pressão."
        ),
        "examples_en": "SOC analyst for Maputo banks; field engineer keeping telecom towers online",
        "examples_pt": "Analista SOC em bancos de Maputo; Engenheiro de campo que mantém torres de telecom",
    },
}

@dataclass
class PipelineResult:
    raw_rows: int
    processed_rows: int


def normalize_text(value: object) -> str:
    if not isinstance(value, str):
        return ""
    return " ".join(value.replace("\u00a0", " ").replace("\t", " ").strip().lower().split())


def normalize_key(value: object) -> str:
    base = normalize_text(value)
    if not base:
        return ""
    normalized = unicodedata.normalize("NFKD", base)
    return "".join(ch for ch in normalized if not unicodedata.combining(ch))


def resolve_region_label(value: object) -> str:
    key = normalize_key(value)
    if not key:
        return REGION_DEFAULT_LABEL
    return REGION_ALIASES.get(key, REGION_DEFAULT_LABEL)


SEMESTER_NUMBER_PATTERN = re.compile(r"(\d+)")


def resolve_semester_label(value: object) -> str:
    key = normalize_key(value)
    if not key:
        return SEMESTER_DEFAULT_LABEL
    if key in SEMESTER_ALIASES:
        return SEMESTER_ALIASES[key]
    match = SEMESTER_NUMBER_PATTERN.search(key)
    if match:
        number = int(match.group(1))
        return SEMESTER_NUMBER_TO_LABEL.get(number, SEMESTER_DEFAULT_LABEL)
    return SEMESTER_DEFAULT_LABEL


def get_ria_sec_value(norm_key: object, field: str, fallback: str = "") -> str:
    if not isinstance(norm_key, str) or not norm_key:
        return fallback
    entry = RIASEC_MAP.get(norm_key)
    if entry is None:
        return fallback
    return entry.get(field, fallback)


def load_raw() -> pd.DataFrame:
    if not RAW_DATA.exists():
        raise FileNotFoundError(f"Missing dataset file at {RAW_DATA}")
    return pd.read_csv(RAW_DATA, sep=";")


def drop_pii(df: pd.DataFrame) -> pd.DataFrame:
    pii_cols = ["ID", "Email", "Name"]
    return df.drop(columns=[c for c in pii_cols if c in df.columns])


def map_region(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["region_moz"] = df["Which region or state are you from?"].apply(
        resolve_region_label
    )
    return df


def map_semester(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["grade_band"] = df["(Semester)"].apply(resolve_semester_label)
    return df


def assign_synthetic_regions(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    needs_assignment = df["region_moz"] == REGION_DEFAULT_LABEL
    if not needs_assignment.any():
        df["region_macro"] = df["region_moz"].map(
            lambda prov: PROVINCE_TO_MACRO.get(prov, "Internacional")
        )
        return df

    provinces = list(MOZ_PROVINCE_WEIGHTS.keys())
    weights = np.array(list(MOZ_PROVINCE_WEIGHTS.values()), dtype=float)
    weights = weights / weights.sum()
    rng = np.random.default_rng(SYNTHETIC_REGION_SEED)
    sampled = rng.choice(provinces, size=needs_assignment.sum(), p=weights)
    df.loc[needs_assignment, "region_moz"] = sampled
    df["region_macro"] = df["region_moz"].map(
        lambda prov: PROVINCE_TO_MACRO.get(prov, "Internacional")
    )
    return df


def assign_school_type(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    if "school_type" not in df.columns:
        df["school_type"] = ""
    needs_assignment = ~df["school_type"].astype(bool)
    if not needs_assignment.any():
        return df
    rng = np.random.default_rng(SYNTHETIC_SCHOOL_SEED)
    assignments = rng.choice(
        [SCHOOL_TYPE_PUBLIC, SCHOOL_TYPE_PRIVATE],
        size=int(needs_assignment.sum()),
        p=[PUBLIC_SCHOOL_SHARE, 1 - PUBLIC_SCHOOL_SHARE],
    )
    df.loc[needs_assignment, "school_type"] = assignments
    return df


def rename_bfi(df: pd.DataFrame) -> pd.DataFrame:
    rename_dict = {item["column"]: item["name"] for item in BFI_ITEMS}
    return df.rename(columns=rename_dict)


def reverse_score(series: pd.Series) -> pd.Series:
    return (LIKERT_MAX + 1) - series


def score_bfi_traits(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    for item in BFI_ITEMS:
        col = item["name"]
        if item["reverse"]:
            df[col] = reverse_score(df[col])
    trait_map: Dict[str, List[str]] = {}
    for item in BFI_ITEMS:
        trait_map.setdefault(item["trait"], []).append(item["name"])
    for trait, cols in trait_map.items():
        df[f"trait_{trait.lower()}"] = df[cols].mean(axis=1)
    return df


def map_ria_sec(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    col = "Which of the following career fields are you most interested in?"
    df["career_interest_norm"] = df[col].apply(normalize_text)
    df["ria_sec_letters"] = df["career_interest_norm"].apply(
        lambda key: get_ria_sec_value(key, "letters", "Desconhecido")
    )
    df["career_desc_en"] = df["career_interest_norm"].apply(
        lambda key: get_ria_sec_value(key, "en")
    )
    df["career_desc_pt"] = df["career_interest_norm"].apply(
        lambda key: get_ria_sec_value(key, "pt")
    )
    df["career_examples_en"] = df["career_interest_norm"].apply(
        lambda key: get_ria_sec_value(key, "examples_en")
    )
    df["career_examples_pt"] = df["career_interest_norm"].apply(
        lambda key: get_ria_sec_value(key, "examples_pt")
    )
    df["career_desc_en"] = df["career_desc_en"].where(
        df["career_desc_en"].astype(bool), df[col]
    )
    df["career_desc_pt"] = df["career_desc_pt"].where(
        df["career_desc_pt"].astype(bool), df[col]
    )
    df["career_examples_en"] = df["career_examples_en"].fillna("")
    df["career_examples_pt"] = df["career_examples_pt"].fillna("")
    return df


def finalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    keep_cols: Iterable[str] = [
        "Gender",
        "Age (Years)",
        "region_moz",
        "region_macro",
        "grade_band",
        "school_type",
        "ria_sec_letters",
        "career_desc_en",
        "career_desc_pt",
        "career_examples_en",
        "career_examples_pt",
        "trait_extraversion",
        "trait_agreeableness",
        "trait_conscientiousness",
        "trait_neuroticism",
        "trait_openness",
    ]
    existing = [col for col in keep_cols if col in df.columns]
    return df[existing].copy()


def preprocess() -> PipelineResult:
    raw = load_raw()
    df = drop_pii(raw)
    df = map_region(df)
    df = map_semester(df)
    df = assign_synthetic_regions(df)
    df = assign_school_type(df)
    df = rename_bfi(df)
    df = score_bfi_traits(df)
    df = map_ria_sec(df)
    processed = finalize_columns(df)
    OUTPUT_DATA.parent.mkdir(parents=True, exist_ok=True)
    processed.to_csv(OUTPUT_DATA, index=False)
    return PipelineResult(raw_rows=len(raw), processed_rows=len(processed))


if __name__ == "__main__":
    result = preprocess()
    print(
        "Finished preprocessing:",
        f"raw_rows={result.raw_rows}",
        f"processed_rows={result.processed_rows}",
        f"output='{OUTPUT_DATA}'",
    )
