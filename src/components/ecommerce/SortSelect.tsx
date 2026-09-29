"use client";
/**
 * Sort control. A GET form carrying the current filters as hidden inputs;
 * with JS it navigates on change, without JS the "Sort" button submits.
 */
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { FILTER_KEYS, SORT_OPTIONS, type ProductFilters } from "@/lib/commerce/catalog";

export function SortSelect({ filters, basePath }: { filters: ProductFilters; basePath: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const hrefFor = (sort: string) => {
    const qs = new URLSearchParams();
    for (const k of FILTER_KEYS) if (filters[k].length) qs.set(k, filters[k].join(","));
    if (sort !== "featured") qs.set("sort", sort);
    const s = qs.toString();
    return s ? `${basePath}?${s}` : basePath;
  };

  return (
    <form action={basePath} method="get" className="flex items-center gap-2" aria-busy={pending}>
      {FILTER_KEYS.map((k) => (filters[k].length ? <input key={k} type="hidden" name={k} value={filters[k].join(",")} /> : null))}
      <label htmlFor="sort" className="text-sm text-muted">
        Sort by
      </label>
      <select
        id="sort"
        name="sort"
        defaultValue={filters.sort}
        onChange={(e) => startTransition(() => router.push(hrefFor(e.target.value), { scroll: false }))}
        className="min-h-11 rounded-full border border-line bg-white px-3 text-sm font-medium"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <noscript>
        <button type="submit" className="min-h-11 rounded-full border border-ink px-3 text-sm">
          Sort
        </button>
      </noscript>
    </form>
  );
}
