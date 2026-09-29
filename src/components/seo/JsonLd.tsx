/**
 * Renders a JSON-LD <script>. Server Component only.
 *
 * `<` is escaped so user/content strings can never close the script tag.
 * Render each entity ONCE per page (see lib/seo/jsonld.ts rules).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
