import api from "@/services/api";
import { withFallback } from "@/services/with-fallback";
import type { LoginRequest, LoginResponse } from "@/types";

/**
 * Demo admin session used when the backend is unavailable, so the dashboard
 * remains explorable offline (consistent with the storefront's fallback data).
 * A real deployment returns a signed JWT from the API.
 */
function demoSession(email: string): LoginResponse {
  return {
    token: `demo.${btoa(email)}.token`,
    user: { id: "admin", email, name: "Admin", role: "admin" },
  };
}

/**
 * Auth service (Task 7.1). Exchanges credentials for a JWT via
 * `POST /auth/login`.
 */
export const authService = {
  login(credentials: LoginRequest): Promise<LoginResponse> {
    return withFallback(
      "auth.login",
      async () => {
        const { data } = await api.post<LoginResponse>(
          "/auth/login",
          credentials,
        );
        return data;
      },
      () => demoSession(credentials.email),
    );
  },
};
