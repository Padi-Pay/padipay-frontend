import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
}

export interface GlobalState {
  // Auth Slice
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;

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
      login: (token: string) => set({ token, isAuthenticated: true }),
      logout: () => set({ token: null, isAuthenticated: false, profile: null }),

      // User Slice
      profile: null,
      setProfile: (profile) => set({ profile }),
    }),
    {
      name: 'auth-storage',
      // Persist only required auth/user state
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        profile: state.profile,
      }),
    }
  )
);
