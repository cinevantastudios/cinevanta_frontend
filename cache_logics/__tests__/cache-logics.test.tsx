import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cacheAdImpression,
  clearAdImpressionCache,
  getAdImpressionCachePrefix,
  hasCachedAdImpression,
} from "@/cache_logics/ad-impression-cache";
import {
  PAGE_REVALIDATE_SECONDS,
  SITEMAP_REVALIDATE_SECONDS,
  buildNextCacheOptions,
  cacheTags,
} from "@/cache_logics/revalidation-cache";
import { buildEventJsonLd, buildOrganizationJsonLd } from "@/components/seo/JsonLd";
import { StatusBanner } from "@/components/ui";
import {
  getEnvApiBaseUrl,
  getEnvImageHosts,
  getEnvMockAdsMode,
  getEnvMockEventsMode,
  getEnvSiteUrl,
  getEnvUseMocks,
} from "@/lib/env";
import { apiEndpoints, networkConfig } from "@/lib/api-client";
import {
  displayLimits,
  formatStudioContactSummary,
  mediaConfig,
  routes,
  site,
  uiConfig,
} from "@/lib/site";
import { createPageMetadata, isNavRouteActive } from "@/lib/utils";
import { WORK_CATEGORIES, formConstraints } from "@/types/api";

const originalEnv = { ...process.env };

describe("cache_logics & modular registries", () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
    clearAdImpressionCache();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it("builds Next.js Data Cache options and deterministic cache tags in cache_logics/revalidation-cache", () => {
    expect(PAGE_REVALIDATE_SECONDS).toBe(60);
    expect(SITEMAP_REVALIDATE_SECONDS).toBe(3600);
    expect(cacheTags.ads()).toBe("ads");
    expect(cacheTags.events()).toBe("events");
    expect(cacheTags.events("upcoming")).toBe("events:upcoming");
    expect(cacheTags.work("film", 2)).toBe("work:film:page-2");
    expect(cacheTags.work()).toBe("work:all:page-1");

    expect(buildNextCacheOptions([cacheTags.ads()])).toEqual({
      revalidate: 60,
      tags: ["ads"],
    });
    expect(buildNextCacheOptions(["sitemap"], SITEMAP_REVALIDATE_SECONDS)).toEqual({
      revalidate: 3600,
      tags: ["sitemap"],
    });
  });

  it("caches, reads, and clears ad impressions in cache_logics/ad-impression-cache", () => {
    const prefix = getAdImpressionCachePrefix();
    expect(prefix).toBe(`${site.wordmark.toLowerCase()}:ad-impression:`);

    expect(hasCachedAdImpression("ad-101")).toBe(false);
    cacheAdImpression("ad-101");
    expect(hasCachedAdImpression("ad-101")).toBe(true);
    expect(window.sessionStorage.getItem(`${prefix}ad-101`)).toBe("1");

    clearAdImpressionCache();
    expect(hasCachedAdImpression("ad-101")).toBe(false);
    expect(window.sessionStorage.getItem(`${prefix}ad-101`)).toBeNull();
  });

  it("reads typed environment variables through lib/env getters", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://cinevanta.in";
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.cinevanta.in///";
    process.env.NEXT_PUBLIC_USE_MOCKS = "false";
    process.env.NEXT_PUBLIC_MOCK_ADS = "0";
    process.env.NEXT_PUBLIC_MOCK_EVENTS = "none";
    process.env.NEXT_PUBLIC_IMAGE_HOSTS = "cdn.cinevanta.in, images.cinevanta.in , cdn.cinevanta.in";

    expect(getEnvSiteUrl()).toBe("https://cinevanta.in");
    expect(getEnvApiBaseUrl()).toBe("https://api.cinevanta.in");
    expect(getEnvUseMocks()).toBe(false);
    expect(getEnvMockAdsMode()).toBe("0");
    expect(getEnvMockEventsMode()).toBe("none");
    expect(getEnvImageHosts()).toEqual(["cdn.cinevanta.in", "images.cinevanta.in"]);
  });

  it("exposes centralized route builders, apiEndpoints, limits, constraints, and metadata factories", () => {
    expect(routes.workByCategory()).toBe("/work");
    expect(routes.workByCategory("all")).toBe("/work");
    expect(routes.workByCategory("film")).toBe("/work?category=film");
    expect(routes.eventsByStatus("past")).toBe("/events?status=past");
    expect(routes.eventAnchor("upcoming", "film-gala")).toBe("/events?status=upcoming#film-gala");
    expect(routes.contactByType("corporate")).toBe("/contact?type=corporate");

    expect(apiEndpoints.adTrack("ad 1", "impression")).toBe("/api/ads/ad%201/impression");
    expect(networkConfig.revalidateSeconds).toBe(PAGE_REVALIDATE_SECONDS);
    expect(displayLimits.workPageSize).toBe(9);
    expect(uiConfig.adAutoplayIntervalMs).toBe(5500);
    expect(mediaConfig.youtubeEmbedBaseUrl).toBe("https://www.youtube-nocookie.com");
    expect(formConstraints.messageMax).toBe(1000);
    expect(WORK_CATEGORIES).toContain("live_event");
    expect(formatStudioContactSummary()).toContain(site.city);

    expect(isNavRouteActive("/work", routes.work)).toBe(true);
    expect(isNavRouteActive("/work/detail", routes.work)).toBe(true);
    expect(isNavRouteActive("/", routes.services)).toBe(false);

    const meta = createPageMetadata({
      title: "Work",
      description: "Selected work",
      path: routes.work,
    });
    expect(meta.title).toBe("Work");
    expect(meta.openGraph?.title).toBe(`Work | ${site.name}`);

    const orgLd = buildOrganizationJsonLd();
    expect(orgLd["@type"]).toBe("Organization");

    const evtLd = buildEventJsonLd({
      id: "e1",
      slug: "gala",
      title: "Gala",
      date: "2026-10-10T10:00:00.000Z",
      venue: "Siri Fort",
      city: "Delhi",
      status: "upcoming",
    });
    expect(evtLd["@type"]).toBe("Event");
  });

  it("renders StatusBanner in both compact and full modes across light and ink surfaces", () => {
    const { rerender } = render(
      <StatusBanner
        variant="error"
        surface="light"
        title="Action needed"
        message="Please retry your request."
        action={<button type="button">Retry</button>}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Action needed");
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();

    rerender(
      <StatusBanner
        variant="success"
        surface="ink"
        compact
        message="Saved to event updates."
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Saved to event updates.");
  });
});
