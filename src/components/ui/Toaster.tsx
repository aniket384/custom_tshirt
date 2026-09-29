"use client";
/**
 * Toast notifications + screen-reader announcements (aria-live="polite").
 * Trigger with `toast("message")` from lib/store/toast.
 */
import { useStore } from "@/lib/store/create-store";
import { toastStore } from "@/lib/store/toast";

export function Toaster() {
  const { toasts } = useStore(toastStore);
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((t) => (
        <p
          key={t.id}
          role="status"
          className="animate-fade-in rounded-full bg-ink px-5 py-3 text-sm font-medium text-white shadow-lg"
        >
          <span aria-hidden="true" className="mr-2 text-brand">✓</span>
          {t.message}
        </p>
      ))}
    </div>
  );
}
