/**
 * Shared server wrapper for /custom-tshirt and /custom-tshirt/[category]:
 * breadcrumb, H1, intro, the interactive editor, tips, how-it-works and
 * internal links to related products.
 */
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CUSTOMIZER_PRESETS, type CustomizerPreset } from "@/data/customizer";
import type { Product } from "@/lib/commerce/types";
import { breadcrumbJsonLd, graph, type Crumb } from "@/lib/seo/jsonld";
import { CustomTshirtEditor } from "./CustomTshirtEditor";

interface Props {
  h1: string;
  intro: string;
  crumbs: Crumb[];
  preset?: CustomizerPreset;
  tips: string[];
  products: Product[];
}

export function CustomizerPageShell({ h1, intro, crumbs, preset, tips, products }: Props) {
  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs items={crumbs} />
      <header className="mb-8 mt-5 max-w-3xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Custom T-shirt studio</p>
        <h1 className="heading-display text-5xl md:text-6xl">{h1}</h1>
        <p className="mt-3 text-base text-muted md:text-lg">{intro}</p>
      </header>

      <CustomTshirtEditor preset={preset} />

      <section aria-labelledby="tips-h" className="mt-16 grid gap-8 md:grid-cols-2">
        <div>
          <h2 id="tips-h" className="heading-display text-3xl">
            Tips for a great print
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
            {tips.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <nav aria-label="Other custom designs">
          <h2 className="heading-display text-3xl">Design something else</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {CUSTOMIZER_PRESETS.filter((p) => p.slug !== preset?.slug).map((p) => (
              <li key={p.slug}>
                <Link href={`/custom-tshirt/${p.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm hover:border-ink">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <section id="how-it-works" aria-labelledby="hiw-h" className="mt-16">
        <h2 id="hiw-h" className="heading-display mb-6 text-3xl">
          How custom printing works
        </h2>
        <HowItWorks />
      </section>

      {products.length > 0 && (
        <section aria-labelledby="ideas-h" className="mt-16">
          <h2 id="ideas-h" className="heading-display mb-6 text-3xl">
            Need ideas? Start from a design
          </h2>
          <ProductGrid products={products} label="Customisable designs" />
        </section>
      )}

      <JsonLd data={graph(breadcrumbJsonLd(crumbs))} />
    </div>
  );
}
