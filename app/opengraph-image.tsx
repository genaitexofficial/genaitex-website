import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: ${site.tagline}`;
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
          justifyContent: "space-between",
          padding: 80,
          background:
            "radial-gradient(circle at 85% 10%, rgba(34,211,238,0.35), transparent 45%), radial-gradient(circle at 10% 100%, rgba(139,92,246,0.45), transparent 50%), #05060a",
          color: "#eceef5",
        }}
      >
        <div style={{ display: "flex", fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>
          gen
          <span style={{ color: "#a78bfa" }}>ai</span>
          tex
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 82,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 940,
            }}
          >
            {site.tagline}
          </div>
          <div style={{ display: "flex", marginTop: 32, fontSize: 30, color: "#a3aabd" }}>
            Static websites · Shopify storefronts · Custom development
          </div>
        </div>
      </div>
    ),
    size,
  );
}
