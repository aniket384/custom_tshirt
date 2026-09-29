"use client";
/**
 * CUSTOM T-SHIRT EDITOR (the builder at /custom-tshirt).
 *
 * Steps: 1 T-shirt → 2 colour → 3 size → 4 print placement → 5 upload →
 * 6 personalise → 7 preview → 8 quantity → 9 price estimate → 10 add to cart.
 *
 * State lives in one reducer (./types.ts). Every control is a native form
 * element with a visible label, so keyboard users, screen readers and
 * shopping agents can operate the builder without the visual preview.
 *
 * Builder state is intentionally NOT put in the URL or localStorage (it is
 * temporary, may contain personal photos, and must not be indexed).
 */
import { useEffect, useReducer, useRef, useState } from "react";
import Link from "next/link";
import { CUSTOM_FONTS, MAX_CUSTOM_QTY, PLACEMENT_PRICES, SHIRT_TYPES, type CustomizerPreset } from "@/data/customizer";
import { COLORS, PLACEMENT_LABELS } from "@/data/options";
import { calculateCustomPrice } from "@/lib/commerce/pricing";
import type { PrintPlacement, Size } from "@/lib/commerce/types";
import { cartActions, createCustomLineId } from "@/lib/store/cart";
import { trackEvent } from "@/lib/analytics/track";
import { formatPrice } from "@/lib/utils/format";
import { buttonClass } from "@/components/ui/button-styles";
import { ColorSelector } from "@/components/product/ColorSelector";
import { SizeSelector } from "@/components/product/SizeSelector";
import { QuantityInput } from "@/components/ecommerce/QuantityInput";
import { BagIcon } from "@/components/ui/icons";
import { TshirtPreview } from "./TshirtPreview";
import { UploadDesign } from "./UploadDesign";
import { CustomizationControls, RadioRow } from "./CustomizationControls";
import { builderReducer, EMPTY_UPLOAD, type BuilderState } from "./types";

function initialState(preset?: CustomizerPreset): BuilderState {
  const shirt = SHIRT_TYPES.find((s) => s.id === preset?.shirtTypeId) ?? SHIRT_TYPES[0];
  const colorId = preset && shirt.colors.includes(preset.colorId) ? preset.colorId : shirt.colors[0];
  const placement = preset?.placement ?? "front";
  return {
    shirtTypeId: shirt.id,
    colorId,
    size: null,
    placement,
    upload: EMPTY_UPLOAD,
    design: { x: 0, y: 0, scale: 1 },
    text: {
      name: "",
      custom: "",
      quote: "",
      fontId: "display",
      fontSize: 3,
      align: "center",
      side: placement === "back" ? "back" : placement === "front-back" ? "back" : "front",
      color: "auto",
    },
    quantity: 1,
    view: placement === "back" ? "back" : "front",
    started: false,
  };
}

/** Numbered step wrapper with a real heading (navigable by screen readers). */
function Step({ n, title, id, children, hint }: { n: number; title: string; id: string; children: React.ReactNode; hint?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="border-b border-line py-6 first:pt-0">
      <h2 id={`${id}-h`} className="mb-4 flex items-center gap-3 text-lg font-semibold">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold" aria-hidden="true">
          {n}
        </span>
        <span>
          <span className="sr-only">Step {n}: </span>
          {title}
        </span>
      </h2>
      {hint && <p className="-mt-2 mb-4 text-sm text-muted">{hint}</p>}
      {children}
    </section>
  );
}

export function CustomTshirtEditor({ preset }: { preset?: CustomizerPreset }) {
  const [state, dispatch] = useReducer(builderReducer, preset, initialState);
  const [errors, setErrors] = useState<{ size?: string; design?: string }>({});
  const [added, setAdded] = useState(false);
  const lastUrl = useRef<string | null>(null);

  const shirt = SHIRT_TYPES.find((s) => s.id === state.shirtTypeId) ?? SHIRT_TYPES[0];
  const color = COLORS[state.colorId];
  const hasText = Boolean(state.text.name || state.text.custom || state.text.quote);
  const hasDesign = state.upload.status === "ready" || state.upload.status === "uploading";
  const price = calculateCustomPrice({ shirtTypeId: shirt.id, placement: state.placement, hasPersonalisation: hasText, quantity: state.quantity });
  const shirtLabel = shirt.id === "hoodie" ? "Custom Hoodie" : `Custom ${shirt.name} T-Shirt`;

  // Revoke old object URLs when the uploaded file changes / on unmount (avoids memory leaks).
  useEffect(() => {
    const prev = lastUrl.current;
    if (prev && prev !== state.upload.previewUrl) URL.revokeObjectURL(prev);
    lastUrl.current = state.upload.previewUrl;
  }, [state.upload.previewUrl]);
  useEffect(() => () => {
    if (lastUrl.current) URL.revokeObjectURL(lastUrl.current);
  }, []);

  const markStarted = () => {
    if (!state.started) {
      dispatch({ type: "started" });
      trackEvent("customizer_started", { shirt_type: shirt.id, preset: preset?.slug ?? null });
    }
  };

  const addToCart = () => {
    const next: typeof errors = {};
    if (!state.size) next.size = "Please choose a size.";
    if (!hasDesign && !hasText) next.design = "Upload a design or add a name, text or quote.";
    setErrors(next);
    if (next.size || next.design) {
      document.getElementById(next.size ? "step-size" : "step-upload")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const size = state.size as Size;
    cartActions.add({
      lineId: createCustomLineId(shirt.id),
      productId: `custom-${shirt.id}`,
      slug: null,
      name: shirtLabel,
      image: `/images/customizer/${shirt.id}-${state.colorId}.webp`,
      variantId: null,
      colorName: color.name,
      size,
      unitPrice: price.unitPrice,
      compareAtPrice: null,
      quantity: state.quantity,
      custom: {
        shirtTypeId: shirt.id,
        shirtTypeName: shirt.name,
        colorId: state.colorId,
        colorName: color.name,
        size,
        placement: state.placement,
        nameText: state.text.name.trim(),
        customText: state.text.custom.trim(),
        quoteText: state.text.quote.trim(),
        fontId: state.text.fontId,
        uploadedFileName: state.upload.fileName,
        uploadedFileUrl: state.upload.remoteUrl,
      },
    });
    trackEvent("customizer_completed", { currency: "INR", value: price.total, shirt_type: shirt.id, placement: state.placement });
    setAdded(true);
  };

  return (
    <div className="grid gap-8 pb-28 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:pb-0">
      {/* Step 7 — preview (sticky on desktop) */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <h2 className="sr-only">Step 7: Preview your T-shirt</h2>
        <TshirtPreview state={state} dispatch={dispatch} silhouette={shirt.silhouette} shirtName={shirt.id === "hoodie" ? "hoodie" : `${shirt.name.toLowerCase()} T-shirt`} />
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 rounded-card border border-line bg-white p-4 text-sm">
          <dt className="text-muted">Style</dt>
          <dd>{shirt.name}</dd>
          <dt className="text-muted">Colour</dt>
          <dd>{color.name}</dd>
          <dt className="text-muted">Size</dt>
          <dd>{state.size ?? "Not selected"}</dd>
          <dt className="text-muted">Print</dt>
          <dd>{PLACEMENT_LABELS[state.placement]}</dd>
          <dt className="text-muted">Design file</dt>
          <dd className="break-all">{state.upload.fileName ?? "None"}</dd>
          <dt className="text-muted">Font</dt>
          <dd>{CUSTOM_FONTS.find((f) => f.id === state.text.fontId)?.name}</dd>
        </dl>
      </div>

      <form
        aria-label="Customise your T-shirt"
        onSubmit={(e) => {
          e.preventDefault();
          addToCart();
        }}
      >
        <Step n={1} title="Choose your T-shirt" id="step-shirt">
          <RadioRow
            legend="T-shirt style"
            name="shirt-type"
            value={shirt.id}
            options={SHIRT_TYPES.map((s) => ({ value: s.id, label: s.name, hint: `${s.description} · from ${formatPrice(s.basePrice)}` }))}
            onChange={(id) => {
              markStarted();
              const next = SHIRT_TYPES.find((s) => s.id === id)!;
              dispatch({ type: "shirtType", id, colorId: next.colors.includes(state.colorId) ? state.colorId : next.colors[0] });
            }}
          />
        </Step>

        <Step n={2} title="Choose colour" id="step-color">
          <ColorSelector
            name={shirtLabel}
            groupName="shirt-color"
            colors={shirt.colors.map((c) => COLORS[c])}
            value={state.colorId}
            onChange={(id) => {
              markStarted();
              dispatch({ type: "color", id: id as typeof state.colorId });
            }}
          />
        </Step>

        <Step n={3} title="Choose size" id="step-size">
          <SizeSelector
            groupName="shirt-size"
            options={shirt.sizes.map((s) => ({ size: s, available: true }))}
            value={state.size}
            onChange={(s) => {
              dispatch({ type: "size", size: s as Size });
              setErrors((e) => ({ ...e, size: undefined }));
            }}
            error={errors.size}
          />
        </Step>

        <Step n={4} title="Print placement" id="step-placement">
          <RadioRow
            legend="Where should we print?"
            name="placement"
            value={state.placement}
            options={(Object.keys(PLACEMENT_PRICES) as PrintPlacement[]).map((p) => ({
              value: p,
              label: PLACEMENT_LABELS[p],
              hint: `+${formatPrice(PLACEMENT_PRICES[p])}`,
            }))}
            onChange={(p) => dispatch({ type: "placement", placement: p as PrintPlacement })}
          />
        </Step>

        <Step n={5} title="Upload your design" id="step-upload" hint={state.placement === "front-back" ? "Your image prints on the front; add text for the back below." : undefined}>
          <UploadDesign upload={state.upload} dispatch={dispatch} onStart={markStarted} />
          {errors.design && (
            <p role="alert" className="mt-2 text-sm font-semibold text-danger">
              {errors.design}
            </p>
          )}
        </Step>

        <Step n={6} title="Personalise" id="step-text" hint="Optional — add a name, a line of text or a quote.">
          <CustomizationControls
            text={state.text}
            placement={state.placement}
            dispatch={(a) => {
              dispatch(a);
              setErrors((e) => ({ ...e, design: undefined }));
            }}
            suggestion={preset?.suggestion}
            onStart={markStarted}
          />
        </Step>

        <Step n={8} title="Quantity" id="step-qty" hint="Ordering 5 or more? Quantity discounts apply automatically.">
          <QuantityInput id="custom-qty" value={state.quantity} max={MAX_CUSTOM_QTY} onChange={(q) => dispatch({ type: "quantity", quantity: q })} />
          {state.quantity >= 25 && (
            <p className="mt-3 text-sm">
              Large order?{" "}
              <Link href="/bulk-orders" className="font-semibold underline underline-offset-4">
                Request a bulk quote
              </Link>{" "}
              for team pricing.
            </p>
          )}
        </Step>

        <Step n={9} title="Price estimate" id="step-price">
          <dl className="space-y-2 text-sm" aria-live="polite">
            <div className="flex justify-between">
              <dt>{shirt.name} base</dt>
              <dd>{formatPrice(price.base)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Print — {PLACEMENT_LABELS[state.placement]}</dt>
              <dd>+{formatPrice(price.placement)}</dd>
            </div>
            {price.personalisation > 0 && (
              <div className="flex justify-between">
                <dt>Personalised text</dt>
                <dd>+{formatPrice(price.personalisation)}</dd>
              </div>
            )}
            {price.discountPct > 0 && (
              <div className="flex justify-between text-success">
                <dt>Quantity discount ({price.discountPct}%)</dt>
                <dd>−{formatPrice((price.unitBeforeDiscount - price.unitPrice) * price.quantity)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-line pt-2">
              <dt>Price per piece</dt>
              <dd>{formatPrice(price.unitPrice)}</dd>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <dt>
                Estimated total ({price.quantity} {price.quantity === 1 ? "piece" : "pieces"})
              </dt>
              <dd>{formatPrice(price.total)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-muted">Demo pricing estimate. Shipping is calculated at checkout.</p>
        </Step>

        <Step n={10} title="Add to cart" id="step-cart">
          <button type="submit" className={buttonClass("dark", "lg", "w-full")}>
            <BagIcon /> Add Custom T-Shirt to Cart — {formatPrice(price.total)}
          </button>
          {added && (
            <p role="status" className="mt-3 text-sm">
              Added to cart.{" "}
              <Link href="/cart" className="font-semibold underline underline-offset-4">
                View cart
              </Link>{" "}
              or keep designing another.
            </p>
          )}
        </Step>

        {/* Sticky mobile summary + CTA */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-muted">
                {color.name} {shirt.name} · {state.size ?? "No size"} · ×{state.quantity}
              </p>
              <p className="font-semibold">{formatPrice(price.total)}</p>
            </div>
            <button type="submit" className={buttonClass("dark", "md", "flex-1")}>
              Add to Cart<span className="sr-only"> — custom T-shirt</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
