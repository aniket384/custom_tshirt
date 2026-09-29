/**
 * HOMEPAGE (Server Component, statically rendered).
 *
 * Section order follows the brief: hero → categories → customise → best
 * sellers → moments → styles → bulk → personal → fitness → new arrivals →
 * why us → how it works → Instagram → testimonials → FAQ → final CTA.
 * Each section is its own component so it can be re-ordered or A/B tested.
 */
import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { CategoryQuickNav } from "@/components/home/CategoryQuickNav";
import { CustomiseFeature } from "@/components/home/CustomiseFeature";
import { FeatureSplit } from "@/components/home/FeatureSplit";
import { PersonalFeature } from "@/components/home/PersonalFeature";
import { HowItWorks } from "@/components/home/HowItWorks";
import { InstagramShowcase } from "@/components/home/InstagramShowcase";
import { FinalCta } from "@/components/home/FinalCta";
import { Section } from "@/components/ui/Section";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { ProductRail } from "@/components/product/ProductGrid";
import { ReviewSection } from "@/components/product/ReviewSection";
import { CategoryCard } from "@/components/ecommerce/CategoryCard";
import { TrustStrip } from "@/components/ecommerce/TrustStrip";
import { getAllCategories, getBestSellers, getNewArrivals } from "@/lib/commerce/catalog";
import { generalFaqs, moments, styles } from "@/data/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} — Custom T-Shirts & Personalised Printing | ${siteConfig.tagline}`,
  description:
    "Design custom T-shirts with your photo, name or quote, or shop printed, oversized, couple, kids, family, gym and corporate T-shirts and hoodies. Bulk orders and delivery across India.",
  path: "/",
  absoluteTitle: true,
});

export default async function HomePage() {
  const [categories, bestSellers, newArrivals] = await Promise.all([getAllCategories(), getBestSellers(8), getNewArrivals(8)]);

  return (
    <>
      <Hero />
      <CategoryQuickNav categories={categories} />
      <CustomiseFeature />

      <Section id="best-sellers" eyebrow="Most picked" title="Best Sellers" action={{ href: "/collections/best-sellers", label: "Shop all best sellers" }}>
        <ProductRail products={bestSellers} label="Best selling products" />
      </Section>

      <Section id="moments" eyebrow="Shop by moment" title="For every moment" intro="Birthdays, trips, gym days and team events — find a T-shirt for the occasion." tone="surface">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {moments.map((m) => (
            <li key={m.href}>
              <CategoryCard href={m.href} title={m.name} image={m.image} aspect="square" sizes="(min-width: 768px) 31vw, 46vw" />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="styles" eyebrow="Shop by style" title="Find your style" action={{ href: "/collections", label: "All collections" }}>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {styles.map((s) => (
            <li key={s.href}>
              <CategoryCard href={s.href} title={s.name} image={s.image} sizes="(min-width: 768px) 23vw, 46vw" />
            </li>
          ))}
        </ul>
      </Section>

      <FeatureSplit
        id="bulk"
        tone="dark"
        eyebrow="Corporate & bulk"
        title={
          <>
            More than
            <br />
            <span className="text-brand">just T-shirts.</span>
          </>
        }
        text="Custom apparel for teams, companies, events, colleges and communities."
        bullets={["Company teams", "Events & runs", "Colleges & fests", "Clubs & communities"]}
        image={{ src: "/images/home/bulk.webp", alt: "Team T-shirts in navy, white and black with a company logo", width: 1200, height: 900 }}
        primary={{ href: "/bulk-orders", label: "Request a Bulk Quote" }}
        secondary={{ href: "/shop/bulk-event-t-shirts", label: "Explore Bulk Orders" }}
      />

      <Section id="personal" eyebrow="Kids • Family • Couples" title="Make it personal.">
        <PersonalFeature />
      </Section>

      <FeatureSplit
        id="fitness"
        tone="surface"
        reverse
        eyebrow="Gym & fitness"
        title="Wear your energy."
        text="Motivation quotes, training graphics and custom tees for your gym, running club or fitness studio."
        image={{ src: "/images/home/gym.webp", alt: "Black and grey gym T-shirts with motivation quotes", width: 1200, height: 900 }}
        primary={{ href: "/shop/gym-t-shirts", label: "Shop Fitness T-Shirts" }}
      />

      <Section id="new-arrivals" eyebrow="Just in" title="New Arrivals" action={{ href: "/collections/new-arrivals", label: "Shop new arrivals" }}>
        <ProductRail products={newArrivals} label="New arrivals" />
      </Section>

      <Section id="why-us" eyebrow="Why Custom T-Shirt Wala" title="Made around you" tone="surface">
        <TrustStrip />
      </Section>

      <Section id="how-it-works" eyebrow="Custom printing" title="How it works" action={{ href: "/custom-tshirt", label: "Open the customiser" }}>
        <HowItWorks />
      </Section>

      <Section id="instagram" eyebrow={siteConfig.social.instagramHandle} title="On Instagram" tone="surface">
        <InstagramShowcase />
      </Section>

      <Section id="testimonials" eyebrow="What people say" title="Testimonials">
        <ReviewSection mode="samples" />
      </Section>

      <Section id="faq" eyebrow="Questions" title="FAQ" action={{ href: "/faq", label: "All FAQs" }} tone="surface">
        <div className="max-w-3xl">
          <FAQAccordion faqs={generalFaqs} />
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
