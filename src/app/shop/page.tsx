/**
 * /shop — all products with server-side filters (URL state).
 * Filtered/sorted variants are `noindex, follow`; canonical is always /shop.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { ProductListing } from "@/components/ecommerce/ProductListing";
import { getAllCategories, getAllProducts, hasActiveFilters, parseFilters } from "@/lib/commerce/catalog";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ searchParams }: PageProps<"/shop">): Promise<Metadata> {
  const filtered = hasActiveFilters(parseFilters(await searchParams));
  return buildMetadata({
    title: "Shop Custom & Printed T-Shirts",
    description:
      "Shop printed, custom, oversized, couple, kids, family, gym and corporate T-shirts and hoodies. Filter by size, colour, fit and occasion. Delivery across India.",
    path: "/shop",
    noindex: filtered,
  });
}

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const [products, categories, sp] = await Promise.all([getAllProducts(), getAllCategories(), searchParams]);
  return (
    <ProductListing
      h1="Shop All T-Shirts"
      intro="Printed and personalised T-shirts, oversized tees and hoodies — for everyday wear, gifting, couples, families, gyms and teams. Use the filters to narrow down by size, colour, fit or occasion."
      basePath="/shop"
      crumbs={[
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop" },
      ]}
      products={products}
      searchParams={sp}
      includeCategoryFilter
    >
      <nav aria-label="Browse categories" className="mt-16 border-t border-line pt-8">
        <h2 className="text-lg font-semibold">Browse by category</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/shop/${c.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm hover:border-ink">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </ProductListing>
  );
}
