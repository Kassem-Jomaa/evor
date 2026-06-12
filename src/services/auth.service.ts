import api from "@/services/api";
import { withOfflineFallback } from "@/services/with-fallback";
import type { LoginRequest, LoginResponse, User } from "@/types";

/** Backend login response: `access_token` plus a minimal user record. */
interface ApiLoginResponse {
  access_token: string;
  user: { id: string; email: string; role: string };
}

function mapUser(apiUser: ApiLoginResponse["user"]): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    name: apiUser.email.split("@")[0],
    role: apiUser.role.toUpperCase().includes("ADMIN") ? "admin" : "customer",
  };
}

/**
 * Demo admin session used only when the backend is *unreachable*, so the
 * dashboard remains explorable in offline development. Wrong credentials
 * against the live API are rejected for real (401 passes through).
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
    return withOfflineFallback(
      "auth.login",
      async () => {
        const { data } = await api.post<ApiLoginResponse>(
          "/auth/login",
          credentials,
        );
        return { token: data.access_token, user: mapUser(data.user) };
      },
      () => demoSession(credentials.email),
    );
  },
};
