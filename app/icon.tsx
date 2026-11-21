import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};
export const contentType = "image/png";

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
          backgroundColor: "#FFC93C",
          border: "4px solid #15110E",
          color: "#15110E",
          fontSize: 30,
          fontWeight: 900,
          letterSpacing: "-0.04em",
        }}
      >
        C*
      </div>
    ),
    {
      ...size,
    },
  );
}

