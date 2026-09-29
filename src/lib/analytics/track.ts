/**
 * ANALYTICS ABSTRACTION
 *
 * Call `trackEvent(name, params)` from anywhere on the client. Today it logs
 * in development and forwards to `window.dataLayer` (GTM/GA4 compatible) if
 * one exists. No third-party script is loaded by the prototype.
 *
 * To go live: add GA4/GTM via next/script with strategy="afterInteractive"
 * (or a server-side pipeline) and keep these event names — they follow the
 * GA4 recommended e-commerce schema where one exists.
 */

export type AnalyticsEvent =
  | "page_view"
  | "view_item"
  | "view_item_list"
  | "search"
  | "add_to_cart"
  | "remove_from_cart"
  | "begin_checkout"
  | "add_payment_info"
  | "purchase"
  | "add_to_wishlist"
  | "customizer_started"
  | "customizer_completed"
  | "bulk_quote_started"
  | "bulk_quote_submitted";

/** GA4-style item. */
export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  item_variant?: string;
  item_category?: string;
  price?: number;
  quantity?: number;
}

export type AnalyticsParams = Record<string, unknown> & {
  currency?: "INR";
  value?: number;
  items?: AnalyticsItem[];
};

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function trackEvent(event: AnalyticsEvent, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;
  try {
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event, ...params });
    }
    if (process.env.NODE_ENV === "development") {
      console.debug("[analytics]", event, params);
    }
  } catch {
    /* never let analytics break the UI */
  }
}
