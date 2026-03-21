// ─── Assessment Store (Zustand) ───────────────────────────────────────────────

import { create } from 'zustand';
import { Demographics, PredictionResponse, AssessmentRecord } from '../types';

interface AssessmentState {
  // Current session
  answers:      Record<string, number>;
  demographics: Demographics | null;
  results:      PredictionResponse | null;

  // History (persisted in memory; add AsyncStorage for durability)
  history: AssessmentRecord[];

  // ── Mutators ──────────────────────────────────────────────────────────────
  setAnswer:      (code: string, value: number) => void;
  setDemographics:(data: Demographics) => void;
  setResults:     (results: PredictionResponse) => void;
  saveToHistory:  () => void;
  reset:          () => void;

  // ── Derived helpers ───────────────────────────────────────────────────────
  getAnswersForDimension:    (dimension: string) => Record<string, number>;
  getDimensionAnsweredCount: (dimension: string) => number;
  getTotalAnswered:          () => number;
  isComplete:                () => boolean;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  answers:      {},
  demographics: null,
  results:      null,
  history:      [],

  setAnswer: (code, value) =>
    set(s => ({ answers: { ...s.answers, [code]: value } })),

  setDemographics: (data) => set({ demographics: data }),

  setResults: (results) => set({ results }),

  saveToHistory: () => {
    const { results, demographics, history } = get();
    if (!results) return;
    const record: AssessmentRecord = {
      id:           Date.now().toString(),
      date:         new Date().toISOString(),
      demographics: demographics ?? undefined,
      ...results,
    };
    set({ history: [record, ...history] });
  },

  reset: () => set({ answers: {}, demographics: null, results: null }),

  getAnswersForDimension: (dimension) => {
    const { answers } = get();
    return Object.fromEntries(
      Object.entries(answers).filter(([key]) => key.startsWith(dimension)),
    );
  },

  getDimensionAnsweredCount: (dimension) =>
    Object.keys(get().getAnswersForDimension(dimension)).length,

  getTotalAnswered: () => Object.keys(get().answers).length,

  isComplete: () => Object.keys(get().answers).length >= 30,
}));
