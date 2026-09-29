/**
 * Top announcement bar. Messages come from data/content.ts (no invented
 * discounts). Static text — no JS carousel — so it costs nothing at runtime.
 */
import { announcements } from "@/data/content";

export function AnnouncementBar() {
  return (
    <div className="on-dark bg-ink text-white">
      <div className="container-page flex min-h-9 items-center justify-center gap-6 text-center text-xs font-medium tracking-wide">
        <p>{announcements[0]}</p>
        {announcements[1] && (
          <p className="hidden md:block">
            <span aria-hidden="true" className="mr-6 text-brand">★</span>
            {announcements[1]}
          </p>
        )}
      </div>
    </div>
  );
}
