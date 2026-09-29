"use client";
/**
 * Mobile menu drawer. Uses <details> accordions for sub-menus (native,
 * keyboard-accessible, no extra state). Links are real <a> elements.
 */
import Link from "next/link";
import { mainNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Drawer } from "@/components/ui/Drawer";
import { ChevronDownIcon, InstagramIcon } from "@/components/ui/icons";

export function MobileNavigation({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Drawer open={open} onClose={onClose} title="Menu" side="left">
      <nav aria-label="Mobile" className="px-2 py-3">
        <ul>
          {mainNav.map((item) => (
            <li key={item.href} className="border-b border-line last:border-0">
              {item.children ? (
                <details className="group">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-3 text-lg font-semibold">
                    {item.label}
                    <ChevronDownIcon className="transition-transform group-open:rotate-180" />
                  </summary>
                  <ul className="pb-3 pl-3">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} onClick={onClose} className="flex min-h-11 items-center px-3 text-base text-muted hover:text-ink">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : (
                <Link href={item.href} onClick={onClose} className="flex min-h-14 items-center px-3 text-lg font-semibold">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <ul className="mt-4 grid grid-cols-2 gap-2 px-3 text-sm">
          {[
            { href: "/account", label: "Account" },
            { href: "/wishlist", label: "Wishlist" },
            { href: "/track-order", label: "Track Order" },
            { href: "/faq", label: "Help & FAQ" },
          ].map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={onClose} className="flex min-h-11 items-center rounded-lg bg-surface px-3">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <a
          href={siteConfig.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-3 mt-6 flex min-h-11 items-center gap-2 text-sm font-semibold"
        >
          <InstagramIcon /> Follow {siteConfig.social.instagramHandle}
          <span className="sr-only">(opens Instagram in a new tab)</span>
        </a>
      </nav>
    </Drawer>
  );
}
