"use client";
/**
 * One cart line: image, name, variant, custom design details, quantity
 * stepper, remove / save-for-later. Shared by the drawer and the cart page.
 */
import Image from "next/image";
import Link from "next/link";
import { cartActions, MAX_LINE_QTY } from "@/lib/store/cart";
import { wishlistActions } from "@/lib/store/wishlist";
import { toast } from "@/lib/store/toast";
import { PLACEMENT_LABELS } from "@/data/options";
import type { CartLine } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/utils/format";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";

interface Props {
  line: CartLine;
  compact?: boolean;
  /** Called when a link inside the line is followed (e.g. close the drawer). */
  onNavigate?: () => void;
}

export function CartLineItem({ line, compact = false, onNavigate }: Props) {
  const title = line.custom ? `${line.name} (custom)` : line.name;
  const href = line.slug ? `/product/${line.slug}` : "/custom-tshirt";

  return (
    <article className="flex gap-4 py-4" aria-label={`${title}, ${line.colorName}, size ${line.size}`}>
      <Link href={href} onClick={onNavigate} className="shrink-0" tabIndex={-1} aria-hidden="true">
        <Image src={line.image} alt="" width={96} height={120} className="h-[120px] w-24 rounded-lg bg-surface object-cover" />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold leading-snug">
            <Link href={href} onClick={onNavigate} className="hover:underline underline-offset-4">
              {title}
            </Link>
          </h3>
          <p className="shrink-0 text-sm font-semibold">{formatPrice(line.unitPrice * line.quantity)}</p>
        </div>
        <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-2 text-xs text-muted">
          <dt>Colour:</dt>
          <dd>{line.colorName}</dd>
          <dt>Size:</dt>
          <dd>{line.size}</dd>
          <dt>Unit price:</dt>
          <dd>{formatPrice(line.unitPrice)}</dd>
          {line.custom && (
            <>
              <dt>Style:</dt>
              <dd>{line.custom.shirtTypeName}</dd>
              <dt>Print:</dt>
              <dd>{PLACEMENT_LABELS[line.custom.placement]}</dd>
              {line.custom.nameText && (
                <>
                  <dt>Name:</dt>
                  <dd className="break-words">{line.custom.nameText}</dd>
                </>
              )}
              {line.custom.customText && (
                <>
                  <dt>Text:</dt>
                  <dd className="break-words">{line.custom.customText}</dd>
                </>
              )}
              {line.custom.quoteText && !compact && (
                <>
                  <dt>Quote:</dt>
                  <dd className="break-words">{line.custom.quoteText}</dd>
                </>
              )}
              <dt>Design file:</dt>
              <dd className="break-all">{line.custom.uploadedFileName ?? "None (text only)"}</dd>
            </>
          )}
        </dl>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          {!line.savedForLater && (
            <div className="inline-flex items-center rounded-full border border-line" role="group" aria-label={`Quantity for ${title}`}>
              <button
                type="button"
                onClick={() => cartActions.setQuantity(line.lineId, line.quantity - 1)}
                disabled={line.quantity <= 1}
                aria-label={`Decrease quantity of ${title}`}
                className="grid size-10 place-items-center rounded-full disabled:opacity-40"
              >
                <MinusIcon size={16} />
              </button>
              <output className="w-8 text-center text-sm font-semibold" aria-live="polite" aria-label={`Quantity ${line.quantity}`}>
                {line.quantity}
              </output>
              <button
                type="button"
                onClick={() => cartActions.setQuantity(line.lineId, line.quantity + 1)}
                disabled={line.quantity >= MAX_LINE_QTY}
                aria-label={`Increase quantity of ${title}`}
                className="grid size-10 place-items-center rounded-full disabled:opacity-40"
              >
                <PlusIcon size={16} />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => cartActions.remove(line.lineId)}
            className="min-h-10 text-xs font-semibold underline underline-offset-4"
          >
            Remove<span className="sr-only"> {title}</span>
          </button>
          {!compact && (
            <button
              type="button"
              onClick={() => cartActions.toggleSaveForLater(line.lineId)}
              className="min-h-10 text-xs font-semibold underline underline-offset-4"
            >
              {line.savedForLater ? "Move to cart" : "Save for later"}
              <span className="sr-only"> — {title}</span>
            </button>
          )}
          {!compact && !line.custom && line.slug && (
            <button
              type="button"
              onClick={() => {
                wishlistActions.toggle({
                  productId: line.productId,
                  slug: line.slug!,
                  name: line.name,
                  image: line.image,
                  price: line.unitPrice,
                  compareAtPrice: line.compareAtPrice,
                  defaultVariantId: line.variantId,
                  defaultColorName: line.colorName,
                  defaultSize: line.size,
                  isCustomizable: false,
                });
                cartActions.remove(line.lineId);
                toast(`${line.name} moved to wishlist`);
              }}
              className="min-h-10 text-xs font-semibold underline underline-offset-4"
            >
              Move to wishlist<span className="sr-only"> — {title}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
