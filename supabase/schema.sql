-- Run this in the Supabase SQL editor once after creating your project.

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  amount numeric(12, 2) not null check (amount >= 0),
  category text not null check (category in (
    'rent', 'food', 'internet', 'miscellaneous', 'cosmetic', 'clothes', 'tech'
  )),
  note text,
  spent_on date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists expenses_spent_on_idx on expenses (spent_on desc);
create index if not exists expenses_category_idx on expenses (category);

create table if not exists budgets (
  category text primary key check (category in (
    'rent', 'food', 'internet', 'miscellaneous', 'cosmetic', 'clothes', 'tech'
  )),
  monthly_limit numeric(12, 2) not null check (monthly_limit >= 0),
  updated_at timestamptz not null default now()
);

-- Single-user app: open access. Replace with auth-based RLS if you ever share this.
alter table expenses enable row level security;
alter table budgets enable row level security;

drop policy if exists "anon all access on expenses" on expenses;
create policy "anon all access on expenses" on expenses
  for all using (true) with check (true);

drop policy if exists "anon all access on budgets" on budgets;
create policy "anon all access on budgets" on budgets
  for all using (true) with check (true);
