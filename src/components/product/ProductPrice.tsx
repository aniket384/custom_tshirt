/**
 * Price block: selling price, MRP (struck through) and discount %.
 * Rendered as real text so crawlers, agents and screen readers can read it.
 */
import { discountPercent } from "@/lib/commerce/product-utils";
import { cn, formatPrice } from "@/lib/utils/format";

interface ProductPriceProps {
  price: number;
  compareAtPrice: number | null;
  size?: "sm" | "lg";
  className?: string;
  /** Show "Inclusive of all taxes" note (PDP). */
  showTaxNote?: boolean;
}

export function ProductPrice({ price, compareAtPrice, size = "sm", className, showTaxNote }: ProductPriceProps) {
  const off = discountPercent(price, compareAtPrice);
  return (
    <div className={className}>
      <p className={cn("flex flex-wrap items-baseline gap-x-2", size === "lg" ? "text-2xl" : "text-sm")}>
        <span className="font-semibold">
          <span className="sr-only">Price: </span>
          {formatPrice(price)}
        </span>
        {off !== null && compareAtPrice && (
          <>
            <span className={cn("text-muted line-through", size === "lg" ? "text-base" : "text-xs")}>
              <span className="sr-only">MRP: </span>
              {formatPrice(compareAtPrice)}
            </span>
            <span className={cn("font-semibold text-sale", size === "lg" ? "text-base" : "text-xs")}>{off}% off</span>
          </>
        )}
      </p>
      {showTaxNote && <p className="mt-1 text-xs text-muted">MRP inclusive of all taxes (demo pricing)</p>}
    </div>
  );
}
