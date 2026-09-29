"use client";
/**
 * Account UI (DEMO — no real authentication).
 * Orders come from demo checkouts stored in this browser; the profile is
 * saved to localStorage. Replace with an auth provider (NextAuth/Auth.js,
 * Clerk, Supabase, Shopify customer accounts) — see docs/BACKEND-INTEGRATION.md.
 */
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { getDemoOrder, listDemoOrders } from "@/lib/commerce/orders";
import { ORDER_STEPS } from "@/lib/commerce/orders";
import type { Order } from "@/lib/commerce/types";
import { createStore, useStore } from "@/lib/store/create-store";
import { formatDate, formatPrice } from "@/lib/utils/format";
import { validators } from "@/lib/utils/sanitize";
import { buttonClass } from "@/components/ui/button-styles";
import { Field } from "@/components/forms/Field";
import { OrderTimeline } from "./OrderTimeline";

const noop = () => () => {};
/** Read demo orders after hydration only (localStorage is client-only). */
function useDemoOrders(): Order[] | null {
  const raw = useSyncExternalStore(
    noop,
    () => localStorage.getItem("ctw.demoOrders.v1") ?? "[]",
    () => null,
  );
  return raw === null ? null : listDemoOrders();
}

export function DemoNotice() {
  return (
    <p className="rounded-card bg-surface px-4 py-3 text-sm">
      <strong>Demo account.</strong> Sign-in is not connected yet. Orders placed through the demo checkout in this browser are shown here.
    </p>
  );
}

const statusLabel = (s: Order["status"]) => ORDER_STEPS.find((x) => x.status === s)?.label ?? s;

export function OrdersList({ limit }: { limit?: number }) {
  const orders = useDemoOrders();
  if (orders === null) return <div className="h-32 animate-pulse rounded-card bg-surface" aria-busy="true" aria-label="Loading orders" />;
  if (!orders.length) {
    return (
      <div className="rounded-card border border-dashed border-line p-8 text-center">
        <p className="font-semibold">No orders yet</p>
        <p className="mt-1 text-sm text-muted">Orders you place will appear here.</p>
        <Link href="/shop" className={buttonClass("dark", "md", "mt-4")}>
          Start shopping
        </Link>
      </div>
    );
  }
  return (
    <ul className="divide-y divide-line rounded-card border border-line bg-white">
      {orders.slice(0, limit).map((o) => (
        <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <p className="font-semibold">{o.id}</p>
            <p className="text-sm text-muted">
              {formatDate(o.placedAt)} · {o.lines.reduce((s, l) => s + l.quantity, 0)} items · {formatPrice(o.total)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold">{statusLabel(o.status)}</span>
            <Link href={`/account/orders/${o.id}`} className="min-h-11 content-center text-sm font-semibold underline underline-offset-4">
              View<span className="sr-only"> order {o.id}</span>
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function OrderDetail({ id }: { id: string }) {
  const orders = useDemoOrders();
  if (orders === null) return <div className="h-64 animate-pulse rounded-card bg-surface" aria-busy="true" aria-label="Loading order" />;
  const o = getDemoOrder(id);
  if (!o) {
    return (
      <div className="rounded-card border border-dashed border-line p-8 text-center">
        <p className="font-semibold">Order {id} was not found in this browser.</p>
        <p className="mt-1 text-sm text-muted">Demo orders are stored locally on the device used to place them.</p>
        <Link href="/track-order" className={buttonClass("dark", "md", "mt-4")}>
          Track an order
        </Link>
      </div>
    );
  }
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <section aria-labelledby="items-h" className="rounded-card border border-line bg-white p-5">
          <h2 id="items-h" className="text-lg font-semibold">
            Items
          </h2>
          <ul className="mt-3 divide-y divide-line text-sm">
            {o.lines.map((l) => (
              <li key={l.lineId} className="flex justify-between gap-3 py-2">
                <span>
                  {l.name}
                  {l.custom && " (custom)"} — {l.colorName} / {l.size} × {l.quantity}
                  {l.custom?.uploadedFileName && <span className="block text-xs text-muted">Design: {l.custom.uploadedFileName}</span>}
                </span>
                <span>{formatPrice(l.unitPrice * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex justify-between border-t border-line pt-3 font-semibold">
            <span>Total</span>
            <span>{formatPrice(o.total)}</span>
          </p>
        </section>
        <section aria-labelledby="ship-h" className="rounded-card border border-line bg-white p-5 text-sm">
          <h2 id="ship-h" className="text-lg font-semibold">
            Shipping to
          </h2>
          <address className="mt-2 not-italic text-muted">
            {o.shippingAddress.fullName}
            <br />
            {o.shippingAddress.line1}
            {o.shippingAddress.line2 && `, ${o.shippingAddress.line2}`}
            <br />
            {o.shippingAddress.city}, {o.shippingAddress.state} {o.shippingAddress.pincode}
          </address>
        </section>
      </div>
      <section aria-labelledby="status-h" className="rounded-card border border-line bg-white p-5">
        <h2 id="status-h" className="mb-4 text-lg font-semibold">
          Status
        </h2>
        <OrderTimeline status={o.status} events={o.timeline} />
      </section>
    </div>
  );
}

interface Profile {
  name: string;
  email: string;
  phone: string;
}
const profileStore = createStore<Profile>({ name: "", email: "", phone: "" }, { persistKey: "ctw.profile" });

export function ProfileForm() {
  const profile = useStore(profileStore);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [saved, setSaved] = useState(false);
  return (
    <form
      key={JSON.stringify(profile)}
      noValidate
      className="max-w-xl space-y-4 rounded-card border border-line bg-white p-5"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const p = { name: String(fd.get("name")).trim(), email: String(fd.get("email")).trim(), phone: String(fd.get("phone")).trim() };
        const next: Record<string, string | undefined> = {};
        if (!p.name) next.name = "Enter your name";
        if (p.email && !validators.email(p.email)) next.email = "Enter a valid email";
        if (p.phone && !validators.phone(p.phone)) next.phone = "Enter a valid mobile number";
        setErrors(next);
        if (Object.values(next).some(Boolean)) return;
        profileStore.set(() => p);
        setSaved(true);
      }}
    >
      <Field id="name" label="Full name" autoComplete="name" defaultValue={profile.name} error={errors.name} />
      <Field id="email" label="Email" type="email" autoComplete="email" defaultValue={profile.email} error={errors.email} />
      <Field id="phone" label="Mobile number" type="tel" autoComplete="tel" defaultValue={profile.phone} error={errors.phone} />
      <button type="submit" className={buttonClass("dark", "md")}>
        Save profile
      </button>
      <p role="status" className="text-sm text-success">
        {saved ? "Profile saved on this device (demo)." : ""}
      </p>
    </form>
  );
}
