/** /checkout — private (noindex). Frontend-only demo checkout. */
import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { noindexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = noindexMetadata("Checkout", "/checkout");

export default function CheckoutPage() {
  return (
    <div className="container-page py-8 md:py-12">
      <h1 className="heading-display mb-8 text-5xl">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
