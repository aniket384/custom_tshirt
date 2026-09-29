/**
 * CHECKOUT (mock) — payment-provider abstraction.
 *
 * The prototype NEVER charges money. `placeDemoOrder` just builds an Order
 * object and stores it locally.
 *
 * Razorpay integration outline (see docs/BACKEND-INTEGRATION.md):
 *   1. Server: POST /api/checkout → validate cart + recalc prices → create a
 *      Razorpay order (amount in paise) → return { razorpayOrderId, key }.
 *   2. Client: open Razorpay Checkout with that order id.
 *   3. Server: verify the payment signature (webhook + handler) → mark paid.
 * Implement `PaymentProvider` for Razorpay and swap it in below.
 */
import { calculateCartTotals } from "./pricing";
import { buildTimeline, generateOrderId, saveDemoOrder } from "./orders";
import type { Address, CartLine, Order, PaymentMethod } from "./types";

export interface CheckoutInput {
  email: string;
  phone: string;
  shippingAddress: Address;
  billingAddress: Address | null;
  deliveryOption: "standard";
  paymentMethod: PaymentMethod;
  lines: CartLine[];
  couponCode: string | null;
}

export interface PaymentProvider {
  id: string;
  /** Returns a provider reference once payment is authorised. */
  pay(order: Order): Promise<{ ok: boolean; reference: string | null }>;
}

/** Demo provider — always "succeeds" without contacting anyone. */
const demoProvider: PaymentProvider = {
  id: "demo",
  async pay() {
    await new Promise((r) => setTimeout(r, 700));
    return { ok: true, reference: null };
  },
};

export const PAYMENT_METHODS: { id: PaymentMethod; label: string; hint: string }[] = [
  { id: "upi", label: "UPI", hint: "Google Pay, PhonePe, Paytm and other UPI apps" },
  { id: "card", label: "Credit / Debit Card", hint: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", hint: "All major Indian banks" },
  { id: "cod", label: "Cash on Delivery", hint: "Pay when your order arrives (availability to be confirmed)" },
];

export async function placeDemoOrder(input: CheckoutInput, provider: PaymentProvider = demoProvider): Promise<Order> {
  const active = input.lines.filter((l) => !l.savedForLater);
  const totals = calculateCartTotals(active, input.couponCode);
  const placedAt = new Date().toISOString();
  const order: Order = {
    id: generateOrderId(),
    placedAt,
    status: "placed",
    lines: active,
    subtotal: totals.subtotal,
    shipping: totals.shipping,
    discount: totals.couponDiscount,
    total: totals.total,
    paymentMethod: input.paymentMethod,
    email: input.email,
    phone: input.phone,
    shippingAddress: input.shippingAddress,
    timeline: buildTimeline("placed", placedAt),
    isDemo: true,
  };
  const result = await provider.pay(order);
  if (!result.ok) throw new Error("Payment was not completed.");
  saveDemoOrder(order);
  return order;
}
