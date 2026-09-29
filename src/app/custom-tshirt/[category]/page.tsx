/**
 * /custom-tshirt/[category] — SEO landing pages for specific custom use
 * cases (photo, name, couple, kids, corporate, hoodies…). Each opens the
 * same builder with sensible defaults from data/customizer.ts.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomizerPageShell } from "@/components/customizer/CustomizerPageShell";
import { CUSTOMIZER_PRESETS } from "@/data/customizer";
import { getAllProducts } from "@/lib/commerce/catalog";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return CUSTOMIZER_PRESETS.map((p) => ({ category: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/custom-tshirt/[category]">): Promise<Metadata> {
  const { category } = await params;
  const preset = CUSTOMIZER_PRESETS.find((p) => p.slug === category);
  if (!preset) return {};
  return buildMetadata({ title: preset.seo.title, description: preset.seo.description, path: `/custom-tshirt/${preset.slug}` });
}

export default async function CustomPresetPage({ params }: PageProps<"/custom-tshirt/[category]">) {
  const { category } = await params;
  const preset = CUSTOMIZER_PRESETS.find((p) => p.slug === category);
  if (!preset) notFound();
  const products = (await getAllProducts()).filter((p) => p.customizerPreset === preset.slug).slice(0, 4);
  return (
    <CustomizerPageShell
      h1={preset.h1}
      intro={preset.intro}
      preset={preset}
      tips={preset.tips}
      products={products}
      crumbs={[
        { name: "Home", href: "/" },
        { name: "Customise", href: "/custom-tshirt" },
        { name: preset.name, href: `/custom-tshirt/${preset.slug}` },
      ]}
    />
  );
}
