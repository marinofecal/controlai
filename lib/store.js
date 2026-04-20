import create from "zustand";
import { devtools, persist } from "zustand/middleware";

/**
 * Store para tema (oscuro/claro)
 */
export const useThemeStore = create(
  devtools(
    persist(
      (set) => ({
        isDark: false,
        toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
        setTheme: (isDark) => set({ isDark }),
      }),
      {
        name: "theme-storage",
      }
    )
  )
);

/**
 * Store para autenticación
 */
export const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: true,

        setUser: (user) =>
          set({
            user,
            isAuthenticated: !!user,
            isLoading: false,
          }),

        logout: () =>
          set({
            user: null,
            isAuthenticated: false,
          }),

        setLoading: (isLoading) => set({ isLoading }),
      }),
      {
        name: "auth-storage",
      }
    )
  )
);

/**
 * Store para análisis
 */
export const useAnalysisStore = create(
  devtools((set, get) => ({
    analyses: [],
    currentAnalysis: null,
    isLoading: false,

    addAnalysis: (analysis) =>
      set((state) => ({
        analyses: [analysis, ...state.analyses],
        currentAnalysis: analysis,
      })),

    setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),

    removeAnalysis: (id) =>
      set((state) => ({
        analyses: state.analyses.filter((a) => a.id !== id),
      })),

    setAnalyses: (analyses) => set({ analyses }),

    setLoading: (isLoading) => set({ isLoading }),

    clearAll: () => set({ analyses: [], currentAnalysis: null }),
  }))
);
