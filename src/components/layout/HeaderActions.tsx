"use client";
/**
 * Header icon actions (search, account, wishlist, cart, mobile menu).
 * Account / wishlist / cart are real links; the cart icon ALSO has a
 * JS-enhanced drawer, but its href="/cart" still works without JS.
 */
import Link from "next/link";
import { useState } from "react";
import { useHydrated } from "@/lib/store/create-store";
import { cartActions, useCart } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";
import { BagIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "@/components/ui/icons";
import { SearchDialog, type SearchSuggestion } from "@/components/navigation/SearchDialog";
import { MobileNavigation } from "@/components/navigation/MobileNavigation";
import { CartDrawer } from "@/components/cart/CartDrawer";

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold leading-5 text-ink">
      {count > 99 ? "99+" : count}
    </span>
  );
}

const iconBtn = "relative grid size-11 place-items-center rounded-full hover:bg-surface";

export function HeaderActions({ searchIndex }: { searchIndex: SearchSuggestion[] }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const hydrated = useHydrated();
  const { totals } = useCart();
  const { items } = useWishlist();
  const cartCount = hydrated ? totals.itemCount : 0;
  const wishCount = hydrated ? items.length : 0;

  return (
    <>
      <div className="flex items-center gap-0.5">
        <button type="button" onClick={() => setSearchOpen(true)} className={iconBtn} aria-label="Search" aria-haspopup="dialog">
          <SearchIcon />
        </button>
        <Link href="/account" className={`${iconBtn} hidden sm:grid`} aria-label="Account">
          <UserIcon />
        </Link>
        <Link href="/wishlist" className={`${iconBtn} hidden sm:grid`} aria-label={`Wishlist, ${wishCount} items`}>
          <HeartIcon />
          <CountBadge count={wishCount} />
        </Link>
        <Link
          href="/cart"
          className={iconBtn}
          aria-label={`Cart, ${cartCount} items`}
          onClick={(e) => {
            // Progressive enhancement: open the drawer instead of navigating.
            if (e.metaKey || e.ctrlKey || e.shiftKey) return;
            e.preventDefault();
            cartActions.openDrawer();
          }}
        >
          <BagIcon />
          <CountBadge count={cartCount} />
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className={`${iconBtn} lg:hidden`}
          aria-label="Open menu"
          aria-haspopup="dialog"
        >
          <MenuIcon />
        </button>
      </div>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} index={searchIndex} />
      <MobileNavigation open={menuOpen} onClose={() => setMenuOpen(false)} />
      <CartDrawer />
    </>
  );
}
