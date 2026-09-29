/** 4-step "How custom printing works" — real text, ordered list semantics. */
import { howItWorks } from "@/data/content";

export function HowItWorks({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {howItWorks.map((s) => (
        <li key={s.step} className={tone === "dark" ? "rounded-card border border-line-dark p-6" : "rounded-card border border-line bg-white p-6"}>
          <span className="heading-display grid size-12 place-items-center rounded-full bg-brand text-2xl text-ink" aria-hidden="true">
            {s.step}
          </span>
          <h3 className="mt-5 text-lg font-semibold">
            <span className="sr-only">Step {s.step}: </span>
            {s.title}
          </h3>
          <p className={`mt-2 text-sm ${tone === "dark" ? "text-muted-dark" : "text-muted"}`}>{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
