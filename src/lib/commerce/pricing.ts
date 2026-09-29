/**
 * Pricing rules (DEMO). Pure functions shared by the cart, checkout and the
 * custom T-shirt builder. In production, the server must recalculate every
 * price — never trust totals sent from the browser.
 */
import {
  BULK_TIERS,
  PERSONALISATION_PRICE,
  PLACEMENT_PRICES,
  SHIRT_TYPES,
} from "@/data/customizer";
import type { CartLine, PrintPlacement } from "./types";

/* ------------------------------ Customiser ------------------------------ */

export interface CustomPriceInput {
  shirtTypeId: string;
  placement: PrintPlacement;
  hasPersonalisation: boolean;
  quantity: number;
}

export interface CustomPriceBreakdown {
  base: number;
  placement: number;
  personalisation: number;
  unitBeforeDiscount: number;
  discountPct: number;
  unitPrice: number;
  quantity: number;
  total: number;
}

export function calculateCustomPrice(input: CustomPriceInput): CustomPriceBreakdown {
  const shirt = SHIRT_TYPES.find((s) => s.id === input.shirtTypeId) ?? SHIRT_TYPES[0];
  const quantity = Math.max(1, Math.floor(input.quantity));
  const placement = PLACEMENT_PRICES[input.placement];
  const personalisation = input.hasPersonalisation ? PERSONALISATION_PRICE : 0;
  const unitBeforeDiscount = shirt.basePrice + placement + personalisation;
  const tier = BULK_TIERS.find((t) => quantity >= t.minQty);
  const discountPct = tier?.discountPct ?? 0;
  const unitPrice = Math.round(unitBeforeDiscount * (1 - discountPct / 100));
  return {
    base: shirt.basePrice,
    placement,
    personalisation,
    unitBeforeDiscount,
    discountPct,
    unitPrice,
    quantity,
    total: unitPrice * quantity,
  };
}

/* --------------------------------- Cart --------------------------------- */

/** Demo coupon codes. Replace with server-side validation. */
export const DEMO_COUPONS: Record<string, { pct: number; label: string }> = {
  DEMO10: { pct: 10, label: "Demo coupon — 10% off" },
};

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  /** Savings vs compare-at (MRP) prices. */
  mrpSavings: number;
  couponDiscount: number;
  /** null = not calculated yet (depends on address / shipping partner). */
  shipping: number | null;
  total: number;
}

export function calculateCartTotals(lines: CartLine[], couponCode?: string | null): CartTotals {
  const active = lines.filter((l) => !l.savedForLater);
  const subtotal = active.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
  const mrpSavings = active.reduce(
    (s, l) => s + (l.compareAtPrice && l.compareAtPrice > l.unitPrice ? (l.compareAtPrice - l.unitPrice) * l.quantity : 0),
    0,
  );
  const coupon = couponCode ? DEMO_COUPONS[couponCode.toUpperCase()] : undefined;
  const couponDiscount = coupon ? Math.round((subtotal * coupon.pct) / 100) : 0;
  return {
    itemCount: active.reduce((s, l) => s + l.quantity, 0),
    subtotal,
    mrpSavings,
    couponDiscount,
    shipping: null,
    total: subtotal - couponDiscount,
  };
}
