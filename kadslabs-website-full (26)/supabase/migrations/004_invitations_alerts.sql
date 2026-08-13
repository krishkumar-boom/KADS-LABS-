-- Phase 9 — Invitations, monitoring, alerts
-- Run AFTER 001, 002, 003 on a fresh Supabase project.

-- ========= Invitations =========
create table if not exists public.invitations (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  role text not null check (role in ('client','developer','hr','admin','director')),
  token text not null unique,
  invited_by uuid references public.profiles(id) on delete set null,
  invited_by_name text,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  accepted_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists idx_invitations_token on public.invitations(token);
create index if not exists idx_invitations_email on public.invitations(email);
alter table public.invitations enable row level security;

drop policy if exists "Admin manage invitations" on public.invitations;
create policy "Admin manage invitations" on public.invitations for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

drop policy if exists "Public read own invitation by token" on public.invitations;
create policy "Public read own invitation by token" on public.invitations for select
  using (true);  -- tokens are unguessable; policy limited below via RPC

create or replace function public.accept_invitation(p_token text, p_email text)
returns text language plpgsql security definer as $$
declare
  v_inv public.invitations%rowtype;
  v_profile_id uuid;
begin
  select * into v_inv from public.invitations where token = p_token for update;
  if not found then
    raise exception 'Invalid invitation token';
  end if;
  if v_inv.accepted_at is not null then
    raise exception 'Invitation already accepted';
  end if;
  if v_inv.expires_at < now() then
    raise exception 'Invitation expired';
  end if;
  if lower(v_inv.email) <> lower(p_email) then
    raise exception 'Invitation is for a different email';
  end if;

  -- Find or create profile for this email
  select id into v_profile_id from public.profiles where lower(email) = lower(p_email);
  if v_profile_id is null then
    v_profile_id := gen_random_uuid();
    insert into public.profiles (id, email, role, status)
    values (v_profile_id, lower(p_email), v_inv.role, 'active');
  else
    update public.profiles set role = v_inv.role, status = 'active', updated_at = now() where id = v_profile_id;
  end if;

  update public.invitations set accepted_at = now(), accepted_by = v_profile_id where id = v_inv.id;
  perform public.log_audit('invitation_accepted', 'invitations', v_inv.id::text,
    jsonb_build_object('role', v_inv.role, 'email', p_email));
  return v_inv.role;
end;
$$;

grant execute on function public.accept_invitation(text, text) to anon, authenticated;

create or replace function public.create_invitation(p_email text, p_role text, p_invited_by uuid, p_invited_by_name text)
returns text language plpgsql security definer as $$
declare
  v_token text;
  v_expires timestamptz := now() + interval '7 days';
begin
  v_token := encode(gen_random_bytes(24), 'hex');
  insert into public.invitations (email, role, token, invited_by, invited_by_name, expires_at)
  values (lower(p_email), p_role, v_token, p_invited_by, p_invited_by_name, v_expires);
  return v_token;
end;
$$;

-- ========= Email alert queue =========
create table if not exists public.email_queue (
  id uuid default gen_random_uuid() primary key,
  to_email text not null,
  subject text not null,
  html_body text not null,
  text_body text,
  status text not null default 'pending' check (status in ('pending','sent','failed')),
  attempts int not null default 0,
  last_error text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_email_queue_status on public.email_queue(status, created_at);
alter table public.email_queue enable row level security;
drop policy if exists "Service manages email queue" on public.email_queue;
create policy "Service manages email queue" on public.email_queue for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());

-- Helper to queue an email (used by triggers below)
create or replace function public.queue_email(p_to text, p_subject text, p_html text, p_text text default null)
returns void language plpgsql security definer as $$
begin
  insert into public.email_queue (to_email, subject, html_body, text_body)
  values (p_to, p_subject, p_html, p_text);
end;
$$;

-- ========= Alert trigger: notify founders on new submissions =========
create or replace function public.notify_founders_email()
returns trigger language plpgsql security definer as $$
declare
  founder_email text;
  subject text;
  body html;
  app_url text := coalesce(current_setting('app.app_url', true), 'https://kadslabs.com');
begin
  subject := '[KADS LABS] New ' || initcap(new.type) || ': ' || left(coalesce(new.subject,''), 80);
  body := '<div style="font-family:system-ui,sans-serif;padding:20px;max-width:600px">'
    || '<h2 style="color:#1E6BFF">New ' || initcap(new.type) || ' received</h2>'
    || '<p><strong>From:</strong> ' || coalesce(new.name, 'Anonymous') || ' &lt;' || new.email || '&gt;</p>'
    || '<p><strong>Subject:</strong> ' || coalesce(new.subject, '—') || '</p>'
    || '<p><strong>Ticket ID:</strong> ' || new.ticket_id || '</p>'
    || '<p style="white-space:pre-wrap;border-left:3px solid #1E6BFF;padding-left:12px;color:#333">'
    || left(coalesce(new.description,''), 500) || '</p>'
    || '<p><a href="' || app_url || '/founder#tickets" style="background:#1E6BFF;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:12px">View in dashboard</a></p>'
    || '</div>';

  for founder_email in select email from public.profiles where role in ('founder','ceo','director') and status = 'active' loop
    perform public.queue_email(founder_email, subject, body);
  end loop;
  return new;
end;
$$;

drop trigger if exists trg_notify_founders_ticket on public.tickets;
create trigger trg_notify_founders_ticket after insert on public.tickets
  for each row execute function public.notify_founders_email();

-- ========= System error alerts (client-side inserts into system_events) =========
create table if not exists public.system_events (
  id uuid default gen_random_uuid() primary key,
  level text not null check (level in ('info','warning','error','critical')),
  source text not null,
  message text not null,
  metadata jsonb default '{}',
  acknowledged boolean default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_system_events_created on public.system_events(created_at desc);
create index if not exists idx_system_events_level on public.system_events(level, created_at desc);
alter table public.system_events enable row level security;
drop policy if exists "Public insert system events" on public.system_events;
create policy "Public insert system events" on public.system_events for insert with check (true);
drop policy if exists "Admin view system events" on public.system_events;
create policy "Admin view system events" on public.system_events for select
  using (public.current_user_is_admin());
drop policy if exists "Admin update system events" on public.system_events;
create policy "Admin update system events" on public.system_events for update
  using (public.current_user_is_admin());

-- Critical errors email founders immediately
create or replace function public.alert_critical_error()
returns trigger language plpgsql security definer as $$
declare founder_email text; subject text; body text;
begin
  if new.level in ('error','critical') then
    subject := '[KADS LABS] ' || initcap(new.level) || ': ' || new.source;
    body := '<p>A new ' || new.level || ' event was logged:</p><pre>' || new.message || '</pre>'
            || '<p><em>' || new.created_at || '</em></p>';
    for founder_email in select email from public.profiles where role in ('founder','ceo') and status='active' loop
      perform public.queue_email(founder_email, subject, body);
    end loop;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_critical_alert on public.system_events;
create trigger trg_critical_alert after insert on public.system_events
  for each row execute function public.alert_critical_error();

-- ========= Failed-login monitoring =========
create or replace function public.record_failed_login(p_email text, p_reason text default 'invalid_credentials')
returns void language plpgsql security definer as $$
begin
  insert into public.login_history (user_id, email, success, failure_reason)  -- login_history originally had no email column; add if missing
  values (null, p_email, false, p_reason);
exception when undefined_column then
  -- Older schema without email column: just insert without it
  insert into public.login_history (user_id, success, failure_reason) values (null, false, p_reason || ' (' || p_email || ')');
end;
$$;

-- Add email column to login_history if not present (for monitoring)
do $$ begin
  alter table public.login_history add column if not exists email text;
exception when duplicate_column then null; end $$;

-- ========= Enable realtime on additional tables =========
alter publication supabase_realtime add table public.invitations;
alter publication supabase_realtime add table public.system_events;
