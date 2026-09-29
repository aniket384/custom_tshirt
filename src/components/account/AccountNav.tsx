/** Account section navigation (real links). */
import Link from "next/link";

const links = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/profile", label: "Profile" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/track-order", label: "Track an order" },
];

export function AccountNav() {
  return (
    <nav aria-label="Account" className="min-w-0">
      <ul className="no-scrollbar flex gap-2 overflow-x-auto md:flex-col md:gap-1">
        {links.map((l) => (
          <li key={l.href} className="shrink-0">
            <Link href={l.href} className="flex min-h-11 items-center rounded-full px-4 text-sm font-medium hover:bg-surface md:rounded-lg">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
