"use client";
/** Transient notifications announced via an aria-live region (see <Toaster/>). */
import { createStore } from "./create-store";

export interface Toast {
  id: number;
  message: string;
}

export const toastStore = createStore<{ toasts: Toast[] }>({ toasts: [] });

let nextId = 1;
export function toast(message: string, ms = 3200) {
  const id = nextId++;
  toastStore.set((s) => ({ toasts: [...s.toasts.slice(-2), { id, message }] }));
  window.setTimeout(() => toastStore.set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), ms);
}
