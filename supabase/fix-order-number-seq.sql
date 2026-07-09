-- ============================================================
-- Creative Muse — Atomic Order Number Sequence + Idempotency
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Create sequence for unique order numbers
create sequence if not exists public.order_number_seq;

-- 2. Seed the sequence from the highest existing order number
--    (only runs once; subsequent setval calls are no-ops for seed)
select setval(
  'public.order_number_seq',
  coalesce(
    (
      select max(
        nullif(
          regexp_replace(order_number, '^CM-[0-9]{4}-', '', 'g'),
          ''
        )::bigint
      )
      from public.orders
      where order_number ~ '^CM-[0-9]{4}-[0-9]+$'
    ),
    0
  ),
  true
);

-- 3. Function to generate order number atomically on the database
create or replace function public.generate_order_number()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  next_number bigint;
begin
  next_number := nextval('public.order_number_seq');
  return 'CM-' || extract(year from now())::text || '-' || lpad(next_number::text, 6, '0');
end;
$$;

-- 4. Add checkout_attempt_id for idempotency
alter table public.orders
add column if not exists checkout_attempt_id uuid;

create unique index if not exists orders_checkout_attempt_id_key
on public.orders(checkout_attempt_id)
where checkout_attempt_id is not null;
