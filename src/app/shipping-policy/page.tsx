/** /shipping-policy — policy page (draft copy in data/policies.ts). */
import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/ContentPage";
import { shippingPolicy, POLICY_LAST_UPDATED } from "@/data/policies";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Shipping Policy",
  description: "How delivery works at Custom T-Shirt Wala — delivery across India, order tracking and what to expect.",
  path: "/shipping-policy",
});

export default function Page() {
  return (
    <ContentPage
      title="Shipping Policy"
      path="/shipping-policy"
      intro="We deliver custom and printed T-shirts across India."
      lastUpdated={POLICY_LAST_UPDATED}
      sections={shippingPolicy}
    />
  );
}
