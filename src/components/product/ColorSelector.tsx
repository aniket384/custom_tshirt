"use client";
/**
 * Colour selector — a native radio group (arrow-key navigation for free).
 * The colour NAME is always visible text; the swatch is never the only cue.
 */
import type { ProductColor } from "@/lib/commerce/types";
import { cn } from "@/lib/utils/format";

interface Props {
  name: string;
  colors: ProductColor[];
  value: string;
  onChange: (id: string) => void;
  groupName?: string;
}

export function ColorSelector({ name, colors, value, onChange, groupName = "color" }: Props) {
  const selected = colors.find((c) => c.id === value);
  return (
    <fieldset>
      <legend className="text-sm font-semibold">
        Colour: <span className="font-normal">{selected?.name}</span>
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {colors.map((c) => (
          <label key={c.id} className="cursor-pointer" title={c.name}>
            <input
              type="radio"
              name={groupName}
              value={c.id}
              checked={value === c.id}
              onChange={() => onChange(c.id)}
              className="peer sr-only"
              aria-label={`Select colour ${c.name} for ${name}`}
            />
            <span
              className={cn(
                "grid size-11 place-items-center rounded-full border-2 border-transparent p-0.5 transition-colors peer-checked:border-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink",
              )}
            >
              <span className="size-full rounded-full border border-black/15" style={{ backgroundColor: c.hex }} />
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
