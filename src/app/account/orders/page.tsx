import type { Metadata } from "next";
import { DemoNotice, OrdersList } from "@/components/account/AccountClient";
import { noindexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = noindexMetadata("My Orders", "/account/orders");

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="heading-display text-5xl">My Orders</h1>
      <DemoNotice />
      <OrdersList />
    </div>
  );
}
