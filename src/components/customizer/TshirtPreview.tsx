"use client";
/**
 * LIVE T-SHIRT PREVIEW
 *
 * Built from inline SVG (garment) + regular HTML (<img> for the design,
 * text nodes for personalisation) — NOT a canvas — so everything stays
 * accessible and inspectable. A text summary of the preview is always
 * rendered for screen readers and agents.
 *
 * Interactions: drag the design (pointer), move with buttons (keyboard),
 * zoom in/out, reset, remove, switch front/back view.
 */
import { useRef } from "react";
import { CUSTOM_FONTS } from "@/data/customizer";
import { COLORS } from "@/data/options";
import { cn } from "@/lib/utils/format";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ResetIcon,
  TrashIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "@/components/ui/icons";
import { GARMENT_PATHS, PRINT_AREA, isLight, shade, type Silhouette } from "./garment-shapes";
import { imageSide, type BuilderAction, type BuilderState, type Side } from "./types";

interface Props {
  state: BuilderState;
  dispatch: (a: BuilderAction) => void;
  silhouette: Silhouette;
  shirtName: string;
}

const TEXT_SIZES = [0, 0.75, 1, 1.3, 1.7, 2.2]; // rem-ish multipliers, index 1–5

export function TshirtPreview({ state, dispatch, silhouette, shirtName }: Props) {
  const areaRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const color = COLORS[state.colorId];
  const edge = shade(color.hex, isLight(color.hex) ? -0.12 : 0.12);
  const area = PRINT_AREA[silhouette];
  const view = state.view;
  const showImage = state.upload.previewUrl && imageSide(state.placement) === view;
  const showText = state.text.side === view;
  const font = CUSTOM_FONTS.find((f) => f.id === state.text.fontId) ?? CUSTOM_FONTS[0];
  const autoInk = isLight(color.hex) ? "#0e0e0e" : color.id === "yellow" ? "#0e0e0e" : "#ffffff";
  const ink = { auto: autoInk, black: "#0e0e0e", white: "#ffffff", yellow: "#ffd21f" }[state.text.color];
  const hasText = Boolean(state.text.name || state.text.custom || state.text.quote);
  const canFlip = state.placement === "front-back";

  const move = (dx: number, dy: number) => dispatch({ type: "design", patch: { x: state.design.x + dx, y: state.design.y + dy } });

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: state.design.x, oy: state.design.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    const dx = ((e.clientX - drag.current.x) / rect.width) * 100;
    const dy = ((e.clientY - drag.current.y) / rect.height) * 100;
    dispatch({ type: "design", patch: { x: drag.current.ox + dx, y: drag.current.oy + dy } });
  };
  const endDrag = () => (drag.current = null);

  // Plain-language description of the preview (for screen readers & agents).
  const summary = [
    `${color.name} ${shirtName}, ${view} view.`,
    showImage ? `Uploaded design "${state.upload.fileName}" at ${Math.round(state.design.scale * 100)}% size.` : null,
    showText && state.text.name ? `Name: ${state.text.name}.` : null,
    showText && state.text.custom ? `Text: ${state.text.custom}.` : null,
    showText && state.text.quote ? `Quote: ${state.text.quote}.` : null,
    !showImage && !(showText && hasText) ? "Nothing printed on this side yet." : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="rounded-card bg-surface p-3 md:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div role="group" aria-label="Preview side" className="inline-flex rounded-full bg-white p-1">
          {(["front", "back"] as Side[]).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={view === s}
              onClick={() => dispatch({ type: "view", view: s })}
              className={cn("min-h-10 rounded-full px-4 text-sm font-semibold capitalize", view === s ? "bg-ink text-white" : "text-ink")}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted">{canFlip ? "Printing front + back" : `Printing ${state.placement}`}</p>
      </div>

      {/* Artboard — 4:5 ratio, fixed aspect → no layout shift */}
      <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] select-none">
        <svg viewBox="0 0 1000 1250" className="absolute inset-0 size-full" aria-hidden="true">
          <defs>
            <linearGradient id="pv-shade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity="0.14" />
            </linearGradient>
          </defs>
          <path d={GARMENT_PATHS[silhouette]} transform="translate(0 18)" fill="#000" opacity="0.08" />
          <path d={GARMENT_PATHS[silhouette]} fill={color.hex} stroke={edge} strokeWidth="4" strokeLinejoin="round" className="transition-[fill] duration-300" />
          <path d={GARMENT_PATHS[silhouette]} fill="url(#pv-shade)" />
          {silhouette === "hoodie" ? (
            <path d={view === "front" ? "M400 270 Q500 150 600 270 Q560 360 500 370 Q440 360 400 270 Z" : "M400 270 Q500 120 600 270 Q500 520 400 270 Z"} fill={shade(color.hex, -0.06)} stroke={edge} strokeWidth="4" />
          ) : (
            <path d={view === "front" ? "M420 250 Q500 318 580 250" : "M420 250 Q500 270 580 250"} fill="none" stroke={edge} strokeWidth="12" />
          )}
        </svg>

        {/* Print area (dashed guide) */}
        <div
          ref={areaRef}
          className={cn("absolute overflow-hidden rounded-sm outline-1 outline-dashed", isLight(color.hex) ? "outline-black/25" : "outline-white/35")}
          style={{ left: `${area.left}%`, top: `${area.top}%`, width: `${area.width}%`, height: `${area.height}%` }}
        >
          {showImage && (
            <div
              className="absolute left-1/2 top-1/2 w-3/4 cursor-grab touch-none active:cursor-grabbing"
              style={{ transform: `translate(calc(-50% + ${state.design.x}%), calc(-50% + ${state.design.y}%)) scale(${state.design.scale})` }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              aria-hidden="true"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- blob: URLs can't go through next/image */}
              <img src={state.upload.previewUrl!} alt="" draggable={false} className="pointer-events-none w-full" />
            </div>
          )}
          {showText && hasText && (
            <div
              className="pointer-events-none absolute inset-x-1 bottom-2 flex flex-col gap-1 break-words leading-tight"
              style={{ fontFamily: font.css, color: ink, textAlign: state.text.align, top: showImage ? "auto" : "8%" }}
              aria-hidden="true"
            >
              {state.text.name && <p style={{ fontSize: `clamp(0.7rem, ${TEXT_SIZES[state.text.fontSize] * 2.2}vw, ${TEXT_SIZES[state.text.fontSize] * 1.6}rem)` }} className="font-bold uppercase">{state.text.name}</p>}
              {state.text.custom && <p style={{ fontSize: `clamp(0.6rem, ${TEXT_SIZES[state.text.fontSize] * 1.6}vw, ${TEXT_SIZES[state.text.fontSize] * 1.1}rem)` }}>{state.text.custom}</p>}
              {state.text.quote && <p style={{ fontSize: `clamp(0.55rem, ${TEXT_SIZES[state.text.fontSize] * 1.2}vw, ${TEXT_SIZES[state.text.fontSize] * 0.85}rem)` }} className="italic">“{state.text.quote}”</p>}
            </div>
          )}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {summary}
      </p>
      <p className="mt-3 text-center text-xs text-muted" aria-hidden="true">
        {showImage ? "Drag the design to position it, or use the controls below." : "Your design will appear inside the dashed print area."}
      </p>

      {state.upload.previewUrl && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5" role="group" aria-label="Design position and size">
          <CtrlButton label="Move design left" onClick={() => move(-4, 0)}><ChevronLeftIcon size={18} /></CtrlButton>
          <CtrlButton label="Move design up" onClick={() => move(0, -4)}><ChevronDownIcon size={18} className="rotate-180" /></CtrlButton>
          <CtrlButton label="Move design down" onClick={() => move(0, 4)}><ChevronDownIcon size={18} /></CtrlButton>
          <CtrlButton label="Move design right" onClick={() => move(4, 0)}><ChevronRightIcon size={18} /></CtrlButton>
          <span className="mx-1 h-6 w-px bg-line" aria-hidden="true" />
          <CtrlButton label="Zoom out design" onClick={() => dispatch({ type: "design", patch: { scale: state.design.scale - 0.1 } })}><ZoomOutIcon size={18} /></CtrlButton>
          <output className="w-12 text-center text-xs font-semibold" aria-label="Design size">{Math.round(state.design.scale * 100)}%</output>
          <CtrlButton label="Zoom in design" onClick={() => dispatch({ type: "design", patch: { scale: state.design.scale + 0.1 } })}><ZoomInIcon size={18} /></CtrlButton>
          <CtrlButton label="Reset design position and size" onClick={() => dispatch({ type: "resetDesign" })}><ResetIcon size={18} /></CtrlButton>
          <CtrlButton label="Remove design from T-shirt" onClick={() => dispatch({ type: "removeUpload" })}><TrashIcon size={18} /></CtrlButton>
        </div>
      )}
    </div>
  );
}

function CtrlButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className="grid size-11 place-items-center rounded-full border border-line bg-white hover:border-ink">
      {children}
    </button>
  );
}
