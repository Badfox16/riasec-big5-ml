// ─── Static Question Data ─────────────────────────────────────────────────────
// Mirrors the 30 items defined in src/api/schemas.py and src/api/main.py

import { Colors } from '../theme';
import { DimensionGroup } from '../types';

export const DIMENSION_GROUPS: DimensionGroup[] = [
  {
    dimension: 'R',
    name: 'Realista',
    color: Colors.riasec.R,
    bgColor: Colors.riasecBg.R,
    emoji: '🔧',
    description: 'Prático, técnico, orientado para o trabalho manual e mecânico.',
    questions: [
      { id: 1,  code: 'R1', dimension: 'R', dimensionName: 'Realista',      text: 'Verificar a qualidade de peças antes da expedição' },
      { id: 2,  code: 'R2', dimension: 'R', dimensionName: 'Realista',      text: 'Assentar tijolos ou azulejos' },
      { id: 3,  code: 'R4', dimension: 'R', dimensionName: 'Realista',      text: 'Montar componentes eletrónicos' },
      { id: 4,  code: 'R6', dimension: 'R', dimensionName: 'Realista',      text: 'Reparar uma torneira avariada' },
      { id: 5,  code: 'R8', dimension: 'R', dimensionName: 'Realista',      text: 'Instalar pavimento em casas' },
    ],
  },
  {
    dimension: 'I',
    name: 'Investigativo',
    color: Colors.riasec.I,
    bgColor: Colors.riasecBg.I,
    emoji: '🔬',
    description: 'Analítico, científico, orientado para a pesquisa e resolução de problemas.',
    questions: [
      { id: 6,  code: 'I1', dimension: 'I', dimensionName: 'Investigativo', text: 'Estudar a estrutura do corpo humano' },
      { id: 7,  code: 'I2', dimension: 'I', dimensionName: 'Investigativo', text: 'Estudar o comportamento animal' },
      { id: 8,  code: 'I4', dimension: 'I', dimensionName: 'Investigativo', text: 'Desenvolver um novo tratamento médico' },
      { id: 9,  code: 'I5', dimension: 'I', dimensionName: 'Investigativo', text: 'Conduzir investigação biológica' },
      { id: 10, code: 'I7', dimension: 'I', dimensionName: 'Investigativo', text: 'Trabalhar num laboratório de biologia' },
    ],
  },
  {
    dimension: 'A',
    name: 'Artístico',
    color: Colors.riasec.A,
    bgColor: Colors.riasecBg.A,
    emoji: '🎨',
    description: 'Criativo, expressivo, orientado para a arte e inovação.',
    questions: [
      { id: 11, code: 'A2', dimension: 'A', dimensionName: 'Artístico',     text: 'Dirigir uma peça de teatro' },
      { id: 12, code: 'A3', dimension: 'A', dimensionName: 'Artístico',     text: 'Criar ilustrações para revistas' },
      { id: 13, code: 'A4', dimension: 'A', dimensionName: 'Artístico',     text: 'Compor uma música' },
      { id: 14, code: 'A5', dimension: 'A', dimensionName: 'Artístico',     text: 'Escrever livros ou peças de teatro' },
      { id: 15, code: 'A6', dimension: 'A', dimensionName: 'Artístico',     text: 'Tocar um instrumento musical' },
    ],
  },
  {
    dimension: 'S',
    name: 'Social',
    color: Colors.riasec.S,
    bgColor: Colors.riasecBg.S,
    emoji: '🤝',
    description: 'Empático, comunicativo, orientado para ajudar e ensinar pessoas.',
    questions: [
      { id: 16, code: 'S1', dimension: 'S', dimensionName: 'Social',        text: 'Dar orientação de carreira às pessoas' },
      { id: 17, code: 'S2', dimension: 'S', dimensionName: 'Social',        text: 'Fazer voluntariado numa organização sem fins lucrativos' },
      { id: 18, code: 'S5', dimension: 'S', dimensionName: 'Social',        text: 'Ajudar pessoas com problemas familiares' },
      { id: 19, code: 'S7', dimension: 'S', dimensionName: 'Social',        text: 'Ensinar crianças a ler' },
      { id: 20, code: 'S8', dimension: 'S', dimensionName: 'Social',        text: 'Ajudar idosos nas suas atividades diárias' },
    ],
  },
  {
    dimension: 'E',
    name: 'Empreendedor',
    color: Colors.riasec.E,
    bgColor: Colors.riasecBg.E,
    emoji: '💼',
    description: 'Persuasivo, líder, orientado para negócios e gestão.',
    questions: [
      { id: 21, code: 'E1', dimension: 'E', dimensionName: 'Empreendedor',  text: 'Vender franchisings de restaurantes' },
      { id: 22, code: 'E3', dimension: 'E', dimensionName: 'Empreendedor',  text: 'Gerir as operações de um hotel' },
      { id: 23, code: 'E5', dimension: 'E', dimensionName: 'Empreendedor',  text: 'Dirigir um departamento numa grande empresa' },
      { id: 24, code: 'E6', dimension: 'E', dimensionName: 'Empreendedor',  text: 'Gerir uma loja de roupa' },
      { id: 25, code: 'E7', dimension: 'E', dimensionName: 'Empreendedor',  text: 'Vender imóveis' },
    ],
  },
  {
    dimension: 'C',
    name: 'Convencional',
    color: Colors.riasec.C,
    bgColor: Colors.riasecBg.C,
    emoji: '📊',
    description: 'Organizado, detalhista, orientado para dados e procedimentos.',
    questions: [
      { id: 26, code: 'C1', dimension: 'C', dimensionName: 'Convencional',  text: 'Gerar folhas de pagamento mensais' },
      { id: 27, code: 'C2', dimension: 'C', dimensionName: 'Convencional',  text: 'Fazer inventário de materiais com computador portátil' },
      { id: 28, code: 'C4', dimension: 'C', dimensionName: 'Convencional',  text: 'Manter registos de funcionários' },
      { id: 29, code: 'C5', dimension: 'C', dimensionName: 'Convencional',  text: 'Calcular e registar dados estatísticos e numéricos' },
      { id: 30, code: 'C7', dimension: 'C', dimensionName: 'Convencional',  text: 'Tratar de transações bancárias de clientes' },
    ],
  },
];

export const LIKERT_LABELS: Record<number, string> = {
  1: 'Não gostaria nada',
  2: 'Não gostaria',
  3: 'Neutro',
  4: 'Gostaria',
  5: 'Gostaria muito',
};

export const LIKERT_EMOJIS: Record<number, string> = {
  1: '😞',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😄',
};

export const TOTAL_QUESTIONS = DIMENSION_GROUPS.reduce(
  (sum, g) => sum + g.questions.length,
  0,
);
