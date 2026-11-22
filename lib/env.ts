/**
 * Centralized environment variable access module.
 * Every `process.env.NEXT_PUBLIC_*` lookup in the application goes through this file
 * with zero silent defaults or fallbacks.
 */

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

/** Returns the canonical public site URL (`NEXT_PUBLIC_SITE_URL`), failing fast if unset. */
export function getEnvSiteUrl(): string {
  return requireEnv(process.env.NEXT_PUBLIC_SITE_URL, "NEXT_PUBLIC_SITE_URL");
}

/** Returns the backend API base URL (`NEXT_PUBLIC_API_BASE_URL`) without trailing slashes. */
export function getEnvApiBaseUrl(): string {
  const raw = requireEnv(process.env.NEXT_PUBLIC_API_BASE_URL, "NEXT_PUBLIC_API_BASE_URL");
  return raw.replace(/\/+$/, "");
}

/** Returns true when `NEXT_PUBLIC_USE_MOCKS` is `"true"`, false when `"false"`, and throws otherwise. */
export function getEnvUseMocks(): boolean {
  const value = requireEnv(
    process.env.NEXT_PUBLIC_USE_MOCKS,
    "NEXT_PUBLIC_USE_MOCKS",
  ).toLowerCase();
  if (value !== "true" && value !== "false") {
    throw new Error(`Invalid NEXT_PUBLIC_USE_MOCKS value: "${value}". Expected "true" or "false".`);
  }
  return value === "true";
}

/** Returns the mock ads toggle (`NEXT_PUBLIC_MOCK_ADS`), failing fast if unset. */
export function getEnvMockAdsMode(): string {
  return requireEnv(process.env.NEXT_PUBLIC_MOCK_ADS, "NEXT_PUBLIC_MOCK_ADS");
}

/** Returns the mock events toggle (`NEXT_PUBLIC_MOCK_EVENTS`), failing fast if unset. */
export function getEnvMockEventsMode(): string {
  return requireEnv(process.env.NEXT_PUBLIC_MOCK_EVENTS, "NEXT_PUBLIC_MOCK_EVENTS");
}

/** Returns the parsed array of allowed remote image hostnames from `NEXT_PUBLIC_IMAGE_HOSTS`. */
export function getEnvImageHosts(): string[] {
  const raw = requireDefinedEnv(
    process.env.NEXT_PUBLIC_IMAGE_HOSTS,
    "NEXT_PUBLIC_IMAGE_HOSTS",
  );
  const hosts = new Set<string>();
  for (const entry of raw.split(",")) {
    const trimmed = entry.trim();
    if (trimmed) {
      hosts.add(trimmed);
    }
  }
  return Array.from(hosts);
}
