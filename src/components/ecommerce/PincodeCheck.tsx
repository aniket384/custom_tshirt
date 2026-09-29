"use client";
/**
 * Pincode delivery check (mock service in lib/commerce/delivery.ts).
 * Never shows an invented delivery date.
 */
import { useState } from "react";
import { checkDelivery, type DeliveryCheckResult } from "@/lib/commerce/delivery";
import { TruckIcon } from "@/components/ui/icons";

export function PincodeCheck() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<DeliveryCheckResult | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="rounded-card border border-line bg-white p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(await checkDelivery(pincode));
        setLoading(false);
      }}
    >
      <label htmlFor="pincode" className="flex items-center gap-2 text-sm font-semibold">
        <TruckIcon size={18} /> Check delivery
      </label>
      <p id="pincode-hint" className="mt-1 text-xs text-muted">
        Enter your pincode to check delivery availability.
      </p>
      <div className="mt-3 flex gap-2">
        <input
          id="pincode"
          name="pincode"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          pattern="[1-9][0-9]{5}"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          aria-describedby="pincode-hint pincode-result"
          placeholder="6-digit pincode"
          className="min-h-11 w-full rounded-full border border-line px-4 text-sm"
        />
        <button type="submit" disabled={loading} className="min-h-11 shrink-0 rounded-full bg-ink px-5 text-sm font-semibold text-white disabled:opacity-60">
          {loading ? "Checking…" : "Check"}
        </button>
      </div>
      <p id="pincode-result" role="status" className={`mt-2 text-sm ${result?.ok ? "text-success" : "text-danger"}`}>
        {result?.message}
      </p>
    </form>
  );
}
