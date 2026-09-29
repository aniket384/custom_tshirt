import type { Metadata } from "next";
import { DemoNotice, OrdersList } from "@/components/account/AccountClient";
import { noindexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = noindexMetadata("My Account", "/account");

export default function AccountPage() {
  return (
    <div className="space-y-8">
      <h1 className="heading-display text-5xl">My Account</h1>
      <DemoNotice />
      <section aria-labelledby="recent-orders">
        <h2 id="recent-orders" className="mb-4 text-lg font-semibold">
          Recent orders
        </h2>
        <OrdersList limit={3} />
      </section>
    </div>
  );
}
