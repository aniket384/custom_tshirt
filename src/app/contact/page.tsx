/**
 * /contact — shows only configured channels (Instagram always; WhatsApp /
 * email only when set via env). No invented phone number or address.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { InstagramIcon, MailIcon, MapPinIcon, WhatsAppIcon } from "@/components/ui/icons";
import { siteConfig, whatsappLink } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, graph } from "@/lib/seo/jsonld";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description: "Get in touch with Custom T-Shirt Wala for custom T-shirt orders, bulk quotes and order help. Based in Datia, Madhya Pradesh.",
  path: "/contact",
});

export default function ContactPage() {
  const wa = whatsappLink("Hi! I have a question about a custom T-shirt.");
  const email = siteConfig.contact.email;
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Contact", href: "/contact" },
  ];
  const card = "flex min-h-24 items-center gap-4 rounded-card border border-line bg-white p-5 hover:border-ink";
  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs items={crumbs} />
      <h1 className="heading-display mt-5 text-5xl md:text-6xl">Contact Us</h1>
      <p className="mt-3 max-w-xl text-muted md:text-lg">Questions about a custom design, a bulk order or an existing order? Reach us here.</p>
      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        <li>
          <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className={card}>
            <InstagramIcon size={28} />
            <span>
              <span className="block font-semibold">Instagram</span>
              <span className="text-sm text-muted">{siteConfig.social.instagramHandle} — send us a DM</span>
            </span>
          </a>
        </li>
        {wa && (
          <li>
            <a href={wa} target="_blank" rel="noopener noreferrer" className={card}>
              <WhatsAppIcon size={28} />
              <span>
                <span className="block font-semibold">WhatsApp</span>
                <span className="text-sm text-muted">Chat with us</span>
              </span>
            </a>
          </li>
        )}
        {email && (
          <li>
            <a href={`mailto:${email}`} className={card}>
              <MailIcon size={28} />
              <span>
                <span className="block font-semibold">Email</span>
                <span className="text-sm text-muted">{email}</span>
              </span>
            </a>
          </li>
        )}
        <li>
          <div className={card}>
            <MapPinIcon size={28} />
            <span>
              <span className="block font-semibold">Location</span>
              <span className="text-sm text-muted">
                {siteConfig.location.city}, {siteConfig.location.region} · {siteConfig.location.deliveryArea}
              </span>
            </span>
          </div>
        </li>
      </ul>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Link href="/bulk-orders" className="rounded-card bg-ink p-6 text-white">
          <span className="heading-display block text-2xl text-brand">Bulk orders</span>
          <span className="mt-1 block text-sm text-muted-dark">Request a quote for teams and events →</span>
        </Link>
        <Link href="/track-order" className="rounded-card bg-surface p-6">
          <span className="heading-display block text-2xl">Track order</span>
          <span className="mt-1 block text-sm text-muted">Check your order status →</span>
        </Link>
        <Link href="/faq" className="rounded-card bg-surface p-6">
          <span className="heading-display block text-2xl">FAQ</span>
          <span className="mt-1 block text-sm text-muted">Quick answers →</span>
        </Link>
      </div>
      <JsonLd data={graph(breadcrumbJsonLd(crumbs))} />
    </div>
  );
}
