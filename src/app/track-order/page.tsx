/** /track-order — utility page (noindex). */
import type { Metadata } from "next";
import { TrackOrderForm } from "@/components/account/TrackOrderForm";
import { noindexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = noindexMetadata("Track Your Order", "/track-order", "Track your Custom T-Shirt Wala order with your order ID and phone or email.");

export default function TrackOrderPage() {
  return (
    <div className="container-page py-8 md:py-12">
      <h1 className="heading-display text-5xl">Track Your Order</h1>
      <p className="mb-8 mt-3 max-w-xl text-muted">Enter your order ID and the phone number or email used at checkout.</p>
      <TrackOrderForm />
    </div>
  );
}
