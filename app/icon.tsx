import { ImageResponse } from "next/og";
import { site, themeColors } from "@/lib/site";

export const size = {
  width: 64,
  height: 64,
};
export const contentType = "image/png";

/** Generates the dynamic favicon using centralized brand tokens and short mark. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "999px",
          backgroundColor: themeColors.yellow,
          border: `4px solid ${themeColors.ink}`,
          color: themeColors.ink,
          fontSize: 30,
          fontWeight: 900,
          letterSpacing: "-0.04em",
        }}
      >
        {site.shortMark}
      </div>
    ),
    {
      ...size,
    },
  );
}
