/**
 * Section wrapper with a consistent heading block. Keeps homepage and
 * landing pages visually consistent (spacing, eyebrow, H2, action link).
 */
import Link from "next/link";
import { cn } from "@/lib/utils/format";
import { ArrowRightIcon } from "./icons";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  action?: { href: string; label: string };
  tone?: "light" | "dark" | "surface";
  className?: string;
  children: React.ReactNode;
}

export function Section({ id, eyebrow, title, intro, action, tone = "light", className, children }: SectionProps) {
  const dark = tone === "dark";
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(
        "py-14 md:py-20",
        dark && "on-dark bg-ink text-white",
        tone === "surface" && "bg-surface",
        className,
      )}
    >
      <div className="container-page">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className={cn("mb-2 text-xs font-semibold uppercase tracking-[0.2em]", dark ? "text-brand" : "text-muted")}>{eyebrow}</p>
            )}
            <h2 id={headingId} className="heading-display text-4xl md:text-5xl">
              {title}
            </h2>
            {intro && <p className={cn("mt-3 text-base md:text-lg", dark ? "text-muted-dark" : "text-muted")}>{intro}</p>}
          </div>
          {action && (
            <Link
              href={action.href}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline",
                dark ? "text-white" : "text-ink",
              )}
            >
              {action.label}
              <ArrowRightIcon size={16} />
            </Link>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
