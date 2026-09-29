/** /terms-and-conditions — policy page (draft copy in data/policies.ts). */
import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/ContentPage";
import { termsPolicy, POLICY_LAST_UPDATED } from "@/data/policies";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description: "Terms for using the Custom T-Shirt Wala website and ordering custom T-shirts.",
  path: "/terms-and-conditions",
});

export default function Page() {
  return (
    <ContentPage
      title="Terms & Conditions"
      path="/terms-and-conditions"
      lastUpdated={POLICY_LAST_UPDATED}
      sections={termsPolicy}
    />
  );
}
