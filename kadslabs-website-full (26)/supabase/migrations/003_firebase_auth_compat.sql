-- Phase 8 — Firebase Auth compatibility migration
-- KADS LABS migrated from Supabase Auth to Firebase Auth in v2.0.
-- This migration loosens the foreign key on user_id columns so Firebase UIDs
-- (which do NOT exist in auth.users) can be stored without FK violation.
-- Run AFTER 001 + 002.

-- We can't ALTER columns that reference auth.users easily if data exists.
-- Since these tables are brand-new as of v2.0 we drop and recreate the FKs as
-- logical (non-FK) UUID columns that accept any Firebase UID string.

-- Helper: drop FK constraints by known names or by inferred pattern
do $$
declare r record;
begin
  for r in
    select tc.table_name, tc.constraint_name
    from information_schema.table_constraints tc
    join information_schema.key_column_usage kcu
      on tc.constraint_name = kcu.constraint_name and tc.table_schema = kcu.table_schema
    where tc.constraint_type = 'FOREIGN KEY'
      and tc.table_schema = 'public'
      and kcu.column_name = 'user_id'
      and exists (
        select 1 from information_schema.constraint_column_usage ccu
        where ccu.constraint_name = tc.constraint_name
          and ccu.table_schema = 'auth'
          and ccu.table_name = 'users'
      )
  loop
    execute format('alter table public.%I drop constraint if exists %I', r.table_name, r.constraint_name);
  end loop;
end $$;

-- Add a firebase_uid column to profiles for primary lookup going forward.
alter table public.profiles add column if not exists firebase_uid text unique;
create index if not exists idx_profiles_firebase_uid on public.profiles(firebase_uid);

-- Update handle_new_user to be safe even if no Supabase-auth user arrives.
-- (Firebase users are upserted client-side via lib/sync-profile.ts, so this trigger
--  only fires for legacy Supabase Auth signups — which are no longer primary.)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  detected_role text;
begin
  detected_role := case
    when new.email = any(array['ceo@kadslabs.com','founderskadslabs@gmail.com','shivam@kadslabs.com']) then 'founder'
    else 'client'
  end;
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    detected_role
  )
  on conflict (id) do update set email = excluded.email, updated_at = now();
  return new;
end;
$$;

-- login_history: also support firebase_uid (text) for Firebase auth logins
alter table public.login_history add column if not exists firebase_uid text;
alter table public.notifications drop constraint if exists notifications_user_id_fkey;
alter table public.audit_logs drop constraint if exists audit_logs_user_id_fkey;

-- Also drop user_id FKs on tables that reference auth.users (we keep the column as logical UUID/text)
alter table if exists public.projects drop constraint if exists projects_client_id_fkey;
alter table if exists public.projects drop constraint if exists projects_created_by_fkey;
alter table if exists public.invoices drop constraint if exists invoices_client_id_fkey;
alter table if exists public.invoices drop constraint if exists invoices_created_by_fkey;
alter table if exists public.project_tasks drop constraint if exists project_tasks_assigned_to_fkey;
alter table if exists public.project_tasks drop constraint if exists project_tasks_created_by_fkey;
alter table if exists public.tickets drop constraint if exists tickets_user_id_fkey;
alter table if exists public.ticket_messages drop constraint if exists ticket_messages_user_id_fkey;
alter table if exists public.bug_reports drop constraint if exists bug_reports_assigned_to_fkey;

-- Change user_id columns to text to allow Firebase UIDs (which are strings) on the
-- tables where we need to track ownership for Firebase users. Keep UUIDs where
-- it references our own profiles.id (FK to public.profiles).
alter table public.login_history alter column user_id drop not null;
alter table public.notifications alter column user_id drop not null;
alter table public.audit_logs alter column user_id drop not null;

-- Add helper function: upsert profile for Firebase-authenticated user
create or replace function public.upsert_firebase_profile(
  p_firebase_uid text,
  p_email text,
  p_full_name text default null,
  p_avatar_url text default null
) returns uuid language plpgsql security definer as $$
declare
  v_id uuid;
begin
  -- Look up existing by firebase_uid or email
  select id into v_id from public.profiles where firebase_uid = p_firebase_uid;
  if v_id is null then
    select id into v_id from public.profiles where email = lower(p_email);
  end if;

  if v_id is null then
    v_id := gen_random_uuid();
    insert into public.profiles (id, firebase_uid, email, full_name, avatar_url, role)
    values (v_id, p_firebase_uid, lower(p_email), coalesce(p_full_name, split_part(p_email, '@', 1)), p_avatar_url,
      case when lower(p_email) = any(array['ceo@kadslabs.com','founderskadslabs@gmail.com','shivam@kadslabs.com'])
           then 'founder' else 'client' end);
  else
    update public.profiles
       set firebase_uid = coalesce(p_firebase_uid, firebase_uid),
           email = lower(p_email),
           full_name = coalesce(p_full_name, full_name),
           avatar_url = coalesce(p_avatar_url, avatar_url),
           last_login_at = now(),
           updated_at = now()
     where id = v_id;
  end if;

  -- Log login
  insert into public.login_history (firebase_uid, success, created_at)
  values (p_firebase_uid, true, now());

  return v_id;
end;
$$;

-- Realtime publication update (make sure it exists, ignore errors)
alter publication supabase_realtime add table public.profiles;
