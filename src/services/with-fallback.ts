/**
 * Run an API call, returning `fallback` if it throws (e.g. the backend isn't
 * running yet). Logs a warning server-side so failures are visible without
 * breaking the page render.
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
