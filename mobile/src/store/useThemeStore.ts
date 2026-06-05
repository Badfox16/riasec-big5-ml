import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: true,
      toggle: () => set({ isDark: !get().isDark }),
    }),
    {
      name:    'theme-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
