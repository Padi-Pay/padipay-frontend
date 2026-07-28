import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
}

export const AUTH_STORAGE_KEY = 'auth-storage';

export function readPersistedAuthToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as { state?: { token?: string | null } } | null;
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}

export interface GlobalState {
  // Auth Slice
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  sessionExpired: boolean;
  login: (token: string) => void;
  logout: () => void;
  markSessionExpired: () => void;
  clearSessionExpired: () => void;
  setHydrated: (isHydrated: boolean) => void;

  // User Slice
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      // Auth Slice
      token: null,
      isAuthenticated: false,
      isHydrated: false,
      sessionExpired: false,
      login: (token: string) =>
        set({ token, isAuthenticated: true, sessionExpired: false }),
      logout: () =>
        set({
          token: null,
          isAuthenticated: false,
          profile: null,
          sessionExpired: false,
        }),
      markSessionExpired: () =>
        set({
          token: null,
          isAuthenticated: false,
          profile: null,
          sessionExpired: true,
        }),
      clearSessionExpired: () => set({ sessionExpired: false }),
      setHydrated: (isHydrated: boolean) => set({ isHydrated }),

      // User Slice
      profile: null,
      setProfile: (profile) => set({ profile }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      // Persist only required auth/user state
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        profile: state.profile,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (!error && state) {
          state.setHydrated(true);
        }
      },
    }
  )
);
