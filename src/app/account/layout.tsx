/** Account area layout — private, never indexed. */
import type { Metadata } from "next";
import { AccountNav } from "@/components/account/AccountNav";

export const metadata: Metadata = { robots: { index: false, follow: true } };

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return (
    <div className="container-page grid gap-6 py-8 md:grid-cols-[200px_1fr] md:gap-10 md:py-12">
      <AccountNav />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
