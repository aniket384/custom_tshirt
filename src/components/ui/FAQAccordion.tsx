/**
 * FAQ accordion using native <details>/<summary> — keyboard accessible,
 * zero JavaScript, and the answers stay in the HTML for crawlers.
 *
 * NOTE: this component does NOT emit FAQPage JSON-LD. Add faqPageJsonLd()
 * only on the page where the FAQ is the main content (/faq).
 */
import type { Faq } from "@/data/content";
import { PlusIcon } from "./icons";

export function FAQAccordion({ faqs, tone = "light" }: { faqs: readonly Faq[]; tone?: "light" | "dark" }) {
  const border = tone === "dark" ? "border-line-dark" : "border-line";
  return (
    <div className={`divide-y ${tone === "dark" ? "divide-line-dark" : "divide-line"} border-y ${border}`}>
      {faqs.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-base font-semibold md:text-lg [&::-webkit-details-marker]:hidden">
            <h3>{f.q}</h3>
            <PlusIcon className="shrink-0 transition-transform duration-200 group-open:rotate-45" />
          </summary>
          <p className={`pb-5 pr-8 text-sm leading-relaxed md:text-base ${tone === "dark" ? "text-muted-dark" : "text-muted"}`}>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
