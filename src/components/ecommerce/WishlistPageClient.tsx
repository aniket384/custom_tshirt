"use client";
/** Wishlist page: remove, move to cart (default variant) or customise. */
import Image from "next/image";
import Link from "next/link";
import { useHydrated } from "@/lib/store/create-store";
import { useWishlist, wishlistActions } from "@/lib/store/wishlist";
import { cartActions } from "@/lib/store/cart";
import { toast } from "@/lib/store/toast";
import { buttonClass } from "@/components/ui/button-styles";
import { ProductPrice } from "@/components/product/ProductPrice";
import type { Size } from "@/lib/commerce/types";

export function WishlistPageClient() {
  const hydrated = useHydrated();
  const { items } = useWishlist();

  if (!hydrated) return <div className="h-64 animate-pulse rounded-card bg-surface" aria-busy="true" aria-label="Loading wishlist" />;

  if (!items.length) {
    return (
      <div className="rounded-card border border-dashed border-line px-6 py-16 text-center">
        <p className="heading-display text-4xl">Your wishlist is empty</p>
        <p className="mt-3 text-muted">Tap the heart on any product to save it here.</p>
        <Link href="/shop" className={buttonClass("dark", "lg", "mt-8")}>
          Discover T-Shirts
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-4" aria-label="Wishlist items">
      {items.map((i) => (
        <li key={i.productId}>
          <article aria-labelledby={`w-${i.productId}`}>
            <Link href={`/product/${i.slug}`} className="block" tabIndex={-1} aria-hidden="true">
              <Image src={i.image} alt="" width={400} height={500} sizes="(min-width:1024px) 22vw, 46vw" className="aspect-[4/5] w-full rounded-card bg-surface object-cover" />
            </Link>
            <h2 id={`w-${i.productId}`} className="mt-3 text-sm font-semibold md:text-base">
              <Link href={`/product/${i.slug}`} className="hover:underline">
                {i.name}
              </Link>
            </h2>
            <ProductPrice price={i.price} compareAtPrice={i.compareAtPrice} className="mt-1" />
            <div className="mt-3 flex flex-col gap-2">
              {i.isCustomizable || !i.defaultVariantId ? (
                <Link href={`/product/${i.slug}`} className={buttonClass("dark", "sm")}>
                  Customise<span className="sr-only"> {i.name}</span>
                </Link>
              ) : (
                <button
                  type="button"
                  className={buttonClass("dark", "sm")}
                  onClick={() => {
                    cartActions.add({
                      lineId: i.defaultVariantId!,
                      productId: i.productId,
                      slug: i.slug,
                      name: i.name,
                      image: i.image,
                      variantId: i.defaultVariantId,
                      colorName: i.defaultColorName,
                      size: i.defaultSize as Size,
                      unitPrice: i.price,
                      compareAtPrice: i.compareAtPrice,
                      quantity: 1,
                      custom: null,
                    });
                    wishlistActions.remove(i.productId);
                  }}
                >
                  Move to Cart<span className="sr-only"> — {i.name}, {i.defaultColorName} / {i.defaultSize}</span>
                </button>
              )}
              {!i.isCustomizable && i.defaultVariantId && (
                <p className="text-xs text-muted">
                  Adds {i.defaultColorName} / {i.defaultSize}. Change on the product page.
                </p>
              )}
              <button
                type="button"
                onClick={() => {
                  wishlistActions.remove(i.productId);
                  toast(`${i.name} removed from wishlist`);
                }}
                className="min-h-10 text-xs font-semibold underline underline-offset-4"
              >
                Remove<span className="sr-only"> {i.name} from wishlist</span>
              </button>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
