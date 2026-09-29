/**
 * Garment outlines for the live preview (1000×1250 viewBox), plus the
 * printable area for each silhouette as percentages of the artboard.
 * Kept in sync by hand with scripts/generate-placeholder-images.mts.
 */
export type Silhouette = "tee" | "oversized" | "longsleeve" | "hoodie";

export const GARMENT_PATHS: Record<Silhouette, string> = {
  tee: "M420 250 Q500 310 580 250 L700 280 L850 400 L780 510 L712 468 L715 1090 Q500 1105 285 1090 L288 468 L220 510 L150 400 L300 280 Z",
  oversized:
    "M410 250 Q500 318 590 250 L720 285 L880 440 L790 560 L740 520 L745 1110 Q500 1130 255 1110 L260 520 L210 560 L120 440 L280 285 Z",
  longsleeve:
    "M420 250 Q500 310 580 250 L700 280 L800 420 L880 900 L800 915 L720 520 L715 1090 Q500 1105 285 1090 L280 520 L200 915 L120 900 L200 420 L300 280 Z",
  hoodie:
    "M400 270 Q500 330 600 270 L710 300 L810 440 L885 930 L800 945 L730 560 L735 1100 Q500 1120 265 1100 L270 560 L200 945 L115 930 L190 440 L290 300 Z",
};

/** Printable area (percent of artboard): left, top, width, height. */
export const PRINT_AREA: Record<Silhouette, { left: number; top: number; width: number; height: number }> = {
  tee: { left: 34, top: 30, width: 32, height: 44 },
  oversized: { left: 32, top: 31, width: 36, height: 46 },
  longsleeve: { left: 34, top: 30, width: 32, height: 44 },
  hoodie: { left: 35, top: 36, width: 30, height: 30 },
};

/** Darken/lighten a hex colour for seams and edges. */
export function shade(hex: string, amt: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(c + amt * 255)));
  const r = f((n >> 16) & 255), g = f((n >> 8) & 255), b = f(n & 255);
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

export function isLight(hex: string): boolean {
  const n = parseInt(hex.replace("#", ""), 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255 > 0.55;
}
