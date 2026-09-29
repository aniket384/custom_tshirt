/** Closing call-to-action band. */
import Link from "next/link";
import { buttonClass } from "@/components/ui/button-styles";
import { CrownMark } from "@/components/ui/icons";

export function FinalCta({
  title = "Your idea deserves a T-shirt.",
  cta = { href: "/custom-tshirt", label: "Create Your Custom T-Shirt" },
}: {
  title?: string;
  cta?: { href: string; label: string };
}) {
  return (
    <section aria-labelledby="final-cta-heading" className="on-dark bg-ink py-20 text-center text-white md:py-28">
      <div className="container-page">
        <CrownMark className="mx-auto h-8 w-auto text-brand" />
        <h2 id="final-cta-heading" className="heading-display mx-auto mt-6 max-w-4xl text-5xl md:text-7xl">
          {title}
        </h2>
        <Link href={cta.href} className={buttonClass("primary", "lg", "mt-10")}>
          {cta.label}
        </Link>
      </div>
    </section>
  );
}
