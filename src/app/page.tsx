"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CATEGORIES, type Budget, type Category, type Expense } from "@/types";
import { fmtMoney, monthRange } from "@/lib/format";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { BudgetGrid } from "@/components/BudgetGrid";

export default function Page() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Record<Category, number>>(
    Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as Record<Category, number>
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { start, end } = monthRange();
    const [exp, bud] = await Promise.all([
      supabase
        .from("expenses")
        .select("*")
        .gte("spent_on", start)
        .lt("spent_on", end)
        .order("spent_on", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase.from("budgets").select("*"),
    ]);
    if (exp.error) setError(exp.error.message);
    if (bud.error) setError(bud.error.message);
    setExpenses((exp.data ?? []) as Expense[]);
    const map = Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as Record<Category, number>;
    for (const b of (bud.data ?? []) as Budget[]) map[b.category] = Number(b.monthly_limit);
    setBudgets(map);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const totals = useMemo(() => {
    const t = Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as Record<Category, number>;
    for (const e of expenses) t[e.category] += Number(e.amount);
    return t;
  }, [expenses]);

  const monthTotal = useMemo(
    () => Object.values(totals).reduce((a, b) => a + b, 0),
    [totals]
  );
  const budgetTotal = useMemo(
    () => Object.values(budgets).reduce((a, b) => a + b, 0),
    [budgets]
  );

  const addExpense = async (input: {
    amount: number;
    category: Category;
    note: string;
    spent_on: string;
  }) => {
    const { error } = await supabase.from("expenses").insert({
      amount: input.amount,
      category: input.category,
      note: input.note || null,
      spent_on: input.spent_on,
    });
    if (error) {
      setError(error.message);
      return;
    }
    await load();
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }
    setExpenses((xs) => xs.filter((x) => x.id !== id));
  };

  const setBudget = async (category: Category, monthly_limit: number) => {
    const { error } = await supabase
      .from("budgets")
      .upsert({ category, monthly_limit, updated_at: new Date().toISOString() });
    if (error) {
      setError(error.message);
      return;
    }
    setBudgets((b) => ({ ...b, [category]: monthly_limit }));
  };

  const monthName = new Date().toLocaleDateString("cs-CZ", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <header className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Budget</h1>
          <p className="mt-1 text-sm text-mute capitalize">{monthName}</p>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wider text-mute">Spent this month</div>
          <div className="text-2xl font-semibold tabular-nums sm:text-3xl">
            {fmtMoney(monthTotal)}
          </div>
          {budgetTotal > 0 && (
            <div className="text-xs text-mute tabular-nums">
              of {fmtMoney(budgetTotal)} ({Math.round((monthTotal / budgetTotal) * 100)}%)
            </div>
          )}
        </div>
      </header>

      {error && (
        <div className="mb-6 rounded-md border border-bad/40 bg-bad/10 px-4 py-3 text-sm text-bad">
          {error}
        </div>
      )}

      <section className="mb-8">
        <ExpenseForm onSubmit={addExpense} />
      </section>

      <section className="mb-8 grid gap-6 lg:grid-cols-2">
        <CategoryBreakdown totals={totals} budgets={budgets} />
        <BudgetGrid totals={totals} budgets={budgets} onChange={setBudget} />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-mute">
          Recent expenses
        </h2>
        <ExpenseList expenses={expenses} loading={loading} onDelete={deleteExpense} />
      </section>

      <footer className="mt-16 text-center text-xs text-mute">
        {CATEGORIES.length} categories · {expenses.length} entries this month
      </footer>
    </main>
  );
}
