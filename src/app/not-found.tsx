/** Global 404. */
import Link from "next/link";
import { buttonClass } from "@/components/ui/button-styles";
import { CrownMark } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <CrownMark className="h-10 w-auto text-brand [filter:drop-shadow(0_0_0.5px_#0e0e0e)]" />
      <p className="heading-display mt-6 text-8xl">404</p>
      <h1 className="heading-display mt-2 text-4xl">This page went off-print</h1>
      <p className="mt-3 max-w-md text-muted">The page you are looking for doesn&apos;t exist or has moved. Try one of these instead:</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/shop" className={buttonClass("dark", "lg")}>
          Shop T-Shirts
        </Link>
        <Link href="/custom-tshirt" className={buttonClass("primary", "lg")}>
          Create Your T-Shirt
        </Link>
        <Link href="/search" className={buttonClass("outline", "lg")}>
          Search
        </Link>
      </div>
    </div>
  );
}
