import { ImageResponse } from "next/og";
import { site } from "./site";

export const ogSize = { width: 1200, height: 630 };

/** The 1200x630 share card of a page: the brand, a small label, and the page's title. */
export function renderOg({ eyebrow, title }: { eyebrow: string; title: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "radial-gradient(circle at 85% 10%, rgba(230,233,238,0.22), transparent 45%), radial-gradient(circle at 10% 100%, rgba(154,160,168,0.3), transparent 50%), #0e0f11",
          color: "#edeae4",
        }}
      >
        <div style={{ display: "flex", fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>
          gen
          <span style={{ color: "#9aa0a8" }}>ai</span>
          tex
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 28, color: "#a9adb4", letterSpacing: 4, textTransform: "uppercase" }}>
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: title.length > 60 ? 62 : 74,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#a9adb4" }}>{site.url.replace("https://", "")}</div>
      </div>
    ),
    ogSize,
  );
}
