"use client";
/**
 * Personalisation fields (name / text / quote) and typography options.
 * Inputs are sanitised on change (length limit, no control chars / angle
 * brackets) and always rendered as text — never as HTML.
 */
import { CUSTOM_FONTS, TEXT_LIMITS, type CustomFontId } from "@/data/customizer";
import { sanitiseText } from "@/lib/utils/sanitize";
import { cn } from "@/lib/utils/format";
import type { PrintPlacement } from "@/lib/commerce/types";
import type { Align, BuilderAction, BuilderState, Side } from "./types";

interface Props {
  text: BuilderState["text"];
  placement: PrintPlacement;
  dispatch: (a: BuilderAction) => void;
  suggestion?: string;
  onStart: () => void;
}

const inputCls = "mt-1 min-h-12 w-full rounded-lg border border-line bg-white px-3 text-base focus:border-ink";

export function CustomizationControls({ text, placement, dispatch, suggestion, onStart }: Props) {
  const set = (patch: Partial<BuilderState["text"]>) => {
    onStart();
    dispatch({ type: "text", patch });
  };

  const field = (key: "name" | "custom" | "quote", label: string, limit: number, placeholder: string, multiline = false) => {
    const id = `ct-${key}`;
    const value = text[key];
    const common = {
      id,
      name: key,
      value,
      maxLength: limit,
      placeholder,
      "aria-describedby": `${id}-count`,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set({ [key]: sanitiseText(e.target.value, limit) }),
    };
    return (
      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor={id} className="text-sm font-semibold">
            {label}
          </label>
          <span id={`${id}-count`} className="text-xs text-muted">
            {value.length}/{limit}
          </span>
        </div>
        {multiline ? <textarea {...common} rows={2} className={cn(inputCls, "py-2")} /> : <input {...common} type="text" autoComplete="off" className={inputCls} />}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {field("name", "Name", TEXT_LIMITS.name, suggestion ? suggestion.split(" ")[0] : "e.g. AARAV")}
      {field("custom", "Text", TEXT_LIMITS.text, "e.g. Birthday Squad 2026")}
      {field("quote", "Quote", TEXT_LIMITS.quote, suggestion ?? "e.g. Apna Design, Apni Style", true)}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ct-font" className="text-sm font-semibold">
            Font
          </label>
          <select id="ct-font" value={text.fontId} onChange={(e) => set({ fontId: e.target.value as CustomFontId })} className={inputCls}>
            {CUSTOM_FONTS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ct-size" className="text-sm font-semibold">
            Text size: {["", "Extra small", "Small", "Medium", "Large", "Extra large"][text.fontSize]}
          </label>
          <input
            id="ct-size"
            type="range"
            min={1}
            max={5}
            step={1}
            value={text.fontSize}
            onChange={(e) => set({ fontSize: Number(e.target.value) })}
            aria-valuetext={["", "Extra small", "Small", "Medium", "Large", "Extra large"][text.fontSize]}
            className="mt-4 w-full accent-ink"
          />
        </div>
      </div>

      <RadioRow
        legend="Alignment"
        name="ct-align"
        value={text.align}
        options={[
          { value: "left", label: "Left" },
          { value: "center", label: "Centre" },
          { value: "right", label: "Right" },
        ]}
        onChange={(v) => set({ align: v as Align })}
      />
      <RadioRow
        legend="Text colour"
        name="ct-ink"
        value={text.color}
        options={[
          { value: "auto", label: "Auto" },
          { value: "black", label: "Black" },
          { value: "white", label: "White" },
          { value: "yellow", label: "Yellow" },
        ]}
        onChange={(v) => set({ color: v as BuilderState["text"]["color"] })}
      />
      {placement === "front-back" && (
        <RadioRow
          legend="Text placement"
          name="ct-side"
          value={text.side}
          options={[
            { value: "front", label: "Front" },
            { value: "back", label: "Back" },
          ]}
          onChange={(v) => {
            set({ side: v as Side });
            dispatch({ type: "view", view: v as Side });
          }}
        />
      )}
    </div>
  );
}

export function RadioRow({
  legend,
  name,
  value,
  options,
  onChange,
}: {
  legend: string;
  name: string;
  value: string;
  options: { value: string; label: string; hint?: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className="cursor-pointer">
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="peer sr-only" />
            <span className="inline-flex min-h-11 flex-col justify-center rounded-lg border border-line bg-white px-4 text-sm font-semibold peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
              {o.label}
              {o.hint && <span className="text-xs font-normal opacity-75">{o.hint}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
