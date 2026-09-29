/** /collections — index of style, moment and merchandising collections. */
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { CollectionCard } from "@/components/ecommerce/CategoryCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllCollections } from "@/lib/commerce/catalog";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, graph } from "@/lib/seo/jsonld";

export const metadata: Metadata = buildMetadata({
  title: "T-Shirt Collections — Styles & Occasions",
  description: "Browse T-shirt collections by style and occasion: graphic, minimal, funny, name & quote and photo prints, plus birthday, friends, travel and college tees.",
  path: "/collections",
});

const GROUPS = [
  { kind: "style", title: "Shop by style" },
  { kind: "moment", title: "Shop by moment" },
  { kind: "merch", title: "Featured" },
] as const;

export default async function CollectionsPage() {
  const collections = await getAllCollections();
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/collections" },
  ];
  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs items={crumbs} />
      <h1 className="heading-display mt-5 text-5xl md:text-6xl">Collections</h1>
      <p className="mt-3 max-w-2xl text-muted md:text-lg">Curated edits by print style and occasion — a quick way to find the right T-shirt.</p>
      {GROUPS.map((g) => (
        <section key={g.kind} aria-labelledby={`g-${g.kind}`} className="mt-12">
          <h2 id={`g-${g.kind}`} className="heading-display text-3xl">
            {g.title}
          </h2>
          <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {collections
              .filter((c) => c.kind === g.kind)
              .map((c) => (
                <li key={c.slug}>
                  <CollectionCard href={`/collections/${c.slug}`} title={c.name} image={c.image.src} description={c.description} sizes="(min-width: 1024px) 23vw, (min-width: 768px) 31vw, 46vw" />
                </li>
              ))}
          </ul>
        </section>
      ))}
      <JsonLd data={graph(breadcrumbJsonLd(crumbs))} />
    </div>
  );
}
