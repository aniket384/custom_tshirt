/**
 * /shop/[category] — category listing. Categories are known at build time
 * (generateStaticParams); unknown slugs 404.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/ecommerce/ProductListing";
import {
  getAllCategories,
  getCategory,
  getProductsInCategory,
  hasActiveFilters,
  parseFilters,
} from "@/lib/commerce/catalog";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllCategories()).map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params, searchParams }: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category } = await params;
  const c = await getCategory(category);
  if (!c) return {};
  const filtered = hasActiveFilters(parseFilters(await searchParams));
  return buildMetadata({
    title: c.seo.title ?? c.name,
    description: c.seo.description ?? c.description,
    path: `/shop/${c.slug}`,
    image: { src: c.image.src, alt: c.image.alt, width: 800, height: 1000 },
    noindex: filtered,
  });
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/shop/[category]">) {
  const { category } = await params;
  const c = await getCategory(category);
  if (!c) notFound();
  const [products, all, sp] = await Promise.all([getProductsInCategory(c.slug), getAllCategories(), searchParams]);
  const isCustomish = ["custom-t-shirts", "couple-t-shirts", "kids-t-shirts", "family-t-shirts", "corporate-t-shirts", "hoodies"].includes(c.slug);
  const isBulk = ["corporate-t-shirts", "bulk-event-t-shirts"].includes(c.slug);

  return (
    <ProductListing
      h1={c.h1}
      intro={c.intro}
      basePath={`/shop/${c.slug}`}
      crumbs={[
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop" },
        { name: c.name, href: `/shop/${c.slug}` },
      ]}
      products={products}
      searchParams={sp}
    >
      <aside className="mt-16 grid gap-4 border-t border-line pt-8 md:grid-cols-2">
        {isCustomish && (
          <div className="rounded-card bg-ink p-6 text-white on-dark">
            <h2 className="heading-display text-3xl">Want it your way?</h2>
            <p className="mt-2 text-sm text-muted-dark">Upload a photo or add names in the customiser and preview before ordering.</p>
            <Link href="/custom-tshirt" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-brand px-5 text-sm font-semibold text-ink">
              Start Customising
            </Link>
          </div>
        )}
        {isBulk && (
          <div className="rounded-card bg-surface p-6">
            <h2 className="heading-display text-3xl">Ordering for a team?</h2>
            <p className="mt-2 text-sm text-muted">Share your quantity, sizes and deadline and get a bulk quote.</p>
            <Link href="/bulk-orders" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white">
              Request a Bulk Quote
            </Link>
          </div>
        )}
        <nav aria-label="Other categories" className="md:col-span-2">
          <h2 className="text-lg font-semibold">More categories</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {all
              .filter((x) => x.slug !== c.slug)
              .map((x) => (
                <li key={x.slug}>
                  <Link href={`/shop/${x.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm hover:border-ink">
                    {x.name}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </aside>
    </ProductListing>
  );
}
