/**
 * Category quick navigation directly under the hero — makes the whole
 * product range discoverable (and crawlable) in one glance.
 */
import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/commerce/types";
import { NoWrapTee } from "@/components/ui/NoWrapTee";

export function CategoryQuickNav({ categories }: { categories: Category[] }) {
  return (
    <nav aria-label="Shop by category" className="border-y border-line bg-white">
      <ul className="container-page no-scrollbar flex gap-4 overflow-x-auto py-5 md:gap-6 lg:justify-between">
        {categories.map((c) => (
          <li key={c.slug} className="shrink-0">
            <Link href={`/shop/${c.slug}`} className="group flex w-20 flex-col items-center gap-2 text-center md:w-24">
              <span className="relative size-16 overflow-hidden rounded-full border-2 border-transparent bg-surface transition-colors group-hover:border-brand md:size-20">
                <Image src={c.image.src} alt="" fill sizes="80px" className="object-cover object-top" />
              </span>
              <span className="text-xs font-semibold leading-tight md:text-sm">
                <NoWrapTee text={c.name} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
