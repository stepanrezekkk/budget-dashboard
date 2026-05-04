"use client";

import { CATEGORIES, CATEGORY_COLOR, CATEGORY_LABEL, type Category } from "@/types";
import { fmtMoney } from "@/lib/format";

type Props = {
  totals: Record<Category, number>;
  budgets: Record<Category, number>;
};

export function CategoryBreakdown({ totals, budgets }: Props) {
  const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);
  const sorted = [...CATEGORIES].sort((a, b) => totals[b] - totals[a]);

  return (
    <div className="rounded-xl border border-line bg-panel p-5">
      <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-mute">
        By category
      </h2>
      <ul className="space-y-3">
        {sorted.map((c) => {
          const spent = totals[c];
          const limit = budgets[c];
          const share = grandTotal > 0 ? (spent / grandTotal) * 100 : 0;
          const overLimit = limit > 0 && spent > limit;
          return (
            <li key={c}>
              <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: CATEGORY_COLOR[c] }}
                    aria-hidden
                  />
                  <span>{CATEGORY_LABEL[c]}</span>
                </div>
                <div className="tabular-nums">
                  <span className={overLimit ? "text-bad" : ""}>{fmtMoney(spent)}</span>
                  {limit > 0 && (
                    <span className="text-mute"> / {fmtMoney(limit)}</span>
                  )}
                </div>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-panel2">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, share)}%`,
                    background: CATEGORY_COLOR[c],
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      {grandTotal === 0 && (
        <p className="mt-4 text-xs text-mute">Add an expense to see the breakdown.</p>
      )}
    </div>
  );
}
