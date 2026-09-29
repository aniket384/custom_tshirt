"use client";
/** Accessible quantity stepper backed by a real number input. */
import { MinusIcon, PlusIcon } from "@/components/ui/icons";

interface Props {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  id: string;
  label?: string;
}

export function QuantityInput({ value, onChange, min = 1, max = 99, id, label = "Quantity" }: Props) {
  const clamp = (n: number) => Math.max(min, Math.min(max, Number.isFinite(n) ? Math.floor(n) : min));
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      <div className="mt-2 inline-flex items-center rounded-full border border-line bg-white">
        <button type="button" onClick={() => onChange(clamp(value - 1))} disabled={value <= min} aria-label="Decrease quantity" className="grid size-12 place-items-center disabled:opacity-40">
          <MinusIcon size={18} />
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(clamp(Number(e.target.value)))}
          className="w-12 bg-transparent text-center text-base font-semibold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button type="button" onClick={() => onChange(clamp(value + 1))} disabled={value >= max} aria-label="Increase quantity" className="grid size-12 place-items-center disabled:opacity-40">
          <PlusIcon size={18} />
        </button>
      </div>
    </div>
  );
}
