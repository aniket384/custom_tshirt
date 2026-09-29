/**
 * Simple long-form content layout (about, policies...). Pass sections as
 * data so copy can move to a CMS later without touching layout.
 */
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, graph } from "@/lib/seo/jsonld";

export interface ContentSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  /** Mark copy that must be confirmed by the business before launch. */
  placeholder?: boolean;
}

interface Props {
  title: string;
  path: string;
  intro?: string;
  sections: ContentSection[];
  lastUpdated?: string;
  children?: React.ReactNode;
}

export function ContentPage({ title, path, intro, sections, lastUpdated, children }: Props) {
  const crumbs = [
    { name: "Home", href: "/" },
    { name: title, href: path },
  ];
  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs items={crumbs} />
      <article className="mx-auto mt-8 max-w-3xl">
        <h1 className="heading-display text-5xl md:text-6xl">{title}</h1>
        {lastUpdated && <p className="mt-3 text-sm text-muted">Last updated: {lastUpdated}</p>}
        {intro && <p className="mt-5 text-lg text-muted">{intro}</p>}
        <div className="mt-10 space-y-10">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-2xl font-semibold">{s.heading}</h2>
              {s.placeholder && (
                <p className="mt-2 inline-flex rounded-full bg-brand px-3 py-1 text-xs font-semibold">Placeholder — to be confirmed by the business</p>
              )}
              {s.paragraphs?.map((p) => (
                <p key={p} className="mt-3 leading-relaxed text-ink/85">
                  {p}
                </p>
              ))}
              {s.list && (
                <ul className="mt-3 list-disc space-y-1.5 pl-6 text-ink/85">
                  {s.list.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
        {children}
      </article>
      <JsonLd data={graph(breadcrumbJsonLd(crumbs))} />
    </div>
  );
}
