# Supabase Setup

Supabase hosts the Postgres database, Storage buckets, Realtime subscriptions and Edge Functions for KADS LABS.

---

## 1. Create a project

1. Go to https://supabase.com/dashboard → **New Project**
2. Name: `kadslabs-prod`, database password (store it securely — you won't see it again), region closest to your audience (e.g. `ap-south-1` for India)
3. Wait 3-5 minutes for the DB to provision.

---

## 2. Run migrations

1. Go to **SQL Editor** in the Supabase dashboard.
2. Click **New query** for each file in `supabase/migrations/`, paste the contents and click **Run**. Execute them in order:
   1. `001_phase3_forms.sql`
   2. `002_enterprise_tables.sql`
   3. `003_firebase_auth_compat.sql`

All three are idempotent (`IF NOT EXISTS`, `DROP POLICY IF EXISTS`, `ON CONFLICT DO NOTHING`) so you can re-run them safely.

To run them from the CLI instead:
```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

### What each migration does

| Migration | Adds |
|---|---|
| `001_phase3_forms.sql` | Legacy base tables (site_data, form submissions from earlier phases) |
| `002_enterprise_tables.sql` | `profiles`, `login_history`, `tickets`, `ticket_messages`, `career_applications`, `projects`, `project_tasks`, `project_files`, `invoices`, `notifications`, `audit_logs`, `bug_reports`, counters, triggers, RLS policies, Storage buckets (`resumes`, `screenshots`, `avatars`, `attachments`, `project-files`), realtime publication, helper functions. |
| `003_firebase_auth_compat.sql` | Drops user_id FKs that pointed to `auth.users` (so Firebase UIDs work), adds `firebase_uid` column, `upsert_firebase_profile()` RPC. |

---

## 3. Get API credentials

Supabase → Project Settings → API:

| Setting | Env var |
|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| anon public key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| service_role key (secret) | `SUPABASE_SERVICE_ROLE_KEY` (server-only!) |

Add the public vars to Vercel + `.env.local`. Keep service_role secret in Supabase Edge Function secrets / Vercel server-only env.

---

## 4. Verify RLS is enabled

All tables should say **RLS enabled** in Supabase → Table Editor → Auth → RLS. The migrations enable RLS explicitly. To verify:

```sql
select relname, rowsecurity from pg_class
where relnamespace = 'public'::regnamespace and relkind = 'r'
order by relname;
```

Every table should return `rowsecurity = true`.

---

## 5. Storage buckets

Migration 002 creates five buckets. Verify in Supabase → Storage:

| Bucket | Public | Max size | MIME types | Purpose |
|---|---|---|---|---|
| `avatars` | ✅ | 2 MB | image/png, jpeg, webp | Profile avatars |
| `screenshots` | ❌ | 5 MB | images | Bug report screenshots (public upload, admin view) |
| `resumes` | ❌ | 10 MB | pdf, doc, docx | Resume uploads from career form |
| `attachments` | ❌ | 20 MB | pdf, images, zip, doc | Ticket attachments |
| `project-files` | ❌ | 50 MB | pdf, zip, images, doc, txt | Deliverables (admins upload, clients read visible ones) |

Policies (also in migration): avatars publicly readable; resumes restricted to privileged roles; project-files allow privileged all-ops and clients to read where `visible_to_client=true`.

---

## 6. Realtime

Migration 002 adds these tables to the `supabase_realtime` publication:

- `tickets`
- `ticket_messages`
- `notifications`
- `projects`
- `project_tasks`
- `career_applications`
- `bug_reports`

Verify in Supabase → Replication → confirm tables are listed and realtime is enabled.

---

## 7. Auth configuration

We **do not** use Supabase Auth for end-user login (that's Firebase). But leave Email auth enabled with random site URL — the Edge Functions still use the service key, and `upsert_firebase_profile()` inserts directly via SECURITY DEFINER.

- Supabase → Authentication → URL Configuration:
  - Site URL: `https://kadslabs.com`
  - Redirect URLs: `https://kadslabs.com/**`, `https://www.kadslabs.com/**`, preview URLs (optional).

---

## 8. Edge Functions

### `send-email`
Sends transactional email via Resend (preferred) or SMTP. Set secrets:
```bash
supabase secrets set RESEND_API_KEY=re_xxx SMTP_FROM="KADS LABS <no-reply@kadslabs.com>"
supabase functions deploy send-email
```

### `send-push`
Sends FCM push notifications. Deploy and set server key:
```bash
supabase secrets set FCM_SERVER_KEY=AAA...
supabase functions deploy send-push
```

### (Optional) `sync-firebase-user`
If you want to mint Supabase JWTs from Firebase tokens (so Supabase realtime/auth runs against the Firebase user), create an Edge Function that verifies the Firebase ID token and calls `supabase.auth.signInWithIdToken` — the current implementation uses anon key + RLS by `email/firebase_uid`, which is sufficient.

---

## 9. Database indexes

Key indexes are created by migrations:
- Tickets by status/type/assigned/user, ticket messages by ticket
- Career apps by position/status
- Projects by status/client
- Project tasks by project/status/assigned
- Invoices by status/client
- Notifications by user/read
- Audit logs by entity/user/action
- Login history by user

Run `\d+ public.<table>` in the SQL editor to inspect.

---

## 10. Verify end-to-end

After all env vars are in place and deployed:

1. Submit contact form on `/` — a row appears in `public.tickets` with `ticket_id = TCK-000001` (or next in sequence).
2. Founder sign-in creates a `public.profiles` row with `role='founder'` and `firebase_uid` populated.
3. Career application + resume upload creates a row in `career_applications` AND a file in the `resumes` storage bucket.
4. Founder dashboard Inbox shows the new ticket within a few seconds (realtime).
5. Notifications bell shows new notifications.

---

## 11. Common pitfalls

| Symptom | Fix |
|---|---|
| `new row violates row-level security policy` during insert | Ensure RLS policy exists; the migrations create them. If you added a new table, add a policy (usually `for insert with check (true)` for public forms). |
| Storage upload returns 403 | Bucket doesn't exist (re-run migration) or file exceeds size limit / wrong MIME. |
| Realtime doesn't fire | Verify table is in `supabase_realtime` publication; verify client channel subscription; check RLS allows select. |
| `ticket_id` counter not incrementing | Make sure `ticket_counter` row exists (migration inserts it with id=1). |
| Founders don't get founder role | Sign in with exactly `ceo@kadslabs.com` or `founderskadslabs@gmail.com`; check `profiles.role`. Role can always be set manually from `/super` or SQL Editor. |
| Migration error `type "xxx" already exists` | You already ran an earlier version; re-running is safe because all `CREATE` is `IF NOT EXISTS`. If a CHECK constraint errors, 003 drops and rebuilds FKs; rerun 002 then 003. |

---

## 12. Production hardening

- Enable **Point-in-Time Recovery (PITR)** in Supabase → Database → Backups (required for production to keep backups beyond 7 days).
- Enable **Network Restrictions** → allowed IPs (Vercel IP ranges) if you don't need global access.
- Create a dedicated **database read-only role** for analytics tools.
- Rotate service_role key periodically and store it in Vercel secret manager only.
- Set up Supabase project **disk size / autoscaling** alerts.
- Confirm `storage.buckets` have correct MIME/limits (visible under Storage → Configuration).
