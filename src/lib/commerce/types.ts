/**
 * Commerce domain types.
 *
 * These mirror what a real commerce backend (Shopify, Medusa, Saleor, a
 * custom API...) would return, so swapping the mock data layer for a real
 * one should only require a mapping function — not UI changes.
 *
 * Money is stored as an integer number of RUPEES (INR). If the backend uses
 * paise (Razorpay does), convert at the API boundary in `lib/commerce`.
 */

export type Currency = "INR";

export type Availability = "in_stock" | "out_of_stock" | "preorder" | "made_to_order";

export type Condition = "new";

export type Gender = "unisex" | "men" | "women" | "kids";

export type Fit = "regular" | "oversized" | "relaxed" | "slim" | "kids";

export type PrintType =
  | "screen-print"
  | "dtf"
  | "photo-print"
  | "name-print"
  | "quote-print"
  | "graphic-print"
  | "embroidery-look";

export type PrintPlacement = "front" | "back" | "front-back";

/** Occasions / "moments" a product is merchandised for. */
export type Occasion =
  | "birthday"
  | "couples"
  | "family"
  | "friends"
  | "gym"
  | "travel"
  | "college"
  | "events"
  | "corporate"
  | "everyday";

export type ColorId =
  | "black"
  | "white"
  | "yellow"
  | "red"
  | "pink"
  | "purple"
  | "navy"
  | "grey-melange"
  | "olive"
  | "maroon"
  | "sky-blue";

export type AdultSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";
export type KidsSize = "2-3Y" | "4-5Y" | "6-7Y" | "8-9Y" | "10-11Y" | "12-13Y";
export type Size = AdultSize | KidsSize;

export type CategorySlug =
  | "printed-t-shirts"
  | "custom-t-shirts"
  | "oversized-t-shirts"
  | "couple-t-shirts"
  | "kids-t-shirts"
  | "family-t-shirts"
  | "gym-t-shirts"
  | "corporate-t-shirts"
  | "bulk-event-t-shirts"
  | "hoodies";

export interface ProductColor {
  id: ColorId;
  name: string;
  /** Swatch colour. */
  hex: string;
}

export type ImageKind = "front" | "back" | "detail" | "model" | "closeup";

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  kind: ImageKind;
  /** Set when an image shows one specific colourway. */
  colorId?: ColorId;
}

/**
 * A purchasable SKU. One product has many variants (colour × size).
 * `id` is stable and URL-safe, e.g. "ctw-011-black-m".
 */
export interface ProductVariant {
  id: string;
  sku: string;
  productId: string;
  colorId: ColorId;
  size: Size;
  fit: Fit;
  availability: Availability;
  price: number;
  compareAtPrice: number | null;
  /** Barcode — must never be invented. `null` until supplied. */
  gtin: string | null;
}

export interface ProductSeo {
  title?: string;
  description?: string;
}

/** Fully normalised product used by every page and component. */
export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  brand: string;
  /** Parent SKU (also used as Merchant Center `item_group_id`). */
  sku: string;
  /** Never invented. `null` until the business supplies real identifiers. */
  gtin: string | null;
  mpn: string | null;
  /** Primary category (drives breadcrumbs + canonical merchandising). */
  category: CategorySlug;
  /** Every category the product should appear in (includes primary). */
  categories: CategorySlug[];
  collections: string[];
  price: number;
  compareAtPrice: number | null;
  currency: Currency;
  availability: Availability;
  condition: Condition;
  images: ProductImage[];
  thumbnail: ProductImage;
  variants: ProductVariant[];
  sizes: Size[];
  colors: ProductColor[];
  fit: Fit;
  gender: Gender;
  material: string;
  printType: PrintType;
  printPlacements: PrintPlacement[];
  occasion: Occasion[];
  tags: string[];
  badge: string | null;
  highlights: string[];
  care: string[];
  /** If true, the PDP routes shoppers to the customiser instead of direct add-to-cart. */
  isCustomizable: boolean;
  /** Customiser preset slug (see data/customizer.ts) used by "Customise this". */
  customizerPreset: string | null;
  isBestSeller: boolean;
  isNewArrival: boolean;
  seo: ProductSeo;
  /** ISO date string. */
  createdAt: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Short label for chips / nav. */
  shortName: string;
  h1: string;
  description: string;
  /** 1–2 paragraph SEO intro rendered above the grid. */
  intro: string;
  image: { src: string; alt: string };
  seo: ProductSeo;
}

export type CollectionKind = "style" | "moment" | "merch";

/** Rule-based collection. A product matches if it satisfies ANY listed rule. */
export interface CollectionRule {
  occasions?: Occasion[];
  printTypes?: PrintType[];
  tags?: string[];
  flag?: "bestseller" | "new";
}

export interface Collection {
  slug: string;
  name: string;
  kind: CollectionKind;
  h1: string;
  description: string;
  intro: string;
  image: { src: string; alt: string };
  rule: CollectionRule;
  seo: ProductSeo;
}

/* -------------------------------------------------------------------------- */
/* Cart / orders                                                              */
/* -------------------------------------------------------------------------- */

/** Details captured by the custom T-shirt builder. Stored on the cart line. */
export interface CustomDesign {
  shirtTypeId: string;
  shirtTypeName: string;
  colorId: ColorId;
  colorName: string;
  size: Size;
  placement: PrintPlacement;
  /** Personalisation — stored as plain text, always rendered as text (never HTML). */
  nameText: string;
  customText: string;
  quoteText: string;
  fontId: string;
  /** Only the file NAME is persisted. Blob URLs die on refresh; real storage comes later. */
  uploadedFileName: string | null;
  /** Remote URL once a real upload service exists (null in the prototype). */
  uploadedFileUrl: string | null;
}

export interface CartLine {
  /** Unique line id. Stock lines use the variant id; custom lines get a generated id. */
  lineId: string;
  productId: string;
  slug: string | null;
  name: string;
  image: string;
  variantId: string | null;
  colorName: string;
  size: Size;
  unitPrice: number;
  compareAtPrice: number | null;
  quantity: number;
  custom: CustomDesign | null;
  /** "Save for later" moves a line out of the active cart without deleting it. */
  savedForLater?: boolean;
}

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "printing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered";

export interface OrderEvent {
  status: OrderStatus;
  /** ISO string or null if the step has not happened yet. */
  at: string | null;
}

export interface Order {
  id: string;
  placedAt: string;
  status: OrderStatus;
  lines: CartLine[];
  subtotal: number;
  shipping: number | null;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  email: string;
  phone: string;
  shippingAddress: Address;
  timeline: OrderEvent[];
  isDemo: true;
}

export type PaymentMethod = "upi" | "card" | "netbanking" | "cod";

export interface Address {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}
