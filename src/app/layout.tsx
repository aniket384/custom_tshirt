/**
 * ROOT LAYOUT
 * - Loads fonts with next/font (self-hosted, `display: swap`, size-adjusted
 *   fallbacks → no font-induced layout shift).
 * - Sets site-wide metadata defaults (pages override title/description/canonical).
 * - Renders Organization + WebSite JSON-LD ONCE for the whole site.
 * - Wraps every page with header, footer and the toast live region.
 */
import type { Metadata, Viewport } from "next";
import { Anton, Manrope, Permanent_Marker } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/Toaster";
import { JsonLd } from "@/components/seo/JsonLd";
import { graph, organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";

// Body copy — variable font, one file for all weights.
const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });
// Display headings — condensed, bold streetwear feel.
const heading = Anton({ weight: "400", subsets: ["latin"], variable: "--font-heading", display: "swap" });
// Brush accent (tagline, small flourishes) — used sparingly, never for body text.
const brush = Permanent_Marker({ weight: "400", subsets: ["latin"], variable: "--font-brush", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Custom T-Shirts | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  formatDetection: { telephone: false },
  robots: siteConfig.disallowIndexing ? { index: false, follow: false } : { index: true, follow: true },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#0e0e0e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${body.variable} ${heading.variable} ${brush.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-[70] rounded-full bg-brand px-4 py-2 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster />
        {/* Site-wide entities, rendered exactly once. */}
        <JsonLd data={graph(organizationJsonLd(), websiteJsonLd())} />
      </body>
    </html>
  );
}
