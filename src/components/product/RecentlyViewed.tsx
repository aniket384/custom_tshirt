"use client";
/** Recently viewed rail (localStorage). Renders nothing until hydrated. */
import Image from "next/image";
import Link from "next/link";
import { useHydrated } from "@/lib/store/create-store";
import { useRecentlyViewed } from "@/lib/store/recently-viewed";
import { formatPrice } from "@/lib/utils/format";

export function RecentlyViewed({ excludeSlug }: { excludeSlug?: string }) {
  const hydrated = useHydrated();
  const items = useRecentlyViewed().filter((i) => i.slug !== excludeSlug);
  if (!hydrated || items.length === 0) return null;
  return (
    <section aria-labelledby="recent-heading" className="container-page py-12">
      <h2 id="recent-heading" className="heading-display text-3xl">
        Recently viewed
      </h2>
      <ul className="no-scrollbar mt-6 flex gap-3 overflow-x-auto">
        {items.map((i) => (
          <li key={i.slug} className="w-36 shrink-0 md:w-44">
            <Link href={`/product/${i.slug}`} className="group block">
              <Image src={i.image} alt="" width={176} height={220} sizes="176px" className="aspect-[4/5] w-full rounded-lg bg-surface object-cover" />
              <p className="mt-2 text-sm font-medium group-hover:underline">{i.name}</p>
              <p className="text-sm text-muted">{formatPrice(i.price)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
