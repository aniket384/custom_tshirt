"use client";
/**
 * Current product-page selection (colour + size), shared between the
 * purchase panel and the gallery. Being an external store also lets us apply
 * a `?variant=` deep link after hydration without setState-in-effect.
 */
import { createStore } from "./create-store";

export interface PdpSelection {
  productId: string | null;
  colorId: string | null;
  size: string | null;
}

export const pdpColorStore = createStore<PdpSelection>({ productId: null, colorId: null, size: null });
