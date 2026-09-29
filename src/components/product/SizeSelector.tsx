"use client";
/**
 * Size selector — native radio group. Out-of-stock sizes are disabled AND
 * labelled in text (not only struck through).
 */
import { cn } from "@/lib/utils/format";

export interface SizeOption {
  size: string;
  available: boolean;
}

interface Props {
  options: SizeOption[];
  value: string | null;
  onChange: (size: string) => void;
  error?: string | null;
  groupName?: string;
  sizeChartHref?: string;
}

export function SizeSelector({ options, value, onChange, error, groupName = "size", sizeChartHref }: Props) {
  return (
    <fieldset aria-describedby={error ? `${groupName}-error` : undefined}>
      <div className="flex items-center justify-between">
        <legend className="text-sm font-semibold">
          Size: <span className="font-normal">{value ?? "Select a size"}</span>
        </legend>
        {sizeChartHref && (
          <a href={sizeChartHref} className="text-sm font-semibold underline underline-offset-4">
            Size chart
          </a>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.size} className={o.available ? "cursor-pointer" : "cursor-not-allowed"}>
            <input
              type="radio"
              name={groupName}
              value={o.size}
              checked={value === o.size}
              disabled={!o.available}
              onChange={() => onChange(o.size)}
              className="peer sr-only"
              aria-label={o.available ? `Select size ${o.size}` : `Size ${o.size} — out of stock`}
            />
            <span
              className={cn(
                "inline-flex min-h-12 min-w-14 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors",
                "peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white",
                "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink",
                o.available ? "border-line bg-white hover:border-ink" : "border-line bg-surface text-muted line-through",
              )}
            >
              {o.size}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${groupName}-error`} role="alert" className="mt-2 text-sm font-semibold text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
