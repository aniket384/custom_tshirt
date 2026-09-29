/** /cart — private utility page (noindex). */
import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/CartPageClient";
import { noindexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = noindexMetadata("Your Cart", "/cart");

export default function CartPage() {
  return (
    <div className="container-page py-8 md:py-12">
      <h1 className="heading-display mb-8 text-5xl">Your Cart</h1>
      <CartPageClient />
    </div>
  );
}
