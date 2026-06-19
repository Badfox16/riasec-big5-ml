# ESTADO

ACTUAL DO SISTEMA

Antes de descrever o que deve ser implementado, esta
secção documenta o que o sistema já faz actualmente, de forma a que o
desenvolvedor compreenda o ponto de partida e não duplique trabalho já
realizado.

## 0.1. O que o sistema já tem

implementado

•
Questionário RIASEC com 48 perguntas,
ecrã a ecrã, com animações — implementado em React Native/Expo;

•
Modelo de Machine Learning
(ExtraTreesRegressor) treinado com 145.830 respondentes que infere
automaticamente o perfil Big Five a partir das respostas RIASEC — não existe um
segundo questionário separado para o Big Five;

•
API Backend em FastAPI (Python) com
endpoints para submissão de respostas, previsão do perfil e retorno de
recomendações;

•
Sistema de autenticação JWT com registo
e login de utilizadores;

•
Ecrã de Resultados com gráfico radar
(RIASEC) e barras (Big Five), Código Holland de 3 letras, lista de carreiras e
cursos recomendados;

•
Histórico de avaliações — cada avaliação
é guardada com data, código Holland, scores e recomendações;

•
Arquitectura offline-first com Zustand +
AsyncStorage — os dados são guardados localmente e sincronizados com o servidor
quando há ligação;

•
Base de dados de cursos mapeados para
universidades moçambicanas reais (UEM, UP, UniZambeze, UCM, ISCTEM, ISUTC,
ISRI, Politécnica, ISCISA, ISAP) no ficheiro course_map.py;

•
Dataset de 1.863 perfis de estudantes
moçambicanos reais utilizado para validação contextual.

## 0.2. O que ainda NÃO existe e

deve ser implementado

As secções seguintes descrevem, em detalhe, cada
funcionalidade que deve ser acrescentada ao sistema existente. Cada
funcionalidade está categorizada por prioridade, localização no código e
justificativa.

# 1.

FUNCIONALIDADE A — INDICADOR DE EMPREGABILIDADE POR PROVÍNCIA

PRIORIDADE: ALTA | IMPACTO: MUITO ALTO | COMPLEXIDADE: BAIXA Esta é a
funcionalidade mais diferenciadora face a qualquer plataforma existente em
língua portuguesa.

## 1.1. O que é e porquê é

importante

Nenhuma plataforma de orientação vocacional
existente — nem as brasileiras (Descomplica, QualCarreira, UNIP OV) nem as
internacionais (O*NET, CareerExplorer) — considera a realidade geográfica do
utilizador dentro de Moçambique. Recomendar Engenharia de Minas a um estudante
de Maputo sem referir que os grandes projectos mineiros estão em Tete e Nampula
é uma recomendação incompleta. Esta funcionalidade corrige exactamente este
problema.

Do ponto de vista académico, esta funcionalidade é
sustentada por dados reais e verificáveis. O estudo de Jones, Santos e Xirinda
(2024), publicado no World Bank Economic Review, demonstra empiricamente que os
desajustes de emprego entre graduados moçambicanos e o mercado de trabalho têm
custos salariais significativos. Os dados do Banco Mundial
(data.worldbank.org/country/MZ) e do ILOSTAT (ilostat.ilo.org) confirmam que a
distribuição geográfica do emprego qualificado em Moçambique é profundamente
desigual.

## 1.2. O que deve ser implementado

### 1.2.1. Nova tabela no

course_map.py

No ficheiro src/api/course_map.py, adicionar uma
nova estrutura de dados chamada PROVINCE_EMPLOYABILITY. Esta estrutura é um
dicionário Python com a seguinte forma:

PROVINCE_EMPLOYABILITY = {

'Engenharia Informática': {

'Maputo': 'Alto',

'Sofala': 'Alto',

'Nampula': 'Médio',

'Tete': 'Médio',

'Zambézia': 'Baixo',

'Cabo Delgado': 'Médio',

'Gaza': 'Baixo',

'Inhambane': 'Baixo',

'Manica': 'Baixo',

'Niassa': 'Baixo',

'Maputo Cidade': 'Alto',

},

'Engenharia de Minas': {

'Maputo': 'Baixo',

'Tete': 'Alto',

'Nampula': 'Alto',

'Cabo Delgado': 'Alto',

'Sofala': 'Médio',

    # ... restantes
províncias

    },

    # ... restantes cursos

}

Os valores de empregabilidade por curso e por
província devem ser preenchidos com base nas seguintes fontes, que devem ser
consultadas antes de preencher os valores:

◦
Banco Mundial — dados de emprego por
sector e região: data.worldbank.org/country/MZ

◦
INE Moçambique — IV Recenseamento Geral
da População e Habitação 2017, disponível em ine.gov.mz, contém dados de
emprego por sector e por província;

◦
INE — Inquérito ao Orçamento Familiar
(IOF) 2019-2020, disponível em ine.gov.mz, com dados de empregabilidade
actualizada;

◦
INHEA (inhea.org/ahen/mozambique) —
dados sobre alinhamento entre ensino superior e mercado de trabalho em
Moçambique.

As áreas de maior empregabilidade por região que
devem orientar o preenchimento da tabela, com base nas fontes acima citadas,
são as seguintes:

◦
Maputo e Maputo Cidade: Informática,
Gestão, Direito, Medicina, Finanças, Comunicação;

◦
Sofala (Beira): Informática, Engenharia
Civil, Saúde, Educação, Logística Portuária;

◦
Nampula: Comércio, Educação, Saúde,
Engenharia de Minas (crescente);

◦
Tete: Engenharia de Minas, Geologia,
Engenharia Civil, Ambiente;

◦
Cabo Delgado: Engenharia de Petróleo e
Gás, Engenharia Civil, Ambiente, Logística;

◦
Zambézia:
Educação, Agricultura, Saúde;

◦
Gaza e Inhambane: Turismo, Agricultura,
Educação, Saúde.

### 1.2.2. Actualização do endpoint

de previsão na API

No ficheiro src/api/predict.py, actualizar a função
de geração de resultados para:

◦
Receber a província do utilizador como
parâmetro adicional (já recolhida no ecrã de dados demográficos);

◦
Para cada curso recomendado, consultar a
tabela PROVINCE_EMPLOYABILITY e adicionar o campo 'empregabilidade_provincia'
ao resultado;

◦
Se o curso não estiver na tabela,
retornar 'Dados não disponíveis'.

### 1.2.3. Actualização do ecrã de

Resultados na aplicação mobile

No ficheiro mobile/src/screens/ResultsScreen.tsx,
para cada curso listado nas recomendações, adicionar um badge visual ao lado do
nome do curso com as seguintes características:

◦
Badge verde com texto 'Alta' quando
empregabilidade for 'Alto';

◦
Badge amarelo com texto 'Média' quando
empregabilidade for 'Médio';

◦
Badge vermelho com texto 'Baixa' quando
empregabilidade for 'Baixo';

◦
Ao clicar no badge, mostrar um tooltip
ou modal com o texto: 'Empregabilidade estimada para esta área na província de
[nome da província], com base em dados do INE e do Banco Mundial (2024).'

# 2.

FUNCIONALIDADE B — REQUISITOS DE ACESSO ÀS UNIVERSIDADES

PRIORIDADE: ALTA | IMPACTO: ALTO | COMPLEXIDADE: BAIXA Transforma a
recomendação numa acção concreta e imediata para o estudante.

## 2.1. O que é e porquê é

importante

Actualmente, a aplicação diz ao utilizador 'deves
seguir Engenharia Informática na UniZambeze'. Mas não diz o que precisa de
fazer para entrar lá. Esta funcionalidade completa esse ciclo: o utilizador
sabe o que quer ser, sabe que universidade oferece o curso, e sabe exactamente
o que precisa para se candidatar. Isto é informação accionável — e é o que
transforma uma aplicação de teste vocacional numa ferramenta de orientação
profissional completa.

## 2.2. O que deve ser implementado

### 2.2.1. Nova estrutura de dados

no course_map.py

Adicionar ao ficheiro src/api/course_map.py uma nova
estrutura UNIVERSITY_REQUIREMENTS com o seguinte formato:

UNIVERSITY_REQUIREMENTS = {

'UniZambeze': {

'Engenharia Informática': {

'duracao': '4 anos',

'modalidade': 'Presencial',

'cidade': 'Beira',

'disciplinas_exigidas': ['Matemática', 'Física'],

'nota_minima': 'Aprovação no exame de acesso da UniZambeze',

'documentos': ['BI ou Passaporte', 'Certificado da 12ª classe', 'Foto
tipo passe', 'Comprovativo de pagamento de inscrição'],

'website':
'https://www.unizambeze.ac.mz',

    'contacto':
'admissao@unizambeze.ac.mz',

},

},

'UEM': {

'Engenharia Informática': {

'duracao': '5 anos',

'modalidade': 'Presencial',

'cidade': 'Maputo',

'disciplinas_exigidas': ['Matemática', 'Física'],

'nota_minima': 'Exame de admissão específico da UEM',

'documentos': ['BI ou Passaporte', 'Certificado da 12ª classe', 'Foto
tipo passe'],

'website':
'https://www.uem.ac.mz',

    },

    },

    # ... restantes
universidades

}

Os dados para preencher esta estrutura devem ser
recolhidos directamente dos websites oficiais de cada universidade, que são
fontes primárias e academicamente citáveis:

◦
UniZambeze:
unizambeze.ac.mz

◦
UEM:
uem.ac.mz

◦
UCM:
ucm.ac.mz

◦
Universidade
Pedagógica: up.ac.mz

◦
ISCTEM:
isctem.ac.mz

◦
ISUTC:
isutc.ac.mz

### 2.2.2. Novo ecrã de Detalhe de

Universidade na aplicação mobile

Criar um novo ficheiro
mobile/src/screens/UniversityDetailScreen.tsx. Este ecrã é acedido quando o
utilizador clica numa universidade na lista de recomendações. Deve mostrar:

◦
Nome da universidade e cidade;

◦
Nome do curso, duração e modalidade;

◦
Disciplinas do ensino secundário
necessárias (em formato de chips/tags visuais);

◦
Lista de documentos necessários para a
candidatura;

◦
Botão 'Visitar Website' que abre o
browser com o URL oficial da universidade;

◦
Botão 'Guardar' que adiciona esta
universidade a uma lista de favoritos do utilizador.

# 3.

FUNCIONALIDADE C — COMPARAÇÃO TEMPORAL DE PERFIS NO HISTÓRICO

PRIORIDADE: MÉDIA | IMPACTO: ALTO | COMPLEXIDADE: BAIXA-MÉDIA Demonstração
visual da evidência científica sobre a evolução dos interesses vocacionais.

## 3.1. O que é e porquê é

importante

O histórico de avaliações já existe no sistema.
Actualmente lista as avaliações anteriores de forma simples. Esta
funcionalidade acrescenta uma visualização comparativa que mostra como o perfil
RIASEC do utilizador mudou entre avaliações. Isto não é apenas uma
funcionalidade técnica — é a materialização visual da teoria de Low et al. (2005) e Hoff et al. (2022) sobre a
natureza dinâmica dos interesses vocacionais. O júri verá a
teoria a funcionar na prática.

## 3.2. O que deve ser implementado

### 3.2.1. Ecrã de Comparação no

HistoryScreen

No ficheiro mobile/src/screens/HistoryScreen.tsx,
quando o utilizador tiver 2 ou mais avaliações no histórico, mostrar um botão
'Comparar Avaliações'. Ao
clicar, mostrar um ecrã com:

◦
Dois selectores de data (dropdown) onde
o utilizador escolhe as duas avaliações a comparar;

◦
Um gráfico de barras lado a lado (ou
radar sobreposto) mostrando os scores RIASEC das duas avaliações seleccionadas;

◦
Texto dinâmico que descreve a mudança:
por exemplo, 'O teu interesse Investigativo cresceu 15% desde [data]. Isto é
normal e saudável — os nossos interesses evoluem com a experiência.';

◦
Se o Código Holland mudou entre as duas
avaliações, destacar esse facto com uma mensagem positiva e encorajadora.

### 3.2.2. Mensagem de encorajamento

ao refazer o teste

Quando o utilizador acede ao ecrã inicial tendo já
avaliações anteriores, mostrar uma mensagem do tipo: 'A tua última avaliação
foi há X dias. Os teus interesses podem ter evoluído — faz uma nova avaliação
para ver como cresceste.' Isto incentiva o uso recorrente da aplicação e
reforça a mensagem científica sobre a dinâmica dos interesses.

# 4.

FUNCIONALIDADE D — EXPANSÃO DO ECRÃ DE DADOS DEMOGRÁFICOS

PRIORIDADE: ALTA | IMPACTO: ALTO | COMPLEXIDADE: MUITO BAIXA Necessária
para a Funcionalidade A (província) e para os dados do questionário de
investigação.

## 4.1. O que deve ser implementado

O ecrã de dados demográficos já existe. Deve ser
expandido com os seguintes campos adicionais, todos obrigatórios, pois são
necessários para as funcionalidades de empregabilidade provincial e para a
investigação:

*Campos a adicionar ao ecrã de dados
demográficos*

|  **Campo**                               |  **Opções /
  Formato**                                                                            |  **Tipo de

| Input**                                 | **Obrigatório?**                                      |               |     |
| --------------------------------------- | ------------------------------------------------------------ | ------------- | --- |
| Província de                           |                                                              |               |     |
| Residência                             | Lista completa das 11 províncias de Moçambique + Maputo    |               |     |
| Cidade                                  | Dropdown /                                                   |               |     |
| Picker                                  | Sim                                                          |               |     |
| Tipo de Escola                          | Pública /                                                   |               |     |
| Privada / Semi-privada                  | Radio Buttons                                                | Sim           |     |
| Classe Actual ou Último Ano Concluído | 10ª / 11ª / 12ª / Universitário 1º ano / Universitário |               |     |
| 2º ano / Já formado / Profissional    | Radio Buttons                                                | Sim           |     |
| Género                                 | Masculino / Feminino / Prefiro não dizer                    | Radio Buttons | Sim |
| Faixa Etária                           | 15-17 / 18-20 /                                              |               |     |
| 21-24 / 25-30 / Mais de 30              | Radio Buttons                                                | Sim           |     |

*Nota: A lista completa das províncias deve
incluir: Cabo Delgado, Gaza, Inhambane, Manica, Maputo Província, Maputo
Cidade, Nampula, Niassa, Sofala, Tete, Zambézia.*

# 5.

FUNCIONALIDADE E — ECRÃ 'SOBRE A APLICAÇÃO E OS MODELOS'

PRIORIDADE: MÉDIA | IMPACTO: MÉDIO | COMPLEXIDADE: MUITO BAIXA Aumenta a
credibilidade científica da aplicação e demonstra fundamentação académica.

## 5.1. O que é e porquê é

importante

Um júri académico vai querer saber: esta aplicação é
baseada em quê? Ter um ecrã dentro da aplicação que explica, de forma simples e
visual, os modelos RIASEC e Big Five — com referências às fontes — demonstra
rigor académico e transparência metodológica. É também útil para o utilizador
compreender o que está a fazer e porquê.

## 5.2. O que deve ser implementado

Criar um novo ficheiro
mobile/src/screens/AboutScreen.tsx, acessível a partir do menu de navegação
lateral ou do ecrã de Resultados. O ecrã deve ter as seguintes secções:

◦
Secção 'O que é o RIASEC?' — explicação
curta (3-4 frases) com o hexágono de Holland como imagem estática;

◦
Secção 'O que é o Big Five?' —
explicação curta das 5 dimensões OCEAN com ícones simples;

◦
Secção 'Como a aplicação funciona?' —
diagrama de fluxo simples: Respondo ao RIASEC → O sistema calcula o meu perfil
→ O sistema sugere carreiras e cursos moçambicanos;

◦
Secção 'Fontes e referências' — lista
das fontes científicas principais (Holland, 1997; McCrae & Costa, 1997;
Banco Mundial, 2024; INE, 2020);

◦
Secção 'Sobre este projecto' — texto
curto identificando o projecto como monografia de licenciatura da UniZambeze.

# 6.

RESUMO DO SISTEMA COMPLETO APÓS IMPLEMENTAÇÃO

## 6.1. O que a plataforma fará

quando estiver completa

Após a implementação de todas as funcionalidades
descritas neste documento, a plataforma funcionará da seguinte forma, do ponto
de vista do utilizador:

1. O
   utilizador regista-se na aplicação e preenche os dados demográficos: nome,
   faixa etária, género, classe/ano, tipo de escola e PROVÍNCIA DE RESIDÊNCIA.
2. Responde
   às 48 perguntas do questionário RIASEC, ecrã a ecrã, com animações suaves.
3. O modelo
   de Machine Learning processa as respostas e calcula: o Código Holland de 3
   letras (ex: ISA, REC), os scores nas 6 dimensões RIASEC, e a previsão dos 5
   traços de personalidade Big Five (OCEAN).
4. O ecrã
   de Resultados mostra: o gráfico radar RIASEC, o gráfico Big Five, o Código
   Holland, a lista de carreiras recomendadas, e os cursos disponíveis em
   universidades moçambicanas — cada um com badge de empregabilidade para a
   PROVÍNCIA DO UTILIZADOR (Alto / Médio / Baixo).
5. O
   utilizador clica numa universidade e vê o ecrã de detalhe com: duração do
   curso, modalidade, disciplinas exigidas no ensino secundário, documentos
   necessários para candidatura e link para o website oficial.
6. A
   avaliação é guardada automaticamente no histórico. Após 2 ou mais avaliações, o
   utilizador pode comparar os perfis e ver a evolução dos seus interesses ao
   longo do tempo.
7. O
   utilizador pode consultar o ecrã 'Sobre a Aplicação' para entender os modelos
   científicos em que a plataforma se baseia.

## 6.2. Tabela comparativa: antes e

depois

*Quadro: Estado actual vs. estado final
após implementação das funcionalidades*

|  **Funcionalidade**                                     |  **Estado

| Actual**                                               | **Estado Final**                |                 |
| ------------------------------------------------------ | ------------------------------------- | --------------- |
| Questionário                                          |                                       |                 |
| RIASEC                                                 | ✓ Implementado                       |                 |
| (48 perguntas)                                         | ✓ Mantém-se                         |                 |
| igual                                                  |                                       |                 |
| Previsão Big Five por ML                              | ✓ Implementado                       | ✓ Mantém-se   |
| igual                                                  |                                       |                 |
| Recomendação de cursos e universidades moçambicanas | ✓ Implementado                       |                 |
| (básico)                                              | ✓ Expandido com requisitos de acesso |                 |
| Histórico de                                          |                                       |                 |
| avaliações                                           | ✓ Implementado                       |                 |
| (listagem simples)                                     | ✓ Expandido com                      |                 |
| comparação temporal                                  |                                       |                 |
| Arquitectura                                           |                                       |                 |
| offline-first                                          | ✓ Implementado                       | ✓ Mantém-se   |
| igual                                                  |                                       |                 |
| Dados                                                  |                                       |                 |
| demográficos do utilizador                            | ⚠ Básico (sem                       |                 |
| província)                                            | ✓ Expandido com todos os campos      |                 |
| Indicador de empregabilidade por PROVÍNCIA            | ✗ Não existe                        | ✓ Implementado |
| (Funcionalidade A)                                     |                                       |                 |
| Requisitos de acesso às universidades                 | ✗ Não existe                        | ✓ Implementado |
| (Funcionalidade B)                                     |                                       |                 |
| Comparação                                           |                                       |                 |
| temporal de perfis                                     | ✗ Não existe                        | ✓ Implementado |
| (Funcionalidade C)                                     |                                       |                 |
| Ecrã 'Sobre a Aplicação e os Modelos'               | ✗ Não existe                        | ✓ Implementado |
| (Funcionalidade E)                                     |                                       |                 |

*Legenda: ✓ = Implementado | ⚠ = Parcialmente
implementado | ✗ = Não existe*

# 7.

FONTES VERIFICADAS PARA SUSTENTAÇÃO ACADÉMICA

Esta secção lista todas as fontes verificadas e
confirma exactamente onde encontrar os dados necessários para sustentar cada
funcionalidade.

## 7.1. Para sustentar o problema

do desalinhamento vocacional em Moçambique

### Fonte 1 — Jones, Santos & Xirinda (2024) — World Bank Economic Review

Título:
'Employment Mismatches Drive Expectational Earnings Errors among Mozambican
Graduates'

URL:
https://academic.oup.com/wber/article/38/1/51/7232089

O que contém: Estudo longitudinal sobre graduados
moçambicanos que demonstra empiricamente que os desajustes de emprego têm
custos salariais significativos. Documenta que o número de graduados
universitários em Moçambique cresceu de menos de 700 em 2003 para mais de
18.000 em 2016 — mas sem que o mercado de trabalho tenha acompanhado este
crescimento.

Como usar na monografia: Capítulo I
(Contextualização e Justificativa) e Capítulo IV (Discussão de Resultados).

### Fonte 2 — UNU-WIDER (2019) —

Tracer Study Mozambique

URL:
https://www.wider.unu.edu/news/study-reveals-mismatch-between-qualifications-and-market-needs-mozambique

O que contém: Estudo que documenta que a economia
moçambicana não está a gerar procura suficiente para trabalhadores com formação
universitária, e que os estudantes estão frequentemente mal informados sobre os
percursos de carreira e o que diferentes empregos exigem.

Como usar: Capítulo I (Problematização) e Capítulo
II (Contexto Moçambicano).

### Fonte 3 — INE Moçambique —

ine.gov.mz

O que contém: O IOF 2019-2020 (Inquérito ao
Orçamento Familiar) contém dados sobre emprego, taxa de desemprego por
província, e condições de vida. O IV Recenseamento Geral da População e
Habitação 2017 contém dados demográficos e de emprego por sector.

Como aceder: ine.gov.mz → Estatísticas → Emprego e
Mercado de Trabalho.

Dado específico confirmado: A taxa de desemprego na
cidade de Maputo atingiu 36% em 2023, com 47,6% dos jovens dos 15-35 anos
desempregados (fonte: INE via ECA Magazine, 2025).

Como usar: Capítulo I (Justificativa Social) e
Capítulo II (Contexto Moçambicano).

## 7.2. Para sustentar a escolha do

mobile como plataforma

### Fonte 4 — DataReportal — Digital

2024: Mozambique

URL:
https://datareportal.com/reports/digital-2024-mozambique

O que contém (dados verificados e confirmados):

◦
18,91 milhões de ligações móveis activas
em Moçambique em Janeiro de 2024 — equivalente a 55% da população total;

◦
Apenas 7,96 milhões de utilizadores de
internet — correspondentes a 23,2% da população;

◦
3,20 milhões de utilizadores de redes
sociais — 9,3% da população;

◦
76,8% da população moçambicana não
utilizava internet no início de 2024.

Como usar: Capítulo I (Justificativa Tecnológica),
Capítulo II (secção mobile) e Capítulo III (justificação da escolha
tecnológica).

### Fonte 5 — Statista/GSMA — Mobile Traffic in Africa

URL:
https://www.statista.com/statistics/1124283/internet-penetration-in-africa-by-country/

Dado verificado: 74% do tráfego web em África é
gerado via mobile em Janeiro de 2024 — mais de 14 pontos percentuais acima da
média mundial.

Como usar: Capítulo II (secção 2.4.2. sobre mobile
no contexto africano).

## 7.3. Para sustentar o desemprego

juvenil

### Fonte 6 — World Bank / FRED —

Youth Unemployment Rate Mozambique

URL directo (dados abertos):
https://data.worldbank.org/indicator/SL.UEM.1524.ZS?locations=MZ

URL alternativo:
https://fred.stlouisfed.org/series/SLUEM1524ZSMOZ

Dados
verificados:

◦
Taxa de desemprego juvenil (15-24 anos)
em Moçambique: 11,5% em 2023 e 11,6% em 2022 (estimativa ILO);

◦
Nota: Estes dados reflectem apenas quem
procura activamente emprego. A taxa de emprego vulnerável (trabalho informal,
subsistência) é dramaticamente superior — estimada pela ILO (2024) em 71,7%
para a África Subsariana.

Como usar: Capítulo I (contextualização) e Capítulo
II (mercado de trabalho moçambicano).

## 7.4. Para sustentar os modelos

RIASEC e Big Five

### Fonte 7 — Wei (2024) — Cogent Education

Título:
'RIASEC personality types and academic performance in higher education'

Publicação: Cogent Education (Taylor & Francis),
2024.

O que contém: Demonstra que a congruência entre o
perfil RIASEC dos estudantes e a área de formação escolhida tem impacto
positivo e significativo no desempenho académico — justificando directamente a
importância de avaliar o perfil RIASEC antes da escolha do curso.

Como usar: Capítulo II (secção 2.3.1.) e Capítulo I
(Justificativa Educacional).

### Fonte 8 — INHEA — Mozambique Higher Education

URL:
https://www.inhea.org/ahen/mozambique/

O que
contém: Dados sobre o ensino superior em Moçambique, incluindo confirmação de
que 'high unemployment among educated individuals, gender disparities, and a
misalignment between higher education and labor market needs' são problemas
centrais documentados.

Como usar: Capítulo II (Contexto Moçambicano).

NOTA FINAL PARA O DESENVOLVEDOR: Todas as funcionalidades descritas neste
documento devem ser implementadas antes da apresentação da monografia. O código
deve estar limpo, comentado em português, e a aplicação deve funcionar em modo
de demonstração com dados reais de pelo menos 3 universidades moçambicanas com
todos os campos preenchidos. Em caso de dúvida sobre qualquer especificação,
contactar o autor do projecto.
