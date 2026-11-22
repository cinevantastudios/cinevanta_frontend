import type { MetadataRoute } from "next";
import { routes, site } from "@/lib/site";

/** Generates robots.txt rules from centralized site and route configuration. */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = site.url.replace(/\/+$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: routes.home,
      disallow: [routes.styleguide],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
