# SMIT Engineering Career Aspirations Dataset — Data Dictionary

## Overview
- Source: SMIT Engineering Career Aspirations Dataset (Roy, 2025)
- Records: 1,863 engineering students
- Purpose: Link demographics, BFI-10 items, and self-declared RIASEC-aligned career interests
- Delimiter: Semicolon (`;`)

## Column Reference
| Column | Type | Description | Example | Notes |
| --- | --- | --- | --- | --- |
| ID | Integer | Row index exported from Microsoft Forms | 1 | Drop/anonymize for public use |
| Email | String | Placeholder "anonymous" tokens | anonymous | Remove to eliminate residual PII |
| Name | String | Respondent names (often title case) | Dhruva Kumar | Remove or hash to satisfy privacy requirements |
| Gender | Categorical | Self-reported gender | Male | Values observed: Male, Female |
| Age (Years) | Integer | Respondent age | 20 | Range 17–40; will drive grade-band mapping |
| Which region or state are you from? | Categorical | Mozambique province or international origin | Cidade de Maputo | Canonical outputs: Cidade de Maputo, Província de Maputo, Gaza, Inhambane, Sofala, Manica, Tete, Zambézia, Nampula, Niassa, Cabo Delgado, Internacional / Fora de Moçambique. Registros internacionais são posteriormente redistribuídos de forma sintética usando pesos populacionais |
| (Semester) | Categorical | University semester label | 3rd Semester | Normalized into 10ª, 11ª, 12ª Classe or Pré-universitário / Ano Zero; defaults to “Adulto / Fora do Ensino Secundário” |
| Which of the following career fields are you most interested in? | String | Narrative describing dominant interest | Organized, detail-oriented... | Drives derived fields `career_desc_en`, `career_desc_pt`, `career_examples_en`, `career_examples_pt`, plus RIASEC letters |
| region_macro | Categorical (derived) | Macro regiões Sul/Centro/Norte/Internacional | Sul | Derivado da província final (`region_moz`) |
| school_type | Categorical (synthetic) | Ownership category para o ensino secundário | Escola Pública | 85% Pública / 15% Privada enquanto não houver dado real |
| 1–10 | Integer (Likert 1–5) | Raw BFI-10 item responses | 1 | Need labels + reverse scoring to compute trait totals |

## BFI-10 Item Mapping (Proposed)
| Column | Trait | Item (EN) | Reverse Key? |
| --- | --- | --- | --- |
| 1 | Extraversion | I see myself as someone who is reserved | Yes |
| 2 | Agreeableness | ... who has a forgiving nature | No |
| 3 | Conscientiousness | ... who tends to be lazy | Yes |
| 4 | Neuroticism | ... who is relaxed, handles stress well | Yes |
| 5 | Openness | ... who has few artistic interests | Yes |
| 6 | Extraversion | ... who is outgoing, sociable | No |
| 7 | Agreeableness | ... who tends to find fault with others | Yes |
| 8 | Conscientiousness | ... who does a thorough job | No |
| 9 | Neuroticism | ... who gets nervous easily | No |
| 10 | Openness | ... who has an active imagination | No |

> Note: Confirm item wording with original questionnaire. Adjust reverse-key flags if the Mozambican adaptation reorders prompts.

## Career Interest Buckets (Observed)
1. Organized, detail-oriented, disciplined (Eg. Developer / Engineer) — **C-R**; exemplos: Engenheiro civil KaTembe, Técnico de manutenção industrial em Matola
2. Curious, creative, loves learning new concepts (Eg. Research / Innovation) — **I-A**; exemplos: Estagiário de investigação na UEM, Cientista de dados para agricultura inteligente
3. Empathetic, cooperative, user-focused (Eg. Design / Human Interaction) — **S-A**; exemplos: Designer UX para portais gov.mz, Service designer em clínicas comunitárias
4. Outgoing, social, good communicator (Eg. Manager / Coordination) — **E-S**; exemplos: Líder de hub empreendedor em Beira, Coordenador de operações em ONGs juvenis
5. Calm under pressure, resilient (Eg. Cybersecurity Analyst) — **R-I**; exemplos: Analista SOC em bancos de Maputo, Engenheiro de campo para telecom

These narratives must be translated to Portuguese (Mozambique) and augmented with Mozambican career examples before deployment to secondary-school students.

## Transformation Flags
- **PII Removal**: ID, Email, Name
- **Regional Relabeling**: Normalizar entradas (com e sem acentos) para as 11 províncias oficiais + etiqueta Internacional / Fora de Moçambique
- **Redistribuição Sintética**: Entradas internacionais recebem províncias moçambicanas através de uma amostragem ponderada por população (INE 2017) e ligeiramente ajustada para incluir províncias menos desenvolvidas; `region_macro` deriva de `region_moz`
- **Semester Mapping**: Converter semestres em 10ª / 11ª / 12ª Classe ou Pré-universitário / Ano Zero com fallback Adulto / Fora do Ensino Secundário
- **BFI Processing**: Reverse-score flagged items; compute standardized trait scores
- **RIASEC Labeling**: Associar letras RIASEC, descrições EN/PT e colunas `career_examples_en` / `career_examples_pt`
- **School Type Assignment**: Gerar `school_type` por amostragem (85% Escola Pública, 15% Escola Privada) com semente fixa enquanto dados reais não existirem
- **Localization**: Provide bilingual strings for every user-facing prompt and profile
