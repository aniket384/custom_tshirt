"use client";
/**
 * WISHLIST STORE — persisted to localStorage.
 * Stores a small product snapshot so the wishlist page renders without
 * fetching the catalogue. Production: sync to the customer account.
 */
import { createStore, useStore } from "./create-store";
import { trackEvent } from "@/lib/analytics/track";

export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  compareAtPrice: number | null;
  /** Default variant used by "Move to cart" (first available colour/size). */
  defaultVariantId: string | null;
  defaultColorName: string;
  defaultSize: string;
  /** Customisable products must go through the builder instead. */
  isCustomizable: boolean;
}

export const wishlistStore = createStore<{ items: WishlistItem[] }>({ items: [] }, { persistKey: "ctw.wishlist" });

export function useWishlist() {
  return useStore(wishlistStore);
}

export const wishlistActions = {
  has(productId: string) {
    return wishlistStore.get().items.some((i) => i.productId === productId);
  },
  toggle(item: WishlistItem) {
    const exists = wishlistActions.has(item.productId);
    wishlistStore.set((s) => ({
      items: exists ? s.items.filter((i) => i.productId !== item.productId) : [item, ...s.items],
    }));
    if (!exists) {
      trackEvent("add_to_wishlist", { currency: "INR", value: item.price, items: [{ item_id: item.productId, item_name: item.name, price: item.price }] });
    }
    return !exists;
  },
  remove(productId: string) {
    wishlistStore.set((s) => ({ items: s.items.filter((i) => i.productId !== productId) }));
  },
};
