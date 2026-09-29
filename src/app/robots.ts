/**
 * /robots.txt
 * Private/utility paths are disallowed. (They ALSO carry `noindex` meta,
 * which is what actually keeps them out of the index.) Set
 * NEXT_PUBLIC_DISALLOW_INDEXING=true on staging to block everything.
 */
import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  if (siteConfig.disallowIndexing) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/cart", "/checkout", "/account", "/wishlist", "/search", "/track-order", "/*?*utm_", "/*?*sort=", "/*?*variant="],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
