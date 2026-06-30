import { ImageResponse } from "next/og";

export const alt = "By Mosaic — Los Angeles Wedding & Social Event Planner";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F6F1E9",
          position: "relative",
        }}
      >
        {/* sage accent bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 12, background: "#4F6F57", display: "flex" }} />

        <div
          style={{
            fontSize: 32,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#4F6F57",
            marginBottom: 28,
            display: "flex",
          }}
        >
          By Mosaic
        </div>
        <div
          style={{
            fontSize: 78,
            fontWeight: 600,
            color: "#2B2622",
            textAlign: "center",
            lineHeight: 1.1,
            maxWidth: 940,
            display: "flex",
          }}
        >
          Crafting events as unique as mosaics
        </div>
        <div
          style={{
            fontSize: 30,
            color: "#8C8275",
            marginTop: 34,
            display: "flex",
          }}
        >
          Los Angeles wedding &amp; social event planner
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 12, background: "#4F6F57", display: "flex" }} />
      </div>
    ),
    { ...size }
  );
}
