import { ImageResponse } from "next/og";
import { content } from "@/lib/content";
import { site, themeColors } from "@/lib/site";

export const alt = content.meta.defaultTitle;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/** Generates the 1200x630 Open Graph social share image from centralized site and theme tokens. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: themeColors.yellow,
          color: themeColors.ink,
          padding: "56px 64px",
          border: `16px solid ${themeColors.ink}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              borderRadius: "999px",
              border: `3px solid ${themeColors.ink}`,
              backgroundColor: themeColors.cream,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {content.hero.kicker.toUpperCase()}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 84,
              height: 84,
              borderRadius: "999px",
              border: `3px solid ${themeColors.ink}`,
              backgroundColor: themeColors.ink,
              color: themeColors.yellow,
              fontSize: 34,
              fontWeight: 900,
            }}
          >
            {site.shortMark}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <div
            style={{
              fontSize: 122,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 0.92,
              textTransform: "uppercase",
            }}
          >
            {`${site.wordmark.toUpperCase()}*`}
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              color: themeColors.ink,
            }}
          >
            {content.footer.tagline}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
