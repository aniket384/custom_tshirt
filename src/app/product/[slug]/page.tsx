/**
 * PRODUCT DETAIL PAGE — /product/[slug]
 *
 * Statically generated for every product. Server-rendered content (name,
 * price, description, specs, size chart, FAQs) is plain HTML; only the
 * gallery and purchase panel are client islands.
 *
 * Structured data: ProductGroup (+ variants) and BreadcrumbList, generated
 * from the same data shown on the page. No ratings/reviews are emitted
 * because none exist yet.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPrice } from "@/components/product/ProductPrice";
import { ProductPurchasePanel, type PurchaseSummary } from "@/components/product/ProductPurchasePanel";
import { ProductGrid } from "@/components/product/ProductGrid";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { ReviewSection } from "@/components/product/ReviewSection";
import { SizeChart } from "@/components/product/SizeChart";
import { PincodeCheck } from "@/components/ecommerce/PincodeCheck";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { ChevronDownIcon } from "@/components/ui/icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllProducts, getCategory, getCollection, getProductBySlug, getRelatedProducts } from "@/lib/commerce/catalog";
import { FIT_LABELS, GENDER_LABELS, PLACEMENT_LABELS, PRINT_TYPE_LABELS } from "@/data/options";
import { productFaqs } from "@/data/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, graph, productGroupJsonLd } from "@/lib/seo/jsonld";
import { formatPrice } from "@/lib/utils/format";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  return buildMetadata({
    title: p.seo.title ?? `${p.name} — ${formatPrice(p.price)}`,
    description: p.seo.description ?? `${p.shortDescription} ${p.description}`.slice(0, 158),
    path: `/product/${p.slug}`,
    image: { src: p.thumbnail.src, alt: p.thumbnail.alt, width: p.thumbnail.width, height: p.thumbnail.height },
  });
}

/** Collapsible info block — native <details>, content stays in HTML. */
function InfoBlock({ title, id, open, children }: { title: string; id?: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details id={id} open={open} className="group border-b border-line">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between text-base font-semibold [&::-webkit-details-marker]:hidden">
        <h2>{title}</h2>
        <ChevronDownIcon className="transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-6 text-sm leading-relaxed text-muted">{children}</div>
    </details>
  );
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) notFound();

  const [category, related, primaryCollection] = await Promise.all([
    getCategory(p.category),
    getRelatedProducts(p, 4),
    p.collections[0] ? getCollection(p.collections[0]) : Promise.resolve(null),
  ]);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    ...(category ? [{ name: category.name, href: `/shop/${category.slug}` }] : []),
    { name: p.name, href: `/product/${p.slug}` },
  ];

  // Small, serialisable summary for the client purchase panel.
  const summary: PurchaseSummary = {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    colors: p.colors,
    sizes: p.sizes,
    variants: p.variants.map((v) => ({ id: v.id, colorId: v.colorId, size: v.size, availability: v.availability })),
    frontImages: Object.fromEntries(p.images.filter((i) => i.kind === "front" && i.colorId).map((i) => [i.colorId!, i.src])),
    thumbnail: p.thumbnail.src,
    isCustomizable: p.isCustomizable,
    customizerHref: p.customizerPreset ? `/custom-tshirt/${p.customizerPreset}` : "/custom-tshirt",
  };

  return (
    <>
      <div className="container-page pb-28 pt-6 md:pb-12">
        <Breadcrumbs items={crumbs} />

        <div className="mt-6 grid gap-8 md:grid-cols-[1.1fr_1fr] lg:gap-14">
          <ProductGallery productId={p.id} images={p.images} />

          <div>
            {p.badge && <p className="mb-3 inline-flex rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wide">{p.badge}</p>}
            <h1 className="heading-display text-4xl md:text-5xl">{p.name}</h1>
            <p className="mt-3 text-base text-muted">{p.shortDescription}</p>
            <ProductPrice price={p.price} compareAtPrice={p.compareAtPrice} size="lg" showTaxNote className="mt-5" />

            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <dt className="text-muted">Fit</dt>
              <dd>{FIT_LABELS[p.fit]}</dd>
              <dt className="text-muted">Print</dt>
              <dd>{PRINT_TYPE_LABELS[p.printType]}</dd>
              <dt className="text-muted">Placement</dt>
              <dd>{p.printPlacements.map((x) => PLACEMENT_LABELS[x]).join(", ")}</dd>
              <dt className="text-muted">For</dt>
              <dd>{GENDER_LABELS[p.gender]}</dd>
            </dl>

            <div className="mt-8">
              <ProductPurchasePanel product={summary} />
            </div>

            <div className="mt-8">
              <PincodeCheck />
            </div>

            <div className="mt-8 border-t border-line">
              <InfoBlock title="Highlights" open>
                <ul className="list-disc space-y-1 pl-5">
                  {p.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </InfoBlock>
              <InfoBlock title="Description">
                <p>{p.description}</p>
              </InfoBlock>
              <InfoBlock title="Fabric & Fit">
                <p>
                  <strong className="text-ink">Fabric:</strong> {p.material}
                </p>
                <p className="mt-2">
                  <strong className="text-ink">Fit:</strong> {FIT_LABELS[p.fit]}.{" "}
                  {p.fit === "oversized" ? "Take your usual size for the full oversized look, or size down for a closer fit." : "True to size for most people."}
                </p>
              </InfoBlock>
              <InfoBlock title="Print details">
                <p>
                  {PRINT_TYPE_LABELS[p.printType]} — {p.printPlacements.map((x) => PLACEMENT_LABELS[x]).join(" / ")} placement.
                  {p.isCustomizable && " Your artwork and text are printed exactly as previewed; please check spelling before ordering."}
                </p>
              </InfoBlock>
              <InfoBlock title="Care">
                <ul className="list-disc space-y-1 pl-5">
                  {p.care.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </InfoBlock>
              <InfoBlock title="Size chart" id="size-chart">
                <SizeChart fit={p.fit} />
              </InfoBlock>
              <InfoBlock title="Shipping & returns">
                <p>We deliver across India. Delivery timelines depend on your location and will be confirmed at checkout.</p>
                <p className="mt-2">
                  Read our <Link href="/shipping-policy" className="font-semibold text-ink underline">shipping policy</Link> and{" "}
                  <Link href="/returns" className="font-semibold text-ink underline">returns policy</Link>. Custom-printed items are made to order.
                </p>
              </InfoBlock>
            </div>

            <p className="mt-6 text-sm text-muted">
              More in{" "}
              {category && (
                <Link href={`/shop/${category.slug}`} className="font-semibold text-ink underline underline-offset-4">
                  {category.name}
                </Link>
              )}
              {primaryCollection && (
                <>
                  {" "}and{" "}
                  <Link href={`/collections/${primaryCollection.slug}`} className="font-semibold text-ink underline underline-offset-4">
                    {primaryCollection.name}
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>

        <section aria-labelledby="pdp-faq" className="mt-16 grid gap-10 md:grid-cols-2">
          <div>
            <h2 id="pdp-faq" className="heading-display text-3xl">
              Questions
            </h2>
            <div className="mt-4">
              <FAQAccordion faqs={productFaqs} />
            </div>
          </div>
          <div>
            <h2 className="heading-display text-3xl">Reviews</h2>
            <div className="mt-4">
              <ReviewSection mode="product" productName={p.name} />
            </div>
          </div>
        </section>

        <section aria-labelledby="related-heading" className="mt-16">
          <h2 id="related-heading" className="heading-display mb-6 text-3xl">
            You may also like
          </h2>
          <ProductGrid products={related} label="Related products" />
        </section>
      </div>

      <RecentlyViewed excludeSlug={p.slug} />

      <JsonLd data={graph(productGroupJsonLd(p), breadcrumbJsonLd(crumbs))} />
    </>
  );
}
