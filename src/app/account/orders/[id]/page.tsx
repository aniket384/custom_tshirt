import type { Metadata } from "next";
import Link from "next/link";
import { OrderDetail } from "@/components/account/AccountClient";
import { noindexMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/account/orders/[id]">): Promise<Metadata> {
  const { id } = await params;
  return noindexMetadata(`Order ${id}`, `/account/orders/${id}`);
}

export default async function OrderPage({ params }: PageProps<"/account/orders/[id]">) {
  const { id } = await params;
  const safeId = decodeURIComponent(id).slice(0, 40);
  return (
    <div className="space-y-6">
      <Link href="/account/orders" className="text-sm font-semibold underline underline-offset-4">
        ← All orders
      </Link>
      <h1 className="heading-display text-4xl md:text-5xl">Order {safeId}</h1>
      <OrderDetail id={safeId} />
    </div>
  );
}
