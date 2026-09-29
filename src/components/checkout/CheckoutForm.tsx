"use client";
/**
 * DEMO CHECKOUT FORM
 *
 * Collects contact + address, delivery and payment METHOD selection, then
 * calls placeDemoOrder() (lib/commerce/checkout.ts). No payment is taken and
 * no card data is ever collected here — in production the payment step
 * opens the provider's hosted/secure checkout (e.g. Razorpay).
 */
import Link from "next/link";
import { useState } from "react";
import { useHydrated } from "@/lib/store/create-store";
import { cartActions, useCart } from "@/lib/store/cart";
import { PAYMENT_METHODS, placeDemoOrder } from "@/lib/commerce/checkout";
import type { Address, Order, PaymentMethod } from "@/lib/commerce/types";
import { trackEvent } from "@/lib/analytics/track";
import { validators } from "@/lib/utils/sanitize";
import { formatPrice } from "@/lib/utils/format";
import { siteConfig } from "@/config/site";
import { buttonClass } from "@/components/ui/button-styles";
import { ErrorSummary, Field, fieldInputClass, INDIAN_STATES } from "@/components/forms/Field";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { CheckIcon } from "@/components/ui/icons";

type Errors = Record<string, string | undefined>;

function readAddress(fd: FormData, prefix: string): Address {
  const g = (k: string) => String(fd.get(`${prefix}${k}`) ?? "").trim();
  return { fullName: g("name"), line1: g("line1"), line2: g("line2"), city: g("city"), state: g("state"), pincode: g("pincode"), phone: String(fd.get("phone") ?? "").trim() };
}

function validateAddress(a: Address, prefix: string, e: Errors) {
  if (!a.fullName) e[`${prefix}name`] = "Enter the full name";
  if (!a.line1) e[`${prefix}line1`] = "Enter the address";
  if (!a.city) e[`${prefix}city`] = "Enter the city";
  if (!a.state) e[`${prefix}state`] = "Choose the state";
  if (!validators.pincode(a.pincode)) e[`${prefix}pincode`] = "Enter a valid 6-digit pincode";
}

function AddressFields({ prefix, errors, legend }: { prefix: string; errors: Errors; legend: string }) {
  return (
    <fieldset className="grid gap-4 sm:grid-cols-2">
      <legend className="sr-only">{legend}</legend>
      <Field id={`${prefix}name`} label="Full name" autoComplete={`${prefix === "ship-" ? "shipping" : "billing"} name`} error={errors[`${prefix}name`]} className="sm:col-span-2" />
      <Field id={`${prefix}line1`} label="Address (house no., building, street)" autoComplete={`${prefix === "ship-" ? "shipping" : "billing"} address-line1`} error={errors[`${prefix}line1`]} className="sm:col-span-2" />
      <Field id={`${prefix}line2`} label="Area, landmark" optional autoComplete={`${prefix === "ship-" ? "shipping" : "billing"} address-line2`} className="sm:col-span-2" />
      <Field id={`${prefix}city`} label="City" autoComplete={`${prefix === "ship-" ? "shipping" : "billing"} address-level2`} error={errors[`${prefix}city`]} />
      <div>
        <label htmlFor={`${prefix}state`} className="text-sm font-semibold">
          State
        </label>
        <select id={`${prefix}state`} name={`${prefix}state`} defaultValue="" autoComplete={`${prefix === "ship-" ? "shipping" : "billing"} address-level1`} aria-invalid={errors[`${prefix}state`] ? true : undefined} aria-describedby={errors[`${prefix}state`] ? `${prefix}state-error` : undefined} className={`${fieldInputClass} border-line`}>
          <option value="" disabled>
            Select state
          </option>
          {INDIAN_STATES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        {errors[`${prefix}state`] && (
          <p id={`${prefix}state-error`} className="mt-1 text-sm font-semibold text-danger">
            {errors[`${prefix}state`]}
          </p>
        )}
      </div>
      <Field id={`${prefix}pincode`} label="Pincode" inputMode="numeric" maxLength={6} autoComplete={`${prefix === "ship-" ? "shipping" : "billing"} postal-code`} error={errors[`${prefix}pincode`]} />
    </fieldset>
  );
}

function CheckoutSection({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`co-${n}`} className="rounded-card border border-line bg-white p-5 md:p-6">
      <h2 id={`co-${n}`} className="mb-4 flex items-center gap-3 text-lg font-semibold">
        <span className="grid size-7 place-items-center rounded-full bg-ink text-xs font-bold text-white" aria-hidden="true">
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function CheckoutForm() {
  const hydrated = useHydrated();
  const { lines, totals, coupon } = useCart();
  const active = lines.filter((l) => !l.savedForLater);
  const [errors, setErrors] = useState<Errors>({});
  const [billingSame, setBillingSame] = useState(true);
  const [payment, setPayment] = useState<PaymentMethod>("upi");
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  if (!hydrated) return <div className="h-96 animate-pulse rounded-card bg-surface" aria-busy="true" aria-label="Loading checkout" />;

  if (order) {
    return (
      <div className="mx-auto max-w-2xl rounded-card border border-line bg-white p-8 text-center" role="status">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand">
          <CheckIcon size={28} />
        </span>
        <h2 className="heading-display mt-5 text-4xl">Your demo order has been placed.</h2>
        <p className="mt-3 text-muted">
          Order number <strong className="text-ink">{order.id}</strong> · Total {formatPrice(order.total)}
        </p>
        <p className="mt-3 text-sm text-muted">This is a prototype — no payment was taken and nothing will be shipped.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={`/account/orders/${order.id}`} className={buttonClass("dark", "lg")}>
            View Order
          </Link>
          <Link href="/track-order" className={buttonClass("outline", "lg")}>
            Track Order
          </Link>
        </div>
      </div>
    );
  }

  if (!active.length) {
    return (
      <div className="rounded-card border border-dashed border-line p-12 text-center">
        <p className="heading-display text-4xl">Nothing to check out</p>
        <p className="mt-2 text-muted">Your cart is empty.</p>
        <Link href="/shop" className={buttonClass("dark", "lg", "mt-6")}>
          Shop T-Shirts
        </Link>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const shipping = readAddress(fd, "ship-");
    const billing = billingSame ? null : readAddress(fd, "bill-");
    const next: Errors = {};
    if (!validators.email(email)) next.email = "Enter a valid email address";
    if (!validators.phone(phone)) next.phone = "Enter a valid 10-digit Indian mobile number";
    validateAddress(shipping, "ship-", next);
    if (billing) validateAddress(billing, "bill-", next);
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => document.getElementById("error-summary")?.focus());
      return;
    }
    setSubmitting(true);
    try {
      const placed = await placeDemoOrder({ email, phone, shippingAddress: shipping, billingAddress: billing, deliveryOption: "standard", paymentMethod: payment, lines: active, couponCode: coupon });
      trackEvent("purchase", {
        transaction_id: placed.id,
        currency: "INR",
        value: placed.total,
        items: placed.lines.map((l) => ({ item_id: l.variantId ?? l.productId, item_name: l.name, price: l.unitPrice, quantity: l.quantity })),
      });
      cartActions.clear();
      setOrder(placed);
      window.scrollTo({ top: 0 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Checkout" className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-5">
        {siteConfig.isDemo && (
          <p className="rounded-card bg-brand px-4 py-3 text-sm font-semibold">Demo checkout — no real payment will be taken.</p>
        )}
        <ErrorSummary errors={errors} />

        <CheckoutSection n={1} title="Contact">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="email" label="Email" type="email" autoComplete="email" error={errors.email} />
            <Field id="phone" label="Mobile number" type="tel" autoComplete="tel" inputMode="tel" hint="For delivery updates" error={errors.phone} />
          </div>
        </CheckoutSection>

        <CheckoutSection n={2} title="Shipping address">
          <AddressFields prefix="ship-" errors={errors} legend="Shipping address" />
        </CheckoutSection>

        <CheckoutSection n={3} title="Billing address">
          <label className="flex min-h-11 items-center gap-3 text-sm">
            <input type="checkbox" checked={billingSame} onChange={(e) => setBillingSame(e.target.checked)} className="size-5 accent-ink" />
            Billing address is the same as shipping
          </label>
          {!billingSame && (
            <div className="mt-4">
              <AddressFields prefix="bill-" errors={errors} legend="Billing address" />
            </div>
          )}
        </CheckoutSection>

        <CheckoutSection n={4} title="Delivery option">
          <label className="flex items-start gap-3 rounded-lg border border-ink p-4">
            <input type="radio" name="delivery" value="standard" defaultChecked className="mt-1 size-5 accent-ink" />
            <span>
              <span className="block font-semibold">Standard delivery (All India)</span>
              <span className="block text-sm text-muted">Charges and delivery timeline will be confirmed once shipping partners are connected.</span>
            </span>
          </label>
        </CheckoutSection>

        <CheckoutSection n={5} title="Payment method">
          <fieldset>
            <legend className="sr-only">Payment method</legend>
            <div className="grid gap-2">
              {PAYMENT_METHODS.map((m) => (
                <label key={m.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${payment === m.id ? "border-ink bg-surface" : "border-line"}`}>
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={payment === m.id}
                    onChange={() => {
                      setPayment(m.id);
                      trackEvent("add_payment_info", { payment_type: m.id, currency: "INR", value: totals.total });
                    }}
                    className="mt-1 size-5 accent-ink"
                  />
                  <span>
                    <span className="block font-semibold">{m.label}</span>
                    <span className="block text-sm text-muted">{m.hint}</span>
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted">
              Demo mode: payment details are never collected on this page. When payments go live, you will complete payment in the payment provider&apos;s secure window.
            </p>
          </fieldset>
        </CheckoutSection>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <OrderSummary totals={totals}>
          <ul className="mt-4 divide-y divide-line border-t border-line text-sm" aria-label="Items">
            {active.map((l) => (
              <li key={l.lineId} className="flex justify-between gap-3 py-2">
                <span>
                  {l.name}
                  {l.custom && " (custom)"} — {l.colorName} / {l.size} × {l.quantity}
                </span>
                <span className="shrink-0">{formatPrice(l.unitPrice * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <button type="submit" disabled={submitting} className={buttonClass("primary", "lg", "mt-5 w-full")}>
            {submitting ? "Placing demo order…" : `Place Demo Order — ${formatPrice(totals.total)}`}
          </button>
          <Link href="/cart" className="mt-3 block text-center text-sm font-semibold underline underline-offset-4">
            Back to cart
          </Link>
        </OrderSummary>
      </div>
    </form>
  );
}
