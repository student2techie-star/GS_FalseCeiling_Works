-- GS False Ceiling Works - Supabase Schema
-- Run this in the Supabase SQL Editor

-- 1. App Owner (Only one user allowed)
create table public.app_owner (
  user_id uuid primary key references auth.users(id)
);
-- Replace this with your actual user UUID after signing up
-- insert into public.app_owner values ('YOUR-USER-UUID');

alter table public.app_owner enable row level security;

create or replace function public.is_owner()
returns boolean
language sql security definer set search_path = public stable
as $$ 
  select exists (select 1 from public.app_owner where user_id = auth.uid()) 
$$;

-- 2. Business Profile (Single row)
create table public.business_profile (
  id integer primary key default 1 check (id = 1),
  name text not null default 'GS False Ceiling Works',
  logo_path text,
  address text,
  contact text,
  email text,
  gstin text,
  upi_id text,
  bank_details jsonb,
  terms text,
  warranty text,
  default_tax_rate numeric(5,2) default 0
);
alter table public.business_profile enable row level security;
create policy "owner reads business_profile" on public.business_profile for select to authenticated using (public.is_owner());
create policy "owner updates business_profile" on public.business_profile for update to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "owner inserts business_profile" on public.business_profile for insert to authenticated with check (public.is_owner());

-- 3. Customers
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  address text,
  gstin text,
  created_at timestamptz not null default now()
);
alter table public.customers enable row level security;
create policy "owner all customers" on public.customers for all to authenticated using (public.is_owner()) with check (public.is_owner());

-- 4. Sites
create table public.sites (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  project_name text not null,
  site_address text,
  created_at timestamptz not null default now()
);
alter table public.sites enable row level security;
create policy "owner all sites" on public.sites for all to authenticated using (public.is_owner()) with check (public.is_owner());

-- 5. Document Counters (for auto-numbering)
create table public.doc_counters (
  kind text not null, -- 'QUOTATION', 'INVOICE'
  financial_year text not null, -- e.g., '2026-27'
  last_number integer not null default 0,
  primary key (kind, financial_year)
);
alter table public.doc_counters enable row level security;
create policy "owner all doc_counters" on public.doc_counters for all to authenticated using (public.is_owner()) with check (public.is_owner());

-- Function to get next document number securely
create or replace function public.get_next_doc_number(doc_kind text, fy text)
returns integer
language plpgsql security definer set search_path = public
as $$
declare
  next_num integer;
begin
  if not public.is_owner() then
    raise exception 'Unauthorized';
  end if;
  
  insert into public.doc_counters (kind, financial_year, last_number)
  values (doc_kind, fy, 1)
  on conflict (kind, financial_year) do update
  set last_number = doc_counters.last_number + 1
  returning last_number into next_num;
  
  return next_num;
end;
$$;

-- 6. Quotations
create table public.quotations (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  customer_id uuid not null references public.customers(id),
  site_id uuid not null references public.sites(id),
  date date not null default current_date,
  valid_until date,
  status text not null default 'Draft' check (status in ('Draft', 'Sent', 'Accepted', 'Rejected')),
  discount numeric(12,2) default 0,
  tax_rate numeric(5,2) default 0,
  tax_type text default 'IGST' check (tax_type in ('IGST', 'CGST_SGST')),
  notes text,
  created_at timestamptz not null default now()
);
alter table public.quotations enable row level security;
create policy "owner all quotations" on public.quotations for all to authenticated using (public.is_owner()) with check (public.is_owner());

-- 7. Quotation Items
create table public.quotation_items (
  id uuid primary key default gen_random_uuid(),
  quotation_id uuid not null references public.quotations(id) on delete cascade,
  room text not null,
  description text not null,
  unit text not null,
  quantity numeric(10,2) not null,
  rate numeric(12,2) not null,
  discount numeric(12,2) default 0,
  note text,
  sort_order integer default 0
);
alter table public.quotation_items enable row level security;
create policy "owner all quotation_items" on public.quotation_items for all to authenticated using (public.is_owner()) with check (public.is_owner());

-- 8. Invoices
create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  customer_id uuid not null references public.customers(id),
  site_id uuid not null references public.sites(id),
  quotation_id uuid references public.quotations(id) on delete set null,
  date date not null default current_date,
  due_date date,
  discount numeric(12,2) default 0,
  tax_rate numeric(5,2) default 0,
  tax_type text default 'IGST' check (tax_type in ('IGST', 'CGST_SGST')),
  notes text,
  created_at timestamptz not null default now()
);
alter table public.invoices enable row level security;
create policy "owner all invoices" on public.invoices for all to authenticated using (public.is_owner()) with check (public.is_owner());

-- 9. Invoice Items
create table public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  room text not null,
  description text not null,
  unit text not null,
  quantity numeric(10,2) not null,
  rate numeric(12,2) not null,
  discount numeric(12,2) default 0,
  note text,
  sort_order integer default 0
);
alter table public.invoice_items enable row level security;
create policy "owner all invoice_items" on public.invoice_items for all to authenticated using (public.is_owner()) with check (public.is_owner());

-- 10. Payments
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  date date not null default current_date,
  mode text not null, -- 'UPI', 'Cash', 'Bank', 'Cheque'
  reference text,
  created_at timestamptz not null default now()
);
alter table public.payments enable row level security;
create policy "owner all payments" on public.payments for all to authenticated using (public.is_owner()) with check (public.is_owner());

-- 11. Payment Schedule
create table public.payment_schedule (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  label text not null,
  amount numeric(12,2),
  percent numeric(5,2),
  due_date date,
  sort_order integer default 0
);
alter table public.payment_schedule enable row level security;
create policy "owner all payment_schedule" on public.payment_schedule for all to authenticated using (public.is_owner()) with check (public.is_owner());

-- 12. Item Templates
create table public.item_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  unit text not null,
  default_rate numeric(12,2) not null default 0,
  note text
);
alter table public.item_templates enable row level security;
create policy "owner all item_templates" on public.item_templates for all to authenticated using (public.is_owner()) with check (public.is_owner());

-- Seed initial templates
insert into public.item_templates (name, unit, default_rate) values
  ('Gypsum Ceiling', 'sq ft', 0),
  ('Grid Ceiling', 'sq ft', 0),
  ('PVC Ceiling', 'sq ft', 0),
  ('POP Work', 'sq ft', 0),
  ('Cove Lighting Profile', 'running ft', 0),
  ('Partition', 'sq ft', 0),
  ('Painting', 'sq ft', 0),
  ('Labour', 'lump sum', 0),
  ('Material', 'lump sum', 0),
  ('Electrical Points', 'nos', 0);

-- 13. Enquiries (Public write, owner read)
create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  phone text not null check (char_length(phone) between 7 and 20),
  service text check (char_length(service) <= 60),
  message text check (char_length(message) <= 1000),
  handled boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.enquiries enable row level security;

create policy "public can send enquiries" on public.enquiries for insert to anon with check (true);
create policy "owner reads enquiries" on public.enquiries for select to authenticated using (public.is_owner());
create policy "owner updates enquiries" on public.enquiries for update to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "owner deletes enquiries" on public.enquiries for delete to authenticated using (public.is_owner());

-- 14. Works (Optional)
create table public.works (
  id uuid primary key default gen_random_uuid(),
  image_path text not null,
  title text not null,
  category text not null,
  caption text,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);
alter table public.works enable row level security;
create policy "public reads works" on public.works for select to anon, authenticated using (true);
create policy "owner all works" on public.works for all to authenticated using (public.is_owner()) with check (public.is_owner());

-- Storage
-- create bucket 'logos' and 'works' via Supabase dashboard manually, or using SQL if storage schema is exposed.
