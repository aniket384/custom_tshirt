"use client";
/**
 * Design upload: drag & drop + browse, type/size validation, progress,
 * preview and remove. Uses the upload abstraction in lib/uploads/upload.ts.
 */
import { useRef, useState } from "react";
import { UPLOAD_RULES } from "@/data/customizer";
import { formatBytes, uploadDesign, validateDesignFile } from "@/lib/uploads/upload";
import { cn } from "@/lib/utils/format";
import { TrashIcon, UploadIcon } from "@/components/ui/icons";
import type { BuilderAction, UploadState } from "./types";

interface Props {
  upload: UploadState;
  dispatch: (a: BuilderAction) => void;
  onStart: () => void;
}

export function UploadDesign({ upload, dispatch, onStart }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    onStart();
    const v = validateDesignFile(file);
    if (!v.ok) {
      dispatch({ type: "upload", patch: { status: "error", error: v.error ?? "Invalid file." } });
      return;
    }
    // Object URL = instant local preview. (Revoked by the editor when replaced.)
    const previewUrl = URL.createObjectURL(file);
    dispatch({ type: "upload", patch: { status: "uploading", previewUrl, fileName: file.name, fileSize: file.size, progress: 0, error: null } });
    const result = await uploadDesign(file, (progress) => dispatch({ type: "upload", patch: { progress } }));
    dispatch({ type: "upload", patch: { status: "ready", progress: 100, remoteUrl: result.remoteUrl } });
  };

  return (
    <div>
      {upload.previewUrl && upload.status !== "error" ? (
        <div className="flex items-center gap-4 rounded-card border border-line bg-white p-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
          <img src={upload.previewUrl} alt={`Preview of ${upload.fileName}`} className="size-16 rounded-lg bg-surface object-contain" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{upload.fileName}</p>
            <p className="text-xs text-muted">{formatBytes(upload.fileSize)}</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface" role="progressbar" aria-label="Upload progress" aria-valuenow={upload.progress} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full bg-brand transition-[width]" style={{ width: `${upload.progress}%` }} />
            </div>
            <p className="mt-1 text-xs text-muted" role="status">
              {upload.status === "uploading" ? `Uploading… ${upload.progress}%` : "Ready — shown on the preview"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => dispatch({ type: "removeUpload" })}
            aria-label={`Remove uploaded design ${upload.fileName}`}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-line hover:border-ink"
          >
            <TrashIcon size={18} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files[0]);
          }}
          className={cn(
            "flex flex-col items-center rounded-card border-2 border-dashed px-4 py-8 text-center transition-colors",
            dragOver ? "border-ink bg-brand/20" : "border-line bg-white",
          )}
        >
          <UploadIcon size={28} />
          <p className="mt-3 text-sm font-semibold">Drag & drop your design here</p>
          <p className="mt-1 text-xs text-muted" id="upload-rules">
            PNG, JPG, WEBP or SVG · up to {formatBytes(UPLOAD_RULES.maxBytes)} · 1500px+ recommended
          </p>
          <label htmlFor="design-file" className="mt-4 inline-flex min-h-11 cursor-pointer items-center rounded-full bg-ink px-5 text-sm font-semibold text-white focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ink">
            Upload Your Design
            <input
              ref={inputRef}
              id="design-file"
              name="design"
              type="file"
              accept={[...UPLOAD_RULES.acceptedMime, ...UPLOAD_RULES.acceptedExt].join(",")}
              aria-describedby="upload-rules upload-error"
              className="sr-only"
              onChange={(e) => {
                handleFile(e.target.files?.[0]);
                e.target.value = ""; // allow re-selecting the same file
              }}
            />
          </label>
        </div>
      )}
      <p id="upload-error" role="alert" className="mt-2 text-sm font-semibold text-danger">
        {upload.status === "error" ? upload.error : ""}
      </p>
    </div>
  );
}
