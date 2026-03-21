// ─── Domain Types ─────────────────────────────────────────────────────────────

export type RiasecDimension = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export interface Question {
  id: number;
  code: string;
  dimension: RiasecDimension;
  dimensionName: string;
  text: string;
}

export interface DimensionGroup {
  dimension: RiasecDimension;
  name: string;
  color: string;
  bgColor: string;
  emoji: string;
  description: string;
  questions: Question[];
}

export interface Demographics {
  age: number;
  gender: 1 | 2 | 3;       // 1=Masculino, 2=Feminino, 3=Outro
  education: 1 | 2 | 3 | 4; // 1=<HS, 2=HS, 3=Licenciatura, 4=Pós-graduação
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

export interface CareerSuggestion {
  titulo: string;
  descricao: string;
}

export interface PredictionResponse {
  holland_code: string;
  riasec_scores: DimensionScore[];
  big5: Big5Prediction;
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
};

export type TabParamList = {
  Home:    undefined;
  History: undefined;
  Profile: undefined;
};
