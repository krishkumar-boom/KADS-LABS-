-- KADS LABS: Full clean reset script
-- Run this first if you have partial/old schema, then run setup.sql
-- WARNING: This deletes all KADS data. Only use for initial setup or if you don't need existing data.

-- Drop helper functions and all policies that depend on them
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.current_user_has_privileged_role() cascade;
drop function if exists public.current_user_can_manage_roles() cascade;

-- Drop all KADS tables (cascade also drops their remaining policies)
drop table if exists public.client_projects cascade;
drop table if exists public.push_subscriptions cascade;
drop table if exists public.email_templates cascade;
drop table if exists public.role_permissions cascade;
drop table if exists public.permissions cascade;
drop table if exists public.audit_logs cascade;
drop table if exists public.tickets cascade;
drop table if exists public.quote_requests cascade;
drop table if exists public.job_applications cascade;
drop table if exists public.analytics_events cascade;
drop table if exists public.notifications cascade;
drop table if exists public.profiles cascade;
drop table if exists public.media cascade;
drop table if exists public.contact_submissions cascade;
drop table if exists public.site_data cascade;
drop table if exists public.user_roles cascade;

-- Drop storage policies that are not dependent on the helper function
-- (setup.sql will recreate them, but dropping first ensures no conflicts)
drop policy if exists "Public read website-assets" on storage.objects;
drop policy if exists "Privileged upload website-assets" on storage.objects;
drop policy if exists "Privileged update website-assets" on storage.objects;
drop policy if exists "Privileged delete website-assets" on storage.objects;
