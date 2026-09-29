"use client";
/**
 * CART STORE — persisted to localStorage (survives refresh).
 *
 * Production: keep this store as the UI cache, but sync each mutation to a
 * server cart (e.g. POST /api/cart/lines) and re-price on the server.
 */
import { createStore, useStore } from "./create-store";
import { calculateCartTotals } from "@/lib/commerce/pricing";
import { trackEvent } from "@/lib/analytics/track";
import type { CartLine } from "@/lib/commerce/types";

export const MAX_LINE_QTY = 99;

/** Unique id for a custom (made-to-order) cart line. Called from event handlers only. */
export function createCustomLineId(prefix: string): string {
  return `custom-${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

interface CartState {
  lines: CartLine[];
  coupon: string | null;
}

export const cartStore = createStore<CartState>({ lines: [], coupon: null }, { persistKey: "ctw.cart" });

/** UI-only store for the slide-over cart drawer (not persisted). */
export const cartDrawerStore = createStore<{ open: boolean }>({ open: false });

export function useCart() {
  const state = useStore(cartStore);
  const totals = calculateCartTotals(state.lines, state.coupon);
  return { ...state, totals };
}

export const cartActions = {
  add(line: CartLine, opts: { openDrawer?: boolean } = { openDrawer: true }) {
    cartStore.set((s) => {
      const existing = s.lines.find((l) => l.lineId === line.lineId && !l.savedForLater);
      const lines = existing
        ? s.lines.map((l) => (l === existing ? { ...l, quantity: Math.min(MAX_LINE_QTY, l.quantity + line.quantity) } : l))
        : [...s.lines, line];
      return { ...s, lines };
    });
    trackEvent("add_to_cart", {
      currency: "INR",
      value: line.unitPrice * line.quantity,
      items: [{ item_id: line.variantId ?? line.productId, item_name: line.name, price: line.unitPrice, quantity: line.quantity }],
    });
    if (opts.openDrawer) cartDrawerStore.set(() => ({ open: true }));
  },
  setQuantity(lineId: string, quantity: number) {
    const q = Math.max(1, Math.min(MAX_LINE_QTY, Math.floor(quantity) || 1));
    cartStore.set((s) => ({ ...s, lines: s.lines.map((l) => (l.lineId === lineId ? { ...l, quantity: q } : l)) }));
  },
  remove(lineId: string) {
    const line = cartStore.get().lines.find((l) => l.lineId === lineId);
    cartStore.set((s) => ({ ...s, lines: s.lines.filter((l) => l.lineId !== lineId) }));
    if (line) {
      trackEvent("remove_from_cart", {
        currency: "INR",
        value: line.unitPrice * line.quantity,
        items: [{ item_id: line.variantId ?? line.productId, item_name: line.name, quantity: line.quantity }],
      });
    }
  },
  toggleSaveForLater(lineId: string) {
    cartStore.set((s) => ({ ...s, lines: s.lines.map((l) => (l.lineId === lineId ? { ...l, savedForLater: !l.savedForLater } : l)) }));
  },
  applyCoupon(code: string | null) {
    cartStore.set((s) => ({ ...s, coupon: code }));
  },
  clear() {
    cartStore.set(() => ({ lines: [], coupon: null }));
  },
  openDrawer() {
    cartDrawerStore.set(() => ({ open: true }));
  },
  closeDrawer() {
    cartDrawerStore.set(() => ({ open: false }));
  },
};
