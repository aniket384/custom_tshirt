/**
 * Responsive product grid: 2 cols mobile / 3 tablet / 4 desktop.
 * Uses a semantic list so the number of products is announced.
 */
import type { Product } from "@/lib/commerce/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  /** Number of cards to load eagerly (first row above the fold). */
  eagerCount?: number;
  label?: string;
}

export function ProductGrid({ products, eagerCount = 0, label = "Products" }: ProductGridProps) {
  return (
    <ul aria-label={label} className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
      {products.map((p, i) => (
        <li key={p.id}>
          <ProductCard product={p} eager={i < eagerCount} />
        </li>
      ))}
    </ul>
  );
}

/** Horizontal scroll rail for mobile, grid on desktop (homepage). */
export function ProductRail({ products, label }: { products: Product[]; label: string }) {
  return (
    <ul
      aria-label={label}
      className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 lg:grid-cols-4"
    >
      {products.map((p) => (
        <li key={p.id} className="w-[46%] shrink-0 snap-start md:w-auto">
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}
