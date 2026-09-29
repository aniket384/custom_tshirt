/**
 * STRUCTURED DATA BUILDERS (schema.org JSON-LD)
 *
 * Rules:
 *  1. ONE authoritative builder per entity. Organization + WebSite are
 *     rendered once in the root layout; pages render only their own entity
 *     (Product, BreadcrumbList, ItemList, Article, FAQPage).
 *  2. Only describe what is VISIBLE on the page, from real (mock) data.
 *  3. Never fabricate ratings, reviews, GTINs, stock or shipping promises.
 *     `aggregateRating` / `review` are emitted ONLY if verified review data
 *     is passed in — the prototype has none, so they are omitted.
 *
 * Validate with https://search.google.com/test/rich-results after changes.
 */
import { absoluteUrl, siteConfig } from "@/config/site";
import type { BlogPost } from "@/data/blog";
import type { Faq } from "@/data/content";
import type { Availability, Product } from "@/lib/commerce/types";

type Json = Record<string, unknown>;

const ORG_ID = `${siteConfig.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

const AVAILABILITY: Record<Availability, string> = {
  in_stock: "https://schema.org/InStock",
  out_of_stock: "https://schema.org/OutOfStock",
  preorder: "https://schema.org/PreOrder",
  made_to_order: "https://schema.org/MadeToOrder",
};

export function organizationJsonLd(): Json {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: siteConfig.name,
    slogan: siteConfig.tagline,
    url: siteConfig.url,
    logo: absoluteUrl("/icon.png"),
    sameAs: [siteConfig.social.instagram],
    // City/region only — no street address has been confirmed.
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.region,
      addressCountry: siteConfig.location.countryCode,
    },
    areaServed: { "@type": "Country", name: siteConfig.location.country },
    ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
  };
}

export function websiteJsonLd(): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    inLanguage: siteConfig.language,
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteConfig.url}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export interface Crumb {
  name: string;
  href: string;
}

export function breadcrumbJsonLd(crumbs: Crumb[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.href),
    })),
  };
}

/** Product listing pages: a lightweight ItemList of product URLs. */
export function itemListJsonLd(name: string, products: Pick<Product, "slug" | "name">[]): Json {
  return {
    "@type": "ItemList",
    name,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/product/${p.slug}`),
      name: p.name,
    })),
  };
}

/** Optional verified review data. The prototype never passes this. */
export interface VerifiedReviews {
  ratingValue: number;
  reviewCount: number;
  reviews: { author: string; rating: number; body: string; datePublished: string }[];
}

/**
 * Product variants → ProductGroup with `hasVariant` Products (one per SKU).
 * `variesBy` lists the attributes that change between variants.
 */
export function productGroupJsonLd(product: Product, reviews?: VerifiedReviews): Json {
  const url = absoluteUrl(`/product/${product.slug}`);
  const colorName = (id: string) => product.colors.find((c) => c.id === id)?.name ?? id;
  const imageFor = (colorId: string) =>
    absoluteUrl((product.images.find((i) => i.kind === "front" && i.colorId === colorId) ?? product.thumbnail).src);

  const variesBy = ["https://schema.org/size", ...(product.colors.length > 1 ? ["https://schema.org/color"] : [])];

  return {
    "@type": "ProductGroup",
    "@id": `${url}#product`,
    name: product.name,
    description: product.description,
    url,
    brand: { "@type": "Brand", name: product.brand },
    productGroupID: product.sku,
    variesBy,
    image: product.images.slice(0, 5).map((i) => absoluteUrl(i.src)),
    material: product.material,
    category: product.category,
    audience: { "@type": "PeopleAudience", suggestedGender: product.gender === "kids" ? "unisex" : product.gender },
    ...(reviews
      ? {
          aggregateRating: { "@type": "AggregateRating", ratingValue: reviews.ratingValue, reviewCount: reviews.reviewCount },
          review: reviews.reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.author },
            reviewRating: { "@type": "Rating", ratingValue: r.rating },
            reviewBody: r.body,
            datePublished: r.datePublished,
          })),
        }
      : {}),
    hasVariant: product.variants.map((v) => ({
      "@type": "Product",
      sku: v.sku,
      name: `${product.name} — ${colorName(v.colorId)} / ${v.size}`,
      image: imageFor(v.colorId),
      color: colorName(v.colorId),
      size: v.size,
      ...(v.gtin ? { gtin: v.gtin } : {}),
      offers: {
        "@type": "Offer",
        url: `${url}?variant=${encodeURIComponent(v.id)}`,
        priceCurrency: product.currency,
        price: v.price,
        availability: AVAILABILITY[v.availability],
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@id": ORG_ID },
      },
    })),
  };
}

export function articleJsonLd(post: BlogPost): Json {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    image: [absoluteUrl(post.image.src)],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    mainEntityOfPage: url,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: siteConfig.language,
  };
}

/** Only for pages whose main content IS the FAQ list (e.g. /faq). */
export function faqPageJsonLd(faqs: Faq[]): Json {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Wrap one or more entities in a single @graph document. */
export function graph(...nodes: Json[]): Json {
  return { "@context": "https://schema.org", "@graph": nodes };
}
