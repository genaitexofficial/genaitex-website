import { ImageResponse } from "next/og";

/** The genaitex mark on its dark tile, as a PNG of any square size (home-screen icons, structured-data logo). */
export function renderIcon(px: number) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0e0f11", borderRadius: px * 0.25 }}>
        <svg width={px} height={px} viewBox="0 0 64 64">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f4f2ee" />
              <stop offset="1" stopColor="#9aa0a8" />
            </linearGradient>
          </defs>
          <path
            d="M25 21 12 32l13 11M39 21l13 11-13 11M35 15 29 49"
            fill="none"
            stroke="url(#g)"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    { width: px, height: px },
  );
}
