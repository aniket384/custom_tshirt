/**
 * Visible breadcrumb trail. Pair with breadcrumbJsonLd() using the SAME
 * crumbs so structured data matches what users see.
 */
import Link from "next/link";
import type { Crumb } from "@/lib/seo/jsonld";
import { ChevronRightIcon } from "@/components/ui/icons";

export function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-1">
              {last ? (
                <span aria-current="page" className="text-ink">
                  {c.name}
                </span>
              ) : (
                <>
                  <Link href={c.href} className="hover:text-ink hover:underline underline-offset-4">
                    {c.name}
                  </Link>
                  <ChevronRightIcon size={14} />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
