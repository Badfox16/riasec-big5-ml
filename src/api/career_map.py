"""
Mapeamento estático de Códigos Holland → sugestões de carreira (em Português).
Lookup hierárquico: 3 letras → 2 letras → 1 letra.
"""

from __future__ import annotations

# ---------------------------------------------------------------------------
# Estrutura de cada carreira
# ---------------------------------------------------------------------------
# { "titulo": str, "descricao": str }

CAREER_MAP: dict[str, list[dict]] = {
    # ── 3 letras ─────────────────────────────────────────────────────────────
    "RIC": [
        {"titulo": "Técnico de Telecomunicações", "descricao": "Instala e mantém redes de comunicação e sistemas eletrónicos."},
        {"titulo": "Técnico de Automação Industrial", "descricao": "Programa e mantém equipamentos automatizados em fábricas."},
        {"titulo": "Engenheiro Eletrotécnico", "descricao": "Projeta sistemas elétricos e de controlo industrial."},
    ],
    "RCI": [
        {"titulo": "Técnico de Informática / Suporte IT", "descricao": "Diagnostica e resolve problemas de hardware e software."},
        {"titulo": "Técnico de Eletrônica Industrial", "descricao": "Monta, testa e repara equipamentos eletrônicos."},
    ],
    "RIE": [
        {"titulo": "Engenheiro Civil", "descricao": "Planeia e supervisiona projetos de construção e infraestrutura."},
        {"titulo": "Engenheiro Mecânico", "descricao": "Concebe e desenvolve sistemas mecânicos e máquinas."},
        {"titulo": "Técnico de Campo (Telecom)", "descricao": "Instala equipamentos de telecomunicações em campo."},
    ],
    "IRC": [
        {"titulo": "Cientista de Dados", "descricao": "Analisa grandes volumes de dados para extrair padrões e insights."},
        {"titulo": "Analista de Sistemas", "descricao": "Estuda e melhora processos de TI em organizações."},
        {"titulo": "Investigador em Engenharia", "descricao": "Conduz pesquisa aplicada para desenvolver novas tecnologias."},
    ],
    "IRS": [
        {"titulo": "Médico / Clínico Geral", "descricao": "Diagnostica e trata doenças em contexto clínico."},
        {"titulo": "Farmacêutico", "descricao": "Avalia, dispensa e aconselha sobre medicamentos."},
        {"titulo": "Fisioterapeuta", "descricao": "Reabilita pacientes através de terapia física."},
    ],
    "IAR": [
        {"titulo": "Arquiteto", "descricao": "Projeta edifícios e espaços conciliando estética e funcionalidade."},
        {"titulo": "Designer Industrial", "descricao": "Cria produtos físicos com foco em usabilidade e design."},
    ],
    "IAS": [
        {"titulo": "Psicólogo Clínico", "descricao": "Avalia e trata distúrbios mentais e emocionais."},
        {"titulo": "Investigador em Ciências Sociais", "descricao": "Estuda comportamento humano e fenómenos sociais."},
        {"titulo": "Nutricionista", "descricao": "Planeia dietas e promove hábitos alimentares saudáveis."},
    ],
    "AIR": [
        {"titulo": "Designer de Produto / UX Designer", "descricao": "Cria interfaces e produtos centrados na experiência do utilizador."},
        {"titulo": "Realizador / Produtor Multimédia", "descricao": "Concebe e produz conteúdos audiovisuais e digitais."},
    ],
    "AIS": [
        {"titulo": "Jornalista / Redator", "descricao": "Investiga, escreve e publica conteúdos informativos."},
        {"titulo": "Designer Gráfico", "descricao": "Cria materiais visuais para marcas e comunicação."},
    ],
    "ASE": [
        {"titulo": "Professor do Ensino Secundário", "descricao": "Ensina e inspira alunos em disciplinas humanísticas ou artísticas."},
        {"titulo": "Gestor de Redes Sociais", "descricao": "Cria e gere conteúdos em plataformas digitais para marcas."},
        {"titulo": "Relações Públicas", "descricao": "Gere a imagem e comunicação externa de organizações."},
    ],
    "SAI": [
        {"titulo": "Terapeuta Ocupacional", "descricao": "Auxilia pessoas a recuperar ou desenvolver capacidades funcionais."},
        {"titulo": "Assistente Social", "descricao": "Apoia indivíduos e famílias em situação de vulnerabilidade."},
        {"titulo": "Enfermeiro", "descricao": "Presta cuidados de saúde e suporte emocional a pacientes."},
    ],
    "SEA": [
        {"titulo": "Orientador Escolar / Psicopedagogo", "descricao": "Apoia o desenvolvimento académico e vocacional de estudantes."},
        {"titulo": "Animador Sociocultural", "descricao": "Organiza atividades culturais e recreativas em comunidades."},
    ],
    "SEC": [
        {"titulo": "Gestor de Recursos Humanos", "descricao": "Recruta, forma e gere o bem-estar dos colaboradores."},
        {"titulo": "Trabalhador Social / Coordenador de ONG", "descricao": "Planeia e executa programas de impacto social."},
    ],
    "ESA": [
        {"titulo": "Empreendedor / Fundador de Startup", "descricao": "Identifica oportunidades e cria negócios inovadores."},
        {"titulo": "Gestor de Projetos", "descricao": "Planeia, coordena e entrega projetos dentro de prazo e orçamento."},
    ],
    "ECS": [
        {"titulo": "Gestor Comercial / Diretor de Vendas", "descricao": "Lidera equipas de vendas e define estratégias comerciais."},
        {"titulo": "Consultor de Gestão", "descricao": "Analisa organizações e propõe melhorias operacionais e estratégicas."},
    ],
    "ERC": [
        {"titulo": "Engenheiro de Produção", "descricao": "Otimiza processos industriais e cadeias de produção."},
        {"titulo": "Gestor de Operações", "descricao": "Supervisiona a eficiência operacional de uma organização."},
    ],
    "CES": [
        {"titulo": "Contabilista / Auditor", "descricao": "Regista e analisa informação financeira de organizações."},
        {"titulo": "Analista Financeiro", "descricao": "Avalia investimentos e prepara relatórios financeiros."},
        {"titulo": "Administrador de Empresas", "descricao": "Gere recursos e processos administrativos em organizações."},
    ],
    "CRS": [
        {"titulo": "Técnico Administrativo", "descricao": "Organiza documentos, registos e processos de escritório."},
        {"titulo": "Operador Logístico", "descricao": "Controla stocks, receção e expedição de mercadorias."},
    ],
    "CIR": [
        {"titulo": "Analista de Qualidade / Testes de Software (QA)", "descricao": "Verifica conformidade de produtos com especificações técnicas."},
        {"titulo": "Técnico de Estatística", "descricao": "Recolhe, processa e interpreta dados numéricos para relatórios."},
    ],
    # ── 2 letras (fallback) ───────────────────────────────────────────────────
    "RI": [
        {"titulo": "Técnico de Eletrónica", "descricao": "Trabalha com sistemas eletrónicos e equipamentos técnicos."},
        {"titulo": "Técnico de Laboratório", "descricao": "Apoia investigação científica em ambiente laboratorial."},
    ],
    "IR": [
        {"titulo": "Engenheiro de Software", "descricao": "Desenvolve e mantém sistemas e aplicações informáticas."},
        {"titulo": "Investigador Científico", "descricao": "Realiza pesquisa para expandir o conhecimento em diversas áreas."},
    ],
    "IA": [
        {"titulo": "Designer de Interfaces (UI/UX)", "descricao": "Combina análise e criatividade para criar experiências digitais."},
        {"titulo": "Jornalista Científico", "descricao": "Comunica descobertas científicas ao público geral."},
    ],
    "AI": [
        {"titulo": "Arquiteto de Software", "descricao": "Define a estrutura técnica de sistemas complexos."},
        {"titulo": "Música / Compositor Digital", "descricao": "Cria música recorrendo a ferramentas tecnológicas."},
    ],
    "AS": [
        {"titulo": "Professor de Artes", "descricao": "Ensina expressão artística e criatividade a estudantes."},
        {"titulo": "Terapeuta pela Arte", "descricao": "Usa atividades artísticas como ferramenta terapêutica."},
    ],
    "SA": [
        {"titulo": "Educador Social", "descricao": "Trabalha com comunidades para promover inclusão e bem-estar."},
        {"titulo": "Terapeuta da Fala", "descricao": "Avalia e trata problemas de comunicação e linguagem."},
    ],
    "SE": [
        {"titulo": "Professor / Formador", "descricao": "Educa e capacita pessoas em contextos formais ou informais."},
        {"titulo": "Coordenador de ONG", "descricao": "Lidera equipas de voluntariado e programas sociais."},
    ],
    "ES": [
        {"titulo": "Diretor Executivo (CEO)", "descricao": "Lidera organizações e define a visão estratégica."},
        {"titulo": "Coach / Mentor Profissional", "descricao": "Apoia indivíduos no desenvolvimento das suas competências."},
    ],
    "EC": [
        {"titulo": "Gestor Financeiro", "descricao": "Toma decisões estratégicas sobre os recursos financeiros."},
        {"titulo": "Empreendedor", "descricao": "Cria e gere o seu próprio negócio."},
    ],
    "CE": [
        {"titulo": "Contabilista", "descricao": "Gere registos financeiros e fiscais de entidades."},
        {"titulo": "Analista de Negócios", "descricao": "Avalia processos e propõe soluções organizacionais."},
    ],
    "CR": [
        {"titulo": "Técnico de Manutenção Industrial", "descricao": "Repara e mantém máquinas e equipamentos."},
        {"titulo": "Gestor de Armazém / Logística", "descricao": "Controla stocks e fluxos de mercadorias."},
    ],
    "RC": [
        {"titulo": "Operador de Máquinas CNC", "descricao": "Programa e opera máquinas de controlo numérico."},
        {"titulo": "Inspetor de Qualidade", "descricao": "Verifica a conformidade de peças e produtos em fábrica."},
    ],
    # ── 1 letra (fallback final) ──────────────────────────────────────────────
    "R": [
        {"titulo": "Mecânico / Técnico Automóvel", "descricao": "Repara e mantém veículos e motores."},
        {"titulo": "Eletricista", "descricao": "Instala e mantém sistemas elétricos."},
        {"titulo": "Carpinteiro / Marceneiro", "descricao": "Trabalha com madeira para construir e reparar estruturas."},
    ],
    "I": [
        {"titulo": "Médico / Biólogo", "descricao": "Aplica conhecimento científico na saúde ou investigação."},
        {"titulo": "Matemático / Estatístico", "descricao": "Resolve problemas complexos através de análise quantitativa."},
        {"titulo": "Programador / Desenvolvedor", "descricao": "Cria soluções de software para vários domínios."},
    ],
    "A": [
        {"titulo": "Músico / Compositor", "descricao": "Cria e interpreta música profissionalmente."},
        {"titulo": "Escritor / Poeta", "descricao": "Produz conteúdos literários e criativos."},
        {"titulo": "Ator / Cineasta", "descricao": "Cria e interpreta conteúdos audiovisuais."},
    ],
    "S": [
        {"titulo": "Psicólogo", "descricao": "Estuda e suporta o bem-estar mental das pessoas."},
        {"titulo": "Assistente Social", "descricao": "Apoia comunidades e indivíduos vulneráveis."},
        {"titulo": "Educador", "descricao": "Ensina e orienta o desenvolvimento de outros."},
    ],
    "E": [
        {"titulo": "Gestor / Administrador", "descricao": "Lidera equipas e gere recursos organizacionais."},
        {"titulo": "Advogado", "descricao": "Representa clientes e defende os seus interesses legais."},
        {"titulo": "Político / Diplomata", "descricao": "Trabalha em contextos de governação e relações internacionais."},
    ],
    "C": [
        {"titulo": "Contabilista / Economista", "descricao": "Gere e analisa informação financeira."},
        {"titulo": "Secretário Executivo", "descricao": "Organiza e coordena operações administrativas."},
        {"titulo": "Analista de Dados", "descricao": "Processa e interpreta dados para suportar decisões."},
    ],
}

# Descrições das dimensões RIASEC
DIMENSION_DESCRIPTIONS: dict[str, str] = {
    "R": "Realista — prático, técnico, orientado para o trabalho manual e mecânico.",
    "I": "Investigativo — analítico, científico, orientado para a pesquisa e resolução de problemas.",
    "A": "Artístico — criativo, expressivo, orientado para a arte e inovação.",
    "S": "Social — empático, comunicativo, orientado para ajudar e ensinar pessoas.",
    "E": "Empreendedor — persuasivo, líder, orientado para negócios e gestão.",
    "C": "Convencional — organizado, detalhista, orientado para dados e procedimentos.",
}


def lookup_careers(holland_code: str) -> list[dict]:
    """Retorna sugestões de carreira para um código Holland.

    Tenta por ordem: código de 3 letras → top 2 → top 1.
    """
    if len(holland_code) >= 3:
        key3 = holland_code[:3].upper()
        if key3 in CAREER_MAP:
            return CAREER_MAP[key3]

    if len(holland_code) >= 2:
        key2 = holland_code[:2].upper()
        if key2 in CAREER_MAP:
            return CAREER_MAP[key2]

    if len(holland_code) >= 1:
        key1 = holland_code[0].upper()
        if key1 in CAREER_MAP:
            return CAREER_MAP[key1]

    return []
