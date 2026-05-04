"use client";

import { useState } from "react";
import { CATEGORIES, CATEGORY_LABEL, type Category } from "@/types";

type Props = {
  onSubmit: (e: {
    amount: number;
    category: Category;
    note: string;
    spent_on: string;
  }) => Promise<void>;
};

const today = () => new Date().toISOString().slice(0, 10);

export function ExpenseForm({ onSubmit }: Props) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("food");
  const [note, setNote] = useState("");
  const [spentOn, setSpentOn] = useState(today());
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(amount);
    if (!Number.isFinite(n) || n < 0) return;
    setBusy(true);
    await onSubmit({ amount: n, category, note: note.trim(), spent_on: spentOn });
    setAmount("");
    setNote("");
    setBusy(false);
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-line bg-panel p-4 shadow-sm sm:p-5"
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1.4fr_auto] sm:items-end">
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wider text-mute">Amount</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full rounded-md border border-line bg-panel2 px-3 py-2 text-base tabular-nums outline-none focus:border-accent"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wider text-mute">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full rounded-md border border-line bg-panel2 px-3 py-2 text-base outline-none focus:border-accent"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-1">
          <span className="mb-1 block text-xs uppercase tracking-wider text-mute">Note</span>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="optional"
            className="w-full rounded-md border border-line bg-panel2 px-3 py-2 text-base outline-none focus:border-accent"
          />
        </label>
        <button
          type="submit"
          disabled={busy || !amount}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40"
        >
          {busy ? "Adding…" : "Add"}
        </button>
      </div>
      <div className="mt-3">
        <label className="block max-w-xs">
          <span className="mb-1 block text-xs uppercase tracking-wider text-mute">Date</span>
          <input
            type="date"
            value={spentOn}
            onChange={(e) => setSpentOn(e.target.value)}
            className="w-full rounded-md border border-line bg-panel2 px-3 py-2 text-base outline-none focus:border-accent"
          />
        </label>
      </div>
    </form>
  );
}
