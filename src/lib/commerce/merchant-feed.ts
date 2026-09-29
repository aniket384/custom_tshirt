/**
 * GOOGLE MERCHANT CENTER FEED (readiness).
 *
 * Maps catalogue variants to Merchant Center attributes. Served as RSS 2.0
 * XML at /feeds/google-merchant.xml (see app/feeds/...). Identifiers that do
 * not exist (gtin / mpn) are OMITTED and `identifier_exists` is set to "no"
 * — never fill them with made-up values.
 *
 * Before submitting a real feed: replace placeholder images with real
 * photography, confirm materials, prices, shipping and return settings.
 */
import { absoluteUrl } from "@/config/site";
import type { Product } from "./types";

export interface MerchantItem {
  id: string;
  item_group_id: string;
  title: string;
  description: string;
  link: string;
  image_link: string;
  additional_image_link: string[];
  availability: "in_stock" | "out_of_stock" | "preorder" | "backorder";
  price: string;
  sale_price?: string;
  brand: string;
  gtin?: string;
  mpn?: string;
  identifier_exists: "yes" | "no";
  condition: "new";
  color: string;
  size: string;
  gender: "male" | "female" | "unisex";
  age_group: "adult" | "kids";
  material: string;
}

const money = (n: number) => `${n.toFixed(2)} INR`;

export function toMerchantItems(products: Product[]): MerchantItem[] {
  return products.flatMap((p) =>
    p.variants.map((v) => {
      const color = p.colors.find((c) => c.id === v.colorId)?.name ?? v.colorId;
      const front = p.images.find((i) => i.kind === "front" && i.colorId === v.colorId) ?? p.thumbnail;
      const onSale = p.compareAtPrice && p.compareAtPrice > v.price;
      const hasIds = Boolean(v.gtin || p.mpn);
      return {
        id: v.sku,
        item_group_id: p.sku,
        title: `${p.name} - ${color} - ${v.size}`,
        description: p.description,
        link: absoluteUrl(`/product/${p.slug}?variant=${encodeURIComponent(v.id)}`),
        image_link: absoluteUrl(front.src),
        additional_image_link: p.images.filter((i) => i.src !== front.src && !i.colorId).map((i) => absoluteUrl(i.src)),
        // Merchant Center has no "made to order" → map to backorder.
        availability: v.availability === "made_to_order" ? "backorder" : v.availability,
        price: money(onSale ? p.compareAtPrice! : v.price),
        ...(onSale ? { sale_price: money(v.price) } : {}),
        brand: p.brand,
        ...(v.gtin ? { gtin: v.gtin } : {}),
        ...(p.mpn ? { mpn: p.mpn } : {}),
        identifier_exists: hasIds ? "yes" : "no",
        condition: "new",
        color,
        size: v.size,
        gender: p.gender === "men" ? "male" : p.gender === "women" ? "female" : "unisex",
        age_group: p.gender === "kids" ? "kids" : "adult",
        material: p.material,
      } satisfies MerchantItem;
    }),
  );
}

const x = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function merchantFeedXml(items: MerchantItem[], title: string, link: string): string {
  const body = items
    .map((it) => {
      const fields = Object.entries(it)
        .flatMap(([k, v]) => (Array.isArray(v) ? v.map((vv) => [k, vv] as const) : [[k, v] as const]))
        .map(([k, v]) => (k === "title" || k === "link" || k === "description" ? `<${k}>${x(String(v))}</${k}>` : `<g:${k}>${x(String(v))}</g:${k}>`))
        .join("");
      return `<item>${fields}</item>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel><title>${x(title)}</title><link>${x(link)}</link><description>Product feed (demo data)</description>
${body}
</channel></rss>`;
}
