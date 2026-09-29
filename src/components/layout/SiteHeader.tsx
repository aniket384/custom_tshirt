/**
 * Global header (Server Component). Sticky, with announcement bar.
 * The search suggestion index is built here on the server and passed to the
 * client search dialog, so the browser never downloads the full catalogue.
 */
import { AnnouncementBar } from "./AnnouncementBar";
import { Logo } from "./Logo";
import { HeaderActions } from "./HeaderActions";
import { DesktopNavigation } from "@/components/navigation/DesktopNavigation";
import type { SearchSuggestion } from "@/components/navigation/SearchDialog";
import { getAllCategories, getAllCollections, getAllProducts } from "@/lib/commerce/catalog";
import { CUSTOMIZER_PRESETS } from "@/data/customizer";

async function buildSearchIndex(): Promise<SearchSuggestion[]> {
  const [products, categories, collections] = await Promise.all([getAllProducts(), getAllCategories(), getAllCollections()]);
  return [
    ...categories.map((c) => ({ label: c.name, href: `/shop/${c.slug}`, type: "Category" as const })),
    ...collections.map((c) => ({ label: c.h1, href: `/collections/${c.slug}`, type: "Collection" as const })),
    ...CUSTOMIZER_PRESETS.map((p) => ({ label: `Design ${p.name}`, href: `/custom-tshirt/${p.slug}`, type: "Customise" as const })),
    ...products.map((p) => ({ label: p.name, href: `/product/${p.slug}`, type: "Product" as const })),
  ];
}

export async function SiteHeader() {
  const searchIndex = await buildSearchIndex();
  return (
    <header className="sticky top-0 z-40">
      <AnnouncementBar />
      <div className="border-b border-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
        <div className="container-page flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
          <Logo size="md" className="shrink-0 pt-2" />
          <DesktopNavigation />
          <HeaderActions searchIndex={searchIndex} />
        </div>
      </div>
    </header>
  );
}
