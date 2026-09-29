import Link from "next/link";
import { buttonClass } from "@/components/ui/button-styles";

export default function ProductNotFound() {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="heading-display text-5xl">Product not found</h1>
      <p className="mt-3 text-muted">This product may no longer be available.</p>
      <Link href="/shop" className={buttonClass("dark", "lg", "mt-8")}>
        Browse all T-shirts
      </Link>
    </div>
  );
}
