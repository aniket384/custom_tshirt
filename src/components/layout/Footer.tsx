/**
 * Global footer (Server Component). Only confirmed brand facts are shown;
 * WhatsApp / email appear only when configured via env variables.
 */
import Link from "next/link";
import { footerNav, legalNav } from "@/config/navigation";
import { siteConfig, whatsappLink } from "@/config/site";
import { Logo } from "./Logo";
import { InstagramIcon, MailIcon, MapPinIcon, WhatsAppIcon } from "@/components/ui/icons";

export function Footer() {
  const wa = whatsappLink("Hi! I have a question about a custom T-shirt.");
  const email = siteConfig.contact.email;
  // Server Component: rendered once on the server, so no hydration mismatch.
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark mt-auto bg-ink text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <Logo tone="light" size="md" />
          <p className="mt-4 font-marker text-lg text-brand">{siteConfig.tagline}</p>
          <p className="mt-3 flex items-center gap-2 text-sm text-muted-dark">
            <MapPinIcon size={16} />
            {siteConfig.location.city}, {siteConfig.location.region}
          </p>
          <p className="mt-1 text-sm text-muted-dark">{siteConfig.location.deliveryArea}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            <li>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-dark px-4 text-sm hover:border-brand"
              >
                <InstagramIcon size={18} /> Instagram<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            {wa && (
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-dark px-4 text-sm hover:border-brand">
                  <WhatsAppIcon size={18} /> WhatsApp
                </a>
              </li>
            )}
            {email && (
              <li>
                <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-dark px-4 text-sm hover:border-brand">
                  <MailIcon size={18} /> Email
                </a>
              </li>
            )}
          </ul>
        </div>

        {footerNav.map((col) => (
          <nav key={col.title} aria-label={`Footer — ${col.title}`}>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand">{col.title}</h2>
            <ul className="space-y-1">
              {col.links.map((l) => (
                <li key={l.href}>
                  {l.href.startsWith("http") ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center text-sm text-muted-dark hover:text-white">
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className="inline-flex min-h-10 items-center text-sm text-muted-dark hover:text-white">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-line-dark">
        <div className="container-page flex flex-col gap-4 py-6 text-xs text-muted-dark md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
            {siteConfig.isDemo && <span className="ml-2">Prototype store — products, prices and orders are demo data.</span>}
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {legalNav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-8 items-center hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
