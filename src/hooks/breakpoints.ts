"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Tailwind's default breakpoint widths, exposed as typed hooks so responsive
 * logic in JS stays in sync with the CSS breakpoints (see Tailwind config).
 */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/** True when the viewport is at least the given Tailwind breakpoint. */
export function useBreakpoint(bp: Breakpoint): boolean {
  return useMediaQuery(`(min-width: ${breakpoints[bp]}px)`);
}

/** Convenience hook: true on mobile (below the `md` breakpoint). */
export function useIsMobile(): boolean {
  return !useBreakpoint("md");
}
