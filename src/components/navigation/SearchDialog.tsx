"use client";
/**
 * Search dialog with instant suggestions.
 *
 * The search box is a plain GET <form action="/search"> — it works without
 * JavaScript and agents can submit it directly. Suggestions are computed from
 * a small index passed from the server (no API round-trips).
 */
import Link from "next/link";
import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { SearchIcon } from "@/components/ui/icons";
import { trackEvent } from "@/lib/analytics/track";

export interface SearchSuggestion {
  label: string;
  href: string;
  type: "Product" | "Category" | "Collection" | "Customise";
}

interface Props {
  open: boolean;
  onClose: () => void;
  index: SearchSuggestion[];
}

const POPULAR = ["oversized", "couple", "photo print", "hoodie", "gym", "kids"];

export function SearchDialog({ open, onClose, index }: Props) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const results = query.length >= 2 ? index.filter((s) => s.label.toLowerCase().includes(query)).slice(0, 8) : [];

  return (
    <Drawer open={open} onClose={onClose} title="Search the store" side="center">
      <div className="p-5">
        <form
          action="/search"
          method="get"
          role="search"
          onSubmit={() => {
            trackEvent("search", { search_term: q });
            onClose();
          }}
        >
          <label htmlFor="site-search" className="sr-only">
            Search products, categories and collections
          </label>
          <div className="flex items-center gap-2 rounded-full border border-ink px-4 focus-within:ring-2 focus-within:ring-ink">
            <SearchIcon />
            <input
              id="site-search"
              name="q"
              type="search"
              autoComplete="off"
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search T-shirts, hoodies, couple tees…"
              className="min-h-12 w-full bg-transparent text-base outline-none"
              aria-controls="search-suggestions"
            />
            <button type="submit" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold">
              Search
            </button>
          </div>
        </form>

        <div id="search-suggestions" className="mt-5" aria-live="polite">
          {query.length >= 2 ? (
            results.length ? (
              <ul className="divide-y divide-line">
                {results.map((r) => (
                  <li key={r.href + r.label}>
                    <Link href={r.href} onClick={onClose} className="flex min-h-12 items-center justify-between gap-3 py-2 hover:underline">
                      <span>{r.label}</span>
                      <span className="text-xs uppercase tracking-wide text-muted">{r.type}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">No quick matches. Press Search to see all results for “{q}”.</p>
            )
          ) : (
            <>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Popular searches</p>
              <ul className="flex flex-wrap gap-2">
                {POPULAR.map((p) => (
                  <li key={p}>
                    <Link
                      href={`/search?q=${encodeURIComponent(p)}`}
                      onClick={onClose}
                      className="inline-flex min-h-10 items-center rounded-full border border-line px-4 text-sm hover:border-ink"
                    >
                      {p}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </Drawer>
  );
}
