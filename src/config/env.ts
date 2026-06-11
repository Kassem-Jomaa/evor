/**
 * Centralized, typed access to environment variables.
 *
 * Import `env` anywhere instead of reading `process.env` directly so that
 * misconfiguration fails fast and values are strongly typed.
 */

function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Check your .env.local file (see .env.example).`,
    );
  }
  return value;
}

export const env = {
  apiUrl: required(process.env.NEXT_PUBLIC_API_URL, "NEXT_PUBLIC_API_URL"),
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "EVOR",
  apiTimeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT ?? 15000),
} as const;

export type Env = typeof env;
