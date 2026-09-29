/**
 * "Why Custom T-Shirt Wala" value grid. Content from data/content.ts —
 * factual brand values only, no invented stats or awards.
 */
import { brandValues } from "@/data/content";
import { CrownMark } from "@/components/ui/icons";

export function TrustStrip({ compact = false }: { compact?: boolean }) {
  const items = compact ? brandValues.slice(0, 4) : brandValues;
  return (
    <ul className={compact ? "grid grid-cols-2 gap-4 md:grid-cols-4" : "grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"}>
      {items.map((v) => (
        <li key={v.title} className={compact ? "flex items-start gap-3" : "bg-white p-6 md:p-8"}>
          <CrownMark className="mt-1 h-4 w-auto shrink-0 text-brand [filter:drop-shadow(0_0_0.5px_#0e0e0e)]" />
          <div>
            <h3 className="font-semibold">{v.title}</h3>
            <p className="mt-1 text-sm text-muted">{v.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
