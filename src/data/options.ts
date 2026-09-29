/**
 * Shared option lists: colours, sizes, fits, print types, occasions.
 *
 * NOTE for all files in /src/data: keep them free of runtime imports except
 * `import type`. The placeholder image generator (scripts/) imports these
 * files directly with Node's type-stripping, which cannot resolve "@/" aliases.
 */
import type {
  AdultSize,
  ColorId,
  Fit,
  Gender,
  KidsSize,
  Occasion,
  PrintPlacement,
  PrintType,
  ProductColor,
} from "@/lib/commerce/types";

export const COLORS: Record<ColorId, ProductColor> = {
  black: { id: "black", name: "Black", hex: "#111111" },
  white: { id: "white", name: "White", hex: "#F7F6F2" },
  yellow: { id: "yellow", name: "Yellow", hex: "#FFD21F" },
  red: { id: "red", name: "Red", hex: "#C8202B" },
  pink: { id: "pink", name: "Pink", hex: "#F2A7C3" },
  purple: { id: "purple", name: "Purple", hex: "#5B3A8C" },
  navy: { id: "navy", name: "Navy", hex: "#1C2541" },
  "grey-melange": { id: "grey-melange", name: "Grey Melange", hex: "#B9B9B4" },
  olive: { id: "olive", name: "Olive", hex: "#5A5F3A" },
  maroon: { id: "maroon", name: "Maroon", hex: "#6B1E2A" },
  "sky-blue": { id: "sky-blue", name: "Sky Blue", hex: "#9CC7E8" },
};

export const ADULT_SIZES: AdultSize[] = ["XS", "S", "M", "L", "XL", "XXL"];
export const KIDS_SIZES: KidsSize[] = ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"];

export const FIT_LABELS: Record<Fit, string> = {
  regular: "Regular Fit",
  oversized: "Oversized Fit",
  relaxed: "Relaxed Fit",
  slim: "Slim Fit",
  kids: "Kids Fit",
};

export const GENDER_LABELS: Record<Gender, string> = {
  unisex: "Unisex",
  men: "Men",
  women: "Women",
  kids: "Kids",
};

export const PRINT_TYPE_LABELS: Record<PrintType, string> = {
  "screen-print": "Screen Print",
  dtf: "DTF Print",
  "photo-print": "Photo Print",
  "name-print": "Name Print",
  "quote-print": "Quote Print",
  "graphic-print": "Graphic Print",
  "embroidery-look": "Embroidery-look Print",
};

export const PLACEMENT_LABELS: Record<PrintPlacement, string> = {
  front: "Front",
  back: "Back",
  "front-back": "Front + Back",
};

export const OCCASION_LABELS: Record<Occasion, string> = {
  birthday: "Birthday",
  couples: "Couples",
  family: "Family",
  friends: "Friends",
  gym: "Gym & Fitness",
  travel: "Travel",
  college: "College",
  events: "Events",
  corporate: "Corporate",
  everyday: "Everyday",
};

/** Price buckets used by the shop filter (rupees, inclusive min / exclusive max). */
export const PRICE_BUCKETS = [
  { id: "under-500", label: "Under ₹500", min: 0, max: 500 },
  { id: "500-799", label: "₹500 – ₹799", min: 500, max: 800 },
  { id: "800-1199", label: "₹800 – ₹1,199", min: 800, max: 1200 },
  { id: "1200-plus", label: "₹1,200 & above", min: 1200, max: Number.POSITIVE_INFINITY },
] as const;
