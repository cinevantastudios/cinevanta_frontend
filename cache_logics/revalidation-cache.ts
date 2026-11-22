/**
 * Centralized server-side ISR and Next.js Data Cache configuration.
 * All route revalidation intervals, cache tags, and fetch cache option builders live here.
 */

/** Default ISR / Data Cache revalidation window (in seconds) for dynamic content pages and API reads. */
export const PAGE_REVALIDATE_SECONDS = 60;

/** ISR revalidation window (in seconds) for sitemap.xml generation. */
export const SITEMAP_REVALIDATE_SECONDS = 3600;

/** Canonical Next.js Data Cache tag builders for targeted on-demand revalidation. */
export const cacheTags = {
  ads: () => "ads",
  events: (status?: string) => (status ? `events:${status}` : "events"),
  work: (category?: string, page?: number) =>
    `work:${category ?? "all"}:page-${page ?? 1}`,
} as const;

/**
 * Builds the `next` cache configuration object for `fetch()` calls in `lib/api-client.ts`.
 */
export function buildNextCacheOptions(
  tags: string[],
  revalidateSeconds: number = PAGE_REVALIDATE_SECONDS,
): { revalidate: number; tags: string[] } {
  return {
    revalidate: revalidateSeconds,
    tags,
  };
}
