create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  slug text;
  tries int := 0;
begin
  loop
    slug := 'nf-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
    begin
      insert into public.users (
        id,
        email,
        booking_slug,
        stripe_subscription_status
      )
      values (
        new.id,
        new.email,
        slug,
        'inactive'
      );
      exit;
    exception
      when unique_violation then
        tries := tries + 1;
        if tries > 10 then
          raise;
        end if;
    end;
  end loop;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_auth_user();

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  email text,
  booking_slug text not null unique,

  business_name text,
  business_phone text,
  business_address text,

  default_appointment_fee_cents integer not null default 0,
  currency text not null default 'usd',

  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_subscription_status text not null default 'inactive',

  google_access_token text,
  google_refresh_token text,
  google_token_expires_at timestamptz,
  google_calendar_id text
);

create trigger users_set_updated_at
before update on public.users
for each row execute procedure public.set_updated_at();

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  name text not null,
  email text,
  phone text,
  address text
);

create index if not exists clients_user_id_idx on public.clients (user_id);
create index if not exists clients_user_id_email_idx on public.clients (user_id, email);

create trigger clients_set_updated_at
before update on public.clients
for each row execute procedure public.set_updated_at();

create type public.appointment_status as enum ('scheduled', 'completed', 'canceled');

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  start_at timestamptz not null,
  end_at timestamptz not null,
  status public.appointment_status not null default 'scheduled',

  signing_address text,
  notes text,
  fee_cents integer not null default 0,

  google_event_id text
);

create index if not exists appointments_user_id_start_at_idx on public.appointments (user_id, start_at);
create index if not exists appointments_client_id_idx on public.appointments (client_id);

create trigger appointments_set_updated_at
before update on public.appointments
for each row execute procedure public.set_updated_at();

create type public.invoice_status as enum ('draft', 'sent', 'paid');

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  appointment_id uuid not null references public.appointments (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  status public.invoice_status not null default 'draft',

  currency text not null default 'usd',
  subtotal_cents integer not null default 0,
  total_cents integer not null default 0,

  public_id text not null unique,

  stripe_checkout_session_id text,
  stripe_checkout_url text,
  stripe_payment_intent_id text,
  paid_at timestamptz
);

create unique index if not exists invoices_appointment_id_uniq on public.invoices (appointment_id);
create index if not exists invoices_user_id_created_at_idx on public.invoices (user_id, created_at);

create trigger invoices_set_updated_at
before update on public.invoices
for each row execute procedure public.set_updated_at();

create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices (id) on delete cascade,
  created_at timestamptz not null default now(),

  description text not null,
  quantity numeric(10,2) not null default 1,
  unit_amount_cents integer not null default 0,
  sort_order integer not null default 0
);

create index if not exists invoice_items_invoice_id_idx on public.invoice_items (invoice_id);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  invoice_id uuid not null references public.invoices (id) on delete cascade,
  created_at timestamptz not null default now(),

  stripe_event_id text not null unique,
  amount_cents integer not null,
  currency text not null default 'usd',
  status text not null,
  paid_at timestamptz
);

create index if not exists payments_user_id_created_at_idx on public.payments (user_id, created_at);
create index if not exists payments_invoice_id_idx on public.payments (invoice_id);

create type public.expense_category as enum ('printing', 'shipping', 'supplies', 'parking', 'tolls', 'other');

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  appointment_id uuid references public.appointments (id) on delete set null,
  created_at timestamptz not null default now(),

  incurred_on date not null,
  category public.expense_category not null,
  amount_cents integer not null,
  notes text
);

create index if not exists expenses_user_id_incurred_on_idx on public.expenses (user_id, incurred_on);

create table if not exists public.mileage_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  appointment_id uuid not null references public.appointments (id) on delete cascade,
  created_at timestamptz not null default now(),

  miles numeric(10,2) not null,
  origin_lat double precision,
  origin_lng double precision,
  destination_lat double precision,
  destination_lng double precision
);

create index if not exists mileage_entries_user_id_created_at_idx on public.mileage_entries (user_id, created_at);
create index if not exists mileage_entries_appointment_id_idx on public.mileage_entries (appointment_id);

alter table public.users enable row level security;
alter table public.clients enable row level security;
alter table public.appointments enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.payments enable row level security;
alter table public.expenses enable row level security;
alter table public.mileage_entries enable row level security;

create policy "Users can view their profile" on public.users
for select using (id = auth.uid());

create policy "Users can update their profile" on public.users
for update using (id = auth.uid()) with check (id = auth.uid());

create policy "Users can insert their profile" on public.users
for insert with check (id = auth.uid());

create policy "Clients are scoped to user" on public.clients
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Appointments are scoped to user" on public.appointments
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Invoices are scoped to user" on public.invoices
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Invoices can be viewed by public_id" on public.invoices
for select using (user_id = auth.uid());

create policy "Invoice items via invoice ownership" on public.invoice_items
for all using (
  exists (
    select 1 from public.invoices i
    where i.id = invoice_items.invoice_id and i.user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.invoices i
    where i.id = invoice_items.invoice_id and i.user_id = auth.uid()
  )
);

create policy "Payments are scoped to user" on public.payments
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Expenses are scoped to user" on public.expenses
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Mileage entries are scoped to user" on public.mileage_entries
for all using (user_id = auth.uid()) with check (user_id = auth.uid());
