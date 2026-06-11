import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AUTH_TOKEN_KEY } from "@/services/api";
import type { LoginResponse, User } from "@/types";

interface AuthState {
  token: string | null;
  user: User | null;
  /** Persist a successful login (Task 7.1). */
  setSession: (session: LoginResponse) => void;
  logout: () => void;
}

/**
 * Admin auth store, persisted to localStorage. The JWT is mirrored to
 * {@link AUTH_TOKEN_KEY} so the Axios request interceptor attaches it as a
 * Bearer token on every API call.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      setSession: ({ token, user }) => {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(AUTH_TOKEN_KEY, token);
        }
        set({ token, user });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(AUTH_TOKEN_KEY);
        }
        set({ token: null, user: null });
      },
    }),
    { name: "evor-auth" },
  ),
);
