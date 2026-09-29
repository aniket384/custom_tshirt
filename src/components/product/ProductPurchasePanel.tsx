"use client";
/**
 * PDP purchase panel: colour, size, quantity, Add to Cart, Buy Now,
 * wishlist, plus a sticky mobile CTA bar.
 *
 * Receives a SMALL serialisable product summary from the server page, not
 * the whole catalogue.
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store/create-store";
import type { Availability, ProductColor, Size } from "@/lib/commerce/types";
import { cartActions } from "@/lib/store/cart";
import { pdpColorStore } from "@/lib/store/pdp";
import { recordView } from "@/lib/store/recently-viewed";
import { trackEvent } from "@/lib/analytics/track";
import { AVAILABILITY_LABELS } from "@/lib/commerce/product-utils";
import { formatPrice } from "@/lib/utils/format";
import { buttonClass } from "@/components/ui/button-styles";
import { ColorSelector } from "./ColorSelector";
import { SizeSelector } from "./SizeSelector";
import { QuantityInput } from "@/components/ecommerce/QuantityInput";
import { AddToCartButton } from "@/components/ecommerce/AddToCartButton";
import { WishlistButton } from "@/components/ecommerce/WishlistButton";

export interface PurchaseSummary {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice: number | null;
  colors: ProductColor[];
  sizes: Size[];
  variants: { id: string; colorId: string; size: Size; availability: Availability }[];
  frontImages: Record<string, string>;
  thumbnail: string;
  isCustomizable: boolean;
  customizerHref: string;
}

export function ProductPurchasePanel({ product: p }: { product: PurchaseSummary }) {
  const router = useRouter();
  // Selection lives in a tiny external store (shared with the gallery).
  const selection = useStore(pdpColorStore);
  const mine = selection.productId === p.id;
  const colorId = (mine && selection.colorId) || p.colors[0].id;
  const size = (mine ? (selection.size as Size | null) : null) ?? null;
  const setSelection = (patch: { colorId?: string; size?: Size | null }) =>
    pdpColorStore.set((s) => ({
      productId: p.id,
      colorId: patch.colorId ?? (s.productId === p.id ? s.colorId : null) ?? p.colors[0].id,
      size: patch.size !== undefined ? patch.size : s.productId === p.id ? s.size : null,
    }));
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // One-time effects on mount: deep-link ?variant=, analytics, recently viewed.
  useEffect(() => {
    const variantParam = new URLSearchParams(window.location.search).get("variant");
    const v = p.variants.find((x) => x.id === variantParam);
    pdpColorStore.set(() => ({
      productId: p.id,
      colorId: v?.colorId ?? p.colors[0].id,
      size: v && v.availability !== "out_of_stock" ? v.size : null,
    }));
    trackEvent("view_item", { currency: "INR", value: p.price, items: [{ item_id: p.id, item_name: p.name, item_category: p.category, price: p.price }] });
    recordView({ slug: p.slug, name: p.name, image: p.thumbnail, price: p.price });
  }, [p]);

  const colorName = p.colors.find((c) => c.id === colorId)?.name ?? "";
  const sizeOptions = p.sizes.map((s) => ({
    size: s,
    available: p.variants.some((v) => v.colorId === colorId && v.size === s && v.availability !== "out_of_stock"),
  }));
  const variant = size ? p.variants.find((v) => v.colorId === colorId && v.size === size) : undefined;
  const variantLabel = size ? `${colorName} / ${size}` : null;
  const availability = variant?.availability ?? (sizeOptions.some((o) => o.available) ? (p.isCustomizable ? "made_to_order" : "in_stock") : "out_of_stock");

  const selectColor = (id: string) => {
    // Keep size only if it is still available in the new colour.
    const keep = size && p.variants.some((v) => v.colorId === id && v.size === size && v.availability !== "out_of_stock");
    setSelection({ colorId: id, size: keep ? size : null });
  };

  const add = (openDrawer = true): boolean => {
    if (!variant || variant.availability === "out_of_stock") {
      setError("Please select a size.");
      document.getElementById("pdp-size")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    setError(null);
    cartActions.add(
      {
        lineId: variant.id,
        productId: p.id,
        slug: p.slug,
        name: p.name,
        image: p.frontImages[colorId] ?? p.thumbnail,
        variantId: variant.id,
        colorName,
        size: variant.size,
        unitPrice: p.price,
        compareAtPrice: p.compareAtPrice,
        quantity: qty,
        custom: null,
      },
      { openDrawer },
    );
    return true;
  };

  const firstAvailable = p.variants.find((v) => v.availability !== "out_of_stock");
  const wishItem = {
    productId: p.id,
    slug: p.slug,
    name: p.name,
    image: p.thumbnail,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    defaultVariantId: firstAvailable?.id ?? null,
    defaultColorName: p.colors.find((c) => c.id === firstAvailable?.colorId)?.name ?? p.colors[0].name,
    defaultSize: firstAvailable?.size ?? p.sizes[0],
    isCustomizable: p.isCustomizable,
  };

  return (
    <div className="space-y-6">
      <ColorSelector name={p.name} colors={p.colors} value={colorId} onChange={selectColor} />

      <div id="pdp-size">
        <SizeSelector options={sizeOptions} value={size} onChange={(s) => { setSelection({ size: s as Size }); setError(null); }} error={error} groupName="pdp-size" sizeChartHref="#size-chart" />
      </div>

      <p className="text-sm">
        <span className="font-semibold">Availability: </span>
        <span className={availability === "out_of_stock" ? "text-danger" : "text-success"}>{AVAILABILITY_LABELS[availability]}</span>
        {variant && <span className="text-muted"> — SKU variant {variant.id}</span>}
      </p>

      {p.isCustomizable ? (
        <div className="space-y-3">
          <Link href={p.customizerHref} className={buttonClass("primary", "lg", "w-full")}>
            Customise This Design<span className="sr-only"> — {p.name}</span>
          </Link>
          <p className="text-sm text-muted">This style is printed with your own photo, name or text. Add your details in the customiser, preview it, then add it to your cart.</p>
          <WishlistButton item={wishItem} variant="full" className="w-full" />
        </div>
      ) : (
        <>
          <QuantityInput id="pdp-qty" value={qty} onChange={setQty} />
          <div className="grid gap-3 sm:grid-cols-2">
            <AddToCartButton productName={p.name} variantLabel={variantLabel} onAdd={() => add(true)} disabled={availability === "out_of_stock"} />
            <button
              type="button"
              onClick={() => {
                if (add(false)) {
                  trackEvent("begin_checkout", { currency: "INR", value: p.price * qty });
                  router.push("/checkout");
                }
              }}
              disabled={availability === "out_of_stock"}
              className={buttonClass("primary", "lg")}
            >
              Buy Now<span className="sr-only"> — {p.name}</span>
            </button>
          </div>
          <WishlistButton item={wishItem} variant="full" className="w-full" />

          {/* Sticky mobile CTA */}
          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 py-3 backdrop-blur md:hidden">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-muted">{variantLabel ?? "Select a size"}</p>
                <p className="font-semibold">{formatPrice(p.price * qty)}</p>
              </div>
              <AddToCartButton productName={p.name} variantLabel={variantLabel} onAdd={() => add(true)} disabled={availability === "out_of_stock"} size="md" className="flex-1" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
