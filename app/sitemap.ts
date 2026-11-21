import type { MetadataRoute } from "next";
import { getEvents } from "@/lib/api";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = site.url.replace(/\/+$/, "");
  const staticRoutes = ["", "/events", "/work", "/about", "/contact", "/privacy", "/terms"];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route || "/"}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/events" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  const events = await getEvents();
  const eventEntries: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${baseUrl}/events?status=${event.status}#${encodeURIComponent(event.slug)}`,
    lastModified: new Date(event.date),
    changeFrequency: "weekly",
    priority: event.status === "upcoming" ? 0.9 : 0.6,
  }));

  return [...staticEntries, ...eventEntries];
}

