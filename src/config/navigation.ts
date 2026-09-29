/**
 * Navigation config — header, mobile menu and footer read from here, so
 * adding a page to the menu is a one-line change.
 * All entries are real URLs (crawlable, work without JavaScript).
 */
import { siteConfig } from "./site";

export interface NavLink {
  label: string;
  href: string;
  /** Optional sub-links shown in the desktop dropdown / mobile accordion. */
  children?: NavLink[];
}

export const mainNav: NavLink[] = [
  {
    label: "Shop",
    href: "/shop",
    children: [
      { label: "All T-Shirts", href: "/shop" },
      { label: "Printed T-Shirts", href: "/shop/printed-t-shirts" },
      { label: "Oversized T-Shirts", href: "/shop/oversized-t-shirts" },
      { label: "Couple T-Shirts", href: "/shop/couple-t-shirts" },
      { label: "Kids T-Shirts", href: "/shop/kids-t-shirts" },
      { label: "Family T-Shirts", href: "/shop/family-t-shirts" },
      { label: "Gym T-Shirts", href: "/shop/gym-t-shirts" },
      { label: "Corporate T-Shirts", href: "/shop/corporate-t-shirts" },
      { label: "Hoodies", href: "/shop/hoodies" },
    ],
  },
  {
    label: "Customise",
    href: "/custom-tshirt",
    children: [
      { label: "T-Shirt Customiser", href: "/custom-tshirt" },
      { label: "Photo T-Shirts", href: "/custom-tshirt/photo-t-shirts" },
      { label: "Name T-Shirts", href: "/custom-tshirt/name-t-shirts" },
      { label: "Quote T-Shirts", href: "/custom-tshirt/quote-t-shirts" },
      { label: "Couple T-Shirts", href: "/custom-tshirt/couple-t-shirts" },
      { label: "Custom Hoodies", href: "/custom-tshirt/hoodies" },
    ],
  },
  { label: "Collections", href: "/collections" },
  { label: "Bulk Orders", href: "/bulk-orders" },
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Best Sellers", href: "/collections/best-sellers" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "Printed T-Shirts", href: "/shop/printed-t-shirts" },
      { label: "Custom T-Shirts", href: "/shop/custom-t-shirts" },
      { label: "Oversized", href: "/shop/oversized-t-shirts" },
      { label: "Couple", href: "/shop/couple-t-shirts" },
      { label: "Kids", href: "/shop/kids-t-shirts" },
      { label: "Hoodies", href: "/shop/hoodies" },
    ],
  },
  {
    title: "Custom",
    links: [
      { label: "Customise", href: "/custom-tshirt" },
      { label: "Bulk Orders", href: "/bulk-orders" },
      { label: "Corporate", href: "/shop/corporate-t-shirts" },
      { label: "Events", href: "/shop/bulk-event-t-shirts" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Track Order", href: "/track-order" },
      { label: "Shipping", href: "/shipping-policy" },
      { label: "Returns", href: "/returns" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Instagram", href: siteConfig.social.instagram },
    ],
  },
];

export const legalNav: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Returns", href: "/returns" },
];
