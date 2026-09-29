/** Size chart table (indicative demo measurements from data/content.ts). */
import { sizeCharts } from "@/data/content";
import type { Fit } from "@/lib/commerce/types";

export function SizeChart({ fit }: { fit: Fit }) {
  const chart = fit === "oversized" ? sizeCharts.oversized : fit === "kids" ? sizeCharts.kids : sizeCharts.regular;
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[280px] border-collapse text-sm">
          <caption className="mb-2 text-left text-xs text-muted">{chart.label} — measurements in inches; confirm before launch.</caption>
          <thead>
            <tr>
              {chart.columns.map((c) => (
                <th key={c} scope="col" className="border-b border-line bg-surface px-3 py-2 text-left font-semibold">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((r) => (
              <tr key={r[0]}>
                {r.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row" className="border-b border-line px-3 py-2 text-left font-semibold">
                      {cell}
                    </th>
                  ) : (
                    <td key={i} className="border-b border-line px-3 py-2">
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
