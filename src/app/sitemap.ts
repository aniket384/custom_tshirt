/**
 * /sitemap.xml — public, indexable URLs only.
 * Excludes cart, checkout, account, wishlist, search, track-order and any
 * query-string URLs (filters, customiser state, tracking params).
 */
import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { blogPosts } from "@/data/blog";
import { CUSTOMIZER_PRESETS } from "@/data/customizer";
import { getAllCategories, getAllCollections, getAllProducts } from "@/lib/commerce/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, collections] = await Promise.all([getAllProducts(), getAllCategories(), getAllCollections()]);

  const staticPages = [
    { path: "/", priority: 1 },
    { path: "/shop", priority: 0.9 },
    { path: "/custom-tshirt", priority: 0.9 },
    { path: "/collections", priority: 0.7 },
    { path: "/bulk-orders", priority: 0.8 },
    { path: "/blog", priority: 0.6 },
    { path: "/about", priority: 0.4 },
    { path: "/contact", priority: 0.4 },
    { path: "/faq", priority: 0.5 },
    { path: "/shipping-policy", priority: 0.2 },
    { path: "/returns", priority: 0.2 },
    { path: "/privacy-policy", priority: 0.1 },
    { path: "/terms-and-conditions", priority: 0.1 },
    { path: "/cookie-policy", priority: 0.1 },
  ];

  return [
    ...staticPages.map((p) => ({ url: absoluteUrl(p.path), priority: p.priority })),
    ...categories.map((c) => ({ url: absoluteUrl(`/shop/${c.slug}`), priority: 0.8 })),
    ...collections.map((c) => ({ url: absoluteUrl(`/collections/${c.slug}`), priority: 0.7 })),
    ...CUSTOMIZER_PRESETS.map((p) => ({ url: absoluteUrl(`/custom-tshirt/${p.slug}`), priority: 0.7 })),
    ...products.map((p) => ({
      url: absoluteUrl(`/product/${p.slug}`),
      lastModified: new Date(p.createdAt),
      priority: 0.7,
      images: [absoluteUrl(p.thumbnail.src)],
    })),
    ...blogPosts.map((b) => ({ url: absoluteUrl(`/blog/${b.slug}`), lastModified: new Date(b.updatedAt ?? b.publishedAt), priority: 0.5 })),
  ];
}
