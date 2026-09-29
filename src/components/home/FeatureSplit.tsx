/**
 * Reusable image + copy split section (Bulk, Fitness...).
 */
import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button-styles";
import { cn } from "@/lib/utils/format";

interface FeatureSplitProps {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  text: string;
  bullets?: readonly string[];
  image: { src: string; alt: string; width: number; height: number };
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  tone?: "light" | "dark" | "surface";
  reverse?: boolean;
}

export function FeatureSplit({ id, eyebrow, title, text, bullets, image, primary, secondary, tone = "light", reverse }: FeatureSplitProps) {
  const dark = tone === "dark";
  return (
    <section
      aria-labelledby={`${id}-heading`}
      className={cn("py-16 md:py-24", dark && "on-dark bg-ink text-white", tone === "surface" && "bg-surface")}
    >
      <div className="container-page grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className={cn(reverse && "md:order-2")}>
          <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 768px) 45vw, 92vw" className="w-full rounded-card object-cover" />
        </div>
        <div>
          <p className={cn("mb-3 text-xs font-semibold uppercase tracking-[0.2em]", dark ? "text-brand" : "text-muted")}>{eyebrow}</p>
          <h2 id={`${id}-heading`} className="heading-display text-5xl md:text-6xl">
            {title}
          </h2>
          <p className={cn("mt-5 max-w-lg text-lg", dark ? "text-muted-dark" : "text-muted")}>{text}</p>
          {bullets && (
            <ul className="mt-6 grid grid-cols-2 gap-2 text-sm">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span aria-hidden="true" className="size-2 rounded-full bg-brand" />
                  {b}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={primary.href} className={buttonClass(dark ? "primary" : "dark", "lg")}>
              {primary.label}
            </Link>
            {secondary && (
              <Link href={secondary.href} className={buttonClass(dark ? "outline-light" : "outline", "lg")}>
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
