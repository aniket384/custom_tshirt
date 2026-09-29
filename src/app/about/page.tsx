/** /about — brand story (only confirmed facts). */
import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/layout/ContentPage";
import { TrustStrip } from "@/components/ecommerce/TrustStrip";
import { buttonClass } from "@/components/ui/button-styles";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description: "Custom T-Shirt Wala makes personalised and printed T-shirts — Apna Design Apni Style. Based in Datia, Madhya Pradesh, delivering across India.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <ContentPage
      title="About Custom T-Shirt Wala"
      path="/about"
      intro={`${siteConfig.tagline}. We turn your ideas, names, photos and moments into T-shirts you'll actually want to wear.`}
      sections={[
        {
          heading: "What we do",
          paragraphs: [
            "We make custom and printed apparel — photo prints, name prints, quote prints and custom designs on T-shirts and hoodies.",
            "From a single birthday tee to matching couple, kids and family T-shirts, gym tees, corporate apparel and bulk orders for events and teams.",
          ],
        },
        { heading: "Where we are", paragraphs: [`We're based in ${siteConfig.location.city}, ${siteConfig.location.region}, and deliver across India.`] },
        {
          heading: "Our story",
          placeholder: true,
          paragraphs: ["Add the founder story, when the brand started and what makes the team proud of their work here."],
        },
      ]}
    >
      <div className="mt-12">
        <TrustStrip />
      </div>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/custom-tshirt" className={buttonClass("primary", "lg")}>
          Create Your T-Shirt
        </Link>
        <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className={buttonClass("outline", "lg")}>
          Follow on Instagram<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </ContentPage>
  );
}
