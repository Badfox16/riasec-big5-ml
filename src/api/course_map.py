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
"""
from __future__ import annotations

COURSE_MAP: dict[str, list[dict]] = {

    # ── 3 letras ─────────────────────────────────────────────────────────────

    "RIC": [
        {"titulo": "Licenciatura em Engenharia Electrotécnica",
         "instituicao": "UEM — Faculdade de Engenharia / ISUTC",
         "descricao": "Forma engenheiros para projectar e manter sistemas eléctricos, de automação e controlo industrial."},
        {"titulo": "Licenciatura em Engenharia Mecânica",
         "instituicao": "UEM — Faculdade de Engenharia",
         "descricao": "Habilita para conceber, desenvolver e operar máquinas, motores e sistemas mecânicos."},
        {"titulo": "Licenciatura em Engenharia de Telecomunicações",
         "instituicao": "ISUTC (Maputo)",
         "descricao": "Preparação para instalar, gerir e inovar em redes de comunicação e sistemas de transmissão."},
    ],
    "RCI": [
        {"titulo": "Licenciatura em Engenharia Informática",
         "instituicao": "UEM — Faculdade de Engenharia / ISUTC",
         "descricao": "Combina hardware, redes e programação para desenvolver e manter sistemas computacionais."},
        {"titulo": "Licenciatura em Electrónica Industrial",
         "instituicao": "UEM — Faculdade de Engenharia",
         "descricao": "Foca montagem, teste e reparação de equipamentos electrónicos em contexto industrial."},
    ],
    "RIE": [
        {"titulo": "Licenciatura em Engenharia Civil",
         "instituicao": "UEM — Faculdade de Engenharia / UCM (Beira)",
         "descricao": "Forma engenheiros para planear, projectar e supervisionar obras de construção e infraestrutura."},
        {"titulo": "Licenciatura em Engenharia de Minas",
         "instituicao": "UEM — Faculdade de Engenharia",
         "descricao": "Habilita para a exploração sustentável de recursos minerais, área estratégica em Moçambique."},
        {"titulo": "Licenciatura em Arquitectura e Planeamento Físico",
         "instituicao": "UEM — Faculdade de Arquitectura e Planeamento Físico",
         "descricao": "Combina criatividade e técnica para projectar edifícios e ordenar o território."},
    ],
    "IRC": [
        {"titulo": "Licenciatura em Ciências da Computação",
         "instituicao": "UEM — Departamento de Matemática e Informática",
         "descricao": "Base teórica sólida em algoritmos, estruturas de dados e desenvolvimento de software."},
        {"titulo": "Licenciatura em Matemática",
         "instituicao": "UEM / UP",
         "descricao": "Desenvolve raciocínio abstracto e capacidade analítica aplicáveis em ciência, finanças e educação."},
        {"titulo": "Licenciatura em Engenharia Informática",
         "instituicao": "UEM — Faculdade de Engenharia / ISUTC",
         "descricao": "Une engenharia de sistemas e programação para criar soluções tecnológicas de impacto."},
    ],
    "IRS": [
        {"titulo": "Licenciatura em Medicina",
         "instituicao": "UEM — Faculdade de Medicina",
         "descricao": "Forma médicos generalistas com competências para diagnóstico, tratamento e prevenção de doenças."},
        {"titulo": "Licenciatura em Farmácia",
         "instituicao": "UEM — Faculdade de Medicina / ISCISA (Maputo)",
         "descricao": "Prepara para avaliação, dispensa e aconselhamento sobre medicamentos em contexto clínico e comunitário."},
        {"titulo": "Licenciatura em Enfermagem",
         "instituicao": "UniLúrio (Nampula) / ISCISA (Maputo) / UCM (Beira)",
         "descricao": "Habilita para prestar cuidados de saúde integrais e apoio a pacientes em unidades sanitárias."},
    ],
    "IAR": [
        {"titulo": "Licenciatura em Arquitectura e Planeamento Físico",
         "instituicao": "UEM — Faculdade de Arquitectura e Planeamento Físico",
         "descricao": "Projectar espaços habitáveis e sustentáveis, conciliando estética, função e contexto local."},
        {"titulo": "Licenciatura em Design de Comunicação",
         "instituicao": "ISCTEM (Maputo)",
         "descricao": "Foca criação visual, identidade de marca e comunicação gráfica para meios digitais e impressos."},
        {"titulo": "Licenciatura em Comunicação e Jornalismo",
         "instituicao": "UEM — Faculdade de Letras e Ciências Sociais",
         "descricao": "Forma comunicadores criativos e críticos para media, relações públicas e produção de conteúdos."},
    ],
    "IAS": [
        {"titulo": "Licenciatura em Psicologia",
         "instituicao": "UEM — Faculdade de Educação / UCM (Beira)",
         "descricao": "Estuda o comportamento humano e habilita para avaliação, aconselhamento e intervenção psicológica."},
        {"titulo": "Licenciatura em Ciências Biomédicas",
         "instituicao": "UniLúrio (Nampula) / ISCISA (Maputo)",
         "descricao": "Combina ciências básicas da saúde com laboratório clínico e investigação biomédica."},
        {"titulo": "Licenciatura em Biologia",
         "instituicao": "UEM — Faculdade de Ciências",
         "descricao": "Explora os sistemas vivos desde a célula ao ecossistema, com aplicações em saúde, ambiente e agro-pecuária."},
    ],
    "AIR": [
        {"titulo": "Licenciatura em Design de Comunicação",
         "instituicao": "ISCTEM (Maputo)",
         "descricao": "Cria interfaces visuais e experiências de utilizador para plataformas digitais e impressas."},
        {"titulo": "Licenciatura em Comunicação e Multimédia",
         "instituicao": "UEM — Faculdade de Letras e Ciências Sociais / ISCTEM",
         "descricao": "Produção audiovisual, fotografia, edição digital e gestão de conteúdos para meios de comunicação."},
    ],
    "AIS": [
        {"titulo": "Licenciatura em Comunicação e Jornalismo",
         "instituicao": "UEM — Faculdade de Letras e Ciências Sociais",
         "descricao": "Investigação, redacção e difusão de informação para imprensa, rádio, televisão e meios digitais."},
        {"titulo": "Licenciatura em Línguas Modernas",
         "instituicao": "UEM — Faculdade de Letras e Ciências Sociais",
         "descricao": "Domínio aprofundado de línguas estrangeiras com aplicação em tradução, ensino e relações internacionais."},
        {"titulo": "Licenciatura em Relações Internacionais e Diplomacia",
         "instituicao": "ISRI (Maputo)",
         "descricao": "Estuda política externa, direito internacional e diplomacia num contexto de integração regional africana."},
    ],
    "ASE": [
        {"titulo": "Licenciatura em Comunicação e Jornalismo",
         "instituicao": "UEM — Faculdade de Letras e Ciências Sociais",
         "descricao": "Forma profissionais de media com capacidade criativa e sentido crítico para informar a sociedade."},
        {"titulo": "Licenciatura em Relações Públicas e Comunicação Organizacional",
         "instituicao": "ISRI (Maputo) / ISCTEM (Maputo)",
         "descricao": "Gestão de imagem, comunicação institucional e estratégias de relação com públicos."},
        {"titulo": "Licenciatura em Línguas e Literatura",
         "instituicao": "UEM — Faculdade de Letras e Ciências Sociais",
         "descricao": "Estudo aprofundado da literatura e linguística com saídas no ensino, tradução e edição."},
    ],
    "SAI": [
        {"titulo": "Licenciatura em Enfermagem",
         "instituicao": "UEM — Escola de Ciências da Saúde / UniLúrio / ISCISA",
         "descricao": "Prestação de cuidados de saúde centrados no paciente em hospitais, centros de saúde e comunidades."},
        {"titulo": "Licenciatura em Serviço Social",
         "instituicao": "UP (Maputo) / UCM (Beira)",
         "descricao": "Intervenção social com indivíduos, famílias e comunidades vulneráveis para promover inclusão e bem-estar."},
        {"titulo": "Licenciatura em Psicologia",
         "instituicao": "UEM — Faculdade de Educação / UCM (Beira)",
         "descricao": "Avaliação e apoio psicológico em contextos clínicos, educacionais e organizacionais."},
    ],
    "SEA": [
        {"titulo": "Licenciatura em Educação / Pedagogia",
         "instituicao": "UP — Universidade Pedagógica (Maputo / Beira / Nampula)",
         "descricao": "Forma professores e especialistas em educação para todos os níveis do sistema de ensino moçambicano."},
        {"titulo": "Licenciatura em Psicopedagogia",
         "instituicao": "UP (Maputo)",
         "descricao": "Apoia o desenvolvimento cognitivo e emocional de estudantes, com foco em inclusão e orientação escolar."},
        {"titulo": "Licenciatura em Serviço Social",
         "instituicao": "UP (Maputo) / UCM (Beira)",
         "descricao": "Promoção da justiça social e apoio a populações em situação de vulnerabilidade."},
    ],
    "SEC": [
        {"titulo": "Licenciatura em Gestão de Recursos Humanos",
         "instituicao": "UEM — Faculdade de Economia / ISCTEM (Maputo)",
         "descricao": "Recrutamento, desenvolvimento e gestão do talento em organizações públicas e privadas."},
        {"titulo": "Licenciatura em Administração Pública",
         "instituicao": "ISAP (Maputo) / UP",
         "descricao": "Gestão de instituições do Estado, políticas públicas e serviços à cidadania."},
        {"titulo": "Licenciatura em Direito",
         "instituicao": "UCM (Beira) / UEM — Faculdade de Direito",
         "descricao": "Formação jurídica para advocacia, magistratura, assessoria jurídica e serviço público."},
    ],
    "ESA": [
        {"titulo": "Licenciatura em Gestão de Empresas",
         "instituicao": "UEM — Faculdade de Economia / UCM / Politécnica (Maputo)",
         "descricao": "Empreendedorismo, liderança e gestão estratégica de organizações em contexto moçambicano e africano."},
        {"titulo": "Licenciatura em Direito",
         "instituicao": "UEM — Faculdade de Direito / ISRI / UCM",
         "descricao": "Base legal para advocacia, negócios, diplomacia e administração pública."},
        {"titulo": "Licenciatura em Relações Internacionais e Diplomacia",
         "instituicao": "ISRI (Maputo)",
         "descricao": "Negociação, política externa e comércio internacional numa África em rápida transformação."},
    ],
    "ECS": [
        {"titulo": "Licenciatura em Economia",
         "instituicao": "UEM — Faculdade de Economia",
         "descricao": "Análise de mercados, políticas económicas e desenvolvimento — área crítica para Moçambique."},
        {"titulo": "Licenciatura em Gestão Comercial e Marketing",
         "instituicao": "ISCTEM (Maputo) / Politécnica (Maputo)",
         "descricao": "Estratégias de vendas, marketing digital e gestão de clientes em mercados emergentes."},
        {"titulo": "Licenciatura em Administração e Gestão de Empresas",
         "instituicao": "UEM — Faculdade de Economia / Politécnica",
         "descricao": "Gestão operacional e estratégica de empresas com foco no contexto empresarial moçambicano."},
    ],
    "ERC": [
        {"titulo": "Licenciatura em Engenharia Industrial e de Produção",
         "instituicao": "UEM — Faculdade de Engenharia",
         "descricao": "Optimização de processos produtivos, logística e gestão de operações industriais."},
        {"titulo": "Licenciatura em Gestão de Operações e Logística",
         "instituicao": "ISUTC (Maputo) / Politécnica",
         "descricao": "Cadeias de abastecimento, transporte e distribuição — competências em alta demanda em Moçambique."},
    ],
    "CES": [
        {"titulo": "Licenciatura em Contabilidade e Auditoria",
         "instituicao": "UEM — Faculdade de Economia / UCM / ISCTEM / Politécnica",
         "descricao": "Registo, análise e auditoria de informação financeira para empresas e organismos públicos."},
        {"titulo": "Licenciatura em Finanças e Banca",
         "instituicao": "ISCTEM (Maputo) / Politécnica (Maputo)",
         "descricao": "Gestão de activos, mercados financeiros e operações bancárias no sistema financeiro moçambicano."},
        {"titulo": "Licenciatura em Administração e Gestão de Empresas",
         "instituicao": "UEM / UCM / Politécnica",
         "descricao": "Administração de recursos humanos, financeiros e operacionais em organizações de todos os sectores."},
    ],
    "CRS": [
        {"titulo": "Licenciatura em Gestão de Logística e Transportes",
         "instituicao": "ISUTC (Maputo)",
         "descricao": "Planeamento e controlo de cadeias logísticas, armazéns e transporte multimodal."},
        {"titulo": "Licenciatura em Administração de Empresas",
         "instituicao": "Politécnica (Maputo) / UCM (Beira)",
         "descricao": "Processos administrativos, gestão de stocks e organização de escritórios e unidades de serviço."},
    ],
    "CIR": [
        {"titulo": "Licenciatura em Estatística",
         "instituicao": "UEM — Faculdade de Ciências",
         "descricao": "Recolha, tratamento e interpretação de dados — competência fundamental para investigação e políticas públicas."},
        {"titulo": "Licenciatura em Contabilidade e Auditoria",
         "instituicao": "Politécnica (Maputo) / UEM / ISCTEM",
         "descricao": "Controlo financeiro rigoroso, conformidade fiscal e auditoria de sistemas contabilísticos."},
        {"titulo": "Licenciatura em Ciências da Computação / Sistemas de Informação",
         "instituicao": "UEM — Faculdade de Engenharia / ISCTEM",
         "descricao": "Gestão de bases de dados, análise de dados e desenvolvimento de sistemas de informação."},
    ],

    # ── 2 letras (fallback) ───────────────────────────────────────────────────

    "RI": [
        {"titulo": "Licenciatura em Engenharia Electrotécnica",
         "instituicao": "UEM / ISUTC",
         "descricao": "Sistemas eléctricos, electrónica e automação em contexto industrial e de serviços."},
        {"titulo": "Licenciatura em Engenharia Civil",
         "instituicao": "UEM / UCM",
         "descricao": "Infra-estrutura, construção e gestão de obras — área de elevada procura em Moçambique."},
    ],
    "IR": [
        {"titulo": "Licenciatura em Engenharia Informática",
         "instituicao": "UEM / ISUTC",
         "descricao": "Desenvolvimento de software, sistemas embebidos e redes para o sector tecnológico."},
        {"titulo": "Licenciatura em Ciências da Computação",
         "instituicao": "UEM — Faculdade de Engenharia",
         "descricao": "Base científica para inovação tecnológica, inteligência artificial e análise de dados."},
    ],
    "IA": [
        {"titulo": "Licenciatura em Arquitectura e Planeamento Físico",
         "instituicao": "UEM",
         "descricao": "Projectar e planear espaços urbanos e rurais com impacto positivo na qualidade de vida."},
        {"titulo": "Licenciatura em Design de Comunicação",
         "instituicao": "ISCTEM",
         "descricao": "Identidade visual, UX/UI e comunicação gráfica para empresas e organizações."},
    ],
    "AI": [
        {"titulo": "Licenciatura em Comunicação e Multimédia",
         "instituicao": "UEM / ISCTEM",
         "descricao": "Produção criativa com suporte tecnológico para media, publicidade e comunicação digital."},
        {"titulo": "Licenciatura em Design de Comunicação",
         "instituicao": "ISCTEM (Maputo)",
         "descricao": "Arte aplicada a interfaces digitais, publicações e campanhas de comunicação."},
    ],
    "AS": [
        {"titulo": "Licenciatura em Comunicação e Jornalismo",
         "instituicao": "UEM — Faculdade de Letras e Ciências Sociais",
         "descricao": "Expressão criativa e sentido crítico ao serviço da informação e do debate público."},
        {"titulo": "Licenciatura em Línguas e Literatura",
         "instituicao": "UEM — Faculdade de Letras e Ciências Sociais",
         "descricao": "Literatura moçambicana e africana, linguística e criação literária."},
    ],
    "SA": [
        {"titulo": "Licenciatura em Psicologia",
         "instituicao": "UEM / UCM",
         "descricao": "Compreender o comportamento humano para apoiar indivíduos e comunidades."},
        {"titulo": "Licenciatura em Educação de Infância",
         "instituicao": "UP (Maputo / Beira / Nampula)",
         "descricao": "Estimulação do desenvolvimento infantil através de actividades educativas e lúdicas."},
    ],
    "SE": [
        {"titulo": "Licenciatura em Educação / Pedagogia",
         "instituicao": "UP — Universidade Pedagógica",
         "descricao": "Formação de professores e especialistas em educação para escolas e contextos não-formais."},
        {"titulo": "Licenciatura em Serviço Social",
         "instituicao": "UP / UCM",
         "descricao": "Apoio a comunidades e famílias vulneráveis, promoção de direitos e inclusão social."},
    ],
    "ES": [
        {"titulo": "Licenciatura em Gestão de Empresas",
         "instituicao": "UEM / UCM / Politécnica",
         "descricao": "Liderança, estratégia e empreendedorismo para criar e gerir organizações de sucesso."},
        {"titulo": "Licenciatura em Direito",
         "instituicao": "UEM / ISRI / UCM",
         "descricao": "Habilitação para advocacia, mediação e consultoria jurídica em empresa ou serviço público."},
    ],
    "EC": [
        {"titulo": "Licenciatura em Economia",
         "instituicao": "UEM — Faculdade de Economia",
         "descricao": "Análise económica, planeamento financeiro e apoio a decisões em organizações e governo."},
        {"titulo": "Licenciatura em Gestão Comercial e Marketing",
         "instituicao": "ISCTEM / Politécnica",
         "descricao": "Vendas, marketing e gestão de relações com clientes em mercados competitivos."},
    ],
    "CE": [
        {"titulo": "Licenciatura em Contabilidade e Auditoria",
         "instituicao": "UEM / UCM / ISCTEM / Politécnica",
         "descricao": "Registos financeiros, conformidade fiscal e consultoria de gestão para empresas e estado."},
        {"titulo": "Licenciatura em Finanças e Banca",
         "instituicao": "ISCTEM / Politécnica",
         "descricao": "Sistema bancário, mercados de capitais e gestão financeira empresarial."},
    ],
    "CR": [
        {"titulo": "Licenciatura em Gestão de Logística e Transportes",
         "instituicao": "ISUTC (Maputo)",
         "descricao": "Logística, cadeia de abastecimento e transporte num país com corredores estratégicos."},
        {"titulo": "Licenciatura em Administração de Empresas",
         "instituicao": "Politécnica / UCM",
         "descricao": "Organização, processos administrativos e controlo operacional em diversas organizações."},
    ],
    "RC": [
        {"titulo": "Licenciatura em Engenharia Civil",
         "instituicao": "UEM / UCM",
         "descricao": "Construção de infra-estruturas essenciais ao desenvolvimento do país."},
        {"titulo": "Licenciatura em Engenharia Mecânica",
         "instituicao": "UEM",
         "descricao": "Concepção e manutenção de sistemas mecânicos para indústria, energia e transporte."},
    ],

    # ── 1 letra (fallback final) ──────────────────────────────────────────────

    "R": [
        {"titulo": "Licenciatura em Engenharia Civil",
         "instituicao": "UEM — Faculdade de Engenharia / UCM (Beira)",
         "descricao": "Projectar e construir estradas, pontes, edifícios e sistemas de saneamento."},
        {"titulo": "Licenciatura em Engenharia Mecânica",
         "instituicao": "UEM — Faculdade de Engenharia",
         "descricao": "Desenvolver e manter máquinas, motores e sistemas de produção industrial."},
        {"titulo": "Licenciatura em Engenharia Electrotécnica",
         "instituicao": "UEM / ISUTC (Maputo)",
         "descricao": "Sistemas eléctricos, energias renováveis e automação — sectores em expansão em Moçambique."},
    ],
    "I": [
        {"titulo": "Licenciatura em Medicina",
         "instituicao": "UEM — Faculdade de Medicina",
         "descricao": "Formação para diagnosticar, tratar e prevenir doenças, respondendo a necessidades críticas de saúde."},
        {"titulo": "Licenciatura em Engenharia Informática",
         "instituicao": "UEM / ISUTC (Maputo)",
         "descricao": "Desenvolvimento de software e sistemas digitais para os sectores público e privado."},
        {"titulo": "Licenciatura em Biologia",
         "instituicao": "UEM — Faculdade de Ciências",
         "descricao": "Ciências da vida aplicadas à saúde, conservação ambiental e agro-pecuária."},
        {"titulo": "Licenciatura em Química",
         "instituicao": "UEM — Faculdade de Ciências",
         "descricao": "Base científica para indústria farmacêutica, alimentar, mineira e ambiental."},
    ],
    "A": [
        {"titulo": "Licenciatura em Comunicação e Jornalismo",
         "instituicao": "UEM — Faculdade de Letras e Ciências Sociais",
         "descricao": "Produção criativa de conteúdos para media, publicidade e comunicação institucional."},
        {"titulo": "Licenciatura em Design de Comunicação",
         "instituicao": "ISCTEM (Maputo)",
         "descricao": "Expressão visual e design gráfico para marcas, campanhas e plataformas digitais."},
        {"titulo": "Licenciatura em Línguas Modernas",
         "instituicao": "UEM — Faculdade de Letras e Ciências Sociais",
         "descricao": "Domínio de idiomas estrangeiros para tradução, ensino e relações internacionais."},
    ],
    "S": [
        {"titulo": "Licenciatura em Enfermagem",
         "instituicao": "UniLúrio (Nampula) / ISCISA (Maputo) / UCM (Beira)",
         "descricao": "Cuidados de saúde humanizados em hospitais, centros de saúde e comunidades rurais."},
        {"titulo": "Licenciatura em Psicologia",
         "instituicao": "UEM — Faculdade de Educação / UCM (Beira)",
         "descricao": "Suporte ao bem-estar mental e emocional de indivíduos, famílias e grupos."},
        {"titulo": "Licenciatura em Educação / Pedagogia",
         "instituicao": "UP — Universidade Pedagógica",
         "descricao": "Formação de professores para transformar vidas através da educação em todo o país."},
    ],
    "E": [
        {"titulo": "Licenciatura em Gestão de Empresas",
         "instituicao": "UEM — Faculdade de Economia / UCM / Politécnica",
         "descricao": "Empreender, liderar equipas e gerir organizações num mercado moçambicano em crescimento."},
        {"titulo": "Licenciatura em Direito",
         "instituicao": "UEM — Faculdade de Direito / ISRI / UCM",
         "descricao": "Advocacia, direito dos negócios, magistratura e serviço público."},
        {"titulo": "Licenciatura em Economia",
         "instituicao": "UEM — Faculdade de Economia",
         "descricao": "Análise de políticas económicas e financeiras para o desenvolvimento nacional."},
    ],
    "C": [
        {"titulo": "Licenciatura em Contabilidade e Auditoria",
         "instituicao": "UEM / UCM / ISCTEM / Politécnica",
         "descricao": "Controlo financeiro e fiscal indispensável a qualquer organização pública ou privada."},
        {"titulo": "Licenciatura em Finanças e Banca",
         "instituicao": "ISCTEM (Maputo) / Politécnica (Maputo)",
         "descricao": "Gestão de recursos financeiros, crédito e mercados de capitais no sistema bancário nacional."},
        {"titulo": "Licenciatura em Administração e Gestão de Empresas",
         "instituicao": "UEM / UCM / Politécnica",
         "descricao": "Organização, processos e gestão de recursos em empresas, ONGs e serviços do Estado."},
    ],
}


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
