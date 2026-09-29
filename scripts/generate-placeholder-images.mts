/**
 * PLACEHOLDER IMAGE GENERATOR
 * ---------------------------------------------------------------------------
 * Draws clean, flat product mock-ups (SVG) and converts them to WebP with
 * `sharp` (already installed as a Next.js dependency). This keeps the
 * prototype fully local: no stock photos, no hotlinking, no Instagram scraping.
 *
 * Run:   npm run images:generate
 *
 * Output (all under /public/images):
 *   products/<slug>/front-<color>.webp, back.webp, detail.webp, model.webp, closeup.webp
 *   categories/<slug>.webp, collections/<slug>.webp, home/*.webp,
 *   blog/<slug>.webp, instagram/post-N.webp, brand/og-default.webp
 *   + src/app/icon.png and src/app/apple-icon.png
 *
 * REPLACING WITH REAL PHOTOGRAPHY: keep the same file paths (or update the
 * paths in lib/commerce/catalog.ts) and delete this script. Recommended
 * product image ratio: 4:5 (e.g. 1600×2000).
 *
 * Uses Node's --experimental-strip-types, so it imports the TS data files
 * directly (they only contain `import type`, which is erased).
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import { productSeeds, type ProductSeed } from "../src/data/products.ts";
import { COLORS } from "../src/data/options.ts";
import { categories } from "../src/data/categories.ts";
import { collections } from "../src/data/collections.ts";
import { blogPosts } from "../src/data/blog.ts";
import { SHIRT_TYPES } from "../src/data/customizer.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public", "images");

const INK = "#111111";
const YELLOW = "#FFD21F";
const PAPER = "#F4F2EC";

type Silhouette = "tee" | "oversized" | "longsleeve" | "hoodie" | "polo";

/* ------------------------------------------------------------------------ */
/* Colour helpers                                                           */
/* ------------------------------------------------------------------------ */

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}
function shade(hex: string, amt: number) {
  const { r, g, b } = hexToRgb(hex);
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(c + amt * 255)));
  return `#${[f(r), f(g), f(b)].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}
/** Print ink that contrasts with the garment colour. */
function inkFor(garment: string) {
  if (garment.toLowerCase() === YELLOW.toLowerCase()) return INK;
  return luminance(garment) > 0.55 ? INK : YELLOW;
}
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ------------------------------------------------------------------------ */
/* Garment shapes (drawn on a 1000×1250 artboard)                           */
/* ------------------------------------------------------------------------ */

function garmentPath(s: Silhouette) {
  switch (s) {
    case "oversized":
      return "M410 250 Q500 318 590 250 L720 285 L880 440 L790 560 L740 520 L745 1110 Q500 1130 255 1110 L260 520 L210 560 L120 440 L280 285 Z";
    case "longsleeve":
      return "M420 250 Q500 310 580 250 L700 280 L800 420 L880 900 L800 915 L720 520 L715 1090 Q500 1105 285 1090 L280 520 L200 915 L120 900 L200 420 L300 280 Z";
    case "hoodie":
      return "M400 270 Q500 330 600 270 L710 300 L810 440 L885 930 L800 945 L730 560 L735 1100 Q500 1120 265 1100 L270 560 L200 945 L115 930 L190 440 L290 300 Z";
    case "polo":
    case "tee":
    default:
      return "M420 250 Q500 310 580 250 L700 280 L850 400 L780 510 L712 468 L715 1090 Q500 1105 285 1090 L288 468 L220 510 L150 400 L300 280 Z";
  }
}

function crownPath(cx: number, cy: number, w: number, fill: string) {
  const h = w * 0.62;
  const x = cx - w / 2;
  const y = cy - h / 2;
  return `<path fill="${fill}" d="M${x} ${y + h} L${x} ${y + h * 0.25} L${x + w * 0.25} ${y + h * 0.55} L${x + w * 0.5} ${y} L${x + w * 0.75} ${y + h * 0.55} L${x + w} ${y + h * 0.25} L${x + w} ${y + h} Z"/>
  <circle cx="${x}" cy="${y + h * 0.2}" r="${w * 0.055}" fill="${fill}"/><circle cx="${x + w * 0.5}" cy="${y - w * 0.04}" r="${w * 0.055}" fill="${fill}"/><circle cx="${x + w}" cy="${y + h * 0.2}" r="${w * 0.055}" fill="${fill}"/>`;
}

/** Artwork printed on the chest (or back). Centred on (cx, cy). */
function artwork(style: ProductSeed["art"]["style"], lines: string[], ink: string, cx: number, cy: number, scale = 1) {
  const s = scale;
  const display = `font-family="Impact, 'Arial Black', 'Helvetica Neue', sans-serif" font-weight="900"`;
  const script = `font-family="'Brush Script MT', 'Snell Roundhand', cursive" font-style="italic"`;
  const t = (txt: string, y: number, size: number, attrs = display, fill = ink) =>
    `<text x="${cx}" y="${y}" text-anchor="middle" font-size="${size * s}" ${attrs} fill="${fill}">${esc(txt)}</text>`;

  switch (style) {
    case "minimal":
      return lines[0] === "♛"
        ? crownPath(cx + 90 * s, cy - 110 * s, 56 * s, ink)
        : t(lines[0], cy - 150 * s, 26 * s, `font-family="Helvetica, Arial, sans-serif" letter-spacing="2"`);
    case "script":
      return lines.map((l, i) => t(l, cy - 20 * s + i * 92 * s, 86, script)).join("");
    case "photo": {
      const w = 250 * s, h = 250 * s, x = cx - w / 2, y = cy - h / 2 - 40 * s;
      return `<clipPath id="ph"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${10 * s}"/></clipPath>
        <g clip-path="url(#ph)"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#9CC7E8"/>
        <circle cx="${x + w * 0.72}" cy="${y + h * 0.3}" r="${h * 0.12}" fill="${YELLOW}"/>
        <path d="M${x} ${y + h} L${x + w * 0.3} ${y + h * 0.5} L${x + w * 0.5} ${y + h * 0.72} L${x + w * 0.7} ${y + h * 0.45} L${x + w} ${y + h} Z" fill="#2F4F3A"/></g>
        ${t(lines.join(" "), y + h + 58 * s, 40)}`;
    }
    case "badge":
      return `<circle cx="${cx}" cy="${cy - 30 * s}" r="${150 * s}" fill="none" stroke="${ink}" stroke-width="${10 * s}"/>
        ${crownPath(cx, cy - 115 * s, 60 * s, ink)}
        ${t(lines[0], cy - 10 * s, 50)}${lines[1] ? t(lines[1], cy + 50 * s, 30, `font-family="Helvetica, Arial, sans-serif" font-weight="700" letter-spacing="3"`) : ""}`;
    case "retro": {
      const stripes = ["#F28C28", "#E4572E", "#C8202B", YELLOW]
        .map((c, i) => `<rect x="${cx - 150 * s}" y="${cy - 150 * s + i * 22 * s}" width="${300 * s}" height="${12 * s}" fill="${c}"/>`)
        .join("");
      return `<clipPath id="sun"><circle cx="${cx}" cy="${cy - 90 * s}" r="${150 * s}"/></clipPath><g clip-path="url(#sun)">${stripes}<rect x="${cx - 150 * s}" y="${cy - 240 * s}" width="${300 * s}" height="${90 * s}" fill="${YELLOW}"/></g>
        ${lines.map((l, i) => t(l, cy + 50 * s + i * 76 * s, 72)).join("")}`;
    }
    case "crown":
      return `${crownPath(cx, cy - 110 * s, 190 * s, YELLOW === ink ? YELLOW : ink)}${lines.map((l, i) => t(l, cy + 60 * s + i * 64 * s, i === 0 ? 70 : 40)).join("")}`;
    case "logo":
      return `<circle cx="${cx}" cy="${cy - 80 * s}" r="${70 * s}" fill="${ink}"/><path d="M${cx - 38 * s} ${cy - 50 * s} L${cx} ${cy - 120 * s} L${cx + 38 * s} ${cy - 50 * s} Z" fill="${ink === INK ? "#fff" : INK}"/>
        ${lines.map((l, i) => t(l, cy + 50 * s + i * 58 * s, 54)).join("")}`;
    case "block":
    default:
      return lines.map((l, i) => t(l, cy - 20 * s + i * 96 * s, l.length > 9 ? 62 : 104)).join("");
  }
}

interface GarmentOpts {
  color: string;
  silhouette?: Silhouette;
  view?: "front" | "back";
  art?: ProductSeed["art"];
  /** Print art on this view? */
  printed?: boolean;
}

/** One garment as an SVG <g>, 1000×1250 coordinate space. */
function garment({ color, silhouette = "tee", view = "front", art, printed = true }: GarmentOpts) {
  const edge = shade(color, luminance(color) > 0.5 ? -0.12 : 0.1);
  const ink = inkFor(color);
  const hood =
    silhouette === "hoodie"
      ? view === "front"
        ? `<path d="M400 270 Q500 150 600 270 Q560 360 500 370 Q440 360 400 270 Z" fill="${shade(color, -0.08)}" stroke="${edge}" stroke-width="4"/>
           <path d="M340 860 L660 860 L700 1010 L300 1010 Z" fill="none" stroke="${edge}" stroke-width="5"/>
           <line x1="470" y1="360" x2="462" y2="520" stroke="${edge}" stroke-width="5"/><line x1="530" y1="360" x2="538" y2="520" stroke="${edge}" stroke-width="5"/>`
        : `<path d="M400 270 Q500 120 600 270 Q500 520 400 270 Z" fill="${shade(color, -0.05)}" stroke="${edge}" stroke-width="4"/>`
      : "";
  const collar =
    silhouette === "polo" && view === "front"
      ? `<path d="M420 250 L470 330 L500 290 L530 330 L580 250 Q500 280 420 250Z" fill="${shade(color, -0.06)}" stroke="${edge}" stroke-width="4"/><line x1="500" y1="300" x2="500" y2="420" stroke="${edge}" stroke-width="4"/><circle cx="500" cy="345" r="6" fill="${edge}"/><circle cx="500" cy="395" r="6" fill="${edge}"/>`
      : "";
  const neck =
    silhouette !== "hoodie" && silhouette !== "polo"
      ? view === "front"
        ? `<path d="M420 250 Q500 318 580 250" fill="none" stroke="${edge}" stroke-width="12"/>`
        : `<path d="M420 250 Q500 270 580 250" fill="none" stroke="${edge}" stroke-width="10"/>`
      : "";

  let print = "";
  if (art && printed) {
    const small = art.style === "minimal";
    if (view === "front") print = artwork(art.style, art.lines, ink, 500, small ? 640 : 610, silhouette === "hoodie" ? 0.8 : 1);
    else print = artwork(art.style === "minimal" ? "minimal" : "block", art.style === "minimal" ? art.lines : art.lines, ink, 500, 640, 1.05);
  }
  const label = view === "back" ? `<rect x="478" y="262" width="44" height="18" rx="3" fill="${YELLOW}"/>` : "";

  return `<g>
    <path d="${garmentPath(silhouette)}" transform="translate(0 18)" fill="#000" opacity="0.08"/>
    <path d="${garmentPath(silhouette)}" fill="${color}" stroke="${edge}" stroke-width="4" stroke-linejoin="round"/>
    <path d="${garmentPath(silhouette)}" fill="url(#shading)"/>
    ${hood}${collar}${neck}${label}${print}
  </g>`;
}

const DEFS = `<defs>
  <linearGradient id="shading" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity="0.16"/>
    <stop offset="0.5" stop-color="#fff" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity="0.14"/>
  </linearGradient>
  <pattern id="knit" width="10" height="10" patternUnits="userSpaceOnUse">
    <path d="M0 5 Q2.5 0 5 5 T10 5" fill="none" stroke="#000" stroke-opacity="0.09" stroke-width="1.2"/>
  </pattern>
</defs>`;

function svg(w: number, h: number, body: string, bg = PAPER) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${DEFS}<rect width="${w}" height="${h}" fill="${bg}"/>${body}</svg>`;
}

/** Place a 1000×1250 garment into a box. */
function place(g: string, x: number, y: number, scale: number) {
  return `<g transform="translate(${x} ${y}) scale(${scale})">${g}</g>`;
}

async function write(rel: string, svgStr: string, quality = 78) {
  const file = path.join(OUT, rel);
  await mkdir(path.dirname(file), { recursive: true });
  await sharp(Buffer.from(svgStr)).webp({ quality, effort: 5 }).toFile(file);
}

/* ------------------------------------------------------------------------ */
/* Products                                                                 */
/* ------------------------------------------------------------------------ */

function silhouetteFor(p: ProductSeed): Silhouette {
  if (p.art.product === "hoodie") return "hoodie";
  if (p.art.product === "polo") return "polo";
  if (p.fit === "oversized") return "oversized";
  return "tee";
}

async function products() {
  for (const p of productSeeds) {
    const sil = silhouetteFor(p);
    const primary = COLORS[p.colors[0]].hex;
    const backPrinted = p.printPlacements.some((pl) => pl !== "front");
    const dir = `products/${p.slug}`;

    for (const c of p.colors) {
      await write(`${dir}/front-${c}.webp`, svg(1000, 1250, garment({ color: COLORS[c].hex, silhouette: sil, art: p.art })));
    }
    await write(`${dir}/back.webp`, svg(1000, 1250, garment({ color: primary, silhouette: sil, view: "back", art: p.art, printed: backPrinted }), "#ECE9E1"));
    // Detail: zoom into the chest print.
    await write(
      `${dir}/detail.webp`,
      svg(1000, 1250, `<g transform="translate(-600 -520) scale(2.2)">${garment({ color: primary, silhouette: sil, art: p.art })}</g>`),
    );
    // Lifestyle: garment on a hanger against a coloured wall.
    const wall = luminance(primary) > 0.5 ? "#1A1A1A" : "#F1E7C9";
    await write(
      `${dir}/model.webp`,
      svg(
        1000,
        1250,
        `<rect y="1050" width="1000" height="200" fill="${shade(wall, luminance(wall) > 0.5 ? -0.08 : 0.06)}"/>
         <path d="M500 150 Q500 110 530 110 Q555 112 552 140 M500 160 L360 250 L640 250 Z" fill="none" stroke="#8a8a8a" stroke-width="8" stroke-linejoin="round"/>
         ${place(garment({ color: primary, silhouette: sil, art: p.art }), 100, 150, 0.8)}
         <rect x="80" y="880" width="90" height="170" rx="8" fill="#6B8F5E"/><circle cx="125" cy="850" r="60" fill="#7FA96B"/>`,
        wall,
      ),
    );
    // Fabric + print edge close-up.
    await write(
      `${dir}/closeup.webp`,
      svg(
        1000,
        1250,
        `<rect width="1000" height="1250" fill="${primary}"/><rect width="1000" height="1250" fill="url(#knit)"/>
         <g transform="translate(-1500 -1300) scale(4)"><g opacity="0.95">${p.art.style === "minimal" ? crownPath(590, 530, 56, inkFor(primary)) : artwork(p.art.style, p.art.lines, inkFor(primary), 500, 610)}</g></g>
         <rect width="1000" height="1250" fill="url(#knit)" opacity="0.6"/>`,
        primary,
      ),
    );
  }
}

/* ------------------------------------------------------------------------ */
/* Merchandising imagery                                                    */
/* ------------------------------------------------------------------------ */

type Scene = { colors: string[]; lines: string[][]; style?: ProductSeed["art"]["style"]; sil?: Silhouette; bg?: string; accent?: boolean };

/** 1–3 garments composed side by side. */
function scene(w: number, h: number, sc: Scene) {
  const n = sc.colors.length;
  const bg = sc.bg ?? PAPER;
  // Garments overlap (their artboard has side padding) so group shots fill the frame.
  const overlap = n > 1 ? 0.42 : 0;
  const scale = Math.min(w / (1000 * (n - (n - 1) * overlap)), h / 1250) * (n === 1 ? 0.9 : 0.97);
  const gw = 1000 * scale;
  const total = gw * n - (n - 1) * gw * overlap;
  const startX = (w - total) / 2;
  const accent = sc.accent ? `<circle cx="${w * 0.72}" cy="${h * 0.3}" r="${Math.min(w, h) * 0.28}" fill="${YELLOW}" opacity="0.95"/>` : "";
  const body = sc.colors
    .map((c, i) => {
      const lines = sc.lines[i] ?? sc.lines[0];
      // In 3-up family shots the last garment is drawn smaller (a kids tee).
      const s = n > 2 && i === n - 1 ? scale * 0.78 : scale;
      const y = (h - 1250 * scale) / 2 + 1250 * (scale - s);
      return place(garment({ color: c, silhouette: sc.sil ?? "tee", art: { lines, style: sc.style ?? "block" } }), startX + i * gw * (1 - overlap), y, s);
    })
    .join("");
  return svg(w, h, accent + body, bg);
}

const C = (id: keyof typeof COLORS) => COLORS[id].hex;

async function merchandising() {
  const catScenes: Record<string, Scene> = {
    "printed-t-shirts": { colors: [C("black")], lines: [["APNI", "STYLE"]], style: "script", accent: true },
    "custom-t-shirts": { colors: [C("white")], lines: [["YOUR", "PHOTO"]], style: "photo", accent: true },
    "oversized-t-shirts": { colors: [C("black")], lines: [["KING", "OF STYLE"]], style: "crown", sil: "oversized", bg: "#E9E5DA" },
    "couple-t-shirts": { colors: [C("white"), C("black")], lines: [["HIS"], ["HERS"]], style: "script" },
    "kids-t-shirts": { colors: [C("yellow")], lines: [["ANAYA", "TURNS 5"]], style: "badge", bg: "#EAF3FA" },
    "family-t-shirts": { colors: [C("yellow"), C("yellow"), C("yellow")], lines: [["PAPA"], ["MUMMY"], ["MINI"]], style: "block" },
    "gym-t-shirts": { colors: [C("black")], lines: [["NO", "EXCUSES"]], style: "block", bg: "#2A2A2A" },
    "corporate-t-shirts": { colors: [C("navy")], lines: [["LOGO"]], style: "logo", sil: "polo", bg: "#E7EAF0" },
    "bulk-event-t-shirts": { colors: [C("yellow"), C("red"), C("sky-blue")], lines: [["RUN", "2026"]], style: "badge" },
    hoodies: { colors: [C("black")], lines: [["CTW"]], style: "crown", sil: "hoodie", accent: true },
  };
  for (const c of categories) await write(`categories/${c.slug}.webp`, scene(800, 1000, catScenes[c.slug]));

  const colScenes: Record<string, Scene> = {
    "graphic-prints": { colors: [C("white")], lines: [["ROAD", "TRIP"]], style: "retro", bg: "#F1E7C9" },
    "minimal-prints": { colors: [C("white")], lines: [["♛"]], style: "minimal", bg: "#E4E1D9" },
    "funny-prints": { colors: [C("yellow")], lines: [["CHAI PE", "CHARCHA"]], style: "retro", bg: "#1A1A1A" },
    "name-and-quote": { colors: [C("black")], lines: [["AARAV", "07"]], style: "block", accent: true },
    "photo-prints": { colors: [C("white")], lines: [["BEST", "DAY"]], style: "photo", bg: "#E9EEF2" },
    "birthday-t-shirts": { colors: [C("pink")], lines: [["BIRTHDAY", "SQUAD"]], style: "badge", bg: "#FBEFF3" },
    "friends-t-shirts": { colors: [C("black"), C("white")], lines: [["PARTNER"], ["IN CRIME"]], style: "block" },
    "travel-t-shirts": { colors: [C("sky-blue")], lines: [["ROAD", "TRIP"]], style: "retro", bg: "#F4EFE4" },
    "college-t-shirts": { colors: [C("maroon")], lines: [["BATCH", "OF 2026"]], style: "block", bg: "#EFE9E0" },
    "best-sellers": { colors: [C("black"), C("white")], lines: [["KING"], ["APNI"]], style: "crown", accent: true },
    "new-arrivals": { colors: [C("purple")], lines: [["DATIA", "STREETS"]], style: "block", sil: "oversized", accent: true },
  };
  for (const c of collections) await write(`collections/${c.slug}.webp`, scene(800, 1000, colScenes[c.slug]));

  const momentScenes: Record<string, Scene> = {
    birthday: colScenes["birthday-t-shirts"],
    couples: catScenes["couple-t-shirts"],
    family: catScenes["family-t-shirts"],
    friends: colScenes["friends-t-shirts"],
    gym: catScenes["gym-t-shirts"],
    travel: colScenes["travel-t-shirts"],
    college: colScenes["college-t-shirts"],
    events: catScenes["bulk-event-t-shirts"],
    corporate: catScenes["corporate-t-shirts"],
  };
  for (const [k, s] of Object.entries(momentScenes)) await write(`home/moment-${k}.webp`, scene(600, 750, s));

  // Hero — the LCP image. Kept simple so it compresses small.
  await write(
    "home/hero.webp",
    svg(
      1200,
      1500,
      `<circle cx="760" cy="520" r="420" fill="${YELLOW}"/>
       ${place(garment({ color: C("black"), silhouette: "oversized", art: { lines: ["APNA DESIGN", "APNI STYLE"], style: "crown" } }), 60, 150, 1.08)}`,
      "#F4F2EC",
    ),
    80,
  );

  // Customise section: blank → upload → text → final.
  await write("home/customise-blank.webp", scene(600, 750, { colors: [C("white")], lines: [[""]], style: "block", bg: "#1E1E1E" }));
  await write("home/customise-upload.webp", scene(600, 750, { colors: [C("white")], lines: [["", ""]], style: "photo", bg: "#1E1E1E" }));
  await write("home/customise-text.webp", scene(600, 750, { colors: [C("white")], lines: [["RAHUL", "07"]], style: "block", bg: "#1E1E1E" }));
  await write("home/customise-final.webp", scene(600, 750, { colors: [C("black")], lines: [["BEST", "DAY EVER"]], style: "photo", bg: "#1E1E1E" }));

  await write("home/bulk.webp", scene(1200, 900, { colors: [C("navy"), C("white"), C("black")], lines: [["TEAM"], ["TEAM"], ["TEAM"]], style: "logo", bg: "#E7EAF0" }));
  await write("home/personal-kids.webp", scene(600, 750, catScenes["kids-t-shirts"]));
  await write("home/personal-family.webp", scene(600, 750, catScenes["family-t-shirts"]));
  await write("home/personal-couples.webp", scene(600, 750, catScenes["couple-t-shirts"]));
  await write("home/gym.webp", scene(1200, 900, { colors: [C("black"), C("grey-melange")], lines: [["NO", "EXCUSES"], ["ONE MORE", "REP"]], style: "block", bg: "#1A1A1A" }));

  // Blog covers (16:10).
  const blogScenes: Scene[] = [
    colScenes["birthday-t-shirts"],
    { colors: [C("white")], lines: [["YOUR", "DESIGN"]], style: "photo", accent: true },
    { colors: [C("black"), C("white")], lines: [["OVER"], ["REGULAR"]], style: "block", bg: "#E4E1D9" },
    catScenes["bulk-event-t-shirts"],
    { colors: [C("navy"), C("white")], lines: [["LOGO"], ["LOGO"]], style: "logo", bg: "#E7EAF0" },
    catScenes["couple-t-shirts"],
    colScenes["friends-t-shirts"],
    { colors: [C("grey-melange")], lines: [["S M L", "XL"]], style: "block", bg: "#F1E7C9" },
  ];
  for (const [i, b] of blogPosts.entries()) await write(`blog/${b.slug}.webp`, scene(1200, 750, blogScenes[i % blogScenes.length]));

  // Instagram-style squares: bolder, black/yellow brand energy.
  const ig: Scene[] = [
    { colors: [C("black")], lines: [["AARAV", "07"]], style: "block", bg: YELLOW },
    { colors: [C("white"), C("black")], lines: [["RIYA"], ["KABIR"]], style: "script", bg: "#111111" },
    { colors: [C("yellow")], lines: [["ANAYA", "TURNS 5"]], style: "badge", bg: "#111111" },
    { colors: [C("black")], lines: [["NO", "EXCUSES"]], style: "block", bg: YELLOW },
    { colors: [C("navy"), C("white")], lines: [["TEAM"], ["TEAM"]], style: "logo", bg: "#111111" },
    { colors: [C("black")], lines: [["CTW"]], style: "crown", sil: "hoodie", bg: YELLOW },
  ];
  for (const [i, s] of ig.entries()) await write(`instagram/post-${i + 1}.webp`, scene(800, 800, s));

  // Default social share image (1200×630).
  await write(
    "brand/og-default.webp",
    svg(
      1200,
      630,
      `${crownPath(110, 120, 90, YELLOW)}
       <text x="70" y="290" font-family="Impact, 'Arial Black', sans-serif" font-size="80" fill="#fff">CUSTOM T-SHIRT WALA</text>
       <rect x="70" y="330" width="520" height="70" fill="${YELLOW}"/>
       <text x="90" y="380" font-family="Impact, 'Arial Black', sans-serif" font-size="46" fill="#111">APNA DESIGN APNI STYLE</text>
       <text x="70" y="470" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#ddd">Custom T-shirts • Bulk orders • All India delivery</text>
       ${place(garment({ color: C("white"), art: { lines: ["YOUR", "IDEA"], style: "block" } }), 880, 130, 0.33)}`,
      "#111111",
    ),
    82,
  );
}

async function icons() {
  const iconSvg = (size: number) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512"><rect width="512" height="512" rx="96" fill="#111"/>${crownPath(256, 190, 220, YELLOW)}<text x="256" y="420" text-anchor="middle" font-family="Impact, 'Arial Black', sans-serif" font-size="150" fill="#fff">CTW</text></svg>`;
  await writeFile(path.join(ROOT, "src/app/icon.png"), await sharp(Buffer.from(iconSvg(512))).png({ palette: true, colours: 16 }).toBuffer());
  await writeFile(path.join(ROOT, "src/app/apple-icon.png"), await sharp(Buffer.from(iconSvg(180))).resize(180, 180).png({ palette: true, colours: 16 }).toBuffer());
}

/** Blank garments used as cart thumbnails for custom-builder items. */
async function customizerBlanks() {
  const sil: Record<string, Silhouette> = { tee: "tee", oversized: "oversized", longsleeve: "longsleeve", hoodie: "hoodie" };
  for (const t of SHIRT_TYPES) {
    for (const c of t.colors) {
      await write(`customizer/${t.id}-${c}.webp`, svg(1000, 1250, garment({ color: COLORS[c].hex, silhouette: sil[t.silhouette], printed: false })), 70);
    }
  }
}

const started = Date.now();
await customizerBlanks();
await products();
await merchandising();
await icons();
console.log(`Placeholder images generated in ${((Date.now() - started) / 1000).toFixed(1)}s`);
