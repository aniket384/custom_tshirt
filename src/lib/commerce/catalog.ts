/**
 * CATALOG SERVICE (mock implementation)
 * ---------------------------------------------------------------------------
 * The ONLY module pages should use to read products, categories and
 * collections. Today it normalises local seed data; in production, replace
 * the bodies of these functions with API calls (Shopify Storefront, Medusa,
 * a custom REST/GraphQL API...) and keep the signatures.
 *
 * Functions are `async` on purpose, so swapping to network calls later does
 * not change any call sites.
 */
import { categories as categoryData } from "@/data/categories";
import { collections as collectionData } from "@/data/collections";
import { ADULT_SIZES, COLORS, KIDS_SIZES, PRICE_BUCKETS } from "@/data/options";
import { productSeeds, type ProductSeed } from "@/data/products";
import { siteConfig } from "@/config/site";
import type {
  Availability,
  Category,
  CategorySlug,
  Collection,
  Product,
  ProductImage,
  ProductVariant,
  Size,
} from "./types";

/* ------------------------------------------------------------------------ */
/* Normalisation (seed → Product)                                           */
/* ------------------------------------------------------------------------ */

const IMG_W = 1000;
const IMG_H = 1250;

function buildImages(seed: ProductSeed): ProductImage[] {
  const base = `/images/products/${seed.slug}`;
  const [primary] = seed.colors;
  const primaryName = COLORS[primary].name;
  const img = (file: string, kind: ProductImage["kind"], alt: string, colorId?: ProductImage["colorId"]): ProductImage => ({
    src: `${base}/${file}`,
    alt,
    width: IMG_W,
    height: IMG_H,
    kind,
    ...(colorId ? { colorId } : {}),
  });

  return [
    img(`front-${primary}.webp`, "front", `${seed.name} in ${primaryName} — front view`, primary),
    img("back.webp", "back", `${seed.name} in ${primaryName} — back view`),
    img("model.webp", "model", `${seed.name} — styled lifestyle view`),
    img("detail.webp", "detail", `${seed.name} — print detail`),
    img("closeup.webp", "closeup", `${seed.name} — fabric and print close-up`),
    // Additional colourways (front only) — used by the colour switcher.
    ...seed.colors.slice(1).map((c) => img(`front-${c}.webp`, "front", `${seed.name} in ${COLORS[c].name} — front view`, c)),
  ];
}

function resolveSizes(seed: ProductSeed): Size[] {
  if (seed.sizes === "adult") return [...ADULT_SIZES];
  if (seed.sizes === "kids") return [...KIDS_SIZES];
  return seed.sizes;
}

/** Colour codes used in SKUs, e.g. BLK. */
function colorCode(id: string) {
  return id
    .split("-")
    .map((part) => part.slice(0, 3))
    .join("")
    .toUpperCase();
}

function buildVariants(seed: ProductSeed, sizes: Size[]): ProductVariant[] {
  const soldOut = new Set(seed.soldOut ?? []);
  const availabilityFor = (key: string): Availability => {
    if (soldOut.has(key)) return "out_of_stock";
    // Custom pieces are printed on demand.
    return seed.isCustomizable ? "made_to_order" : "in_stock";
  };
  return seed.colors.flatMap((colorId) =>
    sizes.map((size) => ({
      id: `${seed.id}-${colorId}-${size}`.toLowerCase(),
      sku: `${seed.id.toUpperCase()}-${colorCode(colorId)}-${size}`,
      productId: seed.id,
      colorId,
      size,
      fit: seed.fit,
      availability: availabilityFor(`${colorId}-${size}`),
      price: seed.price,
      compareAtPrice: seed.compareAtPrice,
      gtin: null,
    })),
  );
}

function normalise(seed: ProductSeed): Product {
  const sizes = resolveSizes(seed);
  const variants = buildVariants(seed, sizes);
  const images = buildImages(seed);
  const anyAvailable = variants.some((v) => v.availability !== "out_of_stock");
  return {
    id: seed.id,
    slug: seed.slug,
    name: seed.name,
    shortDescription: seed.shortDescription,
    description: seed.description,
    brand: siteConfig.name,
    sku: seed.id.toUpperCase(),
    gtin: null,
    mpn: null,
    category: seed.category,
    categories: [seed.category, ...(seed.alsoIn ?? [])],
    collections: [], // filled below once collection rules are evaluated
    price: seed.price,
    compareAtPrice: seed.compareAtPrice,
    currency: siteConfig.currency,
    availability: anyAvailable ? (seed.isCustomizable ? "made_to_order" : "in_stock") : "out_of_stock",
    condition: "new",
    images,
    thumbnail: images[0],
    variants,
    sizes,
    colors: seed.colors.map((c) => COLORS[c]),
    fit: seed.fit,
    gender: seed.gender,
    material: seed.material,
    printType: seed.printType,
    printPlacements: seed.printPlacements,
    occasion: seed.occasion,
    tags: seed.tags,
    badge: seed.badge ?? null,
    highlights: seed.highlights,
    care: ["Machine wash cold, inside out", "Do not iron directly on the print", "Do not bleach", "Line dry in shade"],
    isCustomizable: Boolean(seed.isCustomizable),
    customizerPreset: seed.customizerPreset ?? null,
    isBestSeller: Boolean(seed.isBestSeller),
    isNewArrival: Boolean(seed.isNewArrival),
    seo: {},
    createdAt: seed.createdAt,
  };
}

export function productMatchesCollection(p: Product, c: Collection): boolean {
  const r = c.rule;
  if (r.flag === "bestseller" && p.isBestSeller) return true;
  if (r.flag === "new" && p.isNewArrival) return true;
  if (r.occasions?.some((o) => p.occasion.includes(o))) return true;
  if (r.printTypes?.includes(p.printType)) return true;
  if (r.tags?.some((t) => p.tags.includes(t))) return true;
  return false;
}

// Normalise once per server process (the data is static).
const PRODUCTS: Product[] = productSeeds.map(normalise).map((p) => ({
  ...p,
  collections: collectionData.filter((c) => productMatchesCollection(p, c)).map((c) => c.slug),
}));

/* ------------------------------------------------------------------------ */
/* Public API                                                               */
/* ------------------------------------------------------------------------ */

export async function getAllProducts(): Promise<Product[]> {
  return PRODUCTS;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  return slugs.map((s) => PRODUCTS.find((p) => p.slug === s)).filter((p): p is Product => Boolean(p));
}

export async function getAllCategories(): Promise<Category[]> {
  return categoryData;
}

export async function getCategory(slug: string): Promise<Category | null> {
  return categoryData.find((c) => c.slug === slug) ?? null;
}

export async function getProductsInCategory(slug: CategorySlug): Promise<Product[]> {
  return PRODUCTS.filter((p) => p.categories.includes(slug));
}

export async function getAllCollections(): Promise<Collection[]> {
  return collectionData;
}

export async function getCollection(slug: string): Promise<Collection | null> {
  return collectionData.find((c) => c.slug === slug) ?? null;
}

export async function getProductsInCollection(slug: string): Promise<Product[]> {
  return PRODUCTS.filter((p) => p.collections.includes(slug));
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  return PRODUCTS.filter((p) => p.isBestSeller).slice(0, limit);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  return PRODUCTS.filter((p) => p.isNewArrival)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

/** Related = same primary category first, then shared occasions. */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const score = (p: Product) =>
    (p.category === product.category ? 3 : 0) +
    p.occasion.filter((o) => product.occasion.includes(o)).length +
    (p.fit === product.fit ? 1 : 0);
  return PRODUCTS.filter((p) => p.id !== product.id)
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}

/* ------------------------------------------------------------------------ */
/* Filtering & sorting (URL-driven; used by /shop, categories, collections) */
/* ------------------------------------------------------------------------ */

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

/** Filter keys ↔ URL query params. Values are comma-separated in the URL. */
export interface ProductFilters {
  category: string[];
  price: string[];
  size: string[];
  color: string[];
  fit: string[];
  gender: string[];
  print: string[];
  occasion: string[];
  availability: string[];
  sort: SortKey;
}

export const FILTER_KEYS = ["category", "price", "size", "color", "fit", "gender", "print", "occasion", "availability"] as const;
export type FilterKey = (typeof FILTER_KEYS)[number];

type SearchParamsInput = Record<string, string | string[] | undefined>;

/** Parse URL search params into typed filters. Unknown values are ignored downstream. */
export function parseFilters(sp: SearchParamsInput): ProductFilters {
  const list = (k: string) => {
    const v = sp[k];
    const raw = Array.isArray(v) ? v.join(",") : v ?? "";
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 20);
  };
  const sortRaw = typeof sp.sort === "string" ? sp.sort : "featured";
  const sort = (SORT_OPTIONS.some((o) => o.value === sortRaw) ? sortRaw : "featured") as SortKey;
  return {
    category: list("category"),
    price: list("price"),
    size: list("size"),
    color: list("color"),
    fit: list("fit"),
    gender: list("gender"),
    print: list("print"),
    occasion: list("occasion"),
    availability: list("availability"),
    sort,
  };
}

export function hasActiveFilters(f: ProductFilters): boolean {
  return FILTER_KEYS.some((k) => f[k].length > 0) || f.sort !== "featured";
}

export function applyFilters(products: Product[], f: ProductFilters): Product[] {
  const buckets = PRICE_BUCKETS.filter((b) => f.price.includes(b.id));
  const out = products.filter((p) => {
    if (f.category.length && !f.category.some((c) => p.categories.includes(c as CategorySlug))) return false;
    if (buckets.length && !buckets.some((b) => p.price >= b.min && p.price < b.max)) return false;
    if (f.size.length && !p.sizes.some((s) => f.size.includes(s))) return false;
    if (f.color.length && !p.colors.some((c) => f.color.includes(c.id))) return false;
    if (f.fit.length && !f.fit.includes(p.fit)) return false;
    if (f.gender.length && !f.gender.includes(p.gender)) return false;
    if (f.print.length && !f.print.includes(p.printType)) return false;
    if (f.occasion.length && !p.occasion.some((o) => f.occasion.includes(o))) return false;
    if (f.availability.includes("in-stock") && p.availability === "out_of_stock") return false;
    return true;
  });
  switch (f.sort) {
    case "newest":
      return [...out].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "price-asc":
      return [...out].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...out].sort((a, b) => b.price - a.price);
    default:
      return out;
  }
}

/* ------------------------------------------------------------------------ */
/* Search (simple token match — replace with Algolia/Meilisearch/Typesense) */
/* ------------------------------------------------------------------------ */

export async function searchProducts(query: string): Promise<Product[]> {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  const scored = PRODUCTS.map((p) => {
    const hay = [p.name, p.shortDescription, p.category, p.printType, ...p.tags, ...p.occasion, ...p.colors.map((c) => c.name)]
      .join(" ")
      .toLowerCase();
    const name = p.name.toLowerCase();
    const score = tokens.reduce((s, t) => s + (name.includes(t) ? 3 : hay.includes(t.replace(/s$/, "")) ? 1 : 0), 0);
    const allMatch = tokens.every((t) => hay.includes(t.replace(/s$/, "")));
    return { p, score: allMatch ? score + 5 : score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.p);
}

// Pure helpers live in product-utils.ts so Client Components can import them
// without pulling the whole catalogue into the browser bundle.
export { productUrl, discountPercent, imageForColor } from "./product-utils";
