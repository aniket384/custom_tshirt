/** Renders structured blog blocks as semantic HTML (no raw HTML injection). */
import type { BlogBlock } from "@/data/blog";

export function ArticleBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="space-y-5 text-base leading-relaxed text-ink/90 md:text-lg">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} className="heading-display pt-4 text-3xl text-ink">
                {b.text}
              </h2>
            );
          case "ul":
            return (
              <ul key={i} className="list-disc space-y-2 pl-6">
                {b.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="list-decimal space-y-2 pl-6">
                {b.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ol>
            );
          case "tip":
            return (
              <aside key={i} className="rounded-card border-l-4 border-brand bg-surface p-4 text-base">
                {b.text}
              </aside>
            );
          default:
            return <p key={i}>{b.text}</p>;
        }
      })}
    </div>
  );
}
