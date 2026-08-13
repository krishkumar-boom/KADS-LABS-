-- KADS LABS Supabase production setup
-- Run this SQL in the Supabase Dashboard SQL Editor to create tables, RLS policies,
-- storage bucket and indexes for the KADS LABS enterprise website.
-- After running, enable Realtime on: site_data, contact_submissions, media, notifications
-- in Database -> Replication -> Realtime.


-- 4. user_roles: role-based access control

create table if not exists public.user_roles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  email text not null,
  role text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.user_roles enable row level security;

drop policy if exists "Users read own role" on public.user_roles;
create policy "Users read own role" on public.user_roles for select
  using (auth.uid() = user_id);

drop policy if exists "Super developer manage roles" on public.user_roles;
drop policy if exists "CEO and Developer manage roles" on public.user_roles;
create policy "CEO and Developer manage roles" on public.user_roles for all
  using (public.current_user_can_manage_roles())
  with check (public.current_user_can_manage_roles());
-- Helper: check if the current user has any of the privileged roles
-- (SECURITY DEFINER so it can read user_roles without being blocked by RLS recursion)
create or replace function public.current_user_has_privileged_role()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role in ('ceo', 'developer', 'admin', 'content_manager')
  );
$$;

-- Helper: check if the current user can manage roles (CEO or Developer)
create or replace function public.current_user_can_manage_roles()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role in ('ceo', 'developer')
  );
$$;

-- 1. site_data: real-time CMS content store

create table if not exists public.site_data (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.site_data enable row level security;

drop policy if exists "Public read site_data" on public.site_data;
create policy "Public read site_data" on public.site_data for select
  using (true);

drop policy if exists "Privileged write site_data" on public.site_data;
create policy "Privileged write site_data" on public.site_data for all
  using (public.current_user_has_privileged_role())
  with check (public.current_user_has_privileged_role());

-- 2. contact_submissions: CRM leads

create table if not exists public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  company text,
  service text,
  budget text,
  message text,
  status text not null default 'new',
  source text not null default 'website',
  assigned_to uuid references auth.users(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  notes jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

drop policy if exists "Public insert submissions" on public.contact_submissions;
create policy "Public insert submissions" on public.contact_submissions for insert
  with check (true);

drop policy if exists "Privileged read submissions" on public.contact_submissions;
create policy "Privileged read submissions" on public.contact_submissions for select
  using (public.current_user_has_privileged_role());

drop policy if exists "Privileged update submissions" on public.contact_submissions;
create policy "Privileged update submissions" on public.contact_submissions for update
  using (public.current_user_has_privileged_role())
  with check (public.current_user_has_privileged_role());

drop policy if exists "Privileged delete submissions" on public.contact_submissions;
create policy "Privileged delete submissions" on public.contact_submissions for delete
  using (public.current_user_has_privileged_role());

-- 3. media: media library metadata

create table if not exists public.media (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text not null,
  url text not null,
  size bigint,
  mime_type text,
  folder text not null default '/',
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.media enable row level security;

drop policy if exists "Public read media" on public.media;
create policy "Public read media" on public.media for select
  using (true);

drop policy if exists "Privileged write media" on public.media;
create policy "Privileged write media" on public.media for all
  using (public.current_user_has_privileged_role())
  with check (public.current_user_has_privileged_role());

-- 5. profiles: public user profiles

create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  company text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Public read profiles" on public.profiles;
create policy "Public read profiles" on public.profiles for select
  using (true);

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile" on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 6. notifications: founder dashboard notifications

create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  type text not null,
  title text,
  message text,
  lead_id uuid references public.contact_submissions(id) on delete set null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

drop policy if exists "Privileged read notifications" on public.notifications;
create policy "Privileged read notifications" on public.notifications for select
  using (public.current_user_has_privileged_role());

drop policy if exists "Privileged update notifications" on public.notifications;
create policy "Privileged update notifications" on public.notifications for update
  using (public.current_user_has_privileged_role())
  with check (public.current_user_has_privileged_role());

drop policy if exists "Privileged insert notifications" on public.notifications;
create policy "Privileged insert notifications" on public.notifications for insert
  with check (public.current_user_has_privileged_role());

drop policy if exists "Privileged delete notifications" on public.notifications;
create policy "Privileged delete notifications" on public.notifications for delete
  using (public.current_user_has_privileged_role());

-- 7. analytics_events: scalable analytics

create table if not exists public.analytics_events (
  id uuid default gen_random_uuid() primary key,
  type text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

alter table public.analytics_events enable row level security;

drop policy if exists "Public insert analytics" on public.analytics_events;
create policy "Public insert analytics"
  on public.analytics_events for insert
  with check (true);

drop policy if exists "Privileged read analytics" on public.analytics_events;
create policy "Privileged read analytics"
  on public.analytics_events for select
  using (public.current_user_has_privileged_role());

create index if not exists idx_analytics_events_type
  on public.analytics_events(type);

create index if not exists idx_analytics_events_created_at
  on public.analytics_events(created_at desc);

-- Storage: website-assets bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'website-assets',
  'website-assets',
  true,
  52428800,  -- 50 MB
  array[
    'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/svg+xml',
    'video/mp4', 'video/webm',
    'application/pdf', 'application/zip', 'application/vnd.openxmlformats-officedocument.*',
    'text/plain', 'text/markdown', 'application/json'
  ]
)
on conflict (id) do nothing;

-- Storage RLS policies

drop policy if exists "Public read website-assets" on storage.objects;
create policy "Public read website-assets" on storage.objects for select
  using (bucket_id = 'website-assets');

drop policy if exists "Privileged upload website-assets" on storage.objects;
create policy "Privileged upload website-assets" on storage.objects for insert
  with check (
    bucket_id = 'website-assets'
    and public.current_user_has_privileged_role()
  );

drop policy if exists "Privileged update website-assets" on storage.objects;
create policy "Privileged update website-assets" on storage.objects for update
  using (
    bucket_id = 'website-assets'
    and public.current_user_has_privileged_role()
  )
  with check (
    bucket_id = 'website-assets'
    and public.current_user_has_privileged_role()
  );

drop policy if exists "Privileged delete website-assets" on storage.objects;
create policy "Privileged delete website-assets" on storage.objects for delete
  using (
    bucket_id = 'website-assets'
    and public.current_user_has_privileged_role()
  );

-- Bootstrap: assign the first CEO role.
-- Replace the email below with the email of the person who should be the CEO,
-- then run this line once. The user must already exist in auth.users (i.e., have signed up).
-- insert into public.user_roles (user_id, email, role)
-- select id, email, 'ceo'
-- from auth.users
-- where email = 'superdeveloper@example.com'
-- on conflict (user_id) do update set role = 'ceo', updated_at = now();

-- 8. job_applications: career application tracking

create table if not exists public.job_applications (
  id uuid default gen_random_uuid() primary key,
  job_id text not null,
  job_title text not null,
  name text not null,
  email text not null,
  phone text,
  resume_url text,
  cover_letter text,
  status text not null default 'new',
  notes jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.job_applications enable row level security;

drop policy if exists "Public insert job applications" on public.job_applications;
create policy "Public insert job applications"
  on public.job_applications for insert
  with check (true);

drop policy if exists "Privileged read job applications" on public.job_applications;
create policy "Privileged read job applications"
  on public.job_applications for select
  using (public.current_user_has_privileged_role());

drop policy if exists "Privileged update job applications" on public.job_applications;
create policy "Privileged update job applications"
  on public.job_applications for update
  using (public.current_user_has_privileged_role())
  with check (public.current_user_has_privileged_role());

drop policy if exists "Privileged delete job applications" on public.job_applications;
create policy "Privileged delete job applications"
  on public.job_applications for delete
  using (public.current_user_has_privileged_role());

-- 9. quote_requests: quote request workflow

create table if not exists public.quote_requests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  company text,
  service text not null,
  budget text,
  details text not null,
  status text not null default 'new',
  notes jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.quote_requests enable row level security;

drop policy if exists "Public insert quote requests" on public.quote_requests;
create policy "Public insert quote requests"
  on public.quote_requests for insert
  with check (true);

drop policy if exists "Privileged read quote requests" on public.quote_requests;
create policy "Privileged read quote requests"
  on public.quote_requests for select
  using (public.current_user_has_privileged_role());

drop policy if exists "Privileged update quote requests" on public.quote_requests;
create policy "Privileged update quote requests"
  on public.quote_requests for update
  using (public.current_user_has_privileged_role())
  with check (public.current_user_has_privileged_role());

drop policy if exists "Privileged delete quote requests" on public.quote_requests;
create policy "Privileged delete quote requests"
  on public.quote_requests for delete
  using (public.current_user_has_privileged_role());

-- 10. tickets: support / ticket system

create table if not exists public.tickets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'open',
  priority text not null default 'medium',
  replies jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tickets enable row level security;

drop policy if exists "Users read own tickets" on public.tickets;
create policy "Users read own tickets"
  on public.tickets for select
  using (auth.uid() = user_id or email = auth.email());

drop policy if exists "Users insert own tickets" on public.tickets;
create policy "Users insert own tickets"
  on public.tickets for insert
  with check (auth.uid() = user_id);

drop policy if exists "Privileged read tickets" on public.tickets;
create policy "Privileged read tickets"
  on public.tickets for select
  using (public.current_user_has_privileged_role());

drop policy if exists "Privileged update tickets" on public.tickets;
create policy "Privileged update tickets"
  on public.tickets for update
  using (public.current_user_has_privileged_role())
  with check (public.current_user_has_privileged_role());

drop policy if exists "Privileged delete tickets" on public.tickets;
create policy "Privileged delete tickets"
  on public.tickets for delete
  using (public.current_user_has_privileged_role());

-- 11. audit_logs: audit log viewer

create table if not exists public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  email text,
  action text not null,
  resource text not null,
  details jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_logs enable row level security;

drop policy if exists "Public insert audit logs" on public.audit_logs;
create policy "Public insert audit logs"
  on public.audit_logs for insert
  with check (auth.uid() = user_id);

drop policy if exists "Privileged read audit logs" on public.audit_logs;
create policy "Privileged read audit logs"
  on public.audit_logs for select
  using (public.current_user_has_privileged_role());

create index if not exists idx_audit_logs_created_at
  on public.audit_logs(created_at desc);

create index if not exists idx_audit_logs_action
  on public.audit_logs(action);

-- 12. permissions & role_permissions: fine-grained RBAC

create table if not exists public.permissions (
  id uuid default gen_random_uuid() primary key,
  key text not null unique,
  label text not null,
  description text,
  created_at timestamptz not null default now()
);

alter table public.permissions enable row level security;

drop policy if exists "Public read permissions" on public.permissions;
create policy "Public read permissions"
  on public.permissions for select
  using (true);

create table if not exists public.role_permissions (
  id uuid default gen_random_uuid() primary key,
  role text not null,
  permission_key text not null references public.permissions(key) on delete cascade,
  unique (role, permission_key)
);

alter table public.role_permissions enable row level security;

drop policy if exists "Public read role_permissions" on public.role_permissions;
create policy "Public read role_permissions"
  on public.role_permissions for select
  using (true);

drop policy if exists "Super developer manage role_permissions" on public.role_permissions;
drop policy if exists "CEO and Developer manage role_permissions" on public.role_permissions;
create policy "CEO and Developer manage role_permissions"
  on public.role_permissions for all
  using (public.current_user_can_manage_roles())
  with check (public.current_user_can_manage_roles());

-- 13. email_templates: email system

create table if not exists public.email_templates (
  id uuid default gen_random_uuid() primary key,
  key text not null unique,
  subject text not null,
  body text not null,
  from_address text not null default 'founders@kadslabs.com',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.email_templates enable row level security;

drop policy if exists "Public read email templates" on public.email_templates;
create policy "Public read email templates"
  on public.email_templates for select
  using (true);

drop policy if exists "Privileged write email templates" on public.email_templates;
create policy "Privileged write email templates"
  on public.email_templates for all
  using (public.current_user_has_privileged_role())
  with check (public.current_user_has_privileged_role());

-- 14. push_subscriptions: push notifications

create table if not exists public.push_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

drop policy if exists "Users manage own subscriptions" on public.push_subscriptions;
create policy "Users manage own subscriptions"
  on public.push_subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Privileged read push subscriptions" on public.push_subscriptions;
create policy "Privileged read push subscriptions"
  on public.push_subscriptions for select
  using (public.current_user_has_privileged_role());

-- 15. client_projects: client portal

create table if not exists public.client_projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  email text not null,
  title text not null,
  description text,
  status text not null default 'planning',
  progress integer not null default 0,
  budget text,
  start_date date,
  due_date date,
  documents jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.client_projects enable row level security;

drop policy if exists "Users read own projects" on public.client_projects;
create policy "Users read own projects"
  on public.client_projects for select
  using (auth.uid() = user_id);

drop policy if exists "Privileged manage projects" on public.client_projects;
create policy "Privileged manage projects"
  on public.client_projects for all
  using (public.current_user_has_privileged_role())
  with check (public.current_user_has_privileged_role());

-- Seed default permissions for fine-grained RBAC
insert into public.permissions (key, label, description) values
  ('cms:read', 'Read CMS', 'View website content and settings'),
  ('cms:write', 'Write CMS', 'Edit website content and settings'),
  ('media:read', 'Read Media', 'View media library'),
  ('media:write', 'Upload & Delete Media', 'Upload, delete, rename, move media'),
  ('leads:read', 'Read Leads', 'View contact submissions, quotes, job applications'),
  ('leads:write', 'Manage Leads', 'Update status and notes on leads'),
  ('users:read', 'Read Users', 'View user profiles and roles'),
  ('users:write', 'Manage Users', 'Assign roles and manage users'),
  ('analytics:read', 'Read Analytics', 'View analytics and audit logs'),
  ('tickets:read', 'Read Tickets', 'View support tickets'),
  ('tickets:write', 'Manage Tickets', 'Reply to and update tickets'),
  ('projects:read', 'Read Projects', 'View client projects'),
  ('projects:write', 'Manage Projects', 'Create and update client projects')
on conflict (key) do nothing;

-- Seed default role_permissions
insert into public.role_permissions (role, permission_key)
select 'ceo', key from public.permissions
on conflict (role, permission_key) do nothing;

insert into public.role_permissions (role, permission_key)
select 'developer', key from public.permissions
on conflict (role, permission_key) do nothing;

insert into public.role_permissions (role, permission_key)
select 'admin', key from public.permissions
where key not in ('users:write')
on conflict (role, permission_key) do nothing;

insert into public.role_permissions (role, permission_key)
select 'content_manager', key from public.permissions
where key in ('cms:read', 'cms:write', 'media:read', 'media:write', 'analytics:read')
on conflict (role, permission_key) do nothing;

insert into public.role_permissions (role, permission_key)
select 'guest', key from public.permissions
where key in ('cms:read', 'media:read')
on conflict (role, permission_key) do nothing;

-- Seed default email templates
insert into public.email_templates (key, subject, body) values
  ('welcome', 'Welcome to KADS LABS', 'Hi {{name}},\n\nWelcome to KADS LABS. We are excited to work with you.\n\nBest regards,\nKADS LABS Team'),
  ('contact_confirmation', 'Thank you for contacting KADS LABS', 'Hi {{name}},\n\nThank you for reaching out. We have received your message and will get back to you within 24 hours.\n\nBest regards,\nKADS LABS Team'),
  ('lead_notification', 'New lead from {{name}}', 'New lead received from {{name}} ({{email}}).\n\nService: {{service}}\nBudget: {{budget}}\nMessage: {{message}}\n\nView in dashboard: https://www.kadslabs.com/founder/')
on conflict (key) do nothing;

-- Indexes for performance
create index if not exists idx_site_data_updated_at on public.site_data(updated_at desc);
create index if not exists idx_contact_submissions_status on public.contact_submissions(status);
create index if not exists idx_contact_submissions_created_at on public.contact_submissions(created_at desc);
create index if not exists idx_contact_submissions_email on public.contact_submissions(email);
create index if not exists idx_media_folder on public.media(folder);
create index if not exists idx_media_created_at on public.media(created_at desc);
create index if not exists idx_notifications_read on public.notifications(read);
create index if not exists idx_job_applications_status on public.job_applications(status);
create index if not exists idx_quote_requests_status on public.quote_requests(status);
create index if not exists idx_tickets_status on public.tickets(status);
create index if not exists idx_tickets_user_id on public.tickets(user_id);
create index if not exists idx_client_projects_user_id on public.client_projects(user_id);
create index if not exists idx_user_roles_email on public.user_roles(email);
create index if not exists idx_user_roles_role on public.user_roles(role);

-- Trigger: assign default role and create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_roles (user_id, email, role)
  values (new.id, new.email, 'guest')
  on conflict (user_id) do nothing;

  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- Realtime publication
do $$
declare
  tables text[] := array['site_data', 'contact_submissions', 'media', 'notifications', 'analytics_events', 'job_applications', 'quote_requests', 'tickets', 'client_projects', 'user_roles'];
  t text;
begin
  foreach t in array tables loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then
      -- already added, ignore
    end;
  end loop;
end;
$$;
