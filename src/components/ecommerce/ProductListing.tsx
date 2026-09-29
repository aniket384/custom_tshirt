/**
 * Shared listing layout for /shop, /shop/[category] and /collections/[slug].
 *
 * - Filtering + sorting happen on the SERVER from URL params, so every
 *   filtered result is plain HTML (crawlable, agent-readable, no JS needed).
 * - Filtered URLs are noindexed by the page's metadata; canonical = basePath.
 * - Renders ItemList + BreadcrumbList JSON-LD for this page only.
 */
import Link from "next/link";
import type { Product } from "@/lib/commerce/types";
import {
  applyFilters,
  FILTER_KEYS,
  parseFilters,
  type FilterKey,
  type ProductFilters,
} from "@/lib/commerce/catalog";
import { buildFacets } from "@/lib/commerce/facets";
import { breadcrumbJsonLd, graph, itemListJsonLd, type Crumb } from "@/lib/seo/jsonld";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CloseIcon } from "@/components/ui/icons";
import { buttonClass } from "@/components/ui/button-styles";
import { FilterForm } from "./FilterForm";
import { FilterDrawer } from "./FilterDrawer";
import { SortSelect } from "./SortSelect";

interface ProductListingProps {
  h1: string;
  intro: string;
  basePath: string;
  crumbs: Crumb[];
  products: Product[];
  searchParams: Record<string, string | string[] | undefined>;
  includeCategoryFilter?: boolean;
  /** Extra content under the grid (SEO copy, related links). */
  children?: React.ReactNode;
}

function removeValueHref(basePath: string, f: ProductFilters, key: FilterKey, value: string) {
  const qs = new URLSearchParams();
  for (const k of FILTER_KEYS) {
    const vals = k === key ? f[k].filter((v) => v !== value) : f[k];
    if (vals.length) qs.set(k, vals.join(","));
  }
  if (f.sort !== "featured") qs.set("sort", f.sort);
  const s = qs.toString();
  return s ? `${basePath}?${s}` : basePath;
}

export function ProductListing({ h1, intro, basePath, crumbs, products, searchParams, includeCategoryFilter, children }: ProductListingProps) {
  const filters = parseFilters(searchParams);
  const results = applyFilters(products, filters);
  const groups = buildFacets(products, { includeCategory: includeCategoryFilter });
  const active = FILTER_KEYS.flatMap((k) =>
    filters[k].map((v) => ({ key: k, value: v, label: groups.find((g) => g.key === k)?.options.find((o) => o.value === v)?.label ?? v })),
  );
  // Remount the uncontrolled filter forms whenever the URL state changes.
  const formKey = JSON.stringify(filters);

  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs items={crumbs} />
      <header className="mt-5 max-w-3xl">
        <h1 className="heading-display text-5xl md:text-6xl">{h1}</h1>
        <p className="mt-3 text-base text-muted md:text-lg">{intro}</p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="sticky top-28">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider">Filter</h2>
            <FilterForm key={formKey} groups={groups} filters={filters} basePath={basePath} autoApply idPrefix="d" />
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <p className="text-sm text-muted" aria-live="polite">
              <strong className="text-ink">{results.length}</strong> {results.length === 1 ? "product" : "products"}
            </p>
            <div className="flex items-center gap-2">
              <FilterDrawer key={formKey} groups={groups} filters={filters} basePath={basePath} activeCount={active.length} />
              <SortSelect key={`s-${formKey}`} filters={filters} basePath={basePath} />
            </div>
          </div>

          {active.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Active filters">
              {active.map((a) => (
                <li key={`${a.key}-${a.value}`}>
                  <Link
                    href={removeValueHref(basePath, filters, a.key, a.value)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-surface px-3 text-xs font-semibold hover:bg-line"
                  >
                    {a.label}
                    <CloseIcon size={14} />
                    <span className="sr-only">Remove filter</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href={basePath} className="inline-flex min-h-9 items-center px-2 text-xs font-semibold underline underline-offset-4">
                  Clear all
                </Link>
              </li>
            </ul>
          )}

          <div className="mt-6">
            {/* Keeps heading order h1 → h2 → h3 (product card titles are h3). */}
            <h2 className="sr-only">Products</h2>
            {results.length ? (
              <ProductGrid products={results} eagerCount={2} label={`${h1} products`} />
            ) : (
              <div className="rounded-card border border-dashed border-line p-10 text-center">
                <p className="text-lg font-semibold">No products match these filters</p>
                <p className="mt-2 text-sm text-muted">Try removing a filter, or create exactly what you want in the customiser.</p>
                <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                  <Link href={basePath} className={buttonClass("dark")}>
                    Clear filters
                  </Link>
                  <Link href="/custom-tshirt" className={buttonClass("outline")}>
                    Design your own
                  </Link>
                </div>
              </div>
            )}
          </div>
          {children}
        </div>
      </div>

      <JsonLd data={graph(breadcrumbJsonLd(crumbs), itemListJsonLd(h1, results))} />
    </div>
  );
}
