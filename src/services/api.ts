import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { env } from "@/config/env";
import { AUTH_TOKEN_KEY, clearAuthCookie } from "@/config/auth";

// Re-exported so existing importers of `@/services/api` keep working.
export { AUTH_TOKEN_KEY };

/**
 * Pre-configured Axios instance for talking to the EVOR backend.
 * Use this for every API call instead of importing axios directly.
 */
export const api: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  timeout: env.apiTimeout,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Request interceptor: attach the bearer token when present ──────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: unwrap data and normalize errors ─────────────────
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      // Token expired / unauthorized → clear it (localStorage + cookie) so the
      // UI re-auths and the middleware redirects the next admin navigation.
      if (status === 401 && typeof window !== "undefined") {
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
        clearAuthCookie();
      }

      const message =
        (error.response?.data as { message?: string } | undefined)?.message ??
        error.message ??
        "Something went wrong. Please try again.";

      return Promise.reject(new ApiError(message, status, error.response?.data));
    }
    return Promise.reject(error);
  },
);

/** Normalized error thrown by the API client. */
export class ApiError extends Error {
  readonly status?: number;
  readonly data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export default api;
