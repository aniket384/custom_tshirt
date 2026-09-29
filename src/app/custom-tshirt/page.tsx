/** /custom-tshirt — the main T-shirt customiser (indexable landing page). */
import type { Metadata } from "next";
import { CustomizerPageShell } from "@/components/customizer/CustomizerPageShell";
import { getAllProducts } from "@/lib/commerce/catalog";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Design Your Own T-Shirt — Custom T-Shirt Maker",
  description:
    "Create a custom T-shirt online: choose a style and colour, upload your photo or logo, add a name or quote and preview it live. Classic, oversized, full sleeve, kids and hoodies.",
  path: "/custom-tshirt",
});

export default async function CustomTshirtPage() {
  const products = (await getAllProducts()).filter((p) => p.isCustomizable).slice(0, 4);
  return (
    <CustomizerPageShell
      h1="Design Your Own T-Shirt"
      intro="Choose your T-shirt, upload a photo, logo or artwork, add a name or quote and preview it live. Everything you see in the preview is exactly what goes into your cart."
      crumbs={[
        { name: "Home", href: "/" },
        { name: "Customise", href: "/custom-tshirt" },
      ]}
      tips={[
        "Use a clear, high-resolution image — at least 1500px on the longest side.",
        "PNG files with a transparent background look cleanest on coloured tees.",
        "Keep text short and double-check spelling before adding to cart.",
        "Light designs stand out on dark tees; dark designs on light tees.",
      ]}
      products={products}
    />
  );
}
