/**
 * Product card (Server Component).
 *
 * All key info (name, price, MRP, discount, colours, availability) is plain
 * HTML text inside a real <a href>. Only the wishlist heart and quick-add are
 * client islands.
 */
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/commerce/types";
import { productUrl } from "@/lib/commerce/product-utils";
import { ProductPrice } from "./ProductPrice";
import { WishlistButton } from "@/components/ecommerce/WishlistButton";
import { QuickAdd } from "@/components/ecommerce/QuickAdd";
import { buttonClass } from "@/components/ui/button-styles";

interface ProductCardProps {
  product: Product;
  /** Mark the first row of above-the-fold cards to load eagerly. */
  eager?: boolean;
  /** `sizes` hint for next/image — defaults to the 2/3/4-col grid. */
  sizes?: string;
}

export function ProductCard({ product: p, eager = false, sizes = "(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 46vw" }: ProductCardProps) {
  const href = productUrl(p);
  const hover = p.images.find((i) => i.kind === "model") ?? p.images[1];
  const defaultColor = p.colors[0];
  const soldOut = p.availability === "out_of_stock";

  const quickOptions = p.variants
    .filter((v) => v.colorId === defaultColor.id)
    .map((v) => ({ size: v.size, variantId: v.id, available: v.availability !== "out_of_stock" }));

  const firstAvailable = p.variants.find((v) => v.availability !== "out_of_stock");

  return (
    <article className="group relative flex h-full flex-col" aria-labelledby={`pc-${p.id}`}>
      <div className="relative overflow-hidden rounded-card bg-surface">
        {/* Whole card is clickable via the stretched title link below. */}
        <div className="block">
          <Image
            src={p.thumbnail.src}
            alt={p.thumbnail.alt}
            width={p.thumbnail.width}
            height={p.thumbnail.height}
            sizes={sizes}
            // First row on listing pages is the LCP candidate → preload (high fetch priority).
            preload={eager}
            loading={eager ? undefined : "lazy"}
            className="aspect-[4/5] w-full object-cover transition-opacity duration-300 motion-safe:group-hover:opacity-0"
          />
          {hover && (
            <Image
              src={hover.src}
              alt=""
              width={hover.width}
              height={hover.height}
              sizes={sizes}
              loading="lazy"
              className="absolute inset-0 aspect-[4/5] w-full object-cover opacity-0 transition-opacity duration-300 motion-safe:group-hover:opacity-100"
            />
          )}
        </div>
        {p.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink">
            {p.badge}
          </span>
        )}
        <div className="absolute right-2 top-2 z-10">
          <WishlistButton
            item={{
              productId: p.id,
              slug: p.slug,
              name: p.name,
              image: p.thumbnail.src,
              price: p.price,
              compareAtPrice: p.compareAtPrice,
              defaultVariantId: firstAvailable?.id ?? null,
              defaultColorName: p.colors.find((c) => c.id === firstAvailable?.colorId)?.name ?? defaultColor.name,
              defaultSize: firstAvailable?.size ?? p.sizes[0],
              isCustomizable: p.isCustomizable,
            }}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1">
        <h3 id={`pc-${p.id}`} className="text-sm font-semibold leading-snug md:text-base">
          <Link href={href} className="after:absolute after:inset-0 after:z-0 hover:underline underline-offset-4">
            {p.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-xs text-muted md:text-sm">{p.shortDescription}</p>
        <ProductPrice price={p.price} compareAtPrice={p.compareAtPrice} className="mt-1" />

        <div className="mt-1 flex items-center gap-1.5">
          <span className="sr-only">Available colours:</span>
          <ul className="flex items-center gap-1.5" aria-label={`Colours: ${p.colors.map((c) => c.name).join(", ")}`}>
            {p.colors.slice(0, 5).map((c) => (
              <li key={c.id} title={c.name} className="size-3.5 rounded-full border border-black/20" style={{ backgroundColor: c.hex }}>
                <span className="sr-only">{c.name}</span>
              </li>
            ))}
          </ul>
          {p.colors.length > 5 && <span className="text-xs text-muted">+{p.colors.length - 5}</span>}
        </div>
        {soldOut && <p className="text-xs font-semibold text-sale">Out of stock</p>}

        {/* z-10 keeps the controls above the stretched card link */}
        <div className="relative z-10 mt-auto pt-3">
          {p.isCustomizable ? (
            <Link
              href={p.customizerPreset ? `/custom-tshirt/${p.customizerPreset}` : "/custom-tshirt"}
              className={buttonClass("outline", "sm", "w-full min-h-11 text-xs")}
            >
              Customise<span className="sr-only"> {p.name}</span>
            </Link>
          ) : soldOut ? null : (
            <QuickAdd
              productId={p.id}
              slug={p.slug}
              name={p.name}
              image={p.thumbnail.src}
              colorName={defaultColor.name}
              price={p.price}
              compareAtPrice={p.compareAtPrice}
              options={quickOptions}
            />
          )}
        </div>
      </div>
    </article>
  );
}
