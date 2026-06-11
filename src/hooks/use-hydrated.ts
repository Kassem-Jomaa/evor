import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns `false` during SSR and the first (hydration) client render, then
 * `true` on every render after. Use it to defer rendering values that only
 * exist client-side — e.g. a localStorage-persisted Zustand store — without the
 * cascading setState-in-effect a `useEffect(() => setMounted(true))` guard
 * incurs.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
