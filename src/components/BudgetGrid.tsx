"use client";

import { useState } from "react";
import { CATEGORIES, CATEGORY_COLOR, CATEGORY_LABEL, type Category } from "@/types";
import { fmtMoney } from "@/lib/format";

type Props = {
  totals: Record<Category, number>;
  budgets: Record<Category, number>;
  onChange: (c: Category, limit: number) => Promise<void>;
};

export function BudgetGrid({ totals, budgets, onChange }: Props) {
  return (
    <div className="rounded-xl border border-line bg-panel p-5">
      <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-mute">
        Monthly limits
      </h2>
      <ul className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((c) => (
          <BudgetRow
            key={c}
            category={c}
            spent={totals[c]}
            limit={budgets[c]}
            onChange={onChange}
          />
        ))}
      </ul>
      <p className="mt-4 text-xs text-mute">
        Set 0 to leave a category uncapped. Bars turn red when you exceed a limit.
      </p>
    </div>
  );
}

function BudgetRow({
  category,
  spent,
  limit,
  onChange,
}: {
  category: Category;
  spent: number;
  limit: number;
  onChange: (c: Category, limit: number) => Promise<void>;
}) {
  const [value, setValue] = useState(String(limit || ""));
  const [editing, setEditing] = useState(false);

  const commit = async () => {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) {
      setValue(String(limit || ""));
      setEditing(false);
      return;
    }
    if (n !== limit) await onChange(category, n);
    setEditing(false);
  };

  const pct = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
  const over = limit > 0 && spent > limit;

  return (
    <li className="rounded-lg border border-line bg-panel2 p-3">
      <div className="mb-2 flex items-center gap-2 text-sm">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: CATEGORY_COLOR[category] }}
          aria-hidden
        />
        <span className="font-medium">{CATEGORY_LABEL[category]}</span>
      </div>
      {editing ? (
        <input
          autoFocus
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            if (e.key === "Escape") {
              setValue(String(limit || ""));
              setEditing(false);
            }
          }}
          placeholder="Limit"
          className="w-full rounded-md border border-line bg-panel px-2 py-1 text-sm tabular-nums outline-none focus:border-accent"
        />
      ) : (
        <button
          onClick={() => {
            setValue(String(limit || ""));
            setEditing(true);
          }}
          className="w-full text-left text-sm tabular-nums"
        >
          {limit > 0 ? (
            <span className={over ? "text-bad" : ""}>
              {fmtMoney(spent)} / {fmtMoney(limit)}
            </span>
          ) : (
            <span className="text-mute">No limit · tap to set</span>
          )}
        </button>
      )}
      {limit > 0 && (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-panel">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              background: over ? "#ff5d6c" : CATEGORY_COLOR[category],
            }}
          />
        </div>
      )}
    </li>
  );
}
