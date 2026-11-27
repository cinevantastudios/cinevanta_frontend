import type { MetadataRoute } from "next";
import { getEvents, isMockMode } from "@/lib/api-client";
import { site } from "@/lib/site";

/** Revalidate sitemap hourly to keep search engines updated without per-request SSR load. */
export const revalidate = 3600;

/** Canonical indexable App Router paths (never hash fragments like `/#about`, which Google ignores in sitemaps). */
const CANONICAL_STATIC_ROUTES: ReadonlyArray<{
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/work", changeFrequency: "weekly", priority: 0.9 },
  { path: "/services", changeFrequency: "monthly", priority: 0.85 },
  { path: "/about", changeFrequency: "monthly", priority: 0.85 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/events", changeFrequency: "weekly", priority: 0.7 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

/**
 * Generates clean, canonical sitemap.xml entries with zero hash-fragment URLs
 * and excludes placeholder mock events when running in static/mock mode.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = site.url.replace(/\/+$/, "");
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = CANONICAL_STATIC_ROUTES.map(
    ({ path, changeFrequency, priority }) => ({
      url: path === "/" ? `${baseUrl}/` : `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    }),
  );

  // Avoid indexing placeholder mock events; only validate & include real live API event dates.
  if (isMockMode()) {
    return staticEntries;
  }

  const events = await getEvents();
  const latestEventDate = events.reduce<Date>((latest, event) => {
    const parsed = new Date(event.date);
    if (!Number.isNaN(parsed.getTime()) && parsed > latest) {
      return parsed;
    }
    return latest;
  }, now);

  return staticEntries.map((entry) =>
    entry.url === `${baseUrl}/events` ? { ...entry, lastModified: latestEventDate } : entry,
  );
}
