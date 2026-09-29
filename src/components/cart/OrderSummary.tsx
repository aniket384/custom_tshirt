"use client";
/** Totals box shared by the cart page and checkout. */
import type { CartTotals } from "@/lib/commerce/pricing";
import { formatPrice } from "@/lib/utils/format";

export function OrderSummary({ totals, children }: { totals: CartTotals; children?: React.ReactNode }) {
  return (
    <section aria-labelledby="summary-h" className="rounded-card border border-line bg-white p-5 md:p-6">
      <h2 id="summary-h" className="text-lg font-semibold">
        Order summary
      </h2>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal ({totals.itemCount} {totals.itemCount === 1 ? "item" : "items"})</dt>
          <dd>{formatPrice(totals.subtotal)}</dd>
        </div>
        {totals.mrpSavings > 0 && (
          <div className="flex justify-between text-success">
            <dt>You save on MRP</dt>
            <dd>{formatPrice(totals.mrpSavings)}</dd>
          </div>
        )}
        {totals.couponDiscount > 0 && (
          <div className="flex justify-between text-success">
            <dt>Coupon discount</dt>
            <dd>−{formatPrice(totals.couponDiscount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd className="text-muted">{totals.shipping === null ? "Calculated at checkout" : formatPrice(totals.shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatPrice(totals.total)}</dd>
        </div>
      </dl>
      {children}
    </section>
  );
}
