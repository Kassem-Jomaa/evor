import { ApiError } from "@/services/api";

/**
 * Run an API call, returning `fallback` if it throws (e.g. the backend isn't
 * running yet). Logs a warning server-side so failures are visible without
 * breaking the page render. Use for **reads** where stale/demo content beats a
 * broken page.
 *
 * `fallback` may be a value or a zero-arg factory; the factory is only invoked
 * when the call fails, so callers can defer any work building it.
 */
export async function withFallback<T>(
  label: string,
  fn: () => Promise<T>,
  fallback: T | (() => T),
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[${label}] API unavailable, using fallback data: ${message}`);
    return typeof fallback === "function" ? (fallback as () => T)() : fallback;
  }
}

/**
 * Like {@link withFallback}, but only falls back when the backend is
 * *unreachable* (network error / timeout). Real HTTP responses — 401 wrong
 * password, 400 validation, 404 — are rethrown so the UI can show them.
 * Use for **writes** and auth, where faking success would hide real failures.
 */
export async function withOfflineFallback<T>(
  label: string,
  fn: () => Promise<T>,
  fallback: T | (() => T),
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ApiError && typeof error.status === "number") {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[${label}] API unreachable, using offline fallback: ${message}`);
    return typeof fallback === "function" ? (fallback as () => T)() : fallback;
  }
}
