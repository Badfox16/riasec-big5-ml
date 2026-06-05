// ─── Static Question Data ─────────────────────────────────────────────────────
// 48 items (8 per RIASEC dimension) matching src/api/schemas.py and the model

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
      { id: 1,  code: 'R1', dimension: 'R', dimensionName: 'Realista', text: 'Verificar a qualidade de peças antes da expedição' },
      { id: 2,  code: 'R2', dimension: 'R', dimensionName: 'Realista', text: 'Assentar tijolos ou azulejos' },
      { id: 3,  code: 'R3', dimension: 'R', dimensionName: 'Realista', text: 'Trabalhar num projeto de construção ao ar livre' },
      { id: 4,  code: 'R4', dimension: 'R', dimensionName: 'Realista', text: 'Montar componentes eletrónicos' },
      { id: 5,  code: 'R5', dimension: 'R', dimensionName: 'Realista', text: 'Conduzir um autocarro ou caminhão' },
      { id: 6,  code: 'R6', dimension: 'R', dimensionName: 'Realista', text: 'Reparar uma torneira avariada' },
      { id: 7,  code: 'R7', dimension: 'R', dimensionName: 'Realista', text: 'Reparar uma caldeira ou sistema de aquecimento' },
      { id: 8,  code: 'R8', dimension: 'R', dimensionName: 'Realista', text: 'Instalar pavimento em casas' },
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
      { id: 9,  code: 'I1', dimension: 'I', dimensionName: 'Investigativo', text: 'Estudar a estrutura do corpo humano' },
      { id: 10, code: 'I2', dimension: 'I', dimensionName: 'Investigativo', text: 'Estudar o comportamento animal' },
      { id: 11, code: 'I3', dimension: 'I', dimensionName: 'Investigativo', text: 'Realizar levantamentos geológicos de campo' },
      { id: 12, code: 'I4', dimension: 'I', dimensionName: 'Investigativo', text: 'Desenvolver um novo tratamento médico' },
      { id: 13, code: 'I5', dimension: 'I', dimensionName: 'Investigativo', text: 'Conduzir investigação biológica' },
      { id: 14, code: 'I6', dimension: 'I', dimensionName: 'Investigativo', text: 'Estudar formas de reduzir a poluição da água' },
      { id: 15, code: 'I7', dimension: 'I', dimensionName: 'Investigativo', text: 'Trabalhar num laboratório de biologia' },
      { id: 16, code: 'I8', dimension: 'I', dimensionName: 'Investigativo', text: 'Investigar a estrutura das moléculas' },
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
      { id: 17, code: 'A1', dimension: 'A', dimensionName: 'Artístico', text: 'Fazer esboços, desenhos ou pinturas' },
      { id: 18, code: 'A2', dimension: 'A', dimensionName: 'Artístico', text: 'Dirigir uma peça de teatro' },
      { id: 19, code: 'A3', dimension: 'A', dimensionName: 'Artístico', text: 'Criar ilustrações para revistas ou livros' },
      { id: 20, code: 'A4', dimension: 'A', dimensionName: 'Artístico', text: 'Compor uma música' },
      { id: 21, code: 'A5', dimension: 'A', dimensionName: 'Artístico', text: 'Escrever livros ou peças de teatro' },
      { id: 22, code: 'A6', dimension: 'A', dimensionName: 'Artístico', text: 'Tocar um instrumento musical' },
      { id: 23, code: 'A7', dimension: 'A', dimensionName: 'Artístico', text: 'Interpretar jazz ou música clássica em público' },
      { id: 24, code: 'A8', dimension: 'A', dimensionName: 'Artístico', text: 'Atuar num filme ou peça de teatro' },
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
      { id: 25, code: 'S1', dimension: 'S', dimensionName: 'Social', text: 'Dar orientação de carreira às pessoas' },
      { id: 26, code: 'S2', dimension: 'S', dimensionName: 'Social', text: 'Fazer voluntariado numa organização sem fins lucrativos' },
      { id: 27, code: 'S3', dimension: 'S', dimensionName: 'Social', text: 'Ajudar pessoas com problemas de álcool ou drogas' },
      { id: 28, code: 'S4', dimension: 'S', dimensionName: 'Social', text: 'Dar aulas numa escola primária' },
      { id: 29, code: 'S5', dimension: 'S', dimensionName: 'Social', text: 'Ajudar pessoas com problemas familiares' },
      { id: 30, code: 'S6', dimension: 'S', dimensionName: 'Social', text: 'Prestar cuidados de enfermagem num hospital' },
      { id: 31, code: 'S7', dimension: 'S', dimensionName: 'Social', text: 'Ensinar crianças a ler' },
      { id: 32, code: 'S8', dimension: 'S', dimensionName: 'Social', text: 'Ajudar idosos nas suas atividades diárias' },
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
      { id: 33, code: 'E1', dimension: 'E', dimensionName: 'Empreendedor', text: 'Vender franchisings de restaurantes' },
      { id: 34, code: 'E2', dimension: 'E', dimensionName: 'Empreendedor', text: 'Gerir um estabelecimento comercial' },
      { id: 35, code: 'E3', dimension: 'E', dimensionName: 'Empreendedor', text: 'Gerir as operações de um hotel' },
      { id: 36, code: 'E4', dimension: 'E', dimensionName: 'Empreendedor', text: 'Gerir um salão de beleza ou barbearia' },
      { id: 37, code: 'E5', dimension: 'E', dimensionName: 'Empreendedor', text: 'Dirigir um departamento numa grande empresa' },
      { id: 38, code: 'E6', dimension: 'E', dimensionName: 'Empreendedor', text: 'Gerir uma loja de roupa' },
      { id: 39, code: 'E7', dimension: 'E', dimensionName: 'Empreendedor', text: 'Vender imóveis' },
      { id: 40, code: 'E8', dimension: 'E', dimensionName: 'Empreendedor', text: 'Vender serviços financeiros como seguros ou fundos' },
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
      { id: 41, code: 'C1', dimension: 'C', dimensionName: 'Convencional', text: 'Gerar folhas de pagamento mensais' },
      { id: 42, code: 'C2', dimension: 'C', dimensionName: 'Convencional', text: 'Fazer inventário de materiais com computador portátil' },
      { id: 43, code: 'C3', dimension: 'C', dimensionName: 'Convencional', text: 'Registar dados numéricos num sistema de contabilidade' },
      { id: 44, code: 'C4', dimension: 'C', dimensionName: 'Convencional', text: 'Manter registos de expedições e receções' },
      { id: 45, code: 'C5', dimension: 'C', dimensionName: 'Convencional', text: 'Calcular e registar dados estatísticos e numéricos' },
      { id: 46, code: 'C6', dimension: 'C', dimensionName: 'Convencional', text: 'Configurar e manter registos usando um computador' },
      { id: 47, code: 'C7', dimension: 'C', dimensionName: 'Convencional', text: 'Tratar de transações bancárias de clientes' },
      { id: 48, code: 'C8', dimension: 'C', dimensionName: 'Convencional', text: 'Manter registos de contas a pagar e a receber' },
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
