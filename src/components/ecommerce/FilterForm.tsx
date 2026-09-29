"use client";
/**
 * Filter form — a real GET <form>, so filtering works without JavaScript and
 * agents can submit it. With JS, changes apply instantly via router.push
 * (inside a transition, so typing/clicking stays responsive — good INP).
 */
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import type { FacetGroup } from "@/lib/commerce/facets";
import type { ProductFilters } from "@/lib/commerce/catalog";
import { buttonClass } from "@/components/ui/button-styles";
import { ChevronDownIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils/format";

interface Props {
  groups: FacetGroup[];
  filters: ProductFilters;
  basePath: string;
  /** Apply on every change (desktop). Mobile drawer applies on "Show results". */
  autoApply?: boolean;
  onApplied?: () => void;
  idPrefix: string;
}

/** Serialise form data into ?key=a,b query (repeat keys merged). */
function toQuery(form: HTMLFormElement): string {
  const data = new FormData(form);
  const map = new Map<string, string[]>();
  for (const [k, v] of data.entries()) {
    if (typeof v !== "string" || !v) continue;
    map.set(k, [...(map.get(k) ?? []), v]);
  }
  const qs = new URLSearchParams();
  for (const [k, vals] of map) {
    if (k === "sort" && vals[0] === "featured") continue;
    qs.set(k, vals.join(","));
  }
  return qs.toString();
}

export function FilterForm({ groups, filters, basePath, autoApply = false, onApplied, idPrefix }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const apply = (form: HTMLFormElement) => {
    const qs = toQuery(form);
    startTransition(() => router.push(qs ? `${basePath}?${qs}` : basePath, { scroll: false }));
    onApplied?.();
  };

  return (
    <form
      action={basePath}
      method="get"
      aria-label="Product filters"
      aria-busy={pending}
      onSubmit={(e) => {
        e.preventDefault();
        apply(e.currentTarget);
      }}
      onChange={(e) => {
        if (autoApply) apply(e.currentTarget);
      }}
      className={cn("transition-opacity", pending && "opacity-60")}
    >
      {filters.sort !== "featured" && <input type="hidden" name="sort" value={filters.sort} />}
      <div className="divide-y divide-line border-y border-line">
        {groups.map((g) => {
          const selected = filters[g.key];
          return (
            <details key={g.key} open={selected.length > 0 || ["category", "size", "price"].includes(g.key)} className="group py-1">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-sm font-semibold [&::-webkit-details-marker]:hidden">
                <span>
                  {g.label}
                  {selected.length > 0 && <span className="ml-2 rounded-full bg-brand px-2 py-0.5 text-xs">{selected.length}</span>}
                </span>
                <ChevronDownIcon size={16} className="transition-transform group-open:rotate-180" />
              </summary>
              <fieldset className="pb-4">
                <legend className="sr-only">Filter by {g.label}</legend>
                <ul className={g.key === "size" ? "flex flex-wrap gap-2" : "space-y-1"}>
                  {g.options.map((o) => {
                    const id = `${idPrefix}-${g.key}-${o.value}`;
                    const checked = selected.includes(o.value);
                    if (g.key === "size") {
                      return (
                        <li key={o.value}>
                          <input id={id} type="checkbox" name={g.key} value={o.value} defaultChecked={checked} className="peer sr-only" />
                          <label
                            htmlFor={id}
                            className="inline-flex min-h-10 min-w-11 cursor-pointer items-center justify-center rounded-md border border-line bg-white px-2 text-xs font-semibold peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-ink"
                          >
                            <span className="sr-only">Size </span>
                            {o.label}
                          </label>
                        </li>
                      );
                    }
                    return (
                      <li key={o.value}>
                        <label htmlFor={id} className="flex min-h-10 cursor-pointer items-center gap-3 text-sm">
                          <input id={id} type="checkbox" name={g.key} value={o.value} defaultChecked={checked} className="size-5 accent-ink" />
                          {o.hex && <span aria-hidden="true" className="size-4 rounded-full border border-black/20" style={{ backgroundColor: o.hex }} />}
                          <span className="flex-1">{o.label}</span>
                          <span className="text-xs text-muted">({o.count})</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
            </details>
          );
        })}
      </div>
      <div className={cn("mt-4 flex gap-2", autoApply && "sr-only focus-within:not-sr-only")}>
        <button type="submit" className={buttonClass("dark", "md", "flex-1")}>
          {autoApply ? "Apply filters" : "Show results"}
        </button>
        <Link href={basePath} onClick={onApplied} className={buttonClass("outline", "md")}>
          Clear all
        </Link>
      </div>
    </form>
  );
}
