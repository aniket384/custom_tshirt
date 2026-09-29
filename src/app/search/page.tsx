/**
 * /search?q= — server-rendered results (works without JS).
 * Always `noindex, follow`: search result pages must not be indexed.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SearchIcon } from "@/components/ui/icons";
import { getAllCategories, getAllCollections, searchProducts } from "@/lib/commerce/catalog";
import { CUSTOMIZER_PRESETS } from "@/data/customizer";
import { noindexMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ searchParams }: PageProps<"/search">): Promise<Metadata> {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.slice(0, 80) : "";
  return noindexMetadata(query ? `Search: ${query}` : "Search", "/search");
}

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim().slice(0, 80) : "";
  const [results, categories, collections] = await Promise.all([searchProducts(query), getAllCategories(), getAllCollections()]);
  const lc = query.toLowerCase();
  const catMatches = lc ? categories.filter((c) => c.name.toLowerCase().includes(lc) || lc.split(" ").some((t) => t.length > 2 && c.name.toLowerCase().includes(t))) : [];
  const colMatches = lc ? collections.filter((c) => c.name.toLowerCase().includes(lc) || c.h1.toLowerCase().includes(lc)) : [];
  const customMatches = lc ? CUSTOMIZER_PRESETS.filter((p) => p.name.toLowerCase().includes(lc) || lc.includes("custom") || lc.includes("design")) : [];

  return (
    <div className="container-page py-8 md:py-12">
      <h1 className="heading-display text-5xl">{query ? <>Results for “{query}”</> : "Search"}</h1>
      <form action="/search" method="get" role="search" className="mt-6 max-w-xl">
        <label htmlFor="q" className="sr-only">
          Search products
        </label>
        <div className="flex items-center gap-2 rounded-full border border-ink bg-white px-4">
          <SearchIcon />
          <input id="q" name="q" type="search" defaultValue={query} placeholder="Search T-shirts, hoodies, couple tees…" className="min-h-12 w-full bg-transparent outline-none" />
          <button type="submit" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold">
            Search
          </button>
        </div>
      </form>

      {query && (
        <>
          {(catMatches.length > 0 || colMatches.length > 0 || customMatches.length > 0) && (
            <nav aria-label="Matching pages" className="mt-8">
              <ul className="flex flex-wrap gap-2">
                {catMatches.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/shop/${c.slug}`} className="inline-flex min-h-10 items-center rounded-full bg-surface px-4 text-sm">
                      Category: {c.name}
                    </Link>
                  </li>
                ))}
                {colMatches.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/collections/${c.slug}`} className="inline-flex min-h-10 items-center rounded-full bg-surface px-4 text-sm">
                      Collection: {c.name}
                    </Link>
                  </li>
                ))}
                {customMatches.slice(0, 4).map((p) => (
                  <li key={p.slug}>
                    <Link href={`/custom-tshirt/${p.slug}`} className="inline-flex min-h-10 items-center rounded-full bg-brand px-4 text-sm font-semibold">
                      Customise: {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <p className="mt-8 text-sm text-muted" role="status">
            {results.length} {results.length === 1 ? "product" : "products"} found
          </p>
          <div className="mt-4">
            <h2 className="sr-only">Product results</h2>
            {results.length ? (
              <ProductGrid products={results} label={`Search results for ${query}`} />
            ) : (
              <div className="rounded-card border border-dashed border-line p-10 text-center">
                <p className="text-lg font-semibold">No products found for “{query}”</p>
                <p className="mt-2 text-sm text-muted">Check the spelling, try a broader word, or design exactly what you want.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <Link href="/shop" className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white">
                    Browse all T-shirts
                  </Link>
                  <Link href="/custom-tshirt" className="inline-flex min-h-11 items-center rounded-full border border-ink px-5 text-sm font-semibold">
                    Create your own
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
