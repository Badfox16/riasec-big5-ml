# Localization & Mapping Plan (Mozambique)

## Objectives
- Deliver bilingual (EN/PT-MZ) assets for questionnaires, reports, and model outputs.
- Replace India-specific demographic cues with Mozambican constructs.
- Provide transparent mappings for BFI-10 scoring, RIASEC narratives, and career exemplars.

## Text Assets
| Entity | English | Portuguese (Moçambique) |
| --- | --- | --- |
| Survey prompt (career) | "Which of the following career fields are you most interested in?" | "Qual destas áreas de carreira mais lhe interessa?" |
| Region helper text | "Choose your province (Maputo City, Maputo Province, Gaza, Inhambane, Sofala, Manica, Tete, Zambézia, Nampula, Niassa, Cabo Delgado) or 'International'." | "Escolha a sua província (Cidade de Maputo, Província de Maputo, Gaza, Inhambane, Sofala, Manica, Tete, Zambézia, Nampula, Niassa, Cabo Delgado) ou 'Internacional'." |
| Disclaimer | "Results are suggestions. Always consult a counselor." | "Os resultados são sugestões. Consulte sempre um orientador." |

### Career Narratives
| Canonical Key | EN | PT-MZ | RIASEC | Examples (PT) |
| Organized | Structured builder who keeps systems reliable for Mozambique's roads, ports, and digital infrastructure. | Profissional estruturado que garante sistemas fiáveis nas obras, portos e redes digitais de Moçambique. | C-R | Engenheiro civil na KaTembe; Técnico de manutenção industrial na Matola |
| Curious | Investigator who thrives on experiments, data, and innovation hubs from agrotech to renewables in Mozambique. | Investigador(a) que vibra com experiências, dados e hubs de inovação em agrotech ou energias renováveis em Moçambique. | I-A | Estagiário de investigação na UEM; Cientista de dados para agricultura inteligente |
| Empathetic | Human-centered shaper who codes, designs, or facilitates services for public health, education, and fintech users. | Profissional centrado nas pessoas que desenha experiências digitais ou serviços para saúde, educação e fintech locais. | S-A | Designer UX para portais gov.mz; Service designer em clínicas comunitárias |
| Outgoing | Persuasive coordinator who mobilizes teams for entrepreneurship clubs, cooperatives, or social enterprises across provinces. | Coordenador(a) persuasivo(a) que mobiliza equipas em clubes de empreendedorismo, cooperativas ou negócios sociais pelo país. | E-S | Líder de hub empreendedor em Beira; Coordenador de operações em ONGs juvenis |
| Resilient | Systems guardian who enjoys troubleshooting networks, energy grids, or cybersecurity incidents when pressure is high. | Guardião(ã) de sistemas que gosta de resolver falhas em redes, energia ou cibersegurança mesmo sob pressão. | R-I | Analista SOC em bancos de Maputo; Engenheiro de campo que mantém torres de telecom |

> Atualizar exemplos com feedback dos orientadores sempre que surgirem novas áreas prioritárias.

## Demographic Re-Mapping
- **Region**: normalizar inputs (com ou sem acentos) para as 11 províncias oficiais (Cidade de Maputo, Província de Maputo, Gaza, Inhambane, Sofala, Manica, Tete, Zambézia, Nampula, Niassa, Cabo Delgado) ou etiquetar como `Internacional / Fora de Moçambique`. Registros “Internacional” são posteriormente redistribuídos com pesos populacionais (censo 2017) para simular cobertura nacional.
- **Semester → Grade**: converter semestres universitários em `10ª / 11ª / 12ª Classe` ou `Pré-universitário / Ano Zero`; se não houver informação, usar `Adulto / Fora do Ensino Secundário`.

## BFI-10 Translation Strategy
1. Start from International BFI-10 Portuguese edition; adapt vocabulary to Moz usage (e.g., "fixe" → "porreiro").
2. Maintain Likert anchors (1 = "Discordo totalmente" → 5 = "Concordo totalmente").
3. Reverse-score items 1,3,4,5,7 before trait aggregation.

## Deliverables
- Localized survey form (Microsoft Forms / Kobo) with bilingual prompts.
- Region + semester lookup tables partilhadas com orientadores (inclui pesos utilizados na redistribuição sintética e coluna `region_macro`).
- Processed dataset (`data/processed_moz_students.csv`) contendo descrições e exemplos locais.
- Counselor-facing brief describing mapping assumptions and bias caveats.
- Feedback log para novas narrativas de carreira não mapeadas.