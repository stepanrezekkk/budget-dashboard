"use client";

import { CATEGORY_COLOR, CATEGORY_LABEL, type Expense } from "@/types";
import { fmtDate, fmtMoney } from "@/lib/format";

type Props = {
  expenses: Expense[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
};

export function ExpenseList({ expenses, loading, onDelete }: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border border-line bg-panel p-6 text-center text-sm text-mute">
        Loading…
      </div>
    );
  }
  if (expenses.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-panel p-6 text-center text-sm text-mute">
        No expenses yet this month. Add your first above.
      </div>
    );
  }
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-panel">
      {expenses.map((e) => (
        <li
          key={e.id}
          className="group flex items-center gap-3 px-4 py-3 sm:px-5"
        >
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: CATEGORY_COLOR[e.category] }}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm">
              <span className="font-medium">{CATEGORY_LABEL[e.category]}</span>
              {e.note && <span className="text-mute"> · {e.note}</span>}
            </div>
            <div className="text-xs text-mute">{fmtDate(e.spent_on)}</div>
          </div>
          <div className="tabular-nums text-sm font-medium">{fmtMoney(Number(e.amount))}</div>
          <button
            onClick={() => onDelete(e.id)}
            className="ml-2 rounded p-1 text-mute opacity-0 transition hover:bg-bad/10 hover:text-bad group-hover:opacity-100"
            aria-label="Delete expense"
            title="Delete"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  );
}
