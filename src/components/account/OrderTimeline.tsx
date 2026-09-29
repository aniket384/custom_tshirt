/**
 * Order status timeline (ordered list). Completed / current / upcoming
 * states are conveyed with text, not colour alone.
 */
import { ORDER_STEPS } from "@/lib/commerce/orders";
import type { OrderEvent, OrderStatus } from "@/lib/commerce/types";
import { formatDate, cn } from "@/lib/utils/format";
import { CheckIcon } from "@/components/ui/icons";

export function OrderTimeline({ status, events }: { status: OrderStatus; events?: OrderEvent[] }) {
  const current = ORDER_STEPS.findIndex((s) => s.status === status);
  return (
    <ol className="relative" aria-label="Order progress">
      {ORDER_STEPS.map((s, i) => {
        const done = i < current;
        const now = i === current;
        const at = events?.find((e) => e.status === s.status)?.at;
        return (
          <li key={s.status} className="relative flex gap-4 pb-7 last:pb-0" aria-current={now ? "step" : undefined}>
            {i < ORDER_STEPS.length - 1 && (
              <span aria-hidden="true" className={cn("absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5", i < current ? "bg-ink" : "bg-line")} />
            )}
            <span
              aria-hidden="true"
              className={cn(
                "relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2 text-xs font-bold",
                done && "border-ink bg-ink text-white",
                now && "border-ink bg-brand text-ink",
                !done && !now && "border-line bg-white text-muted",
              )}
            >
              {done ? <CheckIcon size={16} /> : i + 1}
            </span>
            <div className="pt-1">
              <p className={cn("font-semibold", !done && !now && "text-muted")}>
                {s.label}
                <span className="sr-only">{done ? " — completed" : now ? " — current status" : " — upcoming"}</span>
                {now && <span className="ml-2 rounded-full bg-brand px-2 py-0.5 text-xs">Current</span>}
              </p>
              <p className="text-sm text-muted">{s.description}</p>
              {at && (done || now) && <p className="mt-0.5 text-xs text-muted">{formatDate(at)}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
