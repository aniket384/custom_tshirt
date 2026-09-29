"use client";
/**
 * Heart toggle. aria-pressed conveys state to assistive tech; the label
 * names the product so agents know exactly what it does.
 */
import { useHydrated } from "@/lib/store/create-store";
import { useWishlist, wishlistActions, type WishlistItem } from "@/lib/store/wishlist";
import { toast } from "@/lib/store/toast";
import { HeartIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils/format";

interface Props {
  item: WishlistItem;
  variant?: "icon" | "full";
  className?: string;
}

export function WishlistButton({ item, variant = "icon", className }: Props) {
  const { items } = useWishlist();
  const hydrated = useHydrated();
  const active = hydrated && items.some((i) => i.productId === item.productId);
  const label = active ? `Remove ${item.name} from wishlist` : `Add ${item.name} to wishlist`;

  const onClick = () => {
    const added = wishlistActions.toggle(item);
    toast(added ? `${item.name} added to wishlist` : `${item.name} removed from wishlist`);
  };

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(
          "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink px-5 text-sm font-semibold transition-colors hover:bg-surface",
          className,
        )}
      >
        <HeartIcon filled={active} className={active ? "text-sale" : ""} />
        {active ? "Wishlisted" : "Add to Wishlist"}
        <span className="sr-only"> — {item.name}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-11 place-items-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition-transform hover:scale-105 active:scale-95",
        className,
      )}
    >
      <HeartIcon filled={active} className={active ? "text-sale" : ""} />
    </button>
  );
}
