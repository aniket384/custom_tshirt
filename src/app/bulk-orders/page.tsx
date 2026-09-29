/** /bulk-orders — high-intent B2B landing page with quote form. */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { BulkQuoteForm } from "@/components/forms/BulkQuoteForm";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { ProductGrid } from "@/components/product/ProductGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { buttonClass } from "@/components/ui/button-styles";
import { getProductsInCategory } from "@/lib/commerce/catalog";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, graph } from "@/lib/seo/jsonld";

export const metadata: Metadata = buildMetadata({
  title: "Bulk T-Shirt Printing — Corporate, Event & Team Orders",
  description:
    "Request a bulk quote for custom T-shirts, polos and hoodies for companies, colleges, events, startups, clubs, sports teams, weddings and groups. Delivery across India.",
  path: "/bulk-orders",
});

const AUDIENCES = ["Companies", "Corporate teams", "Colleges", "Events", "Startups", "Clubs", "Sports teams", "Weddings", "Friends & groups"];

const STEPS = [
  { t: "Share your requirement", d: "Quantity, T-shirt type, colours, sizes and your deadline." },
  { t: "Send your design", d: "Upload a logo or artwork — or describe what you have in mind." },
  { t: "Get a quote", d: "We review your request and reply with pricing and a mock-up." },
  { t: "Approve & print", d: "Once approved, your order goes into production." },
];

const FAQS = [
  { q: "What is the minimum quantity for a bulk order?", a: "The bulk quote form starts from 10 pieces. For fewer pieces, use the online customiser and order directly." },
  { q: "Can we mix sizes and colours?", a: "Yes. List the size split and colours in the form and we will include them in your quote." },
  { q: "What file should I send for our logo?", a: "Vector files (SVG, PDF, AI) print sharpest. High-resolution PNGs with a transparent background also work well." },
  { q: "Do you deliver bulk orders across India?", a: "Yes, we deliver across India. Share your delivery city and deadline so we can plan the order." },
];

export default async function BulkOrdersPage() {
  const products = (await getProductsInCategory("corporate-t-shirts")).slice(0, 4);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Bulk Orders", href: "/bulk-orders" },
  ];
  return (
    <>
      <section className="on-dark bg-ink text-white">
        <div className="container-page grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
          <div>
            <Breadcrumbs items={crumbs} className="[&_*]:text-white/70 [&_[aria-current]]:text-white" />
            <h1 className="heading-display mt-6 text-5xl md:text-7xl">
              Bulk T-shirts for <span className="text-brand">teams & events</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-dark">Custom apparel for teams, companies, events, colleges and communities — from 10 pieces upwards.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#quote" className={buttonClass("primary", "lg")}>
                Request a Bulk Quote
              </a>
              <Link href="/shop/corporate-t-shirts" className={buttonClass("outline-light", "lg")}>
                Corporate T-Shirts
              </Link>
            </div>
          </div>
          <Image src="/images/home/bulk.webp" alt="Navy, white and black team T-shirts with a logo" width={1200} height={900} preload sizes="(min-width: 768px) 45vw, 92vw" className="w-full rounded-card" />
        </div>
      </section>

      <div className="container-page py-14">
        <section aria-labelledby="who-h">
          <h2 id="who-h" className="heading-display text-3xl md:text-4xl">
            Who we make bulk orders for
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {AUDIENCES.map((a) => (
              <li key={a} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium">
                {a}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="process-h" className="mt-14">
          <h2 id="process-h" className="heading-display text-3xl md:text-4xl">
            How bulk orders work
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.t} className="rounded-card border border-line bg-white p-5">
                <span className="heading-display grid size-10 place-items-center rounded-full bg-brand text-xl" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-semibold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="quote" aria-labelledby="quote-h" className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 id="quote-h" className="heading-display text-4xl md:text-5xl">
              Request a bulk quote
            </h2>
            <p className="mt-3 text-muted">Tell us what you need. The more detail you share — quantity, sizes, colours and deadline — the more accurate your quote.</p>
          </div>
          <BulkQuoteForm />
        </section>

        <section aria-labelledby="bulk-products-h" className="mt-16">
          <h2 id="bulk-products-h" className="heading-display mb-6 text-3xl md:text-4xl">
            Popular for teams
          </h2>
          <ProductGrid products={products} label="Corporate products" />
          <Link href="/shop/corporate-t-shirts" className="mt-6 inline-block text-sm font-semibold underline underline-offset-4">
            See all corporate T-shirts
          </Link>
        </section>

        <section aria-labelledby="bulk-faq-h" className="mt-16 max-w-3xl">
          <h2 id="bulk-faq-h" className="heading-display mb-4 text-3xl md:text-4xl">
            Bulk order FAQs
          </h2>
          <FAQAccordion faqs={FAQS} />
        </section>
      </div>
      <JsonLd data={graph(breadcrumbJsonLd(crumbs))} />
    </>
  );
}
