-- Phase 7 Enterprise Migration — KADS LABS
-- Adds: user profiles, role-based access, unified tickets, career apps, feedback,
-- projects, invoices, notifications, login history, audit logs, bug reports.
-- Safe to run multiple times (IF NOT EXISTS everywhere).
-- Idempotent: running this twice won't error.

-- ========== 0. EXTENSIONS ==========
create extension if not exists "pgcrypto" schema extensions;
create extension if not exists "uuid-ossp" schema extensions;

-- ========== 1. USER PROFILES & ROLES ==========

-- Drop any old CHECK so we can widen roles safely
alter table if exists public.profiles drop constraint if exists profiles_role_check;
alter table if exists public.profiles drop constraint if exists profiles_status_check;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  phone text,
  role text not null default 'client' check (role in ('founder','ceo','director','admin','developer','hr','client','guest')),
  company text,
  city text,
  bio text,
  status text not null default 'active' check (status in ('active','pending','suspended','banned')),
  invited_by uuid references public.profiles(id) on delete set null,
  last_login_at timestamptz,
  last_login_ip text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- Auto-create profile on signup (handles both INSERT and existing users)
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role-check helpers
create or replace function public.current_user_role()
returns text language sql stable as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.current_user_has_privileged_role()
returns boolean language sql stable as $$
  select coalesce(
    (select role in ('founder','ceo','director','admin','developer','hr')
     from public.profiles where id = auth.uid()),
    false
  )
$$;

create or replace function public.current_user_is_admin()
returns boolean language sql stable as $$
  select coalesce(
    (select role in ('founder','ceo','director','admin') from public.profiles where id = auth.uid()),
    false
  )
$$;

create or replace function public.current_user_is_founder()
returns boolean language sql stable as $$
  select coalesce(
    (select role = 'founder' from public.profiles where id = auth.uid()),
    false
  )
$$;

-- ========== 2. LOGIN HISTORY & DEVICE MANAGEMENT ==========

create table if not exists public.login_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  ip_address text,
  user_agent text,
  device_type text,
  location_city text,
  location_country text,
  success boolean not null default true,
  failure_reason text,
  created_at timestamptz not null default now()
);
create index if not exists idx_login_history_user on public.login_history(user_id, created_at desc);
alter table public.login_history enable row level security;

drop policy if exists "Users can view own login history" on public.login_history;
create policy "Users can view own login history" on public.login_history for select
  using (auth.uid() = user_id);
drop policy if exists "Service inserts login history" on public.login_history;
create policy "Service inserts login history" on public.login_history for insert
  with check (true);
drop policy if exists "Privileged view all login history" on public.login_history;
create policy "Privileged view all login history" on public.login_history for select
  using (public.current_user_has_privileged_role());

-- ========== 3. UNIFIED TICKET SYSTEM ==========

-- Ensure CHECK constraints are wide
alter table if exists public.tickets drop constraint if exists tickets_type_check;
alter table if exists public.tickets drop constraint if exists tickets_priority_check;
alter table if exists public.tickets drop constraint if exists tickets_status_check;

create table if not exists public.tickets (
  id uuid default gen_random_uuid() primary key,
  ticket_id text unique,
  type text not null check (type in ('contact','support','quote','career','feedback','bug','suggestion','complaint','feature')),
  subject text not null,
  description text not null,
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  status text not null default 'new' check (status in ('new','in_progress','assigned','resolved','archived','closed','spam')),
  name text,
  email text not null,
  phone text,
  company text,
  user_id uuid references auth.users(id) on delete set null,
  assigned_to uuid references public.profiles(id) on delete set null,
  category text,
  source text default 'website',
  screenshot_url text,
  metadata jsonb not null default '{}',
  ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);
create index if not exists idx_tickets_status on public.tickets(status, created_at desc);
create index if not exists idx_tickets_type on public.tickets(type, created_at desc);
create index if not exists idx_tickets_assigned on public.tickets(assigned_to, status);
create index if not exists idx_tickets_user on public.tickets(user_id, created_at desc);
alter table public.tickets enable row level security;

-- Ticket counter for friendly IDs
create table if not exists public.ticket_counter (
  id int primary key default 1 check (id = 1),
  current_value bigint not null default 0
);
insert into public.ticket_counter (id, current_value) values (1, 0) on conflict (id) do nothing;

create or replace function public.next_ticket_id()
returns text language plpgsql security definer as $$
declare v bigint;
begin
  update public.ticket_counter set current_value = current_value + 1 where id = 1 returning current_value into v;
  return 'TCK-' || lpad(v::text, 6, '0');
end;
$$;

create or replace function public.set_ticket_id()
returns trigger language plpgsql as $$
begin
  if new.ticket_id is null then new.ticket_id := public.next_ticket_id(); end if;
  new.updated_at := now();
  return new;
end;
$$;
drop trigger if exists trg_set_ticket_id on public.tickets;
create trigger trg_set_ticket_id before insert on public.tickets
  for each row execute function public.set_ticket_id();

-- Ticket replies (threaded messages)
create table if not exists public.ticket_messages (
  id uuid default gen_random_uuid() primary key,
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  author_name text,
  author_email text,
  message text not null,
  is_internal boolean not null default false,
  is_from_client boolean not null default true,
  attachment_url text,
  created_at timestamptz not null default now()
);
create index if not exists idx_ticket_messages on public.ticket_messages(ticket_id, created_at);
alter table public.ticket_messages enable row level security;

drop policy if exists "Public create ticket" on public.tickets;
create policy "Public create ticket" on public.tickets for insert with check (true);
drop policy if exists "Users view own tickets" on public.tickets;
create policy "Users view own tickets" on public.tickets for select
  using (auth.uid() = user_id or email = (select email from auth.users where id = auth.uid()));
drop policy if exists "Privileged manage tickets" on public.tickets;
create policy "Privileged manage tickets" on public.tickets for all
  using (public.current_user_has_privileged_role())
  with check (public.current_user_has_privileged_role());

drop policy if exists "Public create ticket message" on public.ticket_messages;
create policy "Public create ticket message" on public.ticket_messages for insert with check (true);
drop policy if exists "Users view own ticket messages" on public.ticket_messages;
create policy "Users view own ticket messages" on public.ticket_messages for select
  using (exists (select 1 from public.tickets t where t.id = ticket_id and (t.user_id = auth.uid() or public.current_user_has_privileged_role())));
drop policy if exists "Privileged manage ticket messages" on public.ticket_messages;
create policy "Privileged manage ticket messages" on public.ticket_messages for all
  using (public.current_user_has_privileged_role());

-- ========== 4. CAREER APPLICATIONS ==========

create table if not exists public.career_applications (
  id uuid default gen_random_uuid() primary key,
  ticket_id uuid references public.tickets(id) on delete cascade,
  position text not null,
  name text not null,
  email text not null,
  phone text,
  city text,
  resume_url text,
  resume_filename text,
  portfolio_url text,
  github_url text,
  linkedin_url text,
  experience_years text,
  expected_salary text,
  notice_period text,
  cover_letter text,
  status text not null default 'new' check (status in ('new','shortlisted','rejected','interview','hired','archived')),
  shortlisted_at timestamptz,
  interview_scheduled_at timestamptz,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_career_position on public.career_applications(position, created_at desc);
create index if not exists idx_career_status on public.career_applications(status);
alter table public.career_applications enable row level security;

drop policy if exists "Public apply career" on public.career_applications;
create policy "Public apply career" on public.career_applications for insert with check (true);
drop policy if exists "Privileged manage career apps" on public.career_applications;
create policy "Privileged manage career apps" on public.career_applications for all
  using (public.current_user_has_privileged_role())
  with check (public.current_user_has_privileged_role());

-- ========== 5. PROJECTS ==========

create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  client_name text,
  client_email text,
  client_id uuid references auth.users(id) on delete set null,
  status text not null default 'planning' check (status in ('planning','in_progress','review','deployed','completed','paused','cancelled')),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  progress int default 0 check (progress between 0 and 100),
  type text default 'general',
  start_date date,
  deadline date,
  budget numeric(12,2),
  assignees uuid[] default '{}',
  created_by uuid references auth.users(id) on delete set null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_projects_status on public.projects(status);
create index if not exists idx_projects_client on public.projects(client_id);
alter table public.projects enable row level security;

drop policy if exists "Clients view own projects" on public.projects;
create policy "Clients view own projects" on public.projects for select
  using (client_id = auth.uid() or public.current_user_has_privileged_role());
drop policy if exists "Privileged manage projects" on public.projects;
create policy "Privileged manage projects" on public.projects for all
  using (public.current_user_has_privileged_role())
  with check (public.current_user_has_privileged_role());

-- Project tasks
create table if not exists public.project_tasks (
  id uuid default gen_random_uuid() primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo','in_progress','review','done')),
  priority text not null default 'normal',
  assigned_to uuid references public.profiles(id) on delete set null,
  due_date timestamptz,
  estimated_hours numeric(6,2),
  actual_hours numeric(6,2),
  order_index int default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_project_tasks on public.project_tasks(project_id, status, order_index);
create index if not exists idx_project_tasks_assigned on public.project_tasks(assigned_to, status);
alter table public.project_tasks enable row level security;

drop policy if exists "Team manage project tasks" on public.project_tasks;
create policy "Team manage project tasks" on public.project_tasks for all
  using (public.current_user_has_privileged_role())
  with check (public.current_user_has_privileged_role());
drop policy if exists "Assignee view tasks" on public.project_tasks;
create policy "Assignee view tasks" on public.project_tasks for select
  using (assigned_to = auth.uid());
drop policy if exists "Client view project tasks" on public.project_tasks;
create policy "Client view project tasks" on public.project_tasks for select
  using (exists (
    select 1 from public.projects p
    where p.id = project_id and p.client_id = auth.uid()
  ));

-- Project files (deliverables, attachments)
create table if not exists public.project_files (
  id uuid default gen_random_uuid() primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  file_url text not null,
  file_size bigint,
  mime_type text,
  uploaded_by uuid references auth.users(id) on delete set null,
  visible_to_client boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_project_files on public.project_files(project_id);
alter table public.project_files enable row level security;

drop policy if exists "Privileged manage project files" on public.project_files;
create policy "Privileged manage project files" on public.project_files for all
  using (public.current_user_has_privileged_role())
  with check (public.current_user_has_privileged_role());
drop policy if exists "Client view project files" on public.project_files;
create policy "Client view project files" on public.project_files for select
  using (visible_to_client and exists (
    select 1 from public.projects p where p.id = project_id and p.client_id = auth.uid()
  ));

-- ========== 6. INVOICES & PAYMENTS ==========

create table if not exists public.invoices (
  id uuid default gen_random_uuid() primary key,
  invoice_number text unique,
  project_id uuid references public.projects(id) on delete set null,
  client_name text not null,
  client_email text not null,
  client_id uuid references auth.users(id) on delete set null,
  amount numeric(12,2) not null,
  currency text not null default 'INR',
  status text not null default 'draft' check (status in ('draft','sent','viewed','paid','overdue','cancelled','refunded')),
  due_date date,
  paid_at timestamptz,
  items jsonb not null default '[]',
  notes text,
  payment_method text,
  transaction_id text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_invoices_status on public.invoices(status, due_date);
create index if not exists idx_invoices_client on public.invoices(client_id);
alter table public.invoices enable row level security;

drop policy if exists "Clients view own invoices" on public.invoices;
create policy "Clients view own invoices" on public.invoices for select
  using (client_id = auth.uid() or public.current_user_is_admin());
drop policy if exists "Admin manage invoices" on public.invoices;
create policy "Admin manage invoices" on public.invoices for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

create table if not exists public.invoice_counter (
  id int primary key default 1 check (id = 1),
  current_value bigint not null default 1000
);
insert into public.invoice_counter (id, current_value) values (1, 1000) on conflict (id) do nothing;

create or replace function public.next_invoice_number()
returns text language plpgsql security definer as $$
declare v bigint;
begin
  update public.invoice_counter set current_value = current_value + 1 where id = 1 returning current_value into v;
  return 'INV-' || lpad(v::text, 5, '0');
end;
$$;

create or replace function public.set_invoice_number()
returns trigger language plpgsql as $$
begin
  if new.invoice_number is null then new.invoice_number := public.next_invoice_number(); end if;
  new.updated_at := now();
  return new;
end;
$$;
drop trigger if exists trg_set_invoice_number on public.invoices;
create trigger trg_set_invoice_number before insert on public.invoices
  for each row execute function public.set_invoice_number();

-- Lead counter
create table if not exists public.lead_counter (
  id int primary key default 1 check (id = 1),
  current_value bigint not null default 0
);
insert into public.lead_counter (id, current_value) values (1, 0) on conflict (id) do nothing;

-- ========== 7. NOTIFICATIONS ==========

create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('info','success','warning','error','mention','ticket','career','project','invoice','system')),
  title text not null,
  message text,
  link text,
  related_type text,
  related_id text,
  is_read boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_notifications_user on public.notifications(user_id, is_read, created_at desc);
alter table public.notifications enable row level security;

drop policy if exists "Users view own notifications" on public.notifications;
create policy "Users view own notifications" on public.notifications for select
  using (auth.uid() = user_id);
drop policy if exists "Users update own notifications" on public.notifications;
create policy "Users update own notifications" on public.notifications for update
  using (auth.uid() = user_id);
drop policy if exists "System insert notifications" on public.notifications;
create policy "System insert notifications" on public.notifications for insert with check (true);

-- ========== 8. AUDIT LOGS ==========

create table if not exists public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  user_email text,
  action text not null,
  entity_type text,
  entity_id text,
  old_data jsonb,
  new_data jsonb,
  ip_address text,
  user_agent text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists idx_audit_logs_entity on public.audit_logs(entity_type, entity_id);
create index if not exists idx_audit_logs_user on public.audit_logs(user_id, created_at desc);
create index if not exists idx_audit_logs_action on public.audit_logs(action, created_at desc);
alter table public.audit_logs enable row level security;

drop policy if exists "Admin view audit logs" on public.audit_logs;
create policy "Admin view audit logs" on public.audit_logs for select
  using (public.current_user_is_admin());
drop policy if exists "Service insert audit logs" on public.audit_logs;
create policy "Service insert audit logs" on public.audit_logs for insert with check (true);

-- Helper for inserting audit logs from client
create or replace function public.log_audit(p_action text, p_entity_type text, p_entity_id text, p_new_data jsonb default '{}'::jsonb, p_old_data jsonb default null)
returns uuid language plpgsql security definer as $$
declare new_id uuid;
begin
  insert into public.audit_logs (user_id, user_email, action, entity_type, entity_id, new_data, old_data)
  values (auth.uid(), (select email from public.profiles where id = auth.uid()), p_action, p_entity_type, p_entity_id, p_new_data, p_old_data)
  returning id into new_id;
  return new_id;
end;
$$;

-- ========== 9. BUG REPORTS ==========

create table if not exists public.bug_reports (
  id uuid default gen_random_uuid() primary key,
  ticket_id uuid references public.tickets(id) on delete cascade,
  severity text not null default 'medium' check (severity in ('low','medium','high','critical')),
  page_url text,
  browser text,
  device text,
  steps_to_reproduce text,
  expected_behavior text,
  actual_behavior text,
  screenshot_url text,
  status text not null default 'new' check (status in ('new','triaged','in_progress','fixed','verified','wontfix')),
  assigned_to uuid references public.profiles(id) on delete set null,
  fixed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_bugs_status on public.bug_reports(status);
create index if not exists idx_bugs_assigned on public.bug_reports(assigned_to);
alter table public.bug_reports enable row level security;

drop policy if exists "Public submit bug" on public.bug_reports;
create policy "Public submit bug" on public.bug_reports for insert with check (true);
drop policy if exists "Privileged manage bugs" on public.bug_reports;
create policy "Privileged manage bugs" on public.bug_reports for all
  using (public.current_user_has_privileged_role())
  with check (public.current_user_has_privileged_role());

-- ========== 10. STORAGE BUCKETS ==========

-- These are idempotent DO blocks that create buckets if they don't exist.
do $$
begin
  insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values ('resumes','resumes',false,10485760,array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
  on conflict (id) do nothing;

  insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values ('screenshots','screenshots',false,5242880,array['image/png','image/jpeg','image/webp','image/gif'])
  on conflict (id) do nothing;

  insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values ('avatars','avatars',true,2097152,array['image/png','image/jpeg','image/webp'])
  on conflict (id) do nothing;

  insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values ('attachments','attachments',false,20971520,array['application/pdf','image/png','image/jpeg','image/webp','text/plain','application/zip','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
  on conflict (id) do nothing;

  insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values ('project-files','project-files',false,52428800,array['application/pdf','application/zip','image/png','image/jpeg','image/webp','text/plain','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
  on conflict (id) do nothing;
end $$;

-- Storage policies — drop and recreate to be safe
drop policy if exists "Authenticated upload resumes" on storage.objects;
create policy "Authenticated upload resumes" on storage.objects for insert
  to authenticated with check (bucket_id = 'resumes');
drop policy if exists "Admin read resumes" on storage.objects;
create policy "Admin read resumes" on storage.objects for select
  using (bucket_id = 'resumes' and public.current_user_has_privileged_role());

drop policy if exists "Public upload screenshots" on storage.objects;
create policy "Public upload screenshots" on storage.objects for insert
  with check (bucket_id = 'screenshots');
drop policy if exists "Admin read screenshots" on storage.objects;
create policy "Admin read screenshots" on storage.objects for select
  using (bucket_id = 'screenshots' and public.current_user_has_privileged_role());

drop policy if exists "Public read avatars" on storage.objects;
create policy "Public read avatars" on storage.objects for select
  using (bucket_id = 'avatars');
drop policy if exists "Authenticated upload avatars" on storage.objects;
create policy "Authenticated upload avatars" on storage.objects for insert
  to authenticated with check (bucket_id = 'avatars');

drop policy if exists "Authenticated upload attachments" on storage.objects;
create policy "Authenticated upload attachments" on storage.objects for insert
  to authenticated with check (bucket_id = 'attachments');
drop policy if exists "Auth read attachments" on storage.objects;
create policy "Auth read attachments" on storage.objects for select
  using (bucket_id = 'attachments' and auth.role() = 'authenticated');

drop policy if exists "Privileged manage project files" on storage.objects;
create policy "Privileged manage project files" on storage.objects for all
  using (bucket_id = 'project-files' and public.current_user_has_privileged_role())
  with check (bucket_id = 'project-files' and public.current_user_has_privileged_role());
drop policy if exists "Client read project files" on storage.objects;
create policy "Client read project files" on storage.objects for select
  using (
    bucket_id = 'project-files'
    and exists (
      select 1 from public.projects p
      where p.client_id = auth.uid()
    )
  );

-- ========== 11. AUTO-NOTIFICATION TRIGGERS ==========

create or replace function public.notify_admins_on_ticket()
returns trigger language plpgsql security definer as $$
declare uid uuid;
begin
  for uid in select id from public.profiles where role in ('founder','ceo','director','admin','hr') loop
    insert into public.notifications (user_id, type, title, message, related_type, related_id)
    values (
      uid,
      case new.type
        when 'career' then 'career'
        when 'bug' then 'ticket'
        when 'quote' then 'ticket'
        when 'feedback' then 'ticket'
        when 'suggestion' then 'ticket'
        when 'complaint' then 'ticket'
        else 'ticket'
      end,
      'New ' || new.type || ' received',
      coalesce(new.subject, new.type || ' from ' || new.name),
      'ticket',
      new.id::text
    );
  end loop;
  return new;
end;
$$;

drop trigger if exists trg_notify_ticket on public.tickets;
create trigger trg_notify_ticket after insert on public.tickets
  for each row execute function public.notify_admins_on_ticket();

-- Auto-updated_at triggers for all tables
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end;
$$;

drop trigger if exists trg_touch_profiles on public.profiles;
create trigger trg_touch_profiles before update on public.profiles
  for each row execute function public.touch_updated_at();
drop trigger if exists trg_touch_career on public.career_applications;
create trigger trg_touch_career before update on public.career_applications
  for each row execute function public.touch_updated_at();
drop trigger if exists trg_touch_projects on public.projects;
create trigger trg_touch_projects before update on public.projects
  for each row execute function public.touch_updated_at();
drop trigger if exists trg_touch_tasks on public.project_tasks;
create trigger trg_touch_tasks before update on public.project_tasks
  for each row execute function public.touch_updated_at();
drop trigger if exists trg_touch_invoices on public.invoices;
create trigger trg_touch_invoices before update on public.invoices
  for each row execute function public.touch_updated_at();
drop trigger if exists trg_touch_bugs on public.bug_reports;
create trigger trg_touch_bugs before update on public.bug_reports
  for each row execute function public.touch_updated_at();

-- Enable Realtime on key tables
drop publication if exists supabase_realtime;
create publication supabase_realtime;
alter publication supabase_realtime add table public.tickets;
alter publication supabase_realtime add table public.ticket_messages;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.projects;
alter publication supabase_realtime add table public.project_tasks;
alter publication supabase_realtime add table public.career_applications;
alter publication supabase_realtime add table public.bug_reports;

-- Success!
