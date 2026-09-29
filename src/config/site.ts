/**
 * Site-wide brand configuration — the single source of truth for brand facts.
 *
 * RULE: only facts confirmed by the business live here. Anything unknown
 * (phone, email, street address, GST, delivery times...) stays `null` / empty
 * and the UI must hide it rather than invent a value.
 *
 * Contact details come from environment variables so they can be filled in
 * per-deployment without a code change (see `.env.example`).
 */

/** Strip a trailing slash so we can safely do `${siteUrl}${path}`. */
function normaliseOrigin(url: string | undefined): string {
  return (url && url.trim() ? url.trim() : "http://localhost:3000").replace(/\/+$/, "");
}

export const siteConfig = {
  name: "Custom T-Shirt Wala",
  shortName: "CTW",
  tagline: "Apna Design Apni Style",
  /** Default meta description — pages should override with their own. */
  description:
    "Custom printed T-shirts, hoodies and personalised apparel — photo, name and quote prints, couple, family, kids, gym and corporate T-shirts. Based in Datia, Madhya Pradesh with delivery across India.",
  url: normaliseOrigin(process.env.NEXT_PUBLIC_SITE_URL),
  locale: "en_IN",
  language: "en-IN",
  currency: "INR" as const,

  /** Confirmed location messaging (city/state only — no street address). */
  location: {
    city: "Datia",
    region: "Madhya Pradesh",
    regionCode: "MP",
    country: "India",
    countryCode: "IN",
    deliveryArea: "All India Delivery",
  },

  social: {
    instagram: "https://www.instagram.com/customtshirtwala/",
    instagramHandle: "@customtshirtwala",
  },

  /**
   * Contact placeholders. `null` means "not confirmed yet" → UI hides it.
   * WhatsApp number format: country code + number, digits only (e.g. 91XXXXXXXXXX).
   */
  contact: {
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || null,
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null,
  },

  /**
   * Brand logo. Drop the real artwork at /public/brand/logo.svg (or .png) and
   * set `src` — the <Logo> component switches from the text lockup to the image.
   */
  logo: {
    src: null as string | null, // e.g. "/brand/logo.svg"
    width: 160,
    height: 48,
  },

  /** Default social share image (1200×630). Replace with real brand art. */
  ogImage: "/images/brand/og-default.webp",

  /**
   * Prototype flag. While true, the UI shows honest "demo" labelling on
   * checkout, orders, testimonials etc. Flip to false only once real
   * backend integrations are connected.
   */
  isDemo: true,

  /** Set NEXT_PUBLIC_DISALLOW_INDEXING=true on staging to noindex everything. */
  disallowIndexing: process.env.NEXT_PUBLIC_DISALLOW_INDEXING === "true",
} as const;

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** WhatsApp deep link, or null if the number is not configured. */
export function whatsappLink(message?: string): string | null {
  const number = siteConfig.contact.whatsappNumber;
  if (!number) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${number}${text}`;
}
