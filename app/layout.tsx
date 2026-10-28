import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/layout/Providers";
import { DnaProvider } from "@/components/dna/DnaProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { themeScript } from "@/components/theme/store";
import { currencyScript } from "@/components/currency/store";
import { DnaBackdrop } from "@/components/dna/DnaBackdrop";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteGraph } from "@/lib/jsonld";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.seoTitle,
    template: `%s · ${site.name}`,
  },
  description: site.seoDescription,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    title: site.seoTitle,
    description: site.seoDescription,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: site.seoTitle,
    description: site.seoDescription,
  },
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // Search Console / Bing Webmaster Tools "HTML tag" verification, from env vars (see .env.example)
  verification: {
    google: site.verification.google || undefined,
    other: site.verification.bing ? { "msvalidate.01": site.verification.bing } : undefined,
  },
};

export const viewport: Viewport = {
  // The browser bar follows the device's light / dark setting, like the Day / Night theme does on Auto
  themeColor: site.desktopThemes
    ? [{ media: "(prefers-color-scheme: light)", color: "#f3f1ec" }, { color: "#0e0f11" }]
    : "#05060a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        {/* Sets the desktop theme before first paint, so there is never a flash of the wrong one */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Likewise for the currency prices are shown in (rupees for visitors in India, else dollars) */}
        <script dangerouslySetInnerHTML={{ __html: currencyScript }} />
        <JsonLd data={siteGraph()} />
        <Providers>
          <ThemeProvider>
            <DnaProvider>
              <DnaBackdrop />
              <a
                href="#main"
                className="sr-only z-[100] rounded-md bg-white px-4 py-2 text-sm font-medium text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
              >
                Skip to content
              </a>
              <CursorGlow />
              <Navbar />
              <ScrollProgress />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
            </DnaProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
