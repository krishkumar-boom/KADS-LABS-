# Database Schema

Full reference for every table, column, index, RLS policy, trigger and helper function created by migrations 001–003.

Supabase (Postgres 15+) is the primary datastore. Migrations are in `supabase/migrations/` and are executed in order.

---

## Naming conventions

- Table names: `snake_case`, plural where appropriate (e.g. `tickets`, `invoices`).
- Primary keys: `id uuid default gen_random_uuid()`.
- Foreign keys: named `<entity>_id`, nullable to avoid cascade loops.
- Timestamps: `timestamptz` with `default now()`.
- Every mutable table has an `updated_at timestamptz not null default now()` column maintained by the `touch_updated_at` trigger.
- Human-friendly counters: `ticket_id TCK-NNNNNN`, `invoice_number INV-NNNNN` (set by triggers `set_ticket_id`, `set_invoice_number`).

---

## Core tables

### `public.profiles`
Extends Firebase/Supabase auth user records.
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | Stable profile id (UUIDv4) |
| firebase_uid | text unique | Firebase UID (mig 003) |
| email | text not null | lowercased |
| full_name | text | Display name |
| avatar_url | text | URL in `avatars` bucket |
| phone | text | |
| role | text not null, CHECK ∈ `founder,ceo,director,admin,developer,hr,client,guest` | default `client` |
| company, city, bio | text | |
| status | text not null, CHECK ∈ `active,pending,suspended,banned` | default `active` |
| invited_by | uuid fk→profiles | |
| last_login_at, last_login_ip | timestamptz / text | |
| created_at, updated_at | timestamptz | |

Indexes: `idx_profiles_firebase_uid(firebase_uid)`.
RLS: users can read/update their own row; privileged roles read all; insert allowed via the SECURITY DEFINER `upsert_firebase_profile()` RPC.

### `public.login_history`
Every login event (Firebase & fallback).
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid null | nullable (no FK to auth.users; Firebase users don't have Supabase UIDs) |
| firebase_uid | text | set by upsert_firebase_profile |
| ip_address, user_agent, device_type, location_city, location_country | text | |
| success | bool default true | |
| failure_reason | text | |
| created_at | timestamptz | |
Index: `idx_login_history_user(user_id, created_at desc)`.
RLS: users see own; privileged roles see all; inserts allowed to authenticated.

---

## Ticketing

### `public.tickets`
Unified inbox for contact/quote/feedback/bug/career/support/complaint.
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| ticket_id | text unique | TCK-NNNNNN set by trigger |
| type | text CHECK ∈ `contact,support,quote,career,feedback,bug,suggestion,complaint,feature` | |
| subject, description | text not null | |
| priority | text CHECK ∈ `low,normal,high,urgent` default `normal` | |
| status | text CHECK ∈ `new,in_progress,assigned,resolved,archived,closed,spam` default `new` | |
| name, email | text | email required |
| phone, company, category, source, screenshot_url, ip_hash | text | source default `website` |
| user_id | uuid null | optional FK (nullable for Firebase users) |
| assigned_to | uuid fk→profiles | |
| metadata | jsonb default `{}` | Flexible bag for form-specific fields |
| created_at, updated_at, resolved_at | timestamptz | |
Indexes: `idx_tickets_status`, `idx_tickets_type`, `idx_tickets_assigned`, `idx_tickets_user`.
RLS: public can insert; users can select own tickets (by user_id or email match); privileged users full CRUD.

### `public.ticket_messages`
Threaded replies linked to a ticket.
| Column | Type |
|---|---|
| id | uuid PK |
| ticket_id | uuid fk→tickets ON DELETE CASCADE |
| user_id | uuid null |
| author_name, author_email, message | text (message required) |
| is_internal bool default false, is_from_client bool default true | |
| attachment_url | text |
| created_at | timestamptz |
Index: `idx_ticket_messages(ticket_id, created_at)`.
RLS: clients can see messages for their own tickets (via tickets table join); privileged users full CRUD; public can insert.

### `public.ticket_counter`
Singleton (id=1) holding `current_value bigint` for TCK numbering.
### `public.next_ticket_id()` returns `TCK-NNNNNN`. Called from the `set_ticket_id` BEFORE INSERT trigger.

---

## Careers

### `public.career_applications`
Tied to `tickets(type='career')` via `ticket_id`.
| Column | Type |
|---|---|
| id | uuid PK |
| ticket_id | uuid fk→tickets ON DELETE CASCADE |
| position, name, email | text not null |
| phone, city, resume_url, resume_filename, portfolio_url, github_url, linkedin_url | text |
| experience_years, expected_salary, notice_period, cover_letter | text |
| status | text CHECK ∈ `new,shortlisted,rejected,interview,hired,archived` default `new` |
| shortlisted_at, interview_scheduled_at, internal_notes | text/timestamptz |
| created_at, updated_at | timestamptz |
Indexes: `idx_career_position`, `idx_career_status`.
RLS: public insert, privileged CRUD.

---

## Projects, tasks, files, invoices

### `public.projects`
| Column | Type |
|---|---|
| id | uuid PK |
| name, description | text (name required) |
| client_name, client_email | text |
| client_id | uuid null |
| status | text CHECK ∈ `planning,in_progress,review,deployed,completed,paused,cancelled` default `planning` |
| priority | text CHECK ∈ `low,normal,high,urgent` default `normal` |
| progress | int CHECK 0–100 default 0 |
| type | text default `general` |
| start_date, deadline | date |
| budget | numeric(12,2) |
| assignees | uuid[] default `{}` |
| created_by | uuid null |
| metadata | jsonb default `{}` |
| created_at, updated_at | timestamptz |
Indexes: `idx_projects_status`, `idx_projects_client`.
RLS: clients see own (by client_id/email); privileged full CRUD.

### `public.project_tasks`
| Column | Type |
|---|---|
| id | uuid PK |
| project_id | uuid fk→projects ON DELETE CASCADE |
| title text required, description text | |
| status | text CHECK ∈ `todo,in_progress,review,done` default `todo` |
| priority | text default `normal` |
| assigned_to | uuid fk→profiles |
| due_date | timestamptz |
| estimated_hours, actual_hours | numeric(6,2) |
| order_index | int default 0 |
| created_by | uuid |
| created_at, updated_at | timestamptz |
Indexes: `idx_project_tasks(project_id,status,order_index)`, `idx_project_tasks_assigned`.
RLS: assignees see their own; privileged CRUD; clients see tasks for their projects.

### `public.project_files` (new in v2)
Deliverables uploaded by the team and optionally shared with clients.
| Column | Type |
|---|---|
| id | uuid PK |
| project_id | uuid fk→projects ON DELETE CASCADE required |
| name | text required |
| file_url | text required |
| file_size | bigint, mime_type | text |
| uploaded_by | uuid null |
| visible_to_client | bool default true |
| created_at | timestamptz |
Index: `idx_project_files(project_id)`.
RLS: privileged full CRUD; clients select where visible_to_client AND their own project.

### `public.invoices`
| Column | Type |
|---|---|
| id | uuid PK |
| invoice_number | text unique (INV-NNNNN set by trigger) |
| project_id | uuid fk→projects |
| client_name, client_email | text required |
| client_id | uuid null |
| amount | numeric(12,2) required |
| currency | text default `INR` |
| status | text CHECK ∈ `draft,sent,viewed,paid,overdue,cancelled,refunded` default `draft` |
| due_date | date, paid_at | timestamptz |
| items | jsonb default `[]` |
| notes, payment_method, transaction_id | text |
| created_by | uuid null |
| created_at, updated_at | timestamptz |
Indexes: `idx_invoices_status`, `idx_invoices_client`.
RLS: clients see own (by client_id/email), admin+ full CRUD.

### `public.invoice_counter` — singleton like ticket_counter.
### `public.next_invoice_number()`, `public.set_invoice_number()` trigger.
### `public.lead_counter` — keeps lead count for analytics.

---

## Bugs

### `public.bug_reports`
Extension of `tickets(type='bug')`.
| Column | Type |
|---|---|
| id | uuid PK |
| ticket_id | uuid fk→tickets |
| severity | text CHECK ∈ `low,medium,high,critical` default `medium` |
| page_url, browser, device, steps_to_reproduce, expected_behavior, actual_behavior, screenshot_url | text |
| status | text CHECK ∈ `new,triaged,in_progress,fixed,verified,wontfix` default `new` |
| assigned_to | uuid fk→profiles |
| fixed_at, created_at, updated_at | timestamptz |
Indexes: `idx_bugs_status`, `idx_bugs_assigned`.
RLS: public insert, privileged CRUD.

---

## Notifications

### `public.notifications`
| Column | Type |
|---|---|
| id | uuid PK |
| user_id | uuid (references auth.users but FK dropped for Firebase compat) |
| type | text CHECK ∈ `info,success,warning,error,mention,ticket,career,project,invoice,system` |
| title, message, link | text (title required) |
| related_type, related_id | text |
| is_read bool default false, read_at timestamptz | |
| created_at | timestamptz |
Index: `idx_notifications_user(user_id,is_read,created_at desc)`.
RLS: users select/update own; system can insert (used by trigger `notify_admins_on_ticket`).

---

## Audit

### `public.audit_logs`
Append-only audit trail.
| Column | Type |
|---|---|
| id | uuid PK |
| user_id | uuid null |
| user_email | text |
| action | text required (e.g. `role_change`, `user_status_change`, `login`, `ticket_update`) |
| entity_type, entity_id | text |
| old_data, new_data | jsonb |
| ip_address, user_agent | text |
| metadata | jsonb default `{}` |
| created_at | timestamptz |
Indexes: `idx_audit_logs_entity`, `idx_audit_logs_user`, `idx_audit_logs_action`.
RLS: admin+ select; service insert (public RPC `log_audit`).

### `public.log_audit(action, entity_type, entity_id, new_data, old_data)` — SECURITY DEFINER helper used by the client and triggers to write audit entries.

---

## Storage

| Bucket | Public | Max size | Allowed MIME | Policies |
|---|---|---|---|---|
| `avatars` | ✅ | 2 MB | png/jpeg/webp | public read; auth insert |
| `screenshots` | ❌ | 5 MB | png/jpeg/webp/gif | public insert; privileged read |
| `resumes` | ❌ | 10 MB | pdf, doc, docx | auth insert; privileged read |
| `attachments` | ❌ | 20 MB | pdf, images, zip, txt, doc, docx | auth insert+read |
| `project-files` | ❌ | 50 MB | pdf, zip, images, txt, doc, docx | privileged all; clients read where `visible_to_client=true` |

---

## Realtime publication

`supabase_realtime` includes: `tickets`, `ticket_messages`, `notifications`, `projects`, `project_tasks`, `career_applications`, `bug_reports`, `profiles`. Clients subscribe with `supabase.channel(...).on('postgres_changes', ...)`.

---

## Helper functions

- `public.current_user_role()` → text (from profiles)
- `public.current_user_has_privileged_role()` → bool (founder/ceo/director/admin/developer/hr)
- `public.current_user_is_admin()` → bool (founder/ceo/director/admin)
- `public.current_user_is_founder()` → bool
- `public.handle_new_user()` trigger — auto-creates a profile for new Supabase-auth users
- `public.notify_admins_on_ticket()` — inserts notifications for admins on new tickets
- `public.touch_updated_at()` — BEFORE UPDATE trigger for `updated_at`
- `public.next_ticket_id()`, `public.next_invoice_number()` — counters
- `public.set_ticket_id()`, `public.set_invoice_number()` — BEFORE INSERT triggers
- `public.upsert_firebase_profile(firebase_uid, email, full_name, avatar_url)` returns uuid — SECURITY DEFINER, called by `lib/sync-profile.ts` on login
- `public.log_audit(...)` — audit helper

---

## Applying / reverting

```bash
# Apply all migrations
supabase db push

# Reset (local dev only — destroys all data)
supabase db reset
```

Never edit a migration after it has been deployed to production; add a new numbered migration.
