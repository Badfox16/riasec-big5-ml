# Modelo RIASEC → Big Five: O que faz, como faz e porquê

## Índice
1. [Contexto teórico](#1-contexto-teórico)
2. [O dataset](#2-o-dataset)
3. [O que o modelo aprende](#3-o-que-o-modelo-aprende)
4. [Percurso pelo notebook](#4-percurso-pelo-notebook)
5. [Decisões de desenho](#5-decisões-de-desenho)
6. [Como a API usa o modelo](#6-como-a-api-usa-o-modelo)
7. [Limitações e avisos](#7-limitações-e-avisos)

---

## 1. Contexto teórico

### 1.1 O Modelo de Holland — RIASEC

O **Modelo de Holland** (John L. Holland, 1959) é o quadro de orientação vocacional mais utilizado no mundo. Parte de uma premissa simples: as pessoas podem ser descritas por uma combinação de seis tipos de personalidade/interesse, e as profissões também. Quando o tipo da pessoa corresponde ao tipo da profissão, há maior satisfação e desempenho.

Os seis tipos formam o acrónimo **RIASEC**:

| Letra | Nome | Perfil | Exemplos de profissão |
|-------|------|--------|-----------------------|
| **R** | Realista *(Realistic)* | Prático, físico, orientado para ferramentas e máquinas. Prefere trabalho concreto a trabalho com ideias ou pessoas. | Engenheiro mecânico, eletricista, carpinteiro |
| **I** | Investigativo *(Investigative)* | Analítico, curioso, orientado para a ciência e resolução de problemas abstratos. Prefere pensar a persuadir. | Investigador, médico, programador |
| **A** | Artístico *(Artistic)* | Criativo, expressivo, avesso à rotina. Prefere liberdade de expressão a regras e procedimentos. | Designer, músico, escritor |
| **S** | Social *(Social)* | Empático, comunicativo, orientado para ajudar pessoas. Prefere interação humana a trabalho técnico. | Professor, psicólogo, assistente social |
| **E** | Empreendedor *(Enterprising)* | Persuasivo, liderante, orientado para objetivos e negócios. Prefere influenciar a analisar. | Gestor, advogado, vendedor |
| **C** | Convencional *(Conventional)* | Organizado, detalhista, orientado para dados e procedimentos. Prefere ordem a ambiguidade. | Contabilista, técnico administrativo, analista |

Os seis tipos dispõem-se num hexágono — tipos adjacentes são mais compatíveis (ex: R e I); tipos opostos são mais incongruentes (ex: R e S). O resultado de um teste RIASEC é um **Código Holland de 3 letras** (ex: `IAS`) que representa as três dimensões dominantes por ordem decrescente.

### 1.2 Big Five (Modelo dos Cinco Fatores)

O **Big Five** é o modelo de personalidade com maior suporte empírico na psicologia. Descreve a personalidade humana em cinco traços ortogonais (independentes), medidos em escalas contínuas:

| Traço | Polo alto | Polo baixo |
|-------|-----------|------------|
| **Extraversão** | Sociável, energético, assertivo | Reservado, solitário, quieto |
| **Amabilidade** | Cooperante, confiante, empático | Crítico, competitivo, frio |
| **Conscienciosidade** | Organizado, disciplinado, fiável | Desorganizado, espontâneo, negligente |
| **Neuroticismo** | Ansioso, instável emocionalmente | Calmo, seguro, resiliente |
| **Abertura à experiência** | Criativo, curioso, imaginativo | Convencional, pragmático, concreto |

#### A escala TIPI

O dataset usa a **TIPI** *(Ten-Item Personality Inventory)*, uma versão ultra-curta do Big Five com apenas 10 itens (escala 1‑7). Cada traço é medido por dois itens — um direto e um reverso — calculando-se a média após recodificação:

| Traço | Item direto | Item reverso |
|-------|-------------|--------------|
| Extraversão | TIPI1 – *Extraverted, enthusiastic* | TIPI6 – *Reserved, quiet* |
| Amabilidade | TIPI7 – *Sympathetic, warm* | TIPI2 – *Critical, quarrelsome* |
| Conscienciosidade | TIPI3 – *Dependable, self-disciplined* | TIPI8 – *Disorganized, careless* |
| Neuroticismo | TIPI4 – *Anxious, easily upset* | TIPI9 – *Calm, emotionally stable* |
| Abertura | TIPI5 – *Open to new experiences* | TIPI10 – *Conventional, uncreative* |

A fórmula de reversão é `(8 − item_reverso)` (para escala 1‑7), e depois faz-se a média com o item direto.

### 1.3 A relação entre RIASEC e Big Five

A literatura psicológica mostra correlações consistentes entre os dois modelos:
- **A** (Artístico) correlaciona positivamente com Abertura e Extraversão.
- **S** (Social) correlaciona com Amabilidade e Extraversão.
- **C** (Convencional) correlaciona com Conscienciosidade.
- **I** (Investigativo) correlaciona negativamente com Extraversão (introvertido).
- **N** (Neuroticismo) correlaciona negativamente com E, S e C.

Estas correlações existem mas são **moderadas** (~0.2–0.4), o que significa que RIASEC e Big Five medem dimensões relacionadas mas distintas. O modelo aprende estas relações empiricamente a partir dos dados.

---

## 2. O dataset

| Atributo | Detalhe |
|----------|---------|
| **Fonte** | Teste RIASEC online público, recolhido 2015–2018 |
| **Dimensão bruta** | ~145 830 respondentes × 96 colunas |
| **Itens RIASEC** | 48 itens (8 × 6 dimensões), escala 1–5 (Dislike → Enjoy) |
| **Itens TIPI** | 10 itens Big Five, escala 1–7 (Disagree strongly → Agree strongly) |
| **VCL** | 16 itens de vocabulário (1=assinalado); inclui 3 palavras falsas como check de validade |
| **Demográficos** | Idade, género, educação, urbanidade, religião, orientação, raça, estado civil, nacionalidade |
| **Duração** | Tempo na intro, no teste e no questionário demográfico |

### Limpeza aplicada

O notebook remove respondentes que:
1. Assinalaram pelo menos uma das **3 palavras falsas** do VCL (VCL6, VCL9, VCL12) — sinal de resposta descuidada ou tentativa de parecer culto.
2. Têm **idade fora do intervalo 13–100** (idades implausíveis ou não preenchidas).
3. Têm **todos os 48 itens RIASEC a zero** — não responderam ao teste.
4. Têm **todos os 10 itens TIPI a zero** — não responderam ao questionário de personalidade.

Após limpeza, ficam ~130–135 k respondentes válidos.

---

## 3. O que o modelo aprende

**Input (features):**
- 48 itens RIASEC individuais (R1–R8, I1–I8, …, C1–C8)
- 6 scores dimensionais RIASEC (média dos 8 itens por dimensão)
- 2 variáveis demográficas numéricas: `age`, `familysize`
- 10 variáveis demográficas categóricas: `education`, `urban`, `gender`, `engnat`, `hand`, `religion`, `orientation`, `race`, `voted`, `married`
- `vcl_score`: número de palavras reais do VCL assinaladas (proxy de literacia verbal)

**Output (targets):**
- 5 traços Big Five derivados do TIPI: `extraversion`, `agreeableness`, `conscientiousness`, `neuroticism`, `openness` (escala contínua ~1–7)

O modelo é uma **regressão multi-output**: prevê os 5 traços em simultâneo a partir do mesmo conjunto de features.

---

## 4. Percurso pelo notebook

### Célula 1 — Imports
Carrega todas as bibliotecas necessárias: `pandas`/`numpy` para manipulação de dados, `sklearn` para o pipeline de ML, `matplotlib`/`seaborn` para visualização, `joblib` para serialização do modelo.

---

### Células 2–3 — Leitura e limpeza

```python
df_raw = pd.read_csv('../RIASEC/data.csv', sep='\t', low_memory=False)
```

O ficheiro é TSV (separado por tabs) porque inclui um campo de texto livre (`major`) que pode conter vírgulas. `low_memory=False` força o pandas a inferir os tipos de dados lendo o ficheiro inteiro em vez de por chunks — evita erros de tipo em colunas com valores mistos.

A limpeza é conservadora: remove apenas casos inequivocamente inválidos (respostas falsas de VCL, idades absurdas, formulários em branco). Não imputa nem extrapola — melhor ter menos dados limpos do que mais dados sujos.

---

### Célula 4 — TIPI: reversão e cálculo dos Big Five

```python
df['big5_extraversion'] = (df['TIPI1'] + (8 - df['TIPI6'])) / 2
```

A reversão `8 − item` transforma a escala de um item negativo (ex: TIPI6 "Reserved, quiet") para que um valor alto signifique o mesmo que no item direto (TIPI1 "Extraverted, enthusiastic"). Depois a média dos dois dá o score do traço.

O gráfico de distribuição serve para confirmar que os targets têm distribuições razoáveis (aproximadamente normais, sem concentração em extremos) e que não há erros de cálculo óbvios.

---

### Célula 5 — Engenharia de features

```python
for dim in 'RIASEC':
    df[f'score_{dim}'] = df[[f'{dim}{i}' for i in range(1,9)]].mean(axis=1)
```

Incluir **tanto os itens individuais como os scores dimensionais** permite ao modelo:
- Usar variação *dentro* de uma dimensão (ex: alguém gosta de I1 mas não de I7) — captada pelos itens individuais.
- Usar o sinal global da dimensão com menos ruído — captado pelo score médio.

Isto é redundante informativamente mas beneficia modelos de árvore que beneficiam de features "pré-computadas".

As variáveis categóricas são convertidas para `string` porque vão ser tratadas por `OneHotEncoder`. O `pd.NA` é substituído por `np.nan` para que o `SimpleImputer` o reconheça.

---

### Célula 6 — Split treino/teste

80/20 com `random_state=42` para reprodutibilidade. O conjunto de teste (hold-out) nunca é visto durante o treino nem o tuning — serve exclusivamente para avaliação final imparcial.

---

### Célula 7 — Pipeline de pré-processamento

```python
preprocessor = ColumnTransformer([
    ('cat', cat_pipeline, _cat_cols),
    ('num', num_pipeline, _num_cols),
])
```

O `ColumnTransformer` aplica transformações diferentes a colunas diferentes em paralelo:
- **Categóricas**: imputação pela moda (valor mais frequente) → One-Hot Encoding com `handle_unknown='ignore'` (categorias novas em inferência viram zeros em vez de erro).
- **Numéricas**: imputação pela mediana (robusta a outliers).

Usar um `Pipeline` encadeia o preprocessador com o modelo, garantindo que **nenhuma informação do teste vaza para o treino** (o transformador é `fit` apenas no treino e depois `transform` no teste).

---

### Célula 8 — Validação cruzada (3-fold)

A CV serve para estimar o desempenho em dados não vistos **sem usar o hold-out**. Usa 3 folds em vez de 5 para reduzir o tempo de computação, com `n_estimators=100` em vez de 300 — suficiente para uma estimativa, não para o modelo final.

O `n_jobs=1` no estimador interno evita **nested parallelism** (uvicorn + sklearn + joblib criarem demasiadas threads). O `n_jobs=-1` no `cross_validate` externo paraleliza os 3 folds.

---

### Célula 9 — Baseline (DummyRegressor)

O `DummyRegressor(strategy='mean')` prevê sempre a média do target no treino — é o limite inferior de desempenho. Se o modelo real não bater claramente o dummy, aprendeu pouco. O R² do dummy é ~0 por definição (ou ligeiramente negativo).

---

### Célula 10 — Tuning com RandomizedSearchCV

```python
et_search = RandomizedSearchCV(
    et_pipe, param_distributions=param_dist,
    n_iter=10, cv=3, scoring=scoring, refit='r2', ...
)
et_search.fit(X_tune, y_tune)  # subsample de 30 k linhas
```

**Por que ExtraTrees e não Random Forest?**
- `ExtraTreesRegressor` usa **splits aleatórios** (não busca o melhor split) — é mais rápido e pode generalizar melhor com features redundantes (como os scores + itens individuais).
- Em datasets grandes e ruidosos como este, a aleatoriedade extra funciona como regularização implícita.

**Por que RandomizedSearch e não GridSearch?**
- GridSearch com 4 hiperparâmetros × 3–4 valores × 3 folds × 5 estimadores (MultiOutput) = centenas de fits. RandomizedSearch com `n_iter=10` explora o espaço mais eficientemente.

**Por que subsample de 30 k para tuning?**
- Com 130 k linhas, cada fit é lento. O subsample (~23% do treino) dá uma estimativa suficientemente boa dos hiperparâmetros. Depois de encontrar os melhores params, o modelo final é retreinado no treino completo.

O `refit='r2'` seleciona o melhor modelo por R² (proporção de variância explicada), que é a métrica mais interpretável para regressão.

---

### Célula 11 — Avaliação final e comparação

Compara três modelos no hold-out:
1. **Baseline Dummy** — prevê sempre a média.
2. **ET base** — ExtraTrees com params padrão razoáveis, treinado no subsample.
3. **ET tuned** — melhores params do RandomizedSearch, treinado no treino completo.

Métricas por traço e macro-média:
- **MAE** (Mean Absolute Error): erro médio em unidades da escala TIPI (1–7). Interpretável diretamente — "erra em média X pontos".
- **RMSE** (Root Mean Squared Error): penaliza mais os erros grandes. Sempre ≥ MAE.
- **R²**: fração da variância do target explicada pelo modelo. 1.0 = perfeito; 0.0 = igual ao dummy; negativo = pior que o dummy.

---

### Célula 12 — Importância por permutação

```python
result = permutation_importance(best_et, X_test, y_test, n_repeats=10)
```

**Por que permutação e não `feature_importances_` da árvore?**
- `feature_importances_` das árvores é calculada no treino e **sobrevaloriza features de alta cardinalidade** e features correlacionadas.
- A importância por permutação é calculada no **conjunto de teste**: cada feature é aleatoriamente embaralhada, mede-se a queda no R², e repete-se 10 vezes para ter um intervalo de confiança. É mais honesta e interpretável.

O resultado responde à questão: *"Se eu perdesse esta feature, quanto pioraria o modelo?"*

---

### Célula 13 — Serialização

```python
joblib.dump(best_et, 'models/riasec_tipi_et_tuned.pkl')
```

`joblib` é preferível a `pickle` para objectos sklearn porque comprime arrays numpy mais eficientemente. O ficheiro `.pkl` contém o pipeline completo (preprocessador + modelo) — basta `joblib.load()` e chamar `.predict()`.

---

## 5. Decisões de desenho

| Decisão | Alternativa considerada | Razão da escolha |
|---------|------------------------|------------------|
| ExtraTrees | Random Forest, GBM, XGBoost | Mais rápido com features redundantes; boa performance em dados tabulares grandes |
| MultiOutputRegressor | RegressorChain, modelos separados | Simplicidade; a correlação entre targets é fraca o suficiente para não justificar encadeamento |
| 3-fold CV | 5-fold | Reduz tempo de computação ~40%; estimativa ainda robusta com 130 k observações |
| Subsample 30 k para tuning | Treino completo | Tuning é exploração; fits rápidos permitem mais iterações e hiperpâmetros testados |
| TIPI (10 itens) | BFI-44, NEO-PI-R | Único instrumento Big Five disponível no dataset; suficiente para investigação com N grande |
| Regressão (Big Five contínuo) | Classificação por tipo Holland | Big Five é contínuo por natureza; classificar perderia informação |

---

## 6. Como a API usa o modelo

A API coleta apenas **18 itens** (3 por dimensão) em vez dos 48 do dataset. Para manter compatibilidade com o pipeline treinado:

1. Os 3 itens observados por dimensão são registados nos seus campos originais (ex: R2, R4, R6).
2. Os 5 itens em falta de cada dimensão (ex: R1, R3, R5, R7, R8) são **imputados pela média dos 3 itens observados** da mesma dimensão.
3. O score dimensional (`score_R`, etc.) é calculado como a média dos 8 itens (incluindo os imputados) — o que é algebricamente igual à média dos 3 observados.
4. Os demográficos não pedidos (religião, raça, etc.) recebem os valores-moda do dataset.

Esta abordagem **preserva a distribuição dos inputs** que o modelo viu no treino, minimizando o distribution shift.

O **Código Holland** é calculado na API, não pelo modelo: ordena os 6 scores por valor decrescente e toma as 3 primeiras letras. Exemplo: se `score_I=4.7, score_C=4.3, score_A=3.0, ...` → código `ICA`.

---

## 7. Limitações e avisos

1. **R² moderado (~0.15–0.30 por traço)**: RIASEC explica uma fracção limitada da variância do Big Five. O modelo é orientativo, não diagnóstico.

2. **Viés de amostra**: os dados foram recolhidos online (voluntários que fizeram um teste de Holland público) — sobrerrepresentam populações jovens, educadas e anglófonas.

3. **TIPI é uma medida curta**: 2 itens por traço têm consistência interna inferior às versões longas (BFI-44, NEO-PI-R). O modelo aprende a prever scores TIPI, não Big Five em geral.

4. **Imputação de itens na API**: prever com 3/8 itens por dimensão introduz ruído face ao modelo treinado com 8/8. A qualidade da previsão é inferior à obtida com o questionário completo.

5. **Estático no tempo**: o modelo foi treinado com dados de 2015–2018. Preferências vocacionais e normas populacionais podem ter mudado.

6. **Não é um instrumento clínico**: destina-se a exploração vocacional e educativa. Para decisões clínicas ou de seleção profissional, use instrumentos validados e profissionais certificados.
