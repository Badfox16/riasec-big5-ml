// ─── Auth Store (Zustand + AsyncStorage) ──────────────────────────────────────

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { User } from '../types';
import { ApiError, getMeApi, loginApi, registerApi } from '../services/api';

interface AuthState {
  user:      User | null;
  token:     string | null;
  isLoading: boolean;
  error:     string | null;

  login:      (email: string, password: string) => Promise<void>;
  register:   (name: string, email: string, password: string) => Promise<void>;
  logout:     () => void;
  clearError: () => void;
  rehydrate:  () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:      null,
      token:     null,
      isLoading: false,
      error:     null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { token, user } = await loginApi(email, password);
          set({
            token,
            user: {
              id:        String(user.id),
              name:      user.name,
              email:     user.email,
              createdAt: user.created_at,
            },
            isLoading: false,
          });
        } catch (err) {
          const msg = err instanceof ApiError ? err.message : 'Erro ao iniciar sessão.';
          set({ isLoading: false, error: msg });
          throw err;
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { token, user } = await registerApi(name, email, password);
          set({
            token,
            user: {
              id:        String(user.id),
              name:      user.name,
              email:     user.email,
              createdAt: user.created_at,
            },
            isLoading: false,
          });
        } catch (err) {
          const msg = err instanceof ApiError ? err.message : 'Erro ao criar conta.';
          set({ isLoading: false, error: msg });
          throw err;
        }
      },

      logout: () => set({ user: null, token: null, error: null }),

      clearError: () => set({ error: null }),

      rehydrate: async () => {
        const { token } = get();
        if (!token) return;
        try {
          const user = await getMeApi(token);
          set({
            user: {
              id:        String(user.id),
              name:      user.name,
              email:     user.email,
              createdAt: user.created_at,
            },
          });
        } catch {
          // Token expirado → logout automático
          set({ user: null, token: null });
        }
      },
    }),
    {
      name:    'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ token: s.token, user: s.user }),
    },
  ),
);
