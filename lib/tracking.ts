import {
  cacheAdImpression,
  clearAdImpressionCache,
  hasCachedAdImpression,
} from "@/cache_logics/ad-impression-cache";
import { trackAd } from "@/lib/api-client";

/**
 * Fires an ad impression tracking event at most once per browser session per ad ID.
 * Delegates session/memory cache persistence to `cache_logics/ad-impression-cache`.
 */
export function trackAdImpressionOnce(id: string): boolean {
  if (hasCachedAdImpression(id)) {
    return false;
  }

  cacheAdImpression(id);
  trackAd(id, "impression");
  return true;
}

/** Fires an ad click tracking event. */
export function trackAdClick(id: string): void {
  trackAd(id, "click");
}

/** Resets cached ad impressions in memory and sessionStorage for test isolation. */
export function resetTrackingMemoryForTests(): void {
  clearAdImpressionCache();
}
