"use client";
/**
 * Bulk quote form with inline validation, error summary and a mock submit.
 * Every field has a visible label; the submit button is "Request Bulk Quote".
 */
import { useRef, useState } from "react";
import { submitBulkQuote } from "@/lib/commerce/quotes";
import { validateDesignFile } from "@/lib/uploads/upload";
import { trackEvent } from "@/lib/analytics/track";
import { sanitiseText, validators } from "@/lib/utils/sanitize";
import { whatsappLink } from "@/config/site";
import { buttonClass } from "@/components/ui/button-styles";
import { ErrorSummary, Field, fieldInputClass } from "./Field";
import { CheckIcon } from "@/components/ui/icons";

type Errors = Record<string, string | undefined>;

const TYPES = ["Classic T-shirt", "Oversized T-shirt", "Polo", "Full sleeve", "Hoodie", "Mixed / not sure"];

export function BulkQuoteForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const started = useRef(false);
  const wa = whatsappLink("Hi! I'd like a bulk T-shirt quote.");
  const today = new Date().toISOString().slice(0, 10);

  if (done) {
    return (
      <div role="status" className="rounded-card border border-line bg-white p-8 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand">
          <CheckIcon size={28} />
        </span>
        <h3 className="heading-display mt-4 text-3xl">Quote request received (demo)</h3>
        <p className="mt-2 text-muted">
          Reference <strong className="text-ink">{done}</strong>. In the live store the team would contact you with a quote. This prototype does not send your details anywhere.
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      aria-label="Bulk quote request"
      className="space-y-5 rounded-card border border-line bg-white p-5 md:p-8"
      onFocus={() => {
        if (!started.current) {
          started.current = true;
          trackEvent("bulk_quote_started");
        }
      }}
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const s = (k: string, max = 200) => sanitiseText(String(fd.get(k) ?? "").trim(), max);
        const file = fd.get("design") as File | null;
        const req = {
          name: s("name", 80),
          organization: s("organization", 120),
          email: s("email", 120),
          phone: s("phone", 20),
          quantity: Number(fd.get("quantity")),
          tshirtType: s("tshirtType"),
          sizes: s("sizes"),
          colors: s("colors"),
          deadline: s("deadline", 10),
          message: s("message", 1000),
          designFileName: file && file.size ? file.name : null,
        };
        const next: Errors = {};
        if (!req.name) next.name = "Enter your name";
        if (!validators.email(req.email)) next.email = "Enter a valid email address";
        if (!validators.phone(req.phone)) next.phone = "Enter a valid 10-digit mobile number";
        if (!Number.isFinite(req.quantity) || req.quantity < 10) next.quantity = "Bulk orders start from 10 pieces";
        if (!req.tshirtType) next.tshirtType = "Choose a T-shirt type";
        if (req.deadline && req.deadline < today) next.deadline = "Deadline cannot be in the past";
        if (file && file.size) {
          const v = validateDesignFile(file);
          if (!v.ok) next.design = v.error;
        }
        setErrors(next);
        if (Object.values(next).some(Boolean)) {
          requestAnimationFrame(() => document.getElementById("error-summary")?.focus());
          return;
        }
        setLoading(true);
        const res = await submitBulkQuote(req);
        setLoading(false);
        trackEvent("bulk_quote_submitted", { quantity: req.quantity, tshirt_type: req.tshirtType });
        setDone(res.reference);
      }}
    >
      <ErrorSummary errors={errors} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="name" label="Your name" autoComplete="name" required error={errors.name} />
        <Field id="organization" label="Company / organisation" optional autoComplete="organization" />
        <Field id="email" label="Email" type="email" autoComplete="email" required error={errors.email} />
        <Field id="phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" required error={errors.phone} />
        <Field id="quantity" label="Quantity (pieces)" type="number" min={10} inputMode="numeric" required hint="Minimum 10 pieces" error={errors.quantity} />
        <div>
          <label htmlFor="tshirtType" className="text-sm font-semibold">
            T-shirt type
          </label>
          <select id="tshirtType" name="tshirtType" defaultValue="" required aria-invalid={errors.tshirtType ? true : undefined} aria-describedby={errors.tshirtType ? "tshirtType-error" : undefined} className={`${fieldInputClass} border-line`}>
            <option value="" disabled>
              Select type
            </option>
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          {errors.tshirtType && (
            <p id="tshirtType-error" className="mt-1 text-sm font-semibold text-danger">
              {errors.tshirtType}
            </p>
          )}
        </div>
        <Field id="sizes" label="Sizes needed" optional placeholder="e.g. 10 M, 15 L, 5 XL" />
        <Field id="colors" label="Colours" optional placeholder="e.g. Navy, White" />
        <Field id="deadline" label="Deadline" type="date" min={today} optional error={errors.deadline} />
        <div>
          <label htmlFor="design" className="text-sm font-semibold">
            Design / logo file <span className="font-normal text-muted">(optional)</span>
          </label>
          <input id="design" name="design" type="file" accept=".png,.jpg,.jpeg,.webp,.svg" aria-describedby="design-hint" aria-invalid={errors.design ? true : undefined} className="mt-1 block w-full text-sm file:mr-3 file:min-h-11 file:rounded-full file:border-0 file:bg-ink file:px-4 file:font-semibold file:text-white" />
          <p id="design-hint" className="mt-1 text-xs text-muted">
            PNG, JPG, WEBP or SVG, up to 10 MB
          </p>
          {errors.design && <p className="mt-1 text-sm font-semibold text-danger">{errors.design}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-semibold">
          Message <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea id="message" name="message" rows={4} maxLength={1000} placeholder="Tell us about the event, print placement or anything else." className={`${fieldInputClass} border-line py-2`} />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="submit" disabled={loading} className={buttonClass("primary", "lg")}>
          {loading ? "Sending…" : "Request Bulk Quote"}
        </button>
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClass("outline", "lg")}>
            Chat on WhatsApp
          </a>
        )}
      </div>
    </form>
  );
}
