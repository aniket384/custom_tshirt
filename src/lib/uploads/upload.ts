/**
 * UPLOAD SERVICE (prototype).
 *
 * - Validates type + size on the client (the server must validate again).
 * - Uses a browser object URL for instant previews. Object URLs are revoked
 *   when replaced/removed and die on page refresh — we deliberately do NOT
 *   store image data (base64) in localStorage.
 * - `uploadDesign()` simulates progress. Replace its body with a real upload
 *   (pre-signed S3 PUT, Cloudinary unsigned upload, etc.) that returns a
 *   permanent URL, then store that URL on the cart line.
 */
import { UPLOAD_RULES } from "@/data/customizer";

export interface UploadValidation {
  ok: boolean;
  error?: string;
}

export function validateDesignFile(file: File): UploadValidation {
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  const typeOk = (UPLOAD_RULES.acceptedMime as readonly string[]).includes(file.type);
  const extOk = (UPLOAD_RULES.acceptedExt as readonly string[]).includes(ext);
  if (!typeOk || !extOk) {
    return { ok: false, error: "Please upload a PNG, JPG, WEBP or SVG file." };
  }
  if (file.size > UPLOAD_RULES.maxBytes) {
    return { ok: false, error: `File is too large. Maximum size is ${Math.round(UPLOAD_RULES.maxBytes / 1024 / 1024)} MB.` };
  }
  if (file.size === 0) return { ok: false, error: "This file appears to be empty." };
  return { ok: true };
}

export interface UploadResult {
  /** Permanent URL from storage. Always null in the prototype. */
  remoteUrl: string | null;
  fileName: string;
}

/** Simulated upload with progress callbacks (0–100). */
export async function uploadDesign(file: File, onProgress: (pct: number) => void): Promise<UploadResult> {
  for (let pct = 10; pct <= 100; pct += 18) {
    await new Promise((r) => setTimeout(r, 90));
    onProgress(Math.min(pct, 100));
  }
  onProgress(100);
  return { remoteUrl: null, fileName: file.name };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
