import type { MetadataRoute } from "next";
import { content } from "@/lib/content";
import { routes, site, themeColors } from "@/lib/site";

/** Generates the web app manifest from centralized brand and color tokens. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.wordmark,
    description: content.meta.defaultDescription,
    start_url: routes.home,
    display: "standalone",
    background_color: themeColors.cream,
    theme_color: themeColors.yellow,
    icons: [
      {
        src: "/icon.png",
        sizes: "128x128",
        type: "image/png",
      },
    ],
  };
}
