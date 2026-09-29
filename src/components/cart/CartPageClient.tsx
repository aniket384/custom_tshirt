"use client";
/** Full cart page UI (client, reads the persisted cart store). */
import Link from "next/link";
import { useHydrated } from "@/lib/store/create-store";
import { useCart } from "@/lib/store/cart";
import { trackEvent } from "@/lib/analytics/track";
import { buttonClass } from "@/components/ui/button-styles";
import { CartLineItem } from "./CartLineItem";
import { OrderSummary } from "./OrderSummary";
import { CouponForm } from "./CouponForm";

export function CartPageClient() {
  const hydrated = useHydrated();
  const { lines, totals, coupon } = useCart();
  const active = lines.filter((l) => !l.savedForLater);
  const saved = lines.filter((l) => l.savedForLater);

  if (!hydrated) {
    return <div className="h-64 animate-pulse rounded-card bg-surface" aria-busy="true" aria-label="Loading cart" />;
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line px-6 py-16 text-center">
        <p className="heading-display text-4xl">Your cart is empty</p>
        <p className="mt-3 text-muted">Pick a design you love or create your own custom T-shirt.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/shop" className={buttonClass("dark", "lg")}>
            Shop T-Shirts
          </Link>
          <Link href="/custom-tshirt" className={buttonClass("primary", "lg")}>
            Create Your T-Shirt
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div>
        <section aria-labelledby="cart-items-h">
          <h2 id="cart-items-h" className="text-lg font-semibold">
            Items in your cart ({totals.itemCount})
          </h2>
          {active.length ? (
            <ul className="divide-y divide-line border-b border-line">
              {active.map((l) => (
                <li key={l.lineId}>
                  <CartLineItem line={l} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-sm text-muted">No active items — move something back from “Saved for later”.</p>
          )}
        </section>
        {saved.length > 0 && (
          <section aria-labelledby="saved-h" className="mt-10">
            <h2 id="saved-h" className="text-lg font-semibold">
              Saved for later ({saved.length})
            </h2>
            <ul className="divide-y divide-line">
              {saved.map((l) => (
                <li key={l.lineId}>
                  <CartLineItem line={l} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      <div className="lg:sticky lg:top-28 lg:self-start">
        <OrderSummary totals={totals}>
          <CouponForm applied={coupon} />
          {active.length > 0 && (
            <Link
              href="/checkout"
              onClick={() => trackEvent("begin_checkout", { currency: "INR", value: totals.total })}
              className={buttonClass("primary", "lg", "mt-5 w-full")}
            >
              Proceed to Checkout
            </Link>
          )}
          <Link href="/shop" className="mt-3 block text-center text-sm font-semibold underline underline-offset-4">
            Continue shopping
          </Link>
        </OrderSummary>
      </div>
    </div>
  );
}
