import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type IUser } from '@intelident/shared';

interface AuthState {
  user:         IUser | null;
  accessToken:  string | null;
  isAuthenticated: boolean;
  setAuth:   (user: IUser, token: string) => void;
  clearAuth: () => void;
  setToken:  (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:            null,
      accessToken:     null,
      isAuthenticated: false,

      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),

      clearAuth: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),

      setToken: (accessToken) => set({ accessToken }),
    }),
    {
      name:    'intelident-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user:            state.user,
        isAuthenticated: state.isAuthenticated,
        // No persistir accessToken — se renueva con refresh
      }),
    },
  ),
);