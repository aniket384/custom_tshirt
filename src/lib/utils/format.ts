/**
 * Formatting helpers (currency, dates). Pure functions — safe everywhere.
 */

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** ₹1,299 */
export function formatPrice(amount: number): string {
  return inr.format(amount);
}

const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

/** 12 Sep 2026 — uses a fixed locale so server and client output match (no hydration mismatch). */
export function formatDate(iso: string): string {
  return dateFmt.format(new Date(iso));
}

/** Tiny className joiner (avoids a dependency). */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
