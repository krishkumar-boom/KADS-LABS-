-- Phase 3 migration — lead management tables
-- Run this in Supabase Dashboard → SQL Editor to add missing columns and tables.
-- Safe to run multiple times (IF NOT EXISTS everywhere).

-- 1. Add lead_id human-readable friendly ID to contact_submissions (format KADS-000001)
alter table public.contact_submissions
  add column if not exists lead_id text unique,
  add column if not exists ip_hash text,
  add column if not exists user_agent text,
  add column if not exists url text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists metadata jsonb not null default '{}';

-- Sequence-like counter used to generate KADS-000001 IDs.
create table if not exists public.lead_counter (
  id int primary key default 1 check (id = 1),
  current_value bigint not null default 0
);
insert into public.lead_counter (id, current_value) values (1, 0)
on conflict (id) do nothing;

-- Function to generate next lead_id: atomically increments counter, returns KADS-NNNNNN
create or replace function public.next_lead_id()
returns text language plpgsql security definer as $$
declare
  next_val bigint;
begin
  update public.lead_counter set current_value = current_value + 1 where id = 1
    returning current_value into next_val;
  return 'KADS-' || lpad(next_val::text, 6, '0');
end;
$$;

-- Auto-fill lead_id on insert if not provided
create or replace function public.set_lead_id()
returns trigger language plpgsql as $$
begin
  if new.lead_id is null then
    new.lead_id := public.next_lead_id();
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_set_lead_id on public.contact_submissions;
create trigger trg_set_lead_id before insert on public.contact_submissions
  for each row execute function public.set_lead_id();

-- 2. newsletter_subscribers table
create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  name text,
  source text not null default 'website',
  status text not null default 'subscribed',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.newsletter_subscribers enable row level security;
drop policy if exists "Public subscribe newsletter" on public.newsletter_subscribers;
create policy "Public subscribe newsletter" on public.newsletter_subscribers for insert
  with check (true);
drop policy if exists "Privileged read newsletter" on public.newsletter_subscribers;
create policy "Privileged read newsletter" on public.newsletter_subscribers for select
  using (public.current_user_has_privileged_role());
drop policy if exists "Privileged update newsletter" on public.newsletter_subscribers;
create policy "Privileged update newsletter" on public.newsletter_subscribers for update
  using (public.current_user_has_privileged_role());

-- 3. meeting_requests table (schedule-a-meeting form)
create table if not exists public.meeting_requests (
  id uuid default gen_random_uuid() primary key,
  lead_id text unique,
  name text not null,
  email text not null,
  phone text,
  company text,
  preferred_date text,
  preferred_time text,
  meeting_type text not null default 'consultation',
  agenda text,
  status text not null default 'new',
  source text not null default 'website',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.meeting_requests enable row level security;
drop policy if exists "Public insert meetings" on public.meeting_requests;
create policy "Public insert meetings" on public.meeting_requests for insert
  with check (true);
drop policy if exists "Privileged read meetings" on public.meeting_requests;
create policy "Privileged read meetings" on public.meeting_requests for select
  using (public.current_user_has_privileged_role());
drop policy if exists "Privileged update meetings" on public.meeting_requests;
create policy "Privileged update meetings" on public.meeting_requests for update
  using (public.current_user_has_privileged_role());

create or replace function public.set_meeting_lead_id()
returns trigger language plpgsql as $$
begin
  if new.lead_id is null then
    new.lead_id := public.next_lead_id();
  end if;
  new.updated_at := now();
  return new;
end;
$$;
drop trigger if exists trg_set_meeting_lead_id on public.meeting_requests;
create trigger trg_set_meeting_lead_id before insert on public.meeting_requests
  for each row execute function public.set_meeting_lead_id();

-- 4. Add lead_id column to quote_requests too
alter table public.quote_requests
  add column if not exists lead_id text unique,
  add column if not exists source text not null default 'website',
  add column if not exists ip_hash text,
  add column if not exists user_agent text,
  add column if not exists url text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists metadata jsonb not null default '{}';

create or replace function public.set_quote_lead_id()
returns trigger language plpgsql as $$
begin
  if new.lead_id is null then
    new.lead_id := public.next_lead_id();
  end if;
  new.updated_at := now();
  return new;
end;
$$;
drop trigger if exists trg_set_quote_lead_id on public.quote_requests;
create trigger trg_set_quote_lead_id before insert on public.quote_requests
  for each row execute function public.set_quote_lead_id();

-- 5. Add lead_id to job_applications
alter table public.job_applications
  add column if not exists lead_id text unique,
  add column if not exists source text not null default 'website',
  add column if not exists metadata jsonb not null default '{}';

create or replace function public.set_jobapp_lead_id()
returns trigger language plpgsql as $$
begin
  if new.lead_id is null then
    new.lead_id := public.next_lead_id();
  end if;
  return new;
end;
$$;
drop trigger if exists trg_set_jobapp_lead_id on public.job_applications;
create trigger trg_set_jobapp_lead_id before insert on public.job_applications
  for each row execute function public.set_jobapp_lead_id();

-- 6. Indexes
create index if not exists idx_contact_submissions_lead_id on public.contact_submissions(lead_id);
create index if not exists idx_contact_submissions_status on public.contact_submissions(status);
create index if not exists idx_contact_submissions_created on public.contact_submissions(created_at desc);
create index if not exists idx_quote_requests_lead_id on public.quote_requests(lead_id);
create index if not exists idx_meeting_requests_lead_id on public.meeting_requests(lead_id);
create index if not exists idx_newsletter_email on public.newsletter_subscribers(email);

-- Grant RLS on new tables
grant usage on schema public to anon, authenticated;
grant insert on public.newsletter_subscribers to anon, authenticated;
grant insert on public.meeting_requests to anon, authenticated;
grant insert on public.contact_submissions to anon, authenticated;
grant insert on public.quote_requests to anon, authenticated;
grant insert on public.job_applications to anon, authenticated;
grant select, update on public.lead_counter to authenticated;
grant execute on function public.next_lead_id() to anon, authenticated;
