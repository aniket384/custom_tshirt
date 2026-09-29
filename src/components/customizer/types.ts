/** Builder state shape + reducer (pure, easy to unit test). */
import type { ColorId, PrintPlacement, Size } from "@/lib/commerce/types";
import type { CustomFontId } from "@/data/customizer";

export type Side = "front" | "back";
export type Align = "left" | "center" | "right";

export interface UploadState {
  status: "idle" | "uploading" | "ready" | "error";
  /** Browser object URL (preview only — dies on refresh). */
  previewUrl: string | null;
  fileName: string | null;
  fileSize: number;
  progress: number;
  error: string | null;
  remoteUrl: string | null;
}

export interface BuilderState {
  shirtTypeId: string;
  colorId: ColorId;
  size: Size | null;
  placement: PrintPlacement;
  upload: UploadState;
  /** Design position relative to print-area centre (percent) + scale. */
  design: { x: number; y: number; scale: number };
  text: {
    name: string;
    custom: string;
    quote: string;
    fontId: CustomFontId;
    fontSize: number; // 1 (small) – 5 (large)
    align: Align;
    side: Side;
    color: "auto" | "black" | "white" | "yellow";
  };
  quantity: number;
  view: Side;
  started: boolean;
}

export const EMPTY_UPLOAD: UploadState = {
  status: "idle",
  previewUrl: null,
  fileName: null,
  fileSize: 0,
  progress: 0,
  error: null,
  remoteUrl: null,
};

export type BuilderAction =
  | { type: "shirtType"; id: string; colorId: ColorId }
  | { type: "color"; id: ColorId }
  | { type: "size"; size: Size }
  | { type: "placement"; placement: PrintPlacement }
  | { type: "upload"; patch: Partial<UploadState> }
  | { type: "removeUpload" }
  | { type: "design"; patch: Partial<BuilderState["design"]> }
  | { type: "resetDesign" }
  | { type: "text"; patch: Partial<BuilderState["text"]> }
  | { type: "quantity"; quantity: number }
  | { type: "view"; view: Side }
  | { type: "started" };

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export function builderReducer(s: BuilderState, a: BuilderAction): BuilderState {
  switch (a.type) {
    case "shirtType":
      // Changing garment resets size (size ranges differ, e.g. kids).
      return { ...s, shirtTypeId: a.id, colorId: a.colorId, size: null };
    case "color":
      return { ...s, colorId: a.id };
    case "size":
      return { ...s, size: a.size };
    case "placement": {
      // Keep the preview on a side that is actually printed.
      const view: Side = a.placement === "back" ? "back" : a.placement === "front" ? "front" : s.view;
      const side: Side = a.placement === "front-back" ? s.text.side : a.placement === "back" ? "back" : "front";
      return { ...s, placement: a.placement, view, text: { ...s.text, side } };
    }
    case "upload":
      return { ...s, upload: { ...s.upload, ...a.patch } };
    case "removeUpload":
      return { ...s, upload: EMPTY_UPLOAD, design: { x: 0, y: 0, scale: 1 } };
    case "design":
      return {
        ...s,
        design: {
          x: clamp(a.patch.x ?? s.design.x, -40, 40),
          y: clamp(a.patch.y ?? s.design.y, -40, 40),
          scale: clamp(a.patch.scale ?? s.design.scale, 0.4, 1.8),
        },
      };
    case "resetDesign":
      return { ...s, design: { x: 0, y: 0, scale: 1 } };
    case "text":
      return { ...s, text: { ...s.text, ...a.patch } };
    case "quantity":
      return { ...s, quantity: clamp(Math.floor(a.quantity) || 1, 1, 99) };
    case "view":
      return { ...s, view: a.view };
    case "started":
      return { ...s, started: true };
  }
}

/** Which side the uploaded image is printed on. */
export function imageSide(placement: PrintPlacement): Side {
  return placement === "back" ? "back" : "front";
}
