/** /wishlist — private (noindex). */
import type { Metadata } from "next";
import { WishlistPageClient } from "@/components/ecommerce/WishlistPageClient";
import { noindexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = noindexMetadata("Wishlist", "/wishlist");

export default function WishlistPage() {
  return (
    <div className="container-page py-8 md:py-12">
      <h1 className="heading-display mb-8 text-5xl">Wishlist</h1>
      <WishlistPageClient />
    </div>
  );
}
