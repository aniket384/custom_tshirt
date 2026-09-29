/**
 * Homepage hero — split editorial layout.
 * The hero image is the LCP element: `preload` + `fetchPriority` (via
 * next/image `preload`), explicit dimensions and a tight `sizes` hint.
 */
import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button-styles";
import { CrownMark } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="overflow-hidden">
      <div className="container-page grid items-center gap-8 py-10 md:grid-cols-2 md:gap-12 md:py-16 lg:py-20">
        <div className="order-2 md:order-1">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white">
            <CrownMark className="h-3 w-auto text-brand" />
            Custom T-Shirts • {siteConfig.location.deliveryArea}
          </p>
          <h1 id="hero-heading" className="heading-display text-[3.4rem] leading-[0.9] sm:text-7xl lg:text-8xl">
            Apna Design.
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">Apni Style.</span>
              <span aria-hidden="true" className="absolute inset-x-0 bottom-1 z-0 h-4 bg-brand md:h-6" />
            </span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted">
            Printed T-shirts made for your ideas, your people and your moments.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className={buttonClass("dark", "lg")}>
              Shop T-Shirts
            </Link>
            <Link href="/custom-tshirt" className={buttonClass("primary", "lg")}>
              Create Your T-Shirt
            </Link>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <Image
            src="/images/home/hero.webp"
            alt="Black oversized T-shirt with a yellow crown print reading Apna Design Apni Style"
            width={1200}
            height={1500}
            preload
            sizes="(min-width: 768px) 46vw, 92vw"
            className="mx-auto aspect-[4/5] w-full max-w-[560px] rounded-card object-cover"
          />
        </div>
      </div>
    </section>
  );
}
