"use client";
/** Mobile filter drawer — wraps the same FilterForm used on desktop. */
import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { FilterIcon } from "@/components/ui/icons";
import { FilterForm } from "./FilterForm";
import type { FacetGroup } from "@/lib/commerce/facets";
import type { ProductFilters } from "@/lib/commerce/catalog";

export function FilterDrawer(props: { groups: FacetGroup[]; filters: ProductFilters; basePath: string; activeCount: number }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink px-4 text-sm font-semibold lg:hidden"
      >
        <FilterIcon size={18} />
        Filters{props.activeCount > 0 && ` (${props.activeCount})`}
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Filters" side="left">
        <div className="p-5">
          <FilterForm {...props} idPrefix="m" onApplied={() => setOpen(false)} />
        </div>
      </Drawer>
    </>
  );
}
