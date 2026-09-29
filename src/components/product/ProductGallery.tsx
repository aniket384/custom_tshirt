"use client";
/**
 * Product gallery: large main image + thumbnail buttons (row on mobile,
 * column on desktop).
 * The front image follows the colour chosen in the purchase panel.
 * The first image is the LCP element → `preload`.
 */
import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/commerce/types";
import { useStore } from "@/lib/store/create-store";
import { pdpColorStore } from "@/lib/store/pdp";
import { cn } from "@/lib/utils/format";

interface Props {
  productId: string;
  images: ProductImage[];
}

export function ProductGallery({ productId, images }: Props) {
  const { productId: pid, colorId } = useStore(pdpColorStore);
  const [active, setActive] = useState(0);

  // Base gallery = images without colourway variants + the selected colour's front.
  const colorFront = pid === productId && colorId ? images.find((i) => i.kind === "front" && i.colorId === colorId) : undefined;
  const base = images.filter((i) => !(i.kind === "front" && i !== images[0]));
  const gallery = colorFront ? [colorFront, ...base.slice(1)] : base;
  const current = gallery[Math.min(active, gallery.length - 1)];

  return (
    <div className="flex min-w-0 flex-col-reverse gap-3 md:flex-row md:gap-4">
      <ul className="no-scrollbar flex gap-2 overflow-x-auto md:w-20 md:shrink-0 md:flex-col md:gap-3 md:overflow-visible" aria-label="Choose image">
        {gallery.map((img, i) => (
          <li key={img.src} className="w-16 shrink-0 md:w-auto">
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1} of ${gallery.length}: ${img.alt}`}
              aria-current={i === active}
              className={cn("block w-full overflow-hidden rounded-lg border-2", i === active ? "border-ink" : "border-transparent hover:border-line")}
            >
              <Image src={img.src} alt="" width={80} height={100} sizes="80px" className="aspect-[4/5] w-full bg-surface object-cover" />
            </button>
          </li>
        ))}
      </ul>
      <div className="flex-1">
        {/* One responsive main image for all breakpoints → a single LCP preload. */}
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          width={current.width}
          height={current.height}
          sizes="(min-width: 1024px) 45vw, (min-width: 768px) 55vw, 100vw"
          preload={active === 0}
          // Fade only when the shopper switches images — never on first paint (LCP).
          className={cn("aspect-[4/5] w-full rounded-card bg-surface object-cover", active !== 0 && "animate-fade-in")}
        />
        <p className="mt-2 text-center text-xs text-muted md:sr-only" aria-live="polite">
          Image {Math.min(active, gallery.length - 1) + 1} of {gallery.length}
        </p>
      </div>
    </div>
  );
}
