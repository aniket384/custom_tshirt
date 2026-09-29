/**
 * Labelled form field with error + hint wiring (aria-invalid,
 * aria-describedby). Works in Server and Client Components.
 */
import { cn } from "@/lib/utils/format";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
}

export const fieldInputClass =
  "mt-1 min-h-12 w-full rounded-lg border bg-white px-3 text-base placeholder:text-muted/70 focus:border-ink aria-[invalid=true]:border-danger";

export function Field({ id, label, error, hint, optional, className, ...rest }: FieldProps) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
        {optional && <span className="font-normal text-muted"> (optional)</span>}
      </label>
      <input id={id} name={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy} className={cn(fieldInputClass, "border-line")} {...rest} />
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm font-semibold text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** Error summary shown at the top of a form after a failed submit (WCAG 3.3.1). */
export function ErrorSummary({ errors, title = "Please fix the following:" }: { errors: Record<string, string | undefined>; title?: string }) {
  const entries = Object.entries(errors).filter(([, v]) => v);
  if (!entries.length) return null;
  return (
    <div role="alert" tabIndex={-1} id="error-summary" className="rounded-card border-2 border-danger bg-white p-4">
      <p className="font-semibold text-danger">{title}</p>
      <ul className="mt-2 list-disc pl-5 text-sm">
        {entries.map(([k, v]) => (
          <li key={k}>
            <a href={`#${k}`} className="underline">
              {v}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];
