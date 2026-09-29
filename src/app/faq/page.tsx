/**
 * /faq — the ONLY page that emits FAQPage JSON-LD (the FAQ is its main
 * content). Other pages show FAQs without the schema to avoid duplication.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { generalFaqs, productFaqs } from "@/data/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, faqPageJsonLd, graph } from "@/lib/seo/jsonld";

export const metadata: Metadata = buildMetadata({
  title: "FAQ — Custom T-Shirt Orders, Sizes & Delivery",
  description: "Answers about custom T-shirt printing: uploading designs, adding names and quotes, sizes, bulk orders, couple and family T-shirts and delivery across India.",
  path: "/faq",
});

export default function FaqPage() {
  const faqs = [...generalFaqs, ...productFaqs.filter((p) => !generalFaqs.some((g) => g.q === p.q))];
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "FAQ", href: "/faq" },
  ];
  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs items={crumbs} />
      <div className="mx-auto mt-8 max-w-3xl">
        <h1 className="heading-display text-5xl md:text-6xl">Frequently Asked Questions</h1>
        <p className="mt-3 text-muted md:text-lg">
          Can&apos;t find what you need? <Link href="/contact" className="font-semibold text-ink underline">Contact us</Link>.
        </p>
        <div className="mt-10">
          <FAQAccordion faqs={faqs} />
        </div>
      </div>
      <JsonLd data={graph(faqPageJsonLd(faqs), breadcrumbJsonLd(crumbs))} />
    </div>
  );
}
