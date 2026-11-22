import type { MetadataRoute } from "next";
import { getEvents } from "@/lib/api-client";
import { routes, site } from "@/lib/site";

/** Revalidate sitemap hourly to keep search engines updated without per-request SSR load. */
export const revalidate = 3600;

/**
 * Generates sitemap.xml entries for static routes and active events.
 * Guards against malformed event dates so invalid API records never break sitemap generation.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = site.url.replace(/\/+$/, "");
  const now = new Date();
  const staticRoutes = [
    routes.home,
    routes.events,
    routes.work,
    routes.about,
    routes.contact,
    routes.privacy,
    routes.terms,
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === routes.home || route === routes.events ? "weekly" : "monthly",
    priority: route === routes.home ? 1 : 0.8,
  }));

  const events = await getEvents();
  const eventEntries: MetadataRoute.Sitemap = events.map((event) => {
    const parsedDate = new Date(event.date);
    const lastModified = Number.isNaN(parsedDate.getTime()) ? now : parsedDate;

    return {
      url: `${baseUrl}${routes.eventAnchor(event.status, event.slug)}`,
      lastModified,
      changeFrequency: "weekly",
      priority: event.status === "upcoming" ? 0.9 : 0.6,
    };
  });

  return [...staticEntries, ...eventEntries];
}
