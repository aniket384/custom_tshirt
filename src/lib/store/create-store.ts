"use client";
/**
 * Minimal external store (≈ a tiny Zustand) built on useSyncExternalStore.
 *
 * Why not Context + useState? Components subscribe directly, so updating the
 * cart re-renders only the components that read the cart — not the whole app.
 *
 * Hydration safety: `getServerSnapshot` always returns the initial state, so
 * the server HTML and the first client render match. React then re-renders
 * with the persisted localStorage state right after hydration.
 */
import { useSyncExternalStore } from "react";

export interface Store<T> {
  get: () => T;
  set: (updater: (prev: T) => T) => void;
  subscribe: (listener: () => void) => () => void;
  getServerSnapshot: () => T;
}

export function createStore<T>(initial: T, options?: { persistKey?: string; version?: number }): Store<T> {
  let state = initial;
  let loaded = !options?.persistKey;
  const listeners = new Set<() => void>();
  const storageKey = options?.persistKey ? `${options.persistKey}.v${options.version ?? 1}` : null;

  const load = () => {
    if (loaded || typeof window === "undefined" || !storageKey) return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) state = { ...initial, ...JSON.parse(raw) };
    } catch {
      /* corrupted or blocked storage → keep initial state */
    }
  };

  const emit = () => listeners.forEach((l) => l());

  return {
    get: () => {
      load();
      return state;
    },
    set: (updater) => {
      load();
      state = updater(state);
      if (storageKey) {
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(state));
        } catch {
          /* quota exceeded / private mode — keep in memory */
        }
      }
      emit();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      // Keep multiple tabs in sync.
      const onStorage = (e: StorageEvent) => {
        if (storageKey && e.key === storageKey) {
          loaded = false;
          load();
          emit();
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
    getServerSnapshot: () => initial,
  };
}

/** React hook: subscribe to a store. */
export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.getServerSnapshot);
}

/** True after hydration — use to avoid rendering persisted counts on the server. */
const noopSubscribe = () => () => {};
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
