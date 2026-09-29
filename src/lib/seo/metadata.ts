/**
 * Metadata helper — every page builds its <head> through `buildMetadata()`
 * so titles, descriptions, canonicals, Open Graph and Twitter tags stay
 * consistent.
 *
 * Canonical strategy:
 *  - Canonical is always the clean path WITHOUT query params, so filtered /
 *    sorted / UTM-tagged URLs consolidate to one indexable URL.
 *  - Private or utility pages pass `noindex: true`.
 */
import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";

interface BuildMetadataInput {
  title: string;
  description: string;
  /** Site-relative path, e.g. "/shop/hoodies". Used for canonical + og:url. */
  path: string;
  image?: { src: string; alt: string; width?: number; height?: number };
  /** Keep out of the index (cart, checkout, account, search...). Links are still followed. */
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  /** Pass true for the homepage so the title isn't suffixed twice. */
  absoluteTitle?: boolean;
}

export function buildMetadata({
  title,
  description,
  path,
  image,
  noindex = false,
  type = "website",
  publishedTime,
  modifiedTime,
  absoluteTitle = false,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ?? { src: siteConfig.ogImage, alt: siteConfig.name, width: 1200, height: 630 };
  const images = [{ url: absoluteUrl(ogImage.src), alt: ogImage.alt, width: ogImage.width, height: ogImage.height }];
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    robots: noindex || siteConfig.disallowIndexing ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images,
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: images.map((i) => i.url),
    },
  };
}

/** Shorthand for private/utility pages. */
export function noindexMetadata(title: string, path: string, description: string = siteConfig.description): Metadata {
  return buildMetadata({ title, description, path, noindex: true });
}
