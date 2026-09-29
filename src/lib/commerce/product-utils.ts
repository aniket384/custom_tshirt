/**
 * Pure product helpers — safe to import from Client Components
 * (no catalogue data, no server-only code).
 */
import type { Product, ProductImage } from "./types";

export function productUrl(p: Pick<Product, "slug">): string {
  return `/product/${p.slug}`;
}

/** Whole-number discount %, or null when there is no genuine markdown. */
export function discountPercent(price: number, compareAt: number | null): number | null {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

/** Front image for a colourway (falls back to the thumbnail). */
export function imageForColor(p: Pick<Product, "images" | "thumbnail">, colorId: string): ProductImage {
  return p.images.find((i) => i.kind === "front" && i.colorId === colorId) ?? p.thumbnail;
}

export const AVAILABILITY_LABELS = {
  in_stock: "In stock",
  out_of_stock: "Out of stock",
  preorder: "Pre-order",
  made_to_order: "Made to order",
} as const;
