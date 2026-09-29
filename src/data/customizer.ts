/**
 * Custom T-shirt builder configuration (fully data-driven).
 *
 * - SHIRT_TYPES: base garments and their demo base price.
 * - PLACEMENT_PRICES / PERSONALISATION_PRICE: demo surcharges.
 * - BULK_TIERS: demo quantity discounts.
 * - CUSTOMIZER_PRESETS: SEO landing pages at /custom-tshirt/[category] that
 *   open the builder with sensible defaults.
 *
 * All prices are DEMO values for the prototype. Replace with real pricing
 * from the backend (see docs/BACKEND-INTEGRATION.md).
 */
import type { ColorId, PrintPlacement, Size } from "@/lib/commerce/types";

export interface ShirtType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  colors: ColorId[];
  sizes: Size[];
  /** Silhouette used by the SVG preview. */
  silhouette: "tee" | "oversized" | "longsleeve" | "hoodie";
}

const ADULT: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];
const KIDS: Size[] = ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"];

export const SHIRT_TYPES: ShirtType[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Regular-fit crew neck",
    basePrice: 449,
    colors: ["black", "white", "yellow", "red", "pink", "purple", "navy", "grey-melange"],
    sizes: ADULT,
    silhouette: "tee",
  },
  {
    id: "oversized",
    name: "Oversized",
    description: "Dropped shoulder, roomy fit",
    basePrice: 599,
    colors: ["black", "white", "yellow", "purple", "olive", "grey-melange"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    silhouette: "oversized",
  },
  {
    id: "full-sleeve",
    name: "Full Sleeve",
    description: "Long-sleeve crew neck",
    basePrice: 549,
    colors: ["black", "white", "red", "navy", "maroon"],
    sizes: ADULT,
    silhouette: "longsleeve",
  },
  {
    id: "kids",
    name: "Kids",
    description: "Sizes 2 to 13 years",
    basePrice: 399,
    colors: ["yellow", "white", "pink", "sky-blue", "red", "black"],
    sizes: KIDS,
    silhouette: "tee",
  },
  {
    id: "hoodie",
    name: "Hoodie",
    description: "Pullover with hood",
    basePrice: 1099,
    colors: ["black", "grey-melange", "navy", "maroon", "purple"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    silhouette: "hoodie",
  },
];

/** Extra cost per print placement (demo). */
export const PLACEMENT_PRICES: Record<PrintPlacement, number> = {
  front: 150,
  back: 150,
  "front-back": 280,
};

/** Flat add-on when any personalised text is added (demo). */
export const PERSONALISATION_PRICE = 50;

/** Quantity discount tiers, highest first (demo). */
export const BULK_TIERS = [
  { minQty: 25, discountPct: 15 },
  { minQty: 10, discountPct: 10 },
  { minQty: 5, discountPct: 5 },
] as const;

export const MAX_CUSTOM_QTY = 99;

/** Fonts available for custom text. Uses already-loaded site fonts + system stacks (no extra downloads). */
export const CUSTOM_FONTS = [
  { id: "display", name: "Bold Display", css: "var(--font-display), Impact, sans-serif" },
  { id: "marker", name: "Brush Marker", css: "var(--font-marker), cursive" },
  { id: "sans", name: "Clean Sans", css: "var(--font-sans), system-ui, sans-serif" },
  { id: "serif", name: "Classic Serif", css: "Georgia, 'Times New Roman', serif" },
  { id: "mono", name: "Typewriter", css: "'Courier New', ui-monospace, monospace" },
] as const;

export type CustomFontId = (typeof CUSTOM_FONTS)[number]["id"];

/** Text length limits (also enforced by sanitiseCustomText). */
export const TEXT_LIMITS = { name: 24, text: 40, quote: 90 } as const;

/** Upload rules. SVG allowed but rendered via <img> only (never inlined). */
export const UPLOAD_RULES = {
  maxBytes: 10 * 1024 * 1024,
  acceptedMime: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
  acceptedExt: [".png", ".jpg", ".jpeg", ".webp", ".svg"],
} as const;

export interface CustomizerPreset {
  slug: string;
  name: string;
  h1: string;
  intro: string;
  shirtTypeId: string;
  colorId: ColorId;
  placement: PrintPlacement;
  /** Suggested starter text (shown as placeholder, never pre-filled as user data). */
  suggestion: string;
  seo: { title: string; description: string };
  /** Tips shown under the builder for this use case. */
  tips: string[];
}

export const CUSTOMIZER_PRESETS: CustomizerPreset[] = [
  {
    slug: "photo-t-shirts",
    name: "Photo T-Shirts",
    h1: "Design a Custom Photo T-Shirt",
    intro: "Upload a favourite photo, place it on the front or back and preview your custom photo T-shirt before you order.",
    shirtTypeId: "classic",
    colorId: "white",
    placement: "front",
    suggestion: "Best Day Ever",
    seo: {
      title: "Custom Photo T-Shirt Maker",
      description: "Create a custom photo T-shirt online. Upload your picture, add text and preview your design before ordering.",
    },
    tips: [
      "Use a clear, well-lit photo — at least 1500px on the longest side prints best.",
      "White and light colours show photo detail most accurately.",
      "Crop out busy backgrounds before uploading for a cleaner print.",
    ],
  },
  {
    slug: "name-t-shirts",
    name: "Name T-Shirts",
    h1: "Design a Custom Name T-Shirt",
    intro: "Add a name, nickname or jersey number, choose a font and see your name T-shirt come to life.",
    shirtTypeId: "classic",
    colorId: "black",
    placement: "back",
    suggestion: "AARAV 07",
    seo: {
      title: "Custom Name T-Shirt Maker",
      description: "Make a custom name T-shirt: pick a font, add a name or number and preview it on the front or back.",
    },
    tips: ["Short names read best from a distance.", "Back placement works well for names with numbers."],
  },
  {
    slug: "quote-t-shirts",
    name: "Quote T-Shirts",
    h1: "Design a Custom Quote T-Shirt",
    intro: "Write your own line — English, Hinglish or both — set the font and alignment and preview your quote T-shirt.",
    shirtTypeId: "classic",
    colorId: "white",
    placement: "front",
    suggestion: "Apna Design, Apni Style",
    seo: {
      title: "Custom Quote T-Shirt Maker",
      description: "Design a custom quote T-shirt with your own words. Choose fonts, alignment and placement with a live preview.",
    },
    tips: ["Keep quotes under ~12 words for a clean layout.", "Centre alignment suits most chest prints."],
  },
  {
    slug: "couple-t-shirts",
    name: "Couple T-Shirts",
    h1: "Design Custom Couple T-Shirts",
    intro: "Add both names, a special date or a photo together and create matching couple T-shirts.",
    shirtTypeId: "classic",
    colorId: "white",
    placement: "front",
    suggestion: "Riya ♥ Kabir",
    seo: {
      title: "Custom Couple T-Shirt Maker",
      description: "Design matching couple T-shirts with names, dates or a photo. Preview and order one for each of you.",
    },
    tips: ["Add each tee to the cart separately to choose different sizes.", "Try matching colours or one black, one white."],
  },
  {
    slug: "family-t-shirts",
    name: "Family T-Shirts",
    h1: "Design Matching Family T-Shirts",
    intro: "One design for everyone: add a family name, a trip or an event and order each person's size.",
    shirtTypeId: "classic",
    colorId: "yellow",
    placement: "front",
    suggestion: "The Sharma Squad",
    seo: {
      title: "Custom Family T-Shirt Maker",
      description: "Create matching family T-shirts with a family name or event. Adult and kids sizes available.",
    },
    tips: ["Switch to the Kids shirt type for children's sizes — the design stays the same.", "For big families, request a bulk quote."],
  },
  {
    slug: "kids-t-shirts",
    name: "Kids T-Shirts",
    h1: "Design a Custom Kids T-Shirt",
    intro: "Put your child's name, age or drawing on a T-shirt in sizes from 2 to 13 years.",
    shirtTypeId: "kids",
    colorId: "yellow",
    placement: "front",
    suggestion: "Anaya Turns 5",
    seo: {
      title: "Custom Kids T-Shirt Maker",
      description: "Design custom kids T-shirts with names, ages or drawings. Kids sizes from 2 to 13 years.",
    },
    tips: ["Scan or photograph drawings in daylight for true colours.", "Name + age prints make great birthday tees."],
  },
  {
    slug: "corporate-t-shirts",
    name: "Corporate T-Shirts",
    h1: "Design Custom Corporate T-Shirts",
    intro: "Upload your company logo, add a team line and preview branded T-shirts for your team.",
    shirtTypeId: "classic",
    colorId: "navy",
    placement: "front-back",
    suggestion: "Team Offsite 2026",
    seo: {
      title: "Custom Corporate T-Shirts with Logo",
      description: "Design corporate T-shirts with your company logo. Preview online and request a bulk quote for teams.",
    },
    tips: ["Vector logos (SVG) or high-res PNGs print sharpest.", "Ordering 10+? Request a bulk quote for team pricing."],
  },
  {
    slug: "hoodies",
    name: "Custom Hoodies",
    h1: "Design a Custom Hoodie",
    intro: "Add your name, logo or artwork to a pullover hoodie and preview it before ordering.",
    shirtTypeId: "hoodie",
    colorId: "black",
    placement: "back",
    suggestion: "MEHAK",
    seo: {
      title: "Custom Hoodie Maker",
      description: "Design a custom hoodie with your name, logo or artwork. Preview front or back placement online.",
    },
    tips: ["Back prints on hoodies can go bigger — great for names.", "Light prints pop on black and navy hoodies."],
  },
];
