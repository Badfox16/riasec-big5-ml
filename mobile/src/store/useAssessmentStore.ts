// ─── Assessment Store (Zustand + AsyncStorage) ────────────────────────────────

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { AssessmentRecord, Demographics, PredictionResponse } from '../types';
import { fetchExamsApi, saveExamApi, deleteExamApi } from '../services/api';

interface AssessmentState {
  answers:      Record<string, number>;
  demographics: Demographics | null;
  results:      PredictionResponse | null;
  history:      AssessmentRecord[];
  favorites:    string[]; // chaves "codigo:area" de universidades guardadas
  isSyncing:    boolean;

  toggleFavorite: (key: string) => void;
  isFavorite:     (key: string) => boolean;

  setAnswer:      (code: string, value: number) => void;
  setDemographics:(data: Demographics) => void;
  setResults:     (results: PredictionResponse) => void;
  reset:          () => void;

  // Guarda local imediatamente; se token disponível envia ao servidor em background
  saveToHistory:  (token?: string | null) => Promise<void>;
  // Substitui history[] com dados do servidor
  syncFromServer: (token: string) => Promise<void>;
  // Apaga local e no servidor se autenticado
  deleteRecord:   (id: string, token?: string | null) => Promise<void>;

  getAnswersForDimension:    (dimension: string) => Record<string, number>;
  getDimensionAnsweredCount: (dimension: string) => number;
  getTotalAnswered:          () => number;
  isComplete:                () => boolean;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      answers:      {},
      demographics: null,
      results:      null,
      history:      [],
      favorites:    [],
      isSyncing:    false,

      toggleFavorite: (key) =>
        set(s => ({
          favorites: s.favorites.includes(key)
            ? s.favorites.filter(k => k !== key)
            : [...s.favorites, key],
        })),

      isFavorite: (key) => get().favorites.includes(key),

      setAnswer: (code, value) =>
        set(s => ({ answers: { ...s.answers, [code]: value } })),

      setDemographics: (data) => set({ demographics: data }),

      setResults: (results) => set({ results }),

      reset: () => set({ answers: {}, demographics: null, results: null }),

      saveToHistory: async (token) => {
        const { results, demographics, history } = get();
        if (!results) return;

        // 1. Guardar local imediatamente (offline-first)
        const localId = Date.now().toString();
        const localRecord: AssessmentRecord = {
          id:           localId,
          date:         new Date().toISOString(),
          demographics: demographics ?? undefined,
          ...results,
        };
        set({ history: [localRecord, ...history] });

        // 2. Sincronizar com servidor se autenticado
        if (token) {
          set({ isSyncing: true });
          try {
            const serverRecord = await saveExamApi(token, results, demographics);
            set(s => ({
              history: s.history.map(r => r.id === localId ? serverRecord : r),
              isSyncing: false,
            }));
          } catch {
            set({ isSyncing: false });
          }
        }
      },

      syncFromServer: async (token) => {
        set({ isSyncing: true });
        try {
          const serverHistory = await fetchExamsApi(token);
          set({ history: serverHistory, isSyncing: false });
        } catch {
          set({ isSyncing: false });
        }
      },

      deleteRecord: async (id, token) => {
        set(s => ({ history: s.history.filter(r => r.id !== id) }));
        if (token) {
          try {
            await deleteExamApi(token, id);
          } catch {
            // Ignorar erros de rede; já apagado localmente
          }
        }
      },

      getAnswersForDimension: (dimension) => {
        const { answers } = get();
        return Object.fromEntries(
          Object.entries(answers).filter(([key]) => key.startsWith(dimension)),
        );
      },

      getDimensionAnsweredCount: (dimension) =>
        Object.keys(get().getAnswersForDimension(dimension)).length,

      getTotalAnswered: () => Object.keys(get().answers).length,

      isComplete: () => Object.keys(get().answers).length >= 48,
    }),
    {
      name:    'assessment-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ history: s.history, favorites: s.favorites }),
    },
  ),
);
