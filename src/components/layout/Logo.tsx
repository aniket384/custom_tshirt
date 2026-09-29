/**
 * Brand logo.
 *
 * Temporary text lockup "CUSTOM / T-SHIRT / WALA" with a crown accent.
 * To use the real logo: add /public/brand/logo.svg (or .png) and set
 * `siteConfig.logo.src` — this component switches to <Image> automatically.
 */
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { CrownMark } from "@/components/ui/icons";
import { cn } from "@/lib/utils/format";

interface LogoProps {
  /** "dark" = ink on light backgrounds; "light" = white on dark backgrounds. */
  tone?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  withTagline?: boolean;
  className?: string;
}

export function Logo({ tone = "dark", size = "md", withTagline = false, className }: LogoProps) {
  const text = tone === "light" ? "text-white" : "text-ink";
  const scale = { sm: "text-[0.8rem]", md: "text-[0.95rem]", lg: "text-[1.35rem]" }[size];

  return (
    <Link href="/" className={cn("inline-flex items-center gap-2", className)}>
      {siteConfig.logo.src ? (
        <Image src={siteConfig.logo.src} alt={siteConfig.name} width={siteConfig.logo.width} height={siteConfig.logo.height}/>
      ) : (
        <span className={cn("relative inline-flex flex-col font-display uppercase leading-[0.85] tracking-wide", text, scale)}>
          <CrownMark className="absolute -top-[0.7em] left-[0.1em] h-[0.8em] w-auto text-brand" />
          <span>Custom</span>{" "}
          <span className="rounded-sm bg-brand px-1 text-ink">T-Shirt</span>{" "}
          <span>Wala</span>
        </span>
      )}
      <span className="sr-only"> — home</span>
      {withTagline && (
        <span className={cn("font-marker text-sm leading-tight", tone === "light" ? "text-brand" : "text-muted")}>
          {siteConfig.tagline}
        </span>
      )}
    </Link>
  );
}
