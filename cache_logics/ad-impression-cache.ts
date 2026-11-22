import { site } from "@/lib/site";

/**
 * Client-side per-session cache for deduplicating ad impressions.
 * Combines an in-memory Set with a sessionStorage fallback (wrapped in try/catch for private browsing).
 */

const memoryImpressionCache = new Set<string>();

/** Derives the sessionStorage key prefix dynamically from the configured studio wordmark. */
export function getAdImpressionCachePrefix(): string {
  return `${site.wordmark.toLowerCase()}:ad-impression:`;
}

/** Returns true if an ad impression has already been cached in the current browser session. */
export function hasCachedAdImpression(id: string): boolean {
  if (memoryImpressionCache.has(id)) {
    return true;
  }

  const prefix = getAdImpressionCachePrefix();
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      return window.sessionStorage.getItem(`${prefix}${id}`) === "1";
    }
  } catch {
    // Ignore storage access errors (e.g., private browsing restrictions).
  }

  return false;
}

/** Records an ad impression in both in-memory and sessionStorage caches for the current session. */
export function cacheAdImpression(id: string): void {
  memoryImpressionCache.add(id);

  const prefix = getAdImpressionCachePrefix();
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.setItem(`${prefix}${id}`, "1");
    }
  } catch {
    // Ignore storage access errors.
  }
}

/** Clears both in-memory and sessionStorage ad impression caches (used in tests and session resets). */
export function clearAdImpressionCache(): void {
  memoryImpressionCache.clear();

  const prefix = getAdImpressionCachePrefix();
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.sessionStorage.length; i += 1) {
        const key = window.sessionStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      for (const key of keysToRemove) {
        window.sessionStorage.removeItem(key);
      }
    }
  } catch {
    // Ignore storage access errors.
  }
}
