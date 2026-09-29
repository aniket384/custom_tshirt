/**
 * Facet builder for listing pages. Only options that exist in the current
 * base product set are offered (no dead-end filters), with product counts.
 */
import { categories } from "@/data/categories";
import {
  COLORS,
  FIT_LABELS,
  GENDER_LABELS,
  OCCASION_LABELS,
  PRICE_BUCKETS,
  PRINT_TYPE_LABELS,
} from "@/data/options";
import type { FilterKey } from "./catalog";
import type { Product } from "./types";

export interface FacetOption {
  value: string;
  label: string;
  count: number;
  /** Swatch colour for colour facets. */
  hex?: string;
}

export interface FacetGroup {
  key: FilterKey;
  label: string;
  options: FacetOption[];
}

function count<T extends string>(products: Product[], get: (p: Product) => T[], label: (v: T) => string, order?: T[]): FacetOption[] {
  const map = new Map<T, number>();
  for (const p of products) for (const v of new Set(get(p))) map.set(v, (map.get(v) ?? 0) + 1);
  const keys = [...map.keys()];
  if (order) keys.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  return keys.map((v) => ({ value: v, label: label(v), count: map.get(v)! }));
}

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"];

export function buildFacets(products: Product[], opts: { includeCategory?: boolean } = {}): FacetGroup[] {
  const groups: FacetGroup[] = [];
  if (opts.includeCategory) {
    groups.push({
      key: "category",
      label: "Category",
      options: count(products, (p) => p.categories, (v) => categories.find((c) => c.slug === v)?.name ?? v, categories.map((c) => c.slug)),
    });
  }
  groups.push(
    {
      key: "price",
      label: "Price",
      options: PRICE_BUCKETS.map((b) => ({ value: b.id, label: b.label, count: products.filter((p) => p.price >= b.min && p.price < b.max).length })).filter(
        (o) => o.count > 0,
      ),
    },
    { key: "size", label: "Size", options: count(products, (p) => p.sizes as string[], (v) => v, SIZE_ORDER) },
    {
      key: "color",
      label: "Colour",
      options: count(products, (p) => p.colors.map((c) => c.id as string), (v) => COLORS[v as keyof typeof COLORS]?.name ?? v, Object.keys(COLORS)).map((o) => ({
        ...o,
        hex: COLORS[o.value as keyof typeof COLORS]?.hex,
      })),
    },
    { key: "fit", label: "Fit", options: count(products, (p) => [p.fit], (v) => FIT_LABELS[v]) },
    { key: "gender", label: "Gender", options: count(products, (p) => [p.gender], (v) => GENDER_LABELS[v]) },
    { key: "print", label: "Print Type", options: count(products, (p) => [p.printType], (v) => PRINT_TYPE_LABELS[v]) },
    { key: "occasion", label: "Occasion", options: count(products, (p) => p.occasion, (v) => OCCASION_LABELS[v]) },
    {
      key: "availability",
      label: "Availability",
      options: [{ value: "in-stock", label: "Hide out of stock", count: products.filter((p) => p.availability !== "out_of_stock").length }],
    },
  );
  // Drop groups with a single meaningless option (except availability).
  return groups.filter((g) => g.options.length > 1 || g.key === "availability");
}
