-- Run this in the Supabase SQL editor once after creating your project.
-- Auth model: per-user rows, RLS gated on auth.uid().

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(12, 2) not null check (amount >= 0),
  category text not null check (category in (
    'rent', 'food', 'internet', 'miscellaneous', 'cosmetic', 'clothes', 'tech'
  )),
  note text,
  spent_on date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists expenses_user_spent_idx on expenses (user_id, spent_on desc);
create index if not exists expenses_user_category_idx on expenses (user_id, category);

create table if not exists budgets (
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in (
    'rent', 'food', 'internet', 'miscellaneous', 'cosmetic', 'clothes', 'tech'
  )),
  monthly_limit numeric(12, 2) not null check (monthly_limit >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, category)
);

alter table expenses enable row level security;
alter table budgets enable row level security;

drop policy if exists "anon all access on expenses" on expenses;
drop policy if exists "anon all access on budgets" on budgets;

drop policy if exists "expenses owner select" on expenses;
drop policy if exists "expenses owner insert" on expenses;
drop policy if exists "expenses owner update" on expenses;
drop policy if exists "expenses owner delete" on expenses;

create policy "expenses owner select" on expenses
  for select using (auth.uid() = user_id);
create policy "expenses owner insert" on expenses
  for insert with check (auth.uid() = user_id);
create policy "expenses owner update" on expenses
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "expenses owner delete" on expenses
  for delete using (auth.uid() = user_id);

drop policy if exists "budgets owner select" on budgets;
drop policy if exists "budgets owner insert" on budgets;
drop policy if exists "budgets owner update" on budgets;
drop policy if exists "budgets owner delete" on budgets;

create policy "budgets owner select" on budgets
  for select using (auth.uid() = user_id);
create policy "budgets owner insert" on budgets
  for insert with check (auth.uid() = user_id);
create policy "budgets owner update" on budgets
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "budgets owner delete" on budgets
  for delete using (auth.uid() = user_id);
