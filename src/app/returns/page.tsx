/** /returns — policy page (draft copy in data/policies.ts). */
import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/ContentPage";
import { returnsPolicy, POLICY_LAST_UPDATED } from "@/data/policies";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Returns & Exchanges",
  description: "Returns, exchanges and refunds for custom-printed and ready-to-wear T-shirts at Custom T-Shirt Wala.",
  path: "/returns",
});

export default function Page() {
  return (
    <ContentPage
      title="Returns & Exchanges"
      path="/returns"
      intro="How returns and exchanges work for custom and ready-to-wear products."
      lastUpdated={POLICY_LAST_UPDATED}
      sections={returnsPolicy}
    />
  );
}
