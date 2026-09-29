"use client";
/**
 * Quick add from a product card: pick a size and the default colour is added
 * straight to the cart. Customisable products link to the builder instead
 * (rendered by the server card, not here).
 */
import { useState } from "react";
import { cartActions } from "@/lib/store/cart";
import type { Size } from "@/lib/commerce/types";
import { PlusIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils/format";

export interface QuickAddOption {
  size: Size;
  variantId: string;
  available: boolean;
}

interface Props {
  productId: string;
  slug: string;
  name: string;
  image: string;
  colorName: string;
  price: number;
  compareAtPrice: number | null;
  options: QuickAddOption[];
}

export function QuickAdd({ productId, slug, name, image, colorName, price, compareAtPrice, options }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = `quickadd-${productId}`;

  const add = (o: QuickAddOption) => {
    cartActions.add({
      lineId: o.variantId,
      productId,
      slug,
      name,
      image,
      variantId: o.variantId,
      colorName,
      size: o.size,
      unitPrice: price,
      compareAtPrice,
      quantity: 1,
      custom: null,
    });
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 text-xs font-semibold hover:border-ink"
      >
        <PlusIcon size={16} />
        Quick add<span className="sr-only"> {name} ({colorName}) to cart</span>
      </button>
      {open && (
        <div
          id={panelId}
          role="group"
          aria-label={`Choose a size for ${name}`}
          className="absolute inset-x-0 bottom-full z-10 mb-2 animate-fade-in rounded-xl border border-line bg-white p-3 shadow-lg"
        >
          <p className="mb-2 text-xs text-muted">Select size ({colorName})</p>
          <div className="flex flex-wrap gap-1.5">
            {options.map((o) => (
              <button
                key={o.variantId}
                type="button"
                disabled={!o.available}
                onClick={() => add(o)}
                aria-label={o.available ? `Add ${name}, size ${o.size}, to cart` : `Size ${o.size} out of stock`}
                className={cn(
                  "min-h-10 min-w-10 rounded-md border px-2 text-xs font-semibold",
                  o.available ? "border-line hover:border-ink hover:bg-brand" : "border-line text-muted line-through",
                )}
              >
                {o.size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
