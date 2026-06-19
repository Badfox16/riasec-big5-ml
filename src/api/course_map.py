"""
Mapeamento de Códigos Holland → cursos superiores em universidades moçambicanas.
Lookup hierárquico: 3 letras → 2 letras → 1 letra.

Universidades referenciadas:
  UEM      — Universidade Eduardo Mondlane (Maputo)
  UP       — Universidade Pedagógica (Maputo / Beira / Nampula)
  UniLúrio — Universidade Lúrio (Nampula / Pemba / Lichinga)
  UCM      — Universidade Católica de Moçambique (Beira)
  ISCTEM   — Instituto Superior de Ciências e Tecnologia de Moçambique (Maputo)
  ISRI     — Instituto Superior de Relações Internacionais (Maputo)
  ISUTC    — Instituto Superior de Transportes e Comunicações (Maputo)
  ISCISA   — Instituto Superior de Ciências de Saúde (Maputo)
  Politécnica — Universidade Politécnica (Maputo)
  ISAP     — Instituto Superior de Administração Pública (Maputo)

Cada curso tem um campo "area" — uma chave estável de sector de emprego,
reutilizada em PROVINCE_EMPLOYABILITY (e, na Funcionalidade B, em
UNIVERSITY_REQUIREMENTS) para evitar comparações fragéis por texto do título.
"""
from __future__ import annotations

COURSE_MAP: dict[str, list[dict]] = {

    # ── 3 letras ─────────────────────────────────────────────────────────────

    "RIC": [
        {"titulo": "Licenciatura em Engenharia Electrotécnica",
         "instituicao": "UEM — Faculdade de Engenharia / ISUTC",
         "descricao": "Forma engenheiros para projectar e manter sistemas eléctricos, de automação e controlo industrial.",
         "area": "engenharia_tic"},
        {"titulo": "Licenciatura em Engenharia Mecânica",
         "instituicao": "UEM — Faculdade de Engenharia",
         "descricao": "Habilita para conceber, desenvolver e operar máquinas, motores e sistemas mecânicos.",
         "area": "engenharia_civil_construcao"},
        {"titulo": "Licenciatura em Engenharia de Telecomunicações",
         "instituicao": "ISUTC (Maputo)",
         "descricao": "Preparação para instalar, gerir e inovar em redes de comunicação e sistemas de transmissão.",
         "area": "engenharia_tic"},
    ],
    "RCI": [
        {"titulo": "Licenciatura em Engenharia Informática",
         "instituicao": "UEM — Faculdade de Engenharia / ISUTC",
         "descricao": "Combina hardware, redes e programação para desenvolver e manter sistemas computacionais.",
         "area": "engenharia_tic"},
        {"titulo": "Licenciatura em Electrónica Industrial",
         "instituicao": "UEM — Faculdade de Engenharia",
         "descricao": "Foca montagem, teste e reparação de equipamentos electrónicos em contexto industrial.",
         "area": "engenharia_tic"},
    ],
    "RIE": [
        {"titulo": "Licenciatura em Engenharia Civil",
         "instituicao": "UEM — Faculdade de Engenharia / UCM (Beira)",
         "descricao": "Forma engenheiros para planear, projectar e supervisionar obras de construção e infraestrutura.",
         "area": "engenharia_civil_construcao"},
        {"titulo": "Licenciatura em Engenharia de Minas",
         "instituicao": "UEM — Faculdade de Engenharia",
         "descricao": "Habilita para a exploração sustentável de recursos minerais, área estratégica em Moçambique.",
         "area": "engenharia_minas_petroleo"},
        {"titulo": "Licenciatura em Arquitectura e Planeamento Físico",
         "instituicao": "UEM — Faculdade de Arquitectura e Planeamento Físico",
         "descricao": "Combina criatividade e técnica para projectar edifícios e ordenar o território.",
         "area": "engenharia_civil_construcao"},
    ],
    "IRC": [
        {"titulo": "Licenciatura em Ciências da Computação",
         "instituicao": "UEM — Departamento de Matemática e Informática",
         "descricao": "Base teórica sólida em algoritmos, estruturas de dados e desenvolvimento de software.",
         "area": "engenharia_tic"},
        {"titulo": "Licenciatura em Matemática",
         "instituicao": "UEM / UP",
         "descricao": "Desenvolve raciocínio abstracto e capacidade analítica aplicáveis em ciência, finanças e educação.",
         "area": "ciencias_exatas"},
        {"titulo": "Licenciatura em Engenharia Informática",
         "instituicao": "UEM — Faculdade de Engenharia / ISUTC",
         "descricao": "Une engenharia de sistemas e programação para criar soluções tecnológicas de impacto.",
         "area": "engenharia_tic"},
    ],
    "IRS": [
        {"titulo": "Licenciatura em Medicina",
         "instituicao": "UEM — Faculdade de Medicina",
         "descricao": "Forma médicos generalistas com competências para diagnóstico, tratamento e prevenção de doenças.",
         "area": "saude"},
        {"titulo": "Licenciatura em Farmácia",
         "instituicao": "UEM — Faculdade de Medicina / ISCISA (Maputo)",
         "descricao": "Prepara para avaliação, dispensa e aconselhamento sobre medicamentos em contexto clínico e comunitário.",
         "area": "saude"},
        {"titulo": "Licenciatura em Enfermagem",
         "instituicao": "UniLúrio (Nampula) / ISCISA (Maputo) / UCM (Beira)",
         "descricao": "Habilita para prestar cuidados de saúde integrais e apoio a pacientes em unidades sanitárias.",
         "area": "saude"},
    ],
    "IAR": [
        {"titulo": "Licenciatura em Arquitectura e Planeamento Físico",
         "instituicao": "UEM — Faculdade de Arquitectura e Planeamento Físico",
         "descricao": "Projectar espaços habitáveis e sustentáveis, conciliando estética, função e contexto local.",
         "area": "engenharia_civil_construcao"},
        {"titulo": "Licenciatura em Design de Comunicação",
         "instituicao": "ISCTEM (Maputo)",
         "descricao": "Foca criação visual, identidade de marca e comunicação gráfica para meios digitais e impressos.",
         "area": "comunicacao_artes"},
        {"titulo": "Licenciatura em Comunicação e Jornalismo",
         "instituicao": "UEM — Faculdade de Letras e Ciências Sociais",
         "descricao": "Forma comunicadores criativos e críticos para media, relações públicas e produção de conteúdos.",
         "area": "comunicacao_artes"},
    ],
    "IAS": [
        {"titulo": "Licenciatura em Psicologia",
         "instituicao": "UEM — Faculdade de Educação / UCM (Beira)",
         "descricao": "Estuda o comportamento humano e habilita para avaliação, aconselhamento e intervenção psicológica.",
         "area": "psicologia_servico_social"},
        {"titulo": "Licenciatura em Ciências Biomédicas",
         "instituicao": "UniLúrio (Nampula) / ISCISA (Maputo)",
         "descricao": "Combina ciências básicas da saúde com laboratório clínico e investigação biomédica.",
         "area": "saude"},
        {"titulo": "Licenciatura em Biologia",
         "instituicao": "UEM — Faculdade de Ciências",
         "descricao": "Explora os sistemas vivos desde a célula ao ecossistema, com aplicações em saúde, ambiente e agro-pecuária.",
         "area": "ciencias_exatas"},
    ],
    "AIR": [
        {"titulo": "Licenciatura em Design de Comunicação",
         "instituicao": "ISCTEM (Maputo)",
         "descricao": "Cria interfaces visuais e experiências de utilizador para plataformas digitais e impressas.",
         "area": "comunicacao_artes"},
        {"titulo": "Licenciatura em Comunicação e Multimédia",
         "instituicao": "UEM — Faculdade de Letras e Ciências Sociais / ISCTEM",
         "descricao": "Produção audiovisual, fotografia, edição digital e gestão de conteúdos para meios de comunicação.",
         "area": "comunicacao_artes"},
    ],
    "AIS": [
        {"titulo": "Licenciatura em Comunicação e Jornalismo",
         "instituicao": "UEM — Faculdade de Letras e Ciências Sociais",
         "descricao": "Investigação, redacção e difusão de informação para imprensa, rádio, televisão e meios digitais.",
         "area": "comunicacao_artes"},
        {"titulo": "Licenciatura em Línguas Modernas",
         "instituicao": "UEM — Faculdade de Letras e Ciências Sociais",
         "descricao": "Domínio aprofundado de línguas estrangeiras com aplicação em tradução, ensino e relações internacionais.",
         "area": "comunicacao_artes"},
        {"titulo": "Licenciatura em Relações Internacionais e Diplomacia",
         "instituicao": "ISRI (Maputo)",
         "descricao": "Estuda política externa, direito internacional e diplomacia num contexto de integração regional africana.",
         "area": "gestao_economia_financas"},
    ],
    "ASE": [
        {"titulo": "Licenciatura em Comunicação e Jornalismo",
         "instituicao": "UEM — Faculdade de Letras e Ciências Sociais",
         "descricao": "Forma profissionais de media com capacidade criativa e sentido crítico para informar a sociedade.",
         "area": "comunicacao_artes"},
        {"titulo": "Licenciatura em Relações Públicas e Comunicação Organizacional",
         "instituicao": "ISRI (Maputo) / ISCTEM (Maputo)",
         "descricao": "Gestão de imagem, comunicação institucional e estratégias de relação com públicos.",
         "area": "comunicacao_artes"},
        {"titulo": "Licenciatura em Línguas e Literatura",
         "instituicao": "UEM — Faculdade de Letras e Ciências Sociais",
         "descricao": "Estudo aprofundado da literatura e linguística com saídas no ensino, tradução e edição.",
         "area": "comunicacao_artes"},
    ],
    "SAI": [
        {"titulo": "Licenciatura em Enfermagem",
         "instituicao": "UEM — Escola de Ciências da Saúde / UniLúrio / ISCISA",
         "descricao": "Prestação de cuidados de saúde centrados no paciente em hospitais, centros de saúde e comunidades.",
         "area": "saude"},
        {"titulo": "Licenciatura em Serviço Social",
         "instituicao": "UP (Maputo) / UCM (Beira)",
         "descricao": "Intervenção social com indivíduos, famílias e comunidades vulneráveis para promover inclusão e bem-estar.",
         "area": "psicologia_servico_social"},
        {"titulo": "Licenciatura em Psicologia",
         "instituicao": "UEM — Faculdade de Educação / UCM (Beira)",
         "descricao": "Avaliação e apoio psicológico em contextos clínicos, educacionais e organizacionais.",
         "area": "psicologia_servico_social"},
    ],
    "SEA": [
        {"titulo": "Licenciatura em Educação / Pedagogia",
         "instituicao": "UP — Universidade Pedagógica (Maputo / Beira / Nampula)",
         "descricao": "Forma professores e especialistas em educação para todos os níveis do sistema de ensino moçambicano.",
         "area": "educacao"},
        {"titulo": "Licenciatura em Psicopedagogia",
         "instituicao": "UP (Maputo)",
         "descricao": "Apoia o desenvolvimento cognitivo e emocional de estudantes, com foco em inclusão e orientação escolar.",
         "area": "educacao"},
        {"titulo": "Licenciatura em Serviço Social",
         "instituicao": "UP (Maputo) / UCM (Beira)",
         "descricao": "Promoção da justiça social e apoio a populações em situação de vulnerabilidade.",
         "area": "psicologia_servico_social"},
    ],
    "SEC": [
        {"titulo": "Licenciatura em Gestão de Recursos Humanos",
         "instituicao": "UEM — Faculdade de Economia / ISCTEM (Maputo)",
         "descricao": "Recrutamento, desenvolvimento e gestão do talento em organizações públicas e privadas.",
         "area": "gestao_economia_financas"},
        {"titulo": "Licenciatura em Administração Pública",
         "instituicao": "ISAP (Maputo) / UP",
         "descricao": "Gestão de instituições do Estado, políticas públicas e serviços à cidadania.",
         "area": "direito_admin_publica"},
        {"titulo": "Licenciatura em Direito",
         "instituicao": "UCM (Beira) / UEM — Faculdade de Direito",
         "descricao": "Formação jurídica para advocacia, magistratura, assessoria jurídica e serviço público.",
         "area": "direito_admin_publica"},
    ],
    "ESA": [
        {"titulo": "Licenciatura em Gestão de Empresas",
         "instituicao": "UEM — Faculdade de Economia / UCM / Politécnica (Maputo)",
         "descricao": "Empreendedorismo, liderança e gestão estratégica de organizações em contexto moçambicano e africano.",
         "area": "gestao_economia_financas"},
        {"titulo": "Licenciatura em Direito",
         "instituicao": "UEM — Faculdade de Direito / ISRI / UCM",
         "descricao": "Base legal para advocacia, negócios, diplomacia e administração pública.",
         "area": "direito_admin_publica"},
        {"titulo": "Licenciatura em Relações Internacionais e Diplomacia",
         "instituicao": "ISRI (Maputo)",
         "descricao": "Negociação, política externa e comércio internacional numa África em rápida transformação.",
         "area": "gestao_economia_financas"},
    ],
    "ECS": [
        {"titulo": "Licenciatura em Economia",
         "instituicao": "UEM — Faculdade de Economia",
         "descricao": "Análise de mercados, políticas económicas e desenvolvimento — área crítica para Moçambique.",
         "area": "gestao_economia_financas"},
        {"titulo": "Licenciatura em Gestão Comercial e Marketing",
         "instituicao": "ISCTEM (Maputo) / Politécnica (Maputo)",
         "descricao": "Estratégias de vendas, marketing digital e gestão de clientes em mercados emergentes.",
         "area": "gestao_economia_financas"},
        {"titulo": "Licenciatura em Administração e Gestão de Empresas",
         "instituicao": "UEM — Faculdade de Economia / Politécnica",
         "descricao": "Gestão operacional e estratégica de empresas com foco no contexto empresarial moçambicano.",
         "area": "gestao_economia_financas"},
    ],
    "ERC": [
        {"titulo": "Licenciatura em Engenharia Industrial e de Produção",
         "instituicao": "UEM — Faculdade de Engenharia",
         "descricao": "Optimização de processos produtivos, logística e gestão de operações industriais.",
         "area": "engenharia_civil_construcao"},
        {"titulo": "Licenciatura em Gestão de Operações e Logística",
         "instituicao": "ISUTC (Maputo) / Politécnica",
         "descricao": "Cadeias de abastecimento, transporte e distribuição — competências em alta demanda em Moçambique.",
         "area": "logistica_transportes"},
    ],
    "CES": [
        {"titulo": "Licenciatura em Contabilidade e Auditoria",
         "instituicao": "UEM — Faculdade de Economia / UCM / ISCTEM / Politécnica",
         "descricao": "Registo, análise e auditoria de informação financeira para empresas e organismos públicos.",
         "area": "gestao_economia_financas"},
        {"titulo": "Licenciatura em Finanças e Banca",
         "instituicao": "ISCTEM (Maputo) / Politécnica (Maputo)",
         "descricao": "Gestão de activos, mercados financeiros e operações bancárias no sistema financeiro moçambicano.",
         "area": "gestao_economia_financas"},
        {"titulo": "Licenciatura em Administração e Gestão de Empresas",
         "instituicao": "UEM / UCM / Politécnica",
         "descricao": "Administração de recursos humanos, financeiros e operacionais em organizações de todos os sectores.",
         "area": "gestao_economia_financas"},
    ],
    "CRS": [
        {"titulo": "Licenciatura em Gestão de Logística e Transportes",
         "instituicao": "ISUTC (Maputo)",
         "descricao": "Planeamento e controlo de cadeias logísticas, armazéns e transporte multimodal.",
         "area": "logistica_transportes"},
        {"titulo": "Licenciatura em Administração de Empresas",
         "instituicao": "Politécnica (Maputo) / UCM (Beira)",
         "descricao": "Processos administrativos, gestão de stocks e organização de escritórios e unidades de serviço.",
         "area": "gestao_economia_financas"},
    ],
    "CIR": [
        {"titulo": "Licenciatura em Estatística",
         "instituicao": "UEM — Faculdade de Ciências",
         "descricao": "Recolha, tratamento e interpretação de dados — competência fundamental para investigação e políticas públicas.",
         "area": "ciencias_exatas"},
        {"titulo": "Licenciatura em Contabilidade e Auditoria",
         "instituicao": "Politécnica (Maputo) / UEM / ISCTEM",
         "descricao": "Controlo financeiro rigoroso, conformidade fiscal e auditoria de sistemas contabilísticos.",
         "area": "gestao_economia_financas"},
        {"titulo": "Licenciatura em Ciências da Computação / Sistemas de Informação",
         "instituicao": "UEM — Faculdade de Engenharia / ISCTEM",
         "descricao": "Gestão de bases de dados, análise de dados e desenvolvimento de sistemas de informação.",
         "area": "engenharia_tic"},
    ],

    # ── 2 letras (fallback) ───────────────────────────────────────────────────

    "RI": [
        {"titulo": "Licenciatura em Engenharia Electrotécnica",
         "instituicao": "UEM / ISUTC",
         "descricao": "Sistemas eléctricos, electrónica e automação em contexto industrial e de serviços.",
         "area": "engenharia_tic"},
        {"titulo": "Licenciatura em Engenharia Civil",
         "instituicao": "UEM / UCM",
         "descricao": "Infra-estrutura, construção e gestão de obras — área de elevada procura em Moçambique.",
         "area": "engenharia_civil_construcao"},
    ],
    "IR": [
        {"titulo": "Licenciatura em Engenharia Informática",
         "instituicao": "UEM / ISUTC",
         "descricao": "Desenvolvimento de software, sistemas embebidos e redes para o sector tecnológico.",
         "area": "engenharia_tic"},
        {"titulo": "Licenciatura em Ciências da Computação",
         "instituicao": "UEM — Faculdade de Engenharia",
         "descricao": "Base científica para inovação tecnológica, inteligência artificial e análise de dados.",
         "area": "engenharia_tic"},
    ],
    "IA": [
        {"titulo": "Licenciatura em Arquitectura e Planeamento Físico",
         "instituicao": "UEM",
         "descricao": "Projectar e planear espaços urbanos e rurais com impacto positivo na qualidade de vida.",
         "area": "engenharia_civil_construcao"},
        {"titulo": "Licenciatura em Design de Comunicação",
         "instituicao": "ISCTEM",
         "descricao": "Identidade visual, UX/UI e comunicação gráfica para empresas e organizações.",
         "area": "comunicacao_artes"},
    ],
    "AI": [
        {"titulo": "Licenciatura em Comunicação e Multimédia",
         "instituicao": "UEM / ISCTEM",
         "descricao": "Produção criativa com suporte tecnológico para media, publicidade e comunicação digital.",
         "area": "comunicacao_artes"},
        {"titulo": "Licenciatura em Design de Comunicação",
         "instituicao": "ISCTEM (Maputo)",
         "descricao": "Arte aplicada a interfaces digitais, publicações e campanhas de comunicação.",
         "area": "comunicacao_artes"},
    ],
    "AS": [
        {"titulo": "Licenciatura em Comunicação e Jornalismo",
         "instituicao": "UEM — Faculdade de Letras e Ciências Sociais",
         "descricao": "Expressão criativa e sentido crítico ao serviço da informação e do debate público.",
         "area": "comunicacao_artes"},
        {"titulo": "Licenciatura em Línguas e Literatura",
         "instituicao": "UEM — Faculdade de Letras e Ciências Sociais",
         "descricao": "Literatura moçambicana e africana, linguística e criação literária.",
         "area": "comunicacao_artes"},
    ],
    "SA": [
        {"titulo": "Licenciatura em Psicologia",
         "instituicao": "UEM / UCM",
         "descricao": "Compreender o comportamento humano para apoiar indivíduos e comunidades.",
         "area": "psicologia_servico_social"},
        {"titulo": "Licenciatura em Educação de Infância",
         "instituicao": "UP (Maputo / Beira / Nampula)",
         "descricao": "Estimulação do desenvolvimento infantil através de actividades educativas e lúdicas.",
         "area": "educacao"},
    ],
    "SE": [
        {"titulo": "Licenciatura em Educação / Pedagogia",
         "instituicao": "UP — Universidade Pedagógica",
         "descricao": "Formação de professores e especialistas em educação para escolas e contextos não-formais.",
         "area": "educacao"},
        {"titulo": "Licenciatura em Serviço Social",
         "instituicao": "UP / UCM",
         "descricao": "Apoio a comunidades e famílias vulneráveis, promoção de direitos e inclusão social.",
         "area": "psicologia_servico_social"},
    ],
    "ES": [
        {"titulo": "Licenciatura em Gestão de Empresas",
         "instituicao": "UEM / UCM / Politécnica",
         "descricao": "Liderança, estratégia e empreendedorismo para criar e gerir organizações de sucesso.",
         "area": "gestao_economia_financas"},
        {"titulo": "Licenciatura em Direito",
         "instituicao": "UEM / ISRI / UCM",
         "descricao": "Habilitação para advocacia, mediação e consultoria jurídica em empresa ou serviço público.",
         "area": "direito_admin_publica"},
    ],
    "EC": [
        {"titulo": "Licenciatura em Economia",
         "instituicao": "UEM — Faculdade de Economia",
         "descricao": "Análise económica, planeamento financeiro e apoio a decisões em organizações e governo.",
         "area": "gestao_economia_financas"},
        {"titulo": "Licenciatura em Gestão Comercial e Marketing",
         "instituicao": "ISCTEM / Politécnica",
         "descricao": "Vendas, marketing e gestão de relações com clientes em mercados competitivos.",
         "area": "gestao_economia_financas"},
    ],
    "CE": [
        {"titulo": "Licenciatura em Contabilidade e Auditoria",
         "instituicao": "UEM / UCM / ISCTEM / Politécnica",
         "descricao": "Registos financeiros, conformidade fiscal e consultoria de gestão para empresas e estado.",
         "area": "gestao_economia_financas"},
        {"titulo": "Licenciatura em Finanças e Banca",
         "instituicao": "ISCTEM / Politécnica",
         "descricao": "Sistema bancário, mercados de capitais e gestão financeira empresarial.",
         "area": "gestao_economia_financas"},
    ],
    "CR": [
        {"titulo": "Licenciatura em Gestão de Logística e Transportes",
         "instituicao": "ISUTC (Maputo)",
         "descricao": "Logística, cadeia de abastecimento e transporte num país com corredores estratégicos.",
         "area": "logistica_transportes"},
        {"titulo": "Licenciatura em Administração de Empresas",
         "instituicao": "Politécnica / UCM",
         "descricao": "Organização, processos administrativos e controlo operacional em diversas organizações.",
         "area": "gestao_economia_financas"},
    ],
    "RC": [
        {"titulo": "Licenciatura em Engenharia Civil",
         "instituicao": "UEM / UCM",
         "descricao": "Construção de infra-estruturas essenciais ao desenvolvimento do país.",
         "area": "engenharia_civil_construcao"},
        {"titulo": "Licenciatura em Engenharia Mecânica",
         "instituicao": "UEM",
         "descricao": "Concepção e manutenção de sistemas mecânicos para indústria, energia e transporte.",
         "area": "engenharia_civil_construcao"},
    ],

    # ── 1 letra (fallback final) ──────────────────────────────────────────────

    "R": [
        {"titulo": "Licenciatura em Engenharia Civil",
         "instituicao": "UEM — Faculdade de Engenharia / UCM (Beira)",
         "descricao": "Projectar e construir estradas, pontes, edifícios e sistemas de saneamento.",
         "area": "engenharia_civil_construcao"},
        {"titulo": "Licenciatura em Engenharia Mecânica",
         "instituicao": "UEM — Faculdade de Engenharia",
         "descricao": "Desenvolver e manter máquinas, motores e sistemas de produção industrial.",
         "area": "engenharia_civil_construcao"},
        {"titulo": "Licenciatura em Engenharia Electrotécnica",
         "instituicao": "UEM / ISUTC (Maputo)",
         "descricao": "Sistemas eléctricos, energias renováveis e automação — sectores em expansão em Moçambique.",
         "area": "engenharia_tic"},
    ],
    "I": [
        {"titulo": "Licenciatura em Medicina",
         "instituicao": "UEM — Faculdade de Medicina",
         "descricao": "Formação para diagnosticar, tratar e prevenir doenças, respondendo a necessidades críticas de saúde.",
         "area": "saude"},
        {"titulo": "Licenciatura em Engenharia Informática",
         "instituicao": "UEM / ISUTC (Maputo)",
         "descricao": "Desenvolvimento de software e sistemas digitais para os sectores público e privado.",
         "area": "engenharia_tic"},
        {"titulo": "Licenciatura em Biologia",
         "instituicao": "UEM — Faculdade de Ciências",
         "descricao": "Ciências da vida aplicadas à saúde, conservação ambiental e agro-pecuária.",
         "area": "ciencias_exatas"},
        {"titulo": "Licenciatura em Química",
         "instituicao": "UEM — Faculdade de Ciências",
         "descricao": "Base científica para indústria farmacêutica, alimentar, mineira e ambiental.",
         "area": "ciencias_exatas"},
    ],
    "A": [
        {"titulo": "Licenciatura em Comunicação e Jornalismo",
         "instituicao": "UEM — Faculdade de Letras e Ciências Sociais",
         "descricao": "Produção criativa de conteúdos para media, publicidade e comunicação institucional.",
         "area": "comunicacao_artes"},
        {"titulo": "Licenciatura em Design de Comunicação",
         "instituicao": "ISCTEM (Maputo)",
         "descricao": "Expressão visual e design gráfico para marcas, campanhas e plataformas digitais.",
         "area": "comunicacao_artes"},
        {"titulo": "Licenciatura em Línguas Modernas",
         "instituicao": "UEM — Faculdade de Letras e Ciências Sociais",
         "descricao": "Domínio de idiomas estrangeiros para tradução, ensino e relações internacionais.",
         "area": "comunicacao_artes"},
    ],
    "S": [
        {"titulo": "Licenciatura em Enfermagem",
         "instituicao": "UniLúrio (Nampula) / ISCISA (Maputo) / UCM (Beira)",
         "descricao": "Cuidados de saúde humanizados em hospitais, centros de saúde e comunidades rurais.",
         "area": "saude"},
        {"titulo": "Licenciatura em Psicologia",
         "instituicao": "UEM — Faculdade de Educação / UCM (Beira)",
         "descricao": "Suporte ao bem-estar mental e emocional de indivíduos, famílias e grupos.",
         "area": "psicologia_servico_social"},
        {"titulo": "Licenciatura em Educação / Pedagogia",
         "instituicao": "UP — Universidade Pedagógica",
         "descricao": "Formação de professores para transformar vidas através da educação em todo o país.",
         "area": "educacao"},
    ],
    "E": [
        {"titulo": "Licenciatura em Gestão de Empresas",
         "instituicao": "UEM — Faculdade de Economia / UCM / Politécnica",
         "descricao": "Empreender, liderar equipas e gerir organizações num mercado moçambicano em crescimento.",
         "area": "gestao_economia_financas"},
        {"titulo": "Licenciatura em Direito",
         "instituicao": "UEM — Faculdade de Direito / ISRI / UCM",
         "descricao": "Advocacia, direito dos negócios, magistratura e serviço público.",
         "area": "direito_admin_publica"},
        {"titulo": "Licenciatura em Economia",
         "instituicao": "UEM — Faculdade de Economia",
         "descricao": "Análise de políticas económicas e financeiras para o desenvolvimento nacional.",
         "area": "gestao_economia_financas"},
    ],
    "C": [
        {"titulo": "Licenciatura em Contabilidade e Auditoria",
         "instituicao": "UEM / UCM / ISCTEM / Politécnica",
         "descricao": "Controlo financeiro e fiscal indispensável a qualquer organização pública ou privada.",
         "area": "gestao_economia_financas"},
        {"titulo": "Licenciatura em Finanças e Banca",
         "instituicao": "ISCTEM (Maputo) / Politécnica (Maputo)",
         "descricao": "Gestão de recursos financeiros, crédito e mercados de capitais no sistema bancário nacional.",
         "area": "gestao_economia_financas"},
        {"titulo": "Licenciatura em Administração e Gestão de Empresas",
         "instituicao": "UEM / UCM / Politécnica",
         "descricao": "Organização, processos e gestão de recursos em empresas, ONGs e serviços do Estado.",
         "area": "gestao_economia_financas"},
    ],
}


# ---------------------------------------------------------------------------
# Empregabilidade por sector de curso e por província (Funcionalidade A)
# ---------------------------------------------------------------------------
# Estimativa qualitativa (Alto / Médio / Baixo) sintetizada a partir de:
#   - INE Moçambique — IV Recenseamento Geral da População e Habitação 2017
#     e Inquérito ao Orçamento Familiar (IOF) 2019-2020 (ine.gov.mz)
#   - Banco Mundial — dados de emprego por sector e região
#     (data.worldbank.org/country/MZ)
#   - INHEA — alinhamento entre ensino superior e mercado de trabalho em
#     Moçambique (inhea.org/ahen/mozambique)
#
# O INE/Banco Mundial não publicam dados ao nível "curso × província" — esta
# tabela é uma síntese qualitativa razoável a partir desses dados sectoriais e
# regionais, alinhada com os polos económicos conhecidos de cada província
# (ex: Tete/Cabo Delgado para minas e gás, Sofala/Maputo para porto e
# logística). Deve ser revista/ajustada antes da defesa da monografia caso
# surjam dados mais finos.
PROVINCE_EMPLOYABILITY: dict[str, dict[str, str]] = {
    "engenharia_tic": {
        "Maputo Cidade": "Alto", "Maputo Província": "Alto", "Sofala": "Alto",
        "Nampula": "Médio", "Tete": "Médio", "Cabo Delgado": "Médio",
        "Manica": "Baixo", "Zambézia": "Baixo", "Gaza": "Baixo",
        "Inhambane": "Baixo", "Niassa": "Baixo",
    },
    "engenharia_civil_construcao": {
        "Maputo Cidade": "Alto", "Maputo Província": "Alto", "Sofala": "Alto",
        "Cabo Delgado": "Alto", "Nampula": "Médio", "Tete": "Médio",
        "Manica": "Médio", "Inhambane": "Médio", "Zambézia": "Baixo",
        "Gaza": "Baixo", "Niassa": "Baixo",
    },
    "engenharia_minas_petroleo": {
        "Tete": "Alto", "Cabo Delgado": "Alto", "Nampula": "Alto",
        "Manica": "Médio", "Sofala": "Médio", "Maputo Cidade": "Baixo",
        "Maputo Província": "Baixo", "Zambézia": "Baixo", "Gaza": "Baixo",
        "Inhambane": "Baixo", "Niassa": "Baixo",
    },
    "saude": {
        "Maputo Cidade": "Alto", "Sofala": "Alto", "Maputo Província": "Médio",
        "Nampula": "Médio", "Tete": "Médio", "Zambézia": "Médio",
        "Gaza": "Médio", "Inhambane": "Médio", "Manica": "Baixo",
        "Cabo Delgado": "Baixo", "Niassa": "Baixo",
    },
    "ciencias_exatas": {
        "Maputo Cidade": "Médio", "Maputo Província": "Médio", "Sofala": "Baixo",
        "Nampula": "Baixo", "Tete": "Baixo", "Cabo Delgado": "Baixo",
        "Manica": "Baixo", "Zambézia": "Baixo", "Gaza": "Baixo",
        "Inhambane": "Baixo", "Niassa": "Baixo",
    },
    "educacao": {
        "Sofala": "Alto", "Nampula": "Alto", "Zambézia": "Alto", "Gaza": "Alto",
        "Inhambane": "Alto", "Maputo Cidade": "Médio", "Maputo Província": "Médio",
        "Tete": "Médio", "Manica": "Médio", "Cabo Delgado": "Médio", "Niassa": "Médio",
    },
    "direito_admin_publica": {
        "Maputo Cidade": "Alto", "Maputo Província": "Alto", "Sofala": "Médio",
        "Nampula": "Baixo", "Tete": "Baixo", "Cabo Delgado": "Baixo",
        "Manica": "Baixo", "Zambézia": "Baixo", "Gaza": "Baixo",
        "Inhambane": "Baixo", "Niassa": "Baixo",
    },
    "gestao_economia_financas": {
        "Maputo Cidade": "Alto", "Maputo Província": "Alto", "Sofala": "Médio",
        "Nampula": "Médio", "Tete": "Médio", "Cabo Delgado": "Médio",
        "Manica": "Baixo", "Zambézia": "Baixo", "Gaza": "Baixo",
        "Inhambane": "Baixo", "Niassa": "Baixo",
    },
    "comunicacao_artes": {
        "Maputo Cidade": "Alto", "Maputo Província": "Médio", "Sofala": "Médio",
        "Nampula": "Baixo", "Tete": "Baixo", "Cabo Delgado": "Baixo",
        "Manica": "Baixo", "Zambézia": "Baixo", "Gaza": "Baixo",
        "Inhambane": "Baixo", "Niassa": "Baixo",
    },
    "psicologia_servico_social": {
        "Maputo Cidade": "Médio", "Maputo Província": "Médio", "Sofala": "Médio",
        "Nampula": "Baixo", "Tete": "Baixo", "Cabo Delgado": "Baixo",
        "Manica": "Baixo", "Zambézia": "Baixo", "Gaza": "Baixo",
        "Inhambane": "Baixo", "Niassa": "Baixo",
    },
    "logistica_transportes": {
        "Sofala": "Alto", "Maputo Cidade": "Alto", "Maputo Província": "Alto",
        "Tete": "Médio", "Nampula": "Médio", "Cabo Delgado": "Médio",
        "Manica": "Baixo", "Zambézia": "Baixo", "Gaza": "Baixo",
        "Inhambane": "Baixo", "Niassa": "Baixo",
    },
}

_DADOS_NAO_DISPONIVEIS = "Dados não disponíveis"


def get_employability(area: str | None, provincia: str | None) -> str:
    """Devolve o nível de empregabilidade (Alto/Médio/Baixo) de uma área de
    curso numa província, ou 'Dados não disponíveis' se faltar informação."""
    if not area or not provincia:
        return _DADOS_NAO_DISPONIVEIS
    return PROVINCE_EMPLOYABILITY.get(area, {}).get(provincia, _DADOS_NAO_DISPONIVEIS)


# ---------------------------------------------------------------------------
# Requisitos de acesso às universidades (Funcionalidade B)
# ---------------------------------------------------------------------------
# Dados recolhidos directamente dos websites oficiais de cada universidade
# (consultados em Junho de 2026): uem.mz, isctem.ac.mz, up.ac.mz, ucm.ac.mz,
# isutc.ac.mz, unizambeze.ac.mz. Apenas as áreas aqui listadas foram
# verificadas em fonte primária — as restantes combinações universidade×área
# não estão preenchidas (ver AREA_INSTITUTIONS) para evitar inventar dados.
# Onde não foi possível confirmar um contacto directo (ex: email de admissões),
# indica-se o site oficial em vez de um contacto fabricado.

UNIVERSITY_NAMES: dict[str, str] = {
    "UEM": "Universidade Eduardo Mondlane",
    "ISCTEM": "Instituto Superior de Ciências e Tecnologia de Moçambique",
    "UP": "Universidade Pedagógica",
    "UCM": "Universidade Católica de Moçambique",
    "ISUTC": "Instituto Superior de Transportes e Comunicações",
    "UniZambeze": "Universidade Zambeze",
}

# Quais universidades (códigos) oferecem cada área — só preenchido para as
# combinações com dados de admissão verificados em UNIVERSITY_REQUIREMENTS.
AREA_INSTITUTIONS: dict[str, list[str]] = {
    "engenharia_tic": ["UEM", "ISCTEM", "ISUTC", "UniZambeze"],
    "saude": ["UEM", "ISCTEM"],
    "educacao": ["UP"],
    "direito_admin_publica": ["UEM", "UCM", "UniZambeze"],
    "gestao_economia_financas": ["UEM", "UCM", "ISCTEM"],
    "logistica_transportes": ["ISUTC"],
}

UNIVERSITY_REQUIREMENTS: dict[str, dict[str, dict]] = {
    "UEM": {
        "engenharia_tic": {
            "curso_titulo": "Licenciatura em Engenharia Informática",
            "duracao": "5 anos", "modalidade": "Presencial", "cidade": "Maputo",
            "disciplinas_exigidas": ["Matemática", "Física"],
            "nota_minima": "Exame de admissão específico da UEM (vagas limitadas por curso)",
            "documentos": ["BI ou Passaporte", "Certificado da 12ª classe", "Foto tipo passe", "Comprovativo de pagamento da inscrição"],
            "website": "https://www.uem.mz", "contacto": "cecoma@uem.ac.mz",
        },
        "saude": {
            "curso_titulo": "Licenciatura em Medicina",
            "duracao": "6 anos", "modalidade": "Presencial", "cidade": "Maputo",
            "disciplinas_exigidas": ["Biologia", "Química"],
            "nota_minima": "Exame de admissão específico da UEM — Faculdade de Medicina",
            "documentos": ["BI ou Passaporte", "Certificado da 12ª classe", "Foto tipo passe", "Comprovativo de pagamento da inscrição"],
            "website": "https://www.uem.mz", "contacto": "cecoma@uem.ac.mz",
        },
        "gestao_economia_financas": {
            "curso_titulo": "Licenciatura em Economia",
            "duracao": "4 anos", "modalidade": "Presencial", "cidade": "Maputo",
            "disciplinas_exigidas": ["Matemática"],
            "nota_minima": "Exame de admissão específico da UEM — Faculdade de Economia",
            "documentos": ["BI ou Passaporte", "Certificado da 12ª classe", "Foto tipo passe", "Comprovativo de pagamento da inscrição"],
            "website": "https://www.uem.mz", "contacto": "cecoma@uem.ac.mz",
        },
    },
    "ISCTEM": {
        "engenharia_tic": {
            "curso_titulo": "Licenciatura em Engenharia Informática",
            "duracao": "4 anos", "modalidade": "Laboral e Presencial", "cidade": "Maputo",
            "disciplinas_exigidas": ["Matemática", "Física (Grupos B e C)"],
            "nota_minima": "Provas diagnósticas com média igual ou superior a 10 valores",
            "documentos": ["2 fotografias tipo passe", "Cópia autenticada do BI", "Certificado da 12ª classe autenticado", "Atestado médico", "Comprovativo de pagamento da inscrição"],
            "website": "https://isctem.ac.mz", "contacto": "Consultar isctem.ac.mz",
        },
        "saude": {
            "curso_titulo": "Licenciatura em Medicina Geral",
            "duracao": "6 anos", "modalidade": "Presencial", "cidade": "Maputo",
            "disciplinas_exigidas": ["Biologia", "Química"],
            "nota_minima": "Provas diagnósticas com média igual ou superior a 10 valores",
            "documentos": ["2 fotografias tipo passe", "Cópia autenticada do BI", "Certificado da 12ª classe autenticado", "Atestado médico", "Comprovativo de pagamento da inscrição"],
            "website": "https://isctem.ac.mz", "contacto": "Consultar isctem.ac.mz",
        },
    },
    "UP": {
        "educacao": {
            "curso_titulo": "Licenciatura em Educação / Pedagogia",
            "duracao": "4 anos", "modalidade": "Presencial, Pós-laboral ou À Distância",
            "cidade": "Maputo (também Beira e Nampula)",
            "disciplinas_exigidas": ["Conforme a variante do curso"],
            "nota_minima": "Exame de admissão da Comissão de Exames de Admissão da UP",
            "documentos": ["BI ou Passaporte", "Certificado da 12ª classe", "Foto tipo passe", "Comprovativo de pagamento da candidatura"],
            "website": "https://www.up.ac.mz", "contacto": "atendimento.comissao.upm@gmail.com",
        },
    },
    "UCM": {
        "gestao_economia_financas": {
            "curso_titulo": "Licenciatura em Administração e Gestão de Empresas",
            "duracao": "4 anos", "modalidade": "Presencial", "cidade": "Beira",
            "disciplinas_exigidas": ["Matemática"],
            "nota_minima": "Processo de admissão da UCM — consultar edital anual",
            "documentos": ["BI ou Passaporte", "Certificado da 12ª classe", "Foto tipo passe", "Inscrição via esura.ucm.ac.mz"],
            "website": "https://www.ucm.ac.mz", "contacto": "reitoria@ucm.ac.mz",
        },
    },
    "ISUTC": {
        "logistica_transportes": {
            "curso_titulo": "Licenciatura em Gestão de Logística e Transportes",
            "duracao": "4 anos", "modalidade": "Presencial ou À Distância", "cidade": "Maputo",
            "disciplinas_exigidas": ["Matemática"],
            "nota_minima": "Admissão directa com média ≥14 na 12ª classe, ou exame de admissão",
            "documentos": ["BI, DIRE ou Passaporte (cópia autenticada)", "Certificado da 12ª classe", "Comprovativo de pagamento"],
            "website": "https://www.isutc.ac.mz", "contacto": "estuda@isutc.ac.mz",
        },
    },
    "UniZambeze": {
        "engenharia_tic": {
            "curso_titulo": "Licenciatura em Engenharia Informática",
            "duracao": "4 anos", "modalidade": "Presencial", "cidade": "Beira",
            "disciplinas_exigidas": ["Matemática", "Física"],
            "nota_minima": "Exame de acesso, conforme o Regulamento de Acesso aos Cursos de Graduação da UniZambeze",
            "documentos": ["BI ou Passaporte", "Certificado da 12ª classe", "Foto tipo passe", "Comprovativo de pagamento de inscrição"],
            "website": "https://unizambeze.ac.mz", "contacto": "Consultar unizambeze.ac.mz/admissao",
        },
        "direito_admin_publica": {
            "curso_titulo": "Licenciatura em Direito",
            "duracao": "5 anos", "modalidade": "Presencial", "cidade": "Beira",
            "disciplinas_exigidas": ["Conforme o Regulamento de Acesso"],
            "nota_minima": "Exame de acesso, conforme o Regulamento de Acesso aos Cursos de Graduação da UniZambeze",
            "documentos": ["BI ou Passaporte", "Certificado da 12ª classe", "Foto tipo passe", "Comprovativo de pagamento de inscrição"],
            "website": "https://unizambeze.ac.mz", "contacto": "Consultar unizambeze.ac.mz/admissao",
        },
    },
}


def get_university_requirement(codigo: str, area: str) -> dict | None:
    """Detalhe de admissão de uma universidade para uma área de curso, ou
    None se a combinação não tiver dados verificados."""
    entry = UNIVERSITY_REQUIREMENTS.get(codigo, {}).get(area)
    if not entry:
        return None
    return {**entry, "codigo": codigo, "universidade": UNIVERSITY_NAMES.get(codigo, codigo)}


def lookup_courses(holland_code: str) -> list[dict]:
    """Retorna sugestões de cursos moçambicanos para um código Holland.

    Tenta por ordem: código de 3 letras → top 2 → top 1.
    """
    if len(holland_code) >= 3:
        key3 = holland_code[:3].upper()
        if key3 in COURSE_MAP:
            return COURSE_MAP[key3]

    if len(holland_code) >= 2:
        key2 = holland_code[:2].upper()
        if key2 in COURSE_MAP:
            return COURSE_MAP[key2]

    if len(holland_code) >= 1:
        key1 = holland_code[0].upper()
        if key1 in COURSE_MAP:
            return COURSE_MAP[key1]

    return []
