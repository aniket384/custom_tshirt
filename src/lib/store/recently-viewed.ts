"use client";
/** Recently viewed products (last 8), persisted locally. */
import { createStore, useStore } from "./create-store";

export interface RecentItem {
  slug: string;
  name: string;
  image: string;
  price: number;
}

export const recentStore = createStore<{ items: RecentItem[] }>({ items: [] }, { persistKey: "ctw.recent" });

export function useRecentlyViewed() {
  return useStore(recentStore).items;
}

export function recordView(item: RecentItem) {
  recentStore.set((s) => ({ items: [item, ...s.items.filter((i) => i.slug !== item.slug)].slice(0, 8) }));
}
