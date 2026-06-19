// ─── Domain Types ─────────────────────────────────────────────────────────────

export type RiasecDimension = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export interface Question {
  id: number;
  code: string;
  dimension: RiasecDimension;
  dimensionName: string;
  text: string;
}

export type IconFamily = 'Feather' | 'Ionicons';

export interface DimensionGroup {
  dimension: RiasecDimension;
  name: string;
  color: string;
  bgColor: string;
  iconFamily: IconFamily;
  iconName: string;
  description: string;
  questions: Question[];
}

export type FaixaEtaria = '15-17' | '18-20' | '21-24' | '25-30' | '30+';
export type TipoEscola = 'Pública' | 'Privada' | 'Semi-privada';
export type ClasseActual =
  | '10ª classe' | '11ª classe' | '12ª classe'
  | 'Universitário 1º ano' | 'Universitário 2º ano'
  | 'Já formado' | 'Profissional';

export const PROVINCIAS = [
  'Cabo Delgado', 'Gaza', 'Inhambane', 'Manica', 'Maputo Província',
  'Maputo Cidade', 'Nampula', 'Niassa', 'Sofala', 'Tete', 'Zambézia',
] as const;
export type Provincia = typeof PROVINCIAS[number];

export interface Demographics {
  gender: 1 | 2 | 3;       // 1=Masculino, 2=Feminino, 3=Outro
  education: 1 | 2 | 3 | 4; // 1=<HS, 2=HS, 3=Licenciatura, 4=Pós-graduação
  provincia: Provincia;
  cidade: string;
  tipo_escola: TipoEscola;
  classe_actual: ClasseActual;
  faixa_etaria: FaixaEtaria;
}

export interface DimensionScore {
  dimension: string;
  letter: RiasecDimension;
  score: number;
  description: string;
}

export interface Big5Prediction {
  extraversion: number;
  agreeableness: number;
  conscientiousness: number;
  neuroticism: number;
  openness: number;
}

export interface CourseRecommendation {
  titulo: string;
  instituicao: string;
  descricao: string;
  area: string;
  universidades: string[];
  empregabilidade_provincia: string;
}

export interface UniversityRequirement {
  codigo: string;
  universidade: string;
  curso_titulo: string;
  duracao: string;
  modalidade: string;
  cidade: string;
  disciplinas_exigidas: string[];
  nota_minima: string;
  documentos: string[];
  website: string;
  contacto: string;
}

export interface CareerSuggestion {
  titulo: string;
  descricao: string;
}

export interface PredictionResponse {
  holland_code: string;
  riasec_scores: DimensionScore[];
  big5: Big5Prediction;
  courses: CourseRecommendation[];
  careers: CareerSuggestion[];
  nota: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

// ─── History ──────────────────────────────────────────────────────────────────

export interface AssessmentRecord {
  id: string;
  date: string;               // ISO string
  holland_code: string;
  riasec_scores: DimensionScore[];
  big5: Big5Prediction;
  courses: CourseRecommendation[];
  careers: CareerSuggestion[];
  nota: string;
  demographics?: Demographics;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export type AuthStackParamList = {
  Login:    undefined;
  Register: undefined;
};

export type AppStackParamList = {
  MainTabs:         undefined;
  AssessmentIntro:  undefined;
  Question:         undefined;
  Demographics:     undefined;
  Loading:          undefined;
  Results:          undefined;
  HistoryDetail:    { record: AssessmentRecord };
  UniversityDetail: { codigo: string; area: string; cursoTitulo: string };
};

export type TabParamList = {
  Home:    undefined;
  History: undefined;
  Profile: undefined;
};
