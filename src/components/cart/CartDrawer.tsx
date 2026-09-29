"use client";
/**
 * Slide-over mini cart. Opens automatically after "Add to cart".
 * Checkout / cart links are real links (agents can follow them directly).
 */
import Link from "next/link";
import { useStore } from "@/lib/store/create-store";
import { cartActions, cartDrawerStore, useCart } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils/format";
import { Drawer } from "@/components/ui/Drawer";
import { buttonClass } from "@/components/ui/button-styles";
import { CartLineItem } from "./CartLineItem";

export function CartDrawer() {
  const { open } = useStore(cartDrawerStore);
  const { lines, totals } = useCart();
  const active = lines.filter((l) => !l.savedForLater);
  const close = cartActions.closeDrawer;

  return (
    <Drawer
      open={open}
      onClose={close}
      title={`Your cart (${totals.itemCount})`}
      footer={
        active.length > 0 ? (
          <div className="space-y-3">
            <p className="flex justify-between text-base font-semibold">
              <span>Subtotal</span>
              <span>{formatPrice(totals.subtotal)}</span>
            </p>
            <p className="text-xs text-muted">Shipping and any coupons are calculated at checkout.</p>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/cart" onClick={close} className={buttonClass("outline", "md")}>
                View cart
              </Link>
              <Link href="/checkout" onClick={close} className={buttonClass("primary", "md")}>
                Checkout
              </Link>
            </div>
          </div>
        ) : null
      }
    >
      <div className="px-5">
        {active.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg font-semibold">Your cart is empty</p>
            <p className="mt-2 text-sm text-muted">Find a design you love or create your own.</p>
            <div className="mt-6 flex flex-col gap-2">
              <Link href="/shop" onClick={close} className={buttonClass("dark")}>
                Shop T-Shirts
              </Link>
              <Link href="/custom-tshirt" onClick={close} className={buttonClass("outline")}>
                Create Your T-Shirt
              </Link>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {active.map((l) => (
              <li key={l.lineId}>
                <CartLineItem line={l} compact onNavigate={close} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Drawer>
  );
}
