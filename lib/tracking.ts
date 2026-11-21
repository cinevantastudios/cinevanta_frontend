import { trackAd } from "@/lib/api";

const IMPRESSION_STORAGE_PREFIX = "cinevanta:ad-impression:";
const memoryRecordedImpressions = new Set<string>();

function hasRecordedImpression(id: string): boolean {
  if (memoryRecordedImpressions.has(id)) {
    return true;
  }

  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      return window.sessionStorage.getItem(`${IMPRESSION_STORAGE_PREFIX}${id}`) === "1";
    }
  } catch {
    // Ignore storage access errors (e.g., private browsing restrictions).
  }

  return false;
}

function markImpressionRecorded(id: string): void {
  memoryRecordedImpressions.add(id);

  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.setItem(`${IMPRESSION_STORAGE_PREFIX}${id}`, "1");
    }
  } catch {
    // Ignore storage access errors.
  }
}

export function trackAdImpressionOnce(id: string): boolean {
  if (hasRecordedImpression(id)) {
    return false;
  }

  markImpressionRecorded(id);
  trackAd(id, "impression");
  return true;
}

export function trackAdClick(id: string): void {
  trackAd(id, "click");
}

export function resetTrackingMemoryForTests(): void {
  memoryRecordedImpressions.clear();
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.sessionStorage.length; i += 1) {
        const key = window.sessionStorage.key(i);
        if (key && key.startsWith(IMPRESSION_STORAGE_PREFIX)) {
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

