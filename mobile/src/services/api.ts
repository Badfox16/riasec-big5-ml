// ─── API Service Layer ─────────────────────────────────────────────────────────
// Ready to connect to the FastAPI backend.
// Switch BASE_URL to your server address to go live.

import { PredictionResponse, Demographics } from '../types';

// ── Config ────────────────────────────────────────────────────────────────────
const BASE_URL = 'http://localhost:8000'; // Change to production URL

const DEFAULT_TIMEOUT = 15000; // 15s

// ── Helpers ───────────────────────────────────────────────────────────────────

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

    return res.json() as Promise<T>;
  } catch (err: any) {
    if (err.name === 'AbortError') throw new ApiError(408, 'Pedido expirou. Verifica a tua ligação.');
    if (err instanceof ApiError) throw err;
    throw new ApiError(0, 'Sem ligação ao servidor.');
  } finally {
    clearTimeout(timer);
  }
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// ── Endpoints ─────────────────────────────────────────────────────────────────

/** GET /health — check if API is reachable and model is loaded */
export async function checkHealth(): Promise<{ status: string; modelo_carregado: boolean }> {
  return request('/health');
}

/** GET /questions — fetch all 30 RIASEC items from the server */
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

/**
 * POST /predict — submit RIASEC answers + optional demographics
 * and receive Holland code, Big Five, and career suggestions.
 */
export async function predict(
  answers: Record<string, number>,
  demographics?: Demographics | null,
): Promise<PredictionResponse> {
  const body: Record<string, number> = { ...answers };

  if (demographics) {
    body.age       = demographics.age;
    body.gender    = demographics.gender;
    body.education = demographics.education;
  }

  return request<PredictionResponse>('/predict', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// ── Auth (mocked — no backend endpoints yet) ──────────────────────────────────
// These functions simulate network latency for realistic UX.
// Replace with real endpoints when auth is implemented on the backend.

export async function mockLogin(email: string, _password: string) {
  await delay(1200);
  if (!email.includes('@')) throw new ApiError(400, 'Email inválido.');
  return {
    token: 'mock-jwt-token-' + Math.random().toString(36).slice(2),
    user: {
      id:        'user-1',
      name:      email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email,
      createdAt: new Date().toISOString(),
    },
  };
}

export async function mockRegister(name: string, email: string, _password: string) {
  await delay(1400);
  if (!email.includes('@')) throw new ApiError(400, 'Email inválido.');
  if (name.trim().length < 2) throw new ApiError(400, 'Nome muito curto.');
  return {
    token: 'mock-jwt-token-' + Math.random().toString(36).slice(2),
    user: {
      id:        'user-' + Math.random().toString(36).slice(2),
      name:      name.trim(),
      email,
      createdAt: new Date().toISOString(),
    },
  };
}

// ── Utils ─────────────────────────────────────────────────────────────────────

function delay(ms: number) {
  return new Promise<void>(res => setTimeout(res, ms));
}
