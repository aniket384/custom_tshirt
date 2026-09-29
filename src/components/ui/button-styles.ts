/**
 * Shared button styles for <button> and <Link>. Keeping them as class
 * strings (not a component) lets us style real links as buttons without
 * wrapping them in JS — important for crawlability and agents.
 *
 * All sizes meet a ≥44px touch target.
 */
import { cn } from "@/lib/utils/format";

type Variant = "primary" | "dark" | "outline" | "outline-light" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 select-none";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-ink hover:bg-brand-deep",
  dark: "bg-ink text-white hover:bg-ink-soft",
  outline: "border border-ink text-ink hover:bg-ink hover:text-white",
  "outline-light": "border border-white/70 text-white hover:bg-white hover:text-ink",
  ghost: "text-ink hover:bg-surface",
  link: "text-ink underline underline-offset-4 hover:no-underline rounded-none",
};

const sizes: Record<Size, string> = {
  sm: "min-h-11 px-4 text-sm",
  md: "min-h-12 px-6 text-sm",
  lg: "min-h-14 px-8 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra?: string) {
  return cn(base, variants[variant], variant === "link" ? "" : sizes[size], extra);
}
