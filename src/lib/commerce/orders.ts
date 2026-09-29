/**
 * ORDERS (mock).
 *
 * Demo orders are stored in the browser (localStorage) so the account and
 * tracking pages have something to show after a demo checkout. There is no
 * server, no real fulfilment and no real payment.
 *
 * Production: replace with authenticated API calls (GET /orders, GET
 * /orders/:id, POST /track) — see docs/BACKEND-INTEGRATION.md.
 */
import type { Order, OrderEvent, OrderStatus } from "./types";

export const ORDER_STEPS: { status: OrderStatus; label: string; description: string }[] = [
  { status: "placed", label: "Order Placed", description: "We have received your order." },
  { status: "confirmed", label: "Confirmed", description: "Your order and design have been confirmed." },
  { status: "printing", label: "Printing", description: "Your T-shirts are being printed." },
  { status: "packed", label: "Packed", description: "Your order is packed and ready to ship." },
  { status: "shipped", label: "Shipped", description: "Your order is on its way." },
  { status: "out_for_delivery", label: "Out for Delivery", description: "Your order will reach you soon." },
  { status: "delivered", label: "Delivered", description: "Your order has been delivered." },
];

const STORAGE_KEY = "ctw.demoOrders.v1";

/** CTW-2026-XXXXX (5 random digits). */
export function generateOrderId(date = new Date()): string {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `CTW-${date.getFullYear()}-${n}`;
}

export function buildTimeline(status: OrderStatus, placedAt: string): OrderEvent[] {
  const reached = ORDER_STEPS.findIndex((s) => s.status === status);
  const start = new Date(placedAt).getTime();
  return ORDER_STEPS.map((s, i) => ({
    status: s.status,
    // Demo timestamps: 1 day apart. Real events come from the backend.
    at: i <= reached ? new Date(start + i * 86_400_000).toISOString() : null,
  }));
}

function read(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as Order[];
  } catch {
    return [];
  }
}

export function saveDemoOrder(order: Order): void {
  try {
    const orders = [order, ...read().filter((o) => o.id !== order.id)].slice(0, 20);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    /* storage full / disabled — demo only */
  }
}

export function listDemoOrders(): Order[] {
  return read();
}

export function getDemoOrder(id: string): Order | null {
  return read().find((o) => o.id.toUpperCase() === id.trim().toUpperCase()) ?? null;
}

/**
 * Mock tracking lookup. Matches locally stored demo orders by ID + phone/email.
 * For any other well-formed ID (CTW-YYYY-NNNNN) it returns a SAMPLE timeline
 * clearly flagged as `sample: true` so the UI can label it.
 */
export async function trackOrder(
  orderId: string,
  contact: string,
): Promise<{ order: Order | null; sampleStatus: OrderStatus | null; error?: string }> {
  await new Promise((r) => setTimeout(r, 400));
  const id = orderId.trim().toUpperCase();
  if (!/^CTW-\d{4}-\d{5}$/.test(id)) return { order: null, sampleStatus: null, error: "Order IDs look like CTW-2026-12345." };
  const local = getDemoOrder(id);
  const c = contact.trim().toLowerCase();
  if (local) {
    const match = local.email.toLowerCase() === c || local.phone.replace(/\D/g, "").endsWith(c.replace(/\D/g, "").slice(-10));
    if (!match) return { order: null, sampleStatus: null, error: "The phone or email does not match this order." };
    return { order: local, sampleStatus: null };
  }
  // Deterministic sample status derived from the ID digits.
  const digit = Number(id.slice(-1));
  return { order: null, sampleStatus: ORDER_STEPS[digit % ORDER_STEPS.length].status };
}
