/** /cookie-policy — policy page (draft copy in data/policies.ts). */
import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/ContentPage";
import { cookiePolicy, POLICY_LAST_UPDATED } from "@/data/policies";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy",
  description: "How Custom T-Shirt Wala uses cookies and browser storage.",
  path: "/cookie-policy",
});

export default function Page() {
  return (
    <ContentPage
      title="Cookie Policy"
      path="/cookie-policy"
      lastUpdated={POLICY_LAST_UPDATED}
      sections={cookiePolicy}
    />
  );
}
