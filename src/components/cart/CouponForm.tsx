"use client";
/** Coupon code UI. Validation is a demo lookup — the server must validate for real. */
import { useState } from "react";
import { DEMO_COUPONS } from "@/lib/commerce/pricing";
import { cartActions } from "@/lib/store/cart";

export function CouponForm({ applied }: { applied: string | null }) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  if (applied) {
    return (
      <p className="mt-4 flex items-center justify-between rounded-lg bg-surface px-3 py-2 text-sm">
        <span>
          Coupon <strong>{applied}</strong> applied
        </span>
        <button type="button" onClick={() => cartActions.applyCoupon(null)} className="min-h-10 font-semibold underline">
          Remove<span className="sr-only"> coupon {applied}</span>
        </button>
      </p>
    );
  }
  return (
    <form
      className="mt-4"
      onSubmit={(e) => {
        e.preventDefault();
        const c = code.trim().toUpperCase();
        if (DEMO_COUPONS[c]) {
          cartActions.applyCoupon(c);
          setMsg(null);
        } else setMsg({ ok: false, text: "This coupon code is not valid." });
      }}
    >
      <label htmlFor="coupon" className="text-sm font-semibold">
        Coupon code
      </label>
      <div className="mt-1 flex gap-2">
        <input id="coupon" value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" aria-describedby="coupon-msg" className="min-h-11 w-full rounded-full border border-line px-4 text-sm uppercase" />
        <button type="submit" className="min-h-11 shrink-0 rounded-full border border-ink px-4 text-sm font-semibold hover:bg-ink hover:text-white">
          Apply
        </button>
      </div>
      <p id="coupon-msg" role="status" className="mt-1 text-xs text-danger">
        {msg?.text}
      </p>
      <p className="text-xs text-muted">Prototype: try the demo code DEMO10.</p>
    </form>
  );
}
