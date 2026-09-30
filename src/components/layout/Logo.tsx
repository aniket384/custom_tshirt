/**
 * Brand logo.
 *
 * Uses the brand badge at /public/brand/logo.webp (set in `siteConfig.logo`).
 * Original artwork: /public/brand/logo-original.jpg (1254×1254).
 * If `siteConfig.logo.src` is set to null, a text lockup is used as fallback.
 *
 * Sizes (circular badge, square box): sm 48px, md 48px mobile → 60px desktop,
 * lg 96px (footer).
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
  const box = { sm: "size-12", md: "size-12 md:size-[60px]", lg: "size-24" }[size];
  const px = { sm: 48, md: 60, lg: 96 }[size];

  return (
    <Link href="/" className={cn("inline-flex items-center gap-2", className)}>
      {siteConfig.logo.src ? (
        <Image
          src={siteConfig.logo.src}
          alt={siteConfig.name}
          width={px}
          height={px}
          // Fixed-size image → 1x/2x srcset only (no `sizes`). Header logo is
          // above the fold, so load it eagerly; footer logo stays lazy.
          loading={size === "lg" ? "lazy" : "eager"}
          className={cn("shrink-0 rounded-full", box)}
        />
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
