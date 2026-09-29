"use client";
/** Order tracking form (mock lookup via lib/commerce/orders.trackOrder). */
import { useState } from "react";
import { trackOrder } from "@/lib/commerce/orders";
import type { OrderStatus } from "@/lib/commerce/types";
import { buttonClass } from "@/components/ui/button-styles";
import { Field } from "@/components/forms/Field";
import { OrderTimeline } from "./OrderTimeline";
import type { Order } from "@/lib/commerce/types";

export function TrackOrderForm() {
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ order: Order | null; sampleStatus: OrderStatus | null; id: string } | null>(null);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form
        noValidate
        aria-label="Track your order"
        className="space-y-4 rounded-card border border-line bg-white p-5 md:p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const id = String(fd.get("orderId") ?? "").trim();
          const contact = String(fd.get("contact") ?? "").trim();
          const next: Record<string, string | undefined> = {};
          if (!id) next.orderId = "Enter your order ID";
          if (!contact) next.contact = "Enter the phone number or email used for the order";
          setErrors(next);
          setResult(null);
          if (next.orderId || next.contact) return;
          setLoading(true);
          const r = await trackOrder(id, contact);
          setLoading(false);
          if (r.error) setErrors({ orderId: r.error });
          else setResult({ ...r, id: id.toUpperCase() });
        }}
      >
        <Field id="orderId" label="Order ID" placeholder="CTW-2026-12345" autoComplete="off" error={errors.orderId} />
        <Field id="contact" label="Phone or email" autoComplete="email" error={errors.contact} />
        <button type="submit" disabled={loading} className={buttonClass("dark", "lg", "w-full")}>
          {loading ? "Looking up…" : "Track Order"}
        </button>
      </form>

      <section aria-live="polite" aria-labelledby="track-result-h">
        <h2 id="track-result-h" className="sr-only">
          Tracking result
        </h2>
        {result ? (
          <div className="rounded-card border border-line bg-white p-5 md:p-6">
            <p className="font-semibold">Order {result.id}</p>
            {result.sampleStatus && <p className="mt-1 rounded-lg bg-surface px-3 py-2 text-xs">Sample tracking (prototype) — not a real shipment.</p>}
            <div className="mt-5">
              <OrderTimeline status={result.order?.status ?? result.sampleStatus!} events={result.order?.timeline} />
            </div>
          </div>
        ) : (
          <div className="rounded-card bg-surface p-6 text-sm text-muted">
            Your order ID is in your confirmation. Enter it with the phone number or email you used at checkout to see the latest status.
          </div>
        )}
      </section>
    </div>
  );
}
