import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — Film, advertising and live events in Delhi`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

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
          backgroundColor: "#FFC93C",
          color: "#15110E",
          padding: "56px 64px",
          border: "16px solid #15110E",
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
              border: "3px solid #15110E",
              backgroundColor: "#FFF6E3",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            FILM STUDIO, DELHI
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 84,
              height: 84,
              borderRadius: "999px",
              border: "3px solid #15110E",
              backgroundColor: "#15110E",
              color: "#FFC93C",
              fontSize: 34,
              fontWeight: 900,
            }}
          >
            C*
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
            CINEVANTA*
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              color: "#15110E",
            }}
          >
            Films, advertising and live events from Delhi.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}

