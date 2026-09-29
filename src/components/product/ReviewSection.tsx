/**
 * Reviews / testimonials.
 *
 * The prototype has NO verified reviews. This component therefore renders
 * clearly-labelled DEVELOPMENT SAMPLES (homepage) or an honest empty state
 * (product pages). It never emits Review / AggregateRating schema.
 *
 * Integration: fetch verified reviews from your provider (Judge.me, Yotpo,
 * your own DB), pass them as `reviews`, and only THEN pass the same data to
 * productGroupJsonLd() so schema matches visible content.
 */
import { sampleTestimonials } from "@/data/content";

interface ReviewSectionProps {
  mode: "samples" | "product";
  productName?: string;
}

export function ReviewSection({ mode, productName }: ReviewSectionProps) {
  if (mode === "product") {
    return (
      <div className="rounded-card border border-dashed border-line bg-white p-6 text-center">
        <p className="font-semibold">No reviews yet</p>
        <p className="mt-1 text-sm text-muted">
          Reviews for {productName ?? "this product"} will appear here once verified customer reviews are connected.
        </p>
      </div>
    );
  }
  return (
    <div>
      <p className="mb-6 inline-flex rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted">
        Sample testimonials for layout only — not real customer reviews
      </p>
      <ul className="grid gap-4 md:grid-cols-3">
        {sampleTestimonials.map((t) => (
          <li key={t.id}>
            <figure className="flex h-full flex-col rounded-card border border-line bg-white p-6">
              <blockquote className="flex-1 text-base leading-relaxed">“{t.quote}”</blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-semibold">{t.author}</span>
                <span className="text-muted"> — {t.context}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
