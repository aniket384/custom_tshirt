/**
 * Desktop primary navigation (Server Component).
 * Dropdowns use CSS (:hover / :focus-within) — no JS, links always in HTML.
 */
import Link from "next/link";
import { mainNav } from "@/config/navigation";
import { ChevronDownIcon } from "@/components/ui/icons";

export function DesktopNavigation() {
  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {mainNav.map((item) => (
          <li key={item.href} className="group relative">
            <Link
              href={item.href}
              className="inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-medium hover:bg-surface"
            >
              {item.label}
              {item.children && <ChevronDownIcon size={14} className="opacity-60" />}
            </Link>
            {item.children && (
              <div className="invisible absolute left-0 top-full z-40 pt-2 opacity-0 transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <ul className="w-60 rounded-xl border border-line bg-white p-2 shadow-xl" aria-label={`${item.label} menu`}>
                  {item.children.map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} className="block rounded-lg px-3 py-2.5 text-sm hover:bg-surface">
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
