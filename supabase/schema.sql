-- ============================================================
-- Budget App Schema
-- Run this in your Supabase project SQL editor
-- ============================================================

-- Categories (Income / Savings / Expense groups)
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  icon        text not null default '',
  type        text not null check (type in ('income', 'savings', 'expense')),
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- Budget items (individual line items within a category)
create table public.budget_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  name        text not null,
  amount      numeric(10,2) not null default 0,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.categories   enable row level security;
alter table public.budget_items enable row level security;

create policy "Users own their categories"
  on public.categories for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users own their budget items"
  on public.budget_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- Seed function — call after first sign-in to populate defaults
-- ============================================================
create or replace function public.seed_default_budget(p_user_id uuid)
returns void language plpgsql security definer as $$
declare
  cat_income_id    uuid;
  cat_savings_id   uuid;
  cat_housing_id   uuid;
  cat_transport_id uuid;
  cat_food_id      uuid;
  cat_bills_id     uuid;
  cat_subs_id      uuid;
begin
  -- Skip if user already has data
  if exists (select 1 from public.categories where user_id = p_user_id) then
    return;
  end if;

  -- Income
  insert into public.categories (user_id, name, icon, type, sort_order)
    values (p_user_id, 'Income', '💵', 'income', 0)
    returning id into cat_income_id;

  insert into public.budget_items (user_id, category_id, name, amount, sort_order) values
    (p_user_id, cat_income_id, 'Salary', 4067, 0);

  -- Savings
  insert into public.categories (user_id, name, icon, type, sort_order)
    values (p_user_id, 'Savings', '🏦', 'savings', 1)
    returning id into cat_savings_id;

  insert into public.budget_items (user_id, category_id, name, amount, sort_order) values
    (p_user_id, cat_savings_id, 'Savings', 1000, 0);

  -- Housing
  insert into public.categories (user_id, name, icon, type, sort_order)
    values (p_user_id, 'Housing', '🏠', 'expense', 2)
    returning id into cat_housing_id;

  insert into public.budget_items (user_id, category_id, name, amount, sort_order) values
    (p_user_id, cat_housing_id, 'Rent',                  1350, 0),
    (p_user_id, cat_housing_id, 'House (Stableford)',     100,  1),
    (p_user_id, cat_housing_id, 'OVO (Elec, Gas, Water)', 160,  2);

  -- Transport
  insert into public.categories (user_id, name, icon, type, sort_order)
    values (p_user_id, 'Transport', '🚗', 'expense', 3)
    returning id into cat_transport_id;

  insert into public.budget_items (user_id, category_id, name, amount, sort_order) values
    (p_user_id, cat_transport_id, 'Car',           0,   0),
    (p_user_id, cat_transport_id, 'Car Petrol',    100, 1),
    (p_user_id, cat_transport_id, 'Car Insurance', 135, 2),
    (p_user_id, cat_transport_id, 'Car Tax',       35,  3);

  -- Food & Groceries
  insert into public.categories (user_id, name, icon, type, sort_order)
    values (p_user_id, 'Food & Groceries', '🍔', 'expense', 4)
    returning id into cat_food_id;

  insert into public.budget_items (user_id, category_id, name, amount, sort_order) values
    (p_user_id, cat_food_id, 'Groceries',       300, 0),
    (p_user_id, cat_food_id, 'Food (Eating Out)', 50, 1),
    (p_user_id, cat_food_id, 'Entertainment',   200, 2);

  -- Bills & Utilities
  insert into public.categories (user_id, name, icon, type, sort_order)
    values (p_user_id, 'Bills & Utilities', '💳', 'expense', 5)
    returning id into cat_bills_id;

  insert into public.budget_items (user_id, category_id, name, amount, sort_order) values
    (p_user_id, cat_bills_id, 'Tax',     200, 0),
    (p_user_id, cat_bills_id, 'WiFi',     25, 1),
    (p_user_id, cat_bills_id, 'Phone',    20, 2),
    (p_user_id, cat_bills_id, 'Revolut',  14, 3);

  -- Subscriptions
  insert into public.categories (user_id, name, icon, type, sort_order)
    values (p_user_id, 'Subscriptions', '📱', 'expense', 6)
    returning id into cat_subs_id;

  insert into public.budget_items (user_id, category_id, name, amount, sort_order) values
    (p_user_id, cat_subs_id, 'YouTube Premium', 5,  0),
    (p_user_id, cat_subs_id, 'iCloud 200GB',    9,  1),
    (p_user_id, cat_subs_id, 'Netflix',         10, 2),
    (p_user_id, cat_subs_id, 'Claude',          18, 3);

end;
$$;

-- ============================================================
-- Auto-seed on first sign-up via trigger
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  perform public.seed_default_budget(new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
