import type { MetadataRoute } from "next";
import { content } from "@/lib/content";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.wordmark,
    description: content.meta.defaultDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#FFF6E3",
    theme_color: "#FFC93C",
    icons: [
      {
        src: "/icon",
        sizes: "64x64",
        type: "image/png",
      },
    ],
  };
}

