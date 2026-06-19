// ─── API Service Layer ─────────────────────────────────────────────────────────

import { AssessmentRecord, Demographics, PredictionResponse, UniversityRequirement } from '../types';

// ── Config ────────────────────────────────────────────────────────────────────

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';
const DEFAULT_TIMEOUT = 15000;

// Idade representativa de cada faixa etária — usada apenas para alimentar o
// modelo de ML (treinado com idade numérica), nunca pedida directamente ao utilizador.
const FAIXA_ETARIA_IDADE: Record<string, number> = {
  '15-17': 16, '18-20': 19, '21-24': 22, '25-30': 27, '30+': 32,
};

// ── Core helpers ──────────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      signal: controller.signal,
      ...options,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new ApiError(res.status, body?.detail ?? `HTTP ${res.status}`);
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  } catch (err: any) {
    if (err.name === 'AbortError') throw new ApiError(408, 'Pedido expirou. Verifica a tua ligação.');
    if (err instanceof ApiError) throw err;
    throw new ApiError(0, 'Sem ligação ao servidor.');
  } finally {
    clearTimeout(timer);
  }
}

async function authRequest<T>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  return request<T>(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// ── Public endpoints ──────────────────────────────────────────────────────────

export async function checkHealth(): Promise<{ status: string; modelo_carregado: boolean }> {
  return request('/health');
}

export async function fetchQuestions() {
  return request<Array<{
    id: number;
    code: string;
    dimension: string;
    dimension_name: string;
    text: string;
    scale_min: number;
    scale_max: number;
    scale_labels: Record<string, string>;
  }>>('/questions');
}

export async function predict(
  answers: Record<string, number>,
  demographics?: Demographics | null,
): Promise<PredictionResponse> {
  const body: Record<string, number | string> = { ...answers };
  if (demographics) {
    body.age       = FAIXA_ETARIA_IDADE[demographics.faixa_etaria];
    body.gender    = demographics.gender;
    body.education = demographics.education;
    body.provincia = demographics.provincia;
  }
  return request<PredictionResponse>('/predict', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function fetchUniversityRequirement(
  codigo: string,
  area: string,
): Promise<UniversityRequirement> {
  return request<UniversityRequirement>(`/universities/${encodeURIComponent(codigo)}/${encodeURIComponent(area)}`);
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  user: { id: number; name: string; email: string; created_at: string };
}

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerApi(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function getMeApi(
  token: string,
): Promise<AuthResponse['user']> {
  return authRequest('/auth/me', token);
}

// ── Exames ────────────────────────────────────────────────────────────────────

export async function fetchExamsApi(token: string): Promise<AssessmentRecord[]> {
  const raw = await authRequest<any[]>('/exams', token);
  return raw.map(e => ({
    ...e,
    id:   String(e.id),
    date: e.date,
  }));
}

export async function saveExamApi(
  token: string,
  result: PredictionResponse,
  demographics?: Demographics | null,
): Promise<AssessmentRecord> {
  const body = {
    ...result,
    age:           demographics ? FAIXA_ETARIA_IDADE[demographics.faixa_etaria] : null,
    gender:        demographics?.gender        ?? null,
    education:     demographics?.education     ?? null,
    provincia:     demographics?.provincia     ?? null,
    cidade:        demographics?.cidade        ?? null,
    tipo_escola:   demographics?.tipo_escola   ?? null,
    classe_actual: demographics?.classe_actual ?? null,
    faixa_etaria:  demographics?.faixa_etaria  ?? null,
  };
  const saved = await authRequest<any>('/exams', token, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return { ...saved, id: String(saved.id), date: saved.date };
}

export async function deleteExamApi(token: string, examId: string): Promise<void> {
  await authRequest(`/exams/${examId}`, token, { method: 'DELETE' });
}
