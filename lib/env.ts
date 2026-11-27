/**
 * Centralized environment variable access module.
 * Provides safe pure-frontend defaults when optional backend/mock toggles are omitted,
 * while keeping strict validation helpers (`requireEnv`, `requireDefinedEnv`) for explicit checks.
 */

const DEFAULT_SITE_URL = "https://www.cinevantastudio.com";

/**
 * Reads a required environment variable without any default or fallback value.
 * Throws immediately if the variable is missing or blank so misconfiguration fails fast.
 */
export function requireEnv(value: string | undefined, name: string): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return trimmed;
}

/**
 * Reads a required environment variable that may be intentionally empty (e.g., an empty host list),
 * but must still be explicitly defined in the environment.
 */
export function requireDefinedEnv(value: string | undefined, name: string): string {
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

/** Returns the canonical public site URL (`NEXT_PUBLIC_SITE_URL`), defaulting to the production domain. */
export function getEnvSiteUrl(): string {
  const trimmed = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return trimmed ? trimmed.replace(/\/+$/, "") : DEFAULT_SITE_URL;
}

/** Returns the optional backend API base URL (`NEXT_PUBLIC_API_BASE_URL`) without trailing slashes. */
export function getEnvApiBaseUrl(): string {
  const trimmed = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return trimmed ? trimmed.replace(/\/+$/, "") : "";
}

/** Returns true when `NEXT_PUBLIC_USE_MOCKS` is unset or `"true"`, false when `"false"`, and throws on invalid values. */
export function getEnvUseMocks(): boolean {
  const trimmed = process.env.NEXT_PUBLIC_USE_MOCKS?.trim();
  if (!trimmed) {
    return true;
  }
  const value = trimmed.toLowerCase();
  if (value !== "true" && value !== "false") {
    throw new Error(`Invalid NEXT_PUBLIC_USE_MOCKS value: "${value}". Expected "true" or "false".`);
  }
  return value === "true";
}

/** Returns the optional mock ads toggle (`NEXT_PUBLIC_MOCK_ADS`), defaulting to `"0"` for static frontend mode. */
export function getEnvMockAdsMode(): string {
  const trimmed = process.env.NEXT_PUBLIC_MOCK_ADS?.trim();
  return trimmed || "0";
}

/** Returns the optional mock events toggle (`NEXT_PUBLIC_MOCK_EVENTS`), defaulting to `"none"` for static frontend mode. */
export function getEnvMockEventsMode(): string {
  const trimmed = process.env.NEXT_PUBLIC_MOCK_EVENTS?.trim();
  return trimmed || "none";
}

/** Returns the parsed array of optional extra remote image hostnames from `NEXT_PUBLIC_IMAGE_HOSTS`. */
export function getEnvImageHosts(): string[] {
  const raw = process.env.NEXT_PUBLIC_IMAGE_HOSTS?.trim() ?? "";
  const hosts = new Set<string>();
  for (const entry of raw.split(",")) {
    const trimmed = entry.trim();
    if (trimmed) {
      hosts.add(trimmed);
    }
  }
  return Array.from(hosts);
}
