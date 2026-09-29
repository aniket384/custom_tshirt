/**
 * DELIVERY LOOKUP (mock).
 *
 * The prototype does NOT know real serviceability or ETAs, so it never
 * returns a delivery date. It only validates the pincode format and reports
 * that delivery across India is available, per the brand's messaging.
 *
 * Production: call your shipping aggregator (Shiprocket, Delhivery,
 * Pickrr...) from a server action / route handler and return real results.
 */
import { validators } from "@/lib/utils/sanitize";

export interface DeliveryCheckResult {
  ok: boolean;
  pincode: string;
  message: string;
}

export async function checkDelivery(pincode: string): Promise<DeliveryCheckResult> {
  const clean = pincode.trim();
  if (!validators.pincode(clean)) {
    return { ok: false, pincode: clean, message: "Please enter a valid 6-digit pincode." };
  }
  // Simulated network latency so loading states can be designed.
  await new Promise((r) => setTimeout(r, 450));
  return {
    ok: true,
    pincode: clean,
    message: `We deliver across India, including ${clean}. Delivery timelines will be confirmed at checkout.`,
  };
}
