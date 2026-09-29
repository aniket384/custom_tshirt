/** /collections/[slug] — rule-based collection listing. */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/ecommerce/ProductListing";
import {
  getAllCollections,
  getCollection,
  getProductsInCollection,
  hasActiveFilters,
  parseFilters,
} from "@/lib/commerce/catalog";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllCollections()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params, searchParams }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCollection(slug);
  if (!c) return {};
  return buildMetadata({
    title: c.seo.title ?? c.name,
    description: c.seo.description ?? c.description,
    path: `/collections/${c.slug}`,
    image: { src: c.image.src, alt: c.image.alt, width: 800, height: 1000 },
    noindex: hasActiveFilters(parseFilters(await searchParams)),
  });
}

export default async function CollectionPage({ params, searchParams }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const c = await getCollection(slug);
  if (!c) notFound();
  const [products, all, sp] = await Promise.all([getProductsInCollection(c.slug), getAllCollections(), searchParams]);
  return (
    <ProductListing
      h1={c.h1}
      intro={c.intro}
      basePath={`/collections/${c.slug}`}
      crumbs={[
        { name: "Home", href: "/" },
        { name: "Collections", href: "/collections" },
        { name: c.name, href: `/collections/${c.slug}` },
      ]}
      products={products}
      searchParams={sp}
      includeCategoryFilter
    >
      <nav aria-label="More collections" className="mt-16 border-t border-line pt-8">
        <h2 className="text-lg font-semibold">More collections</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {all
            .filter((x) => x.slug !== c.slug)
            .map((x) => (
              <li key={x.slug}>
                <Link href={`/collections/${x.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm hover:border-ink">
                  {x.name}
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </ProductListing>
  );
}
