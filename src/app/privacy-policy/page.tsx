/** /privacy-policy — policy page (draft copy in data/policies.ts). */
import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/ContentPage";
import { privacyPolicy, POLICY_LAST_UPDATED } from "@/data/policies";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How Custom T-Shirt Wala handles your personal information.",
  path: "/privacy-policy",
});

export default function Page() {
  return (
    <ContentPage
      title="Privacy Policy"
      path="/privacy-policy"
      lastUpdated={POLICY_LAST_UPDATED}
      sections={privacyPolicy}
    />
  );
}
