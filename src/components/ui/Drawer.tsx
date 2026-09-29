"use client";
/**
 * Accessible drawer / modal built on the native <dialog> element.
 *
 * Native `showModal()` gives us for free: focus moved into the dialog,
 * background made inert, Escape to close, and focus restored on close.
 * Content stays in the DOM when closed (hidden), so links inside remain
 * crawlable.
 */
import { useEffect, useId, useRef } from "react";
import { CloseIcon } from "./icons";
import { cn } from "@/lib/utils/format";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: "left" | "right" | "center";
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Drawer({ open, onClose, title, side = "right", children, footer, className }: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // Sync the `open` prop with the imperative dialog API.
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const position =
    side === "center"
      ? "m-auto max-h-[85dvh] w-[min(40rem,calc(100%-2rem))] rounded-2xl"
      : cn(
          "my-0 h-dvh max-h-dvh w-[min(26rem,100%)] motion-safe:animate-drawer-in",
          side === "right" ? "ml-auto mr-0" : "ml-0 mr-auto [animation-direction:reverse]",
        );

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      // Click on the backdrop (the dialog element itself) closes it.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={cn("max-w-none bg-paper p-0 text-ink shadow-2xl", position, className)}
    >
      <div className="flex h-full max-h-[inherit] flex-col">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id={titleId} className="text-base font-semibold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title}`}
            className="grid size-11 place-items-center rounded-full hover:bg-surface"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && <div className="border-t border-line bg-white px-5 py-4">{footer}</div>}
      </div>
    </dialog>
  );
}
