/**
 * "You bring the idea" — the core differentiator. Shows the 4 stages of a
 * custom tee (blank → upload → text → final) as real captioned figures.
 */
import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button-styles";

const stages = [
  { src: "/images/home/customise-blank.webp", label: "Blank tee", alt: "Plain white T-shirt" },
  { src: "/images/home/customise-upload.webp", label: "Your image", alt: "White T-shirt with an uploaded picture" },
  { src: "/images/home/customise-text.webp", label: "Your text", alt: "White T-shirt with a name and number" },
  { src: "/images/home/customise-final.webp", label: "Final preview", alt: "Black T-shirt with a photo and caption" },
];

export function CustomiseFeature() {
  return (
    <section aria-labelledby="customise-heading" className="on-dark bg-ink py-16 text-white md:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand">Custom T-shirt studio</p>
          <h2 id="customise-heading" className="heading-display text-5xl md:text-6xl">
            You bring the idea.
            <br />
            <span className="text-brand">
              We put it on a <span className="whitespace-nowrap">T-shirt.</span>
            </span>
          </h2>
          <p className="mt-5 max-w-md text-muted-dark">
            Upload a photo, logo or artwork, add a name or quote, pick front or back placement and preview it live before you
            order.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/custom-tshirt" className={buttonClass("primary", "lg")}>
              Start Customising
            </Link>
            <Link href="#how-it-works" className={buttonClass("outline-light", "lg")}>
              See How It Works
            </Link>
          </div>
        </div>
        <ol className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stages.map((s, i) => (
            <li key={s.src}>
              <figure>
                <Image src={s.src} alt={s.alt} width={600} height={750} sizes="(min-width: 1024px) 14vw, (min-width: 768px) 23vw, 45vw" className="aspect-[4/5] w-full rounded-card object-cover" />
                <figcaption className="mt-2 flex items-center gap-2 text-sm">
                  <span className="grid size-6 place-items-center rounded-full bg-brand text-xs font-bold text-ink">{i + 1}</span>
                  {s.label}
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
