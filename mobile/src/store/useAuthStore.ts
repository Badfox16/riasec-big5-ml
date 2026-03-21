// ─── Auth Store (Zustand) ─────────────────────────────────────────────────────
// Manages login / register / logout state (mocked until backend adds auth).

import { create } from 'zustand';
import { User } from '../types';
import { mockLogin, mockRegister, ApiError } from '../services/api';

interface AuthState {
  user:        User | null;
  token:       string | null;
  isLoading:   boolean;
  error:       string | null;

  // Actions
  login:    (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout:   () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user:      null,
  token:     null,
  isLoading: false,
  error:     null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await mockLogin(email, password);
      set({ user, token, isLoading: false });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao iniciar sessão.';
      set({ isLoading: false, error: msg });
      throw err;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await mockRegister(name, email, password);
      set({ user, token, isLoading: false });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao criar conta.';
      set({ isLoading: false, error: msg });
      throw err;
    }
  },

  logout: () => set({ user: null, token: null, error: null }),

  clearError: () => set({ error: null }),
}));
