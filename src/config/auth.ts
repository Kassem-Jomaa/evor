/**
 * Auth token storage key and cookie helpers, shared by the Axios client, the
 * auth store, and the Edge `middleware.ts`.
 *
 * Deliberately free of heavy imports (no axios) so it is safe to import from
 * middleware, which runs in the Edge runtime. The `window`/`document` access
 * lives inside functions, so importing this module never touches the DOM.
 */

/**
 * Key under which the raw JWT is stored: in localStorage (so the Axios request
 * interceptor can attach it as a Bearer header) and as a cookie of the same
 * name (so the server-side middleware can gate `/admin` routes before any page
 * renders).
 */
export const AUTH_TOKEN_KEY = "evor_token";

/** Cookie lifetime, in seconds (7 days) — a typical session window. */
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

/**
 * Mirror the JWT into a cookie so `middleware.ts` can read it server-side.
 * Intentionally not `httpOnly`: the client must read the same token to send it
 * as a Bearer header, so it is no more exposed than the existing localStorage
 * copy. `SameSite=Lax` keeps it off cross-site requests.
 */
export function setAuthCookie(token: string): void {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${AUTH_TOKEN_KEY}=${encodeURIComponent(token)}; path=/; ` +
    `max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

/** Remove the auth cookie (logout, or after a 401 clears the session). */
export function clearAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
}
