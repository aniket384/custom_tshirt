"use client";
/**
 * Add-to-cart button. The accessible name always includes the product and
 * the selected variant, e.g. "Add Black Oversized Graphic Tee, Black / L, to cart".
 */
import { useState } from "react";
import { buttonClass } from "@/components/ui/button-styles";
import { BagIcon, CheckIcon } from "@/components/ui/icons";

interface Props {
  productName: string;
  variantLabel: string | null;
  disabled?: boolean;
  onAdd: () => boolean;
  className?: string;
  size?: "md" | "lg";
}

export function AddToCartButton({ productName, variantLabel, disabled, onAdd, className, size = "lg" }: Props) {
  const [added, setAdded] = useState(false);
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (onAdd()) {
          setAdded(true);
          window.setTimeout(() => setAdded(false), 1600);
        }
      }}
      aria-label={`Add ${productName}${variantLabel ? `, ${variantLabel},` : ""} to cart`}
      className={buttonClass("dark", size, className)}
    >
      {added ? <CheckIcon /> : <BagIcon />}
      {added ? "Added" : "Add to Cart"}
    </button>
  );
}
