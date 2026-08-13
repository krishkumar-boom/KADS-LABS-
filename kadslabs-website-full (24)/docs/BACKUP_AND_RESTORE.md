# Backup & Restore

KADS LABS relies on Supabase-managed Postgres with PITR (Point-in-Time Recovery), plus manual export playbooks for disaster recovery. This document covers both.

---

## 1. Automated backups (Supabase)

| Plan | Retention | Notes |
|---|---|---|
| Free | 7 days | Daily logical backups, downloadable from Supabase Dashboard → Database → Backups |
| Pro | 14 days | Includes PITR down to 1-second granularity |
| Team/Enterprise | 14–30 days | Custom PITR windows, custom roles |

For production we recommend at least the **Pro** plan with PITR enabled (Supabase Dashboard → Database → Backups → Enable PITR).

---

## 2. Manual backup playbook

Run these weekly (or before major schema changes):

### Database (SQL dump)
```bash
# Using Supabase CLI
supabase db dump --db-url "postgresql://postgres:<password>@<host>:5432/postgres" \
  --file backups/kadslabs-$(date +%Y%m%d-%H%M).sql

# Or using pg_dump directly against the direct DB URL
pg_dump "$DATABASE_URL" --format=custom --file backups/kadslabs-$(date +%Y%m%d-%H%M).dump
```

### Storage
```bash
# Using the Supabase CLI or rclone against S3-compatible storage endpoint
# Supabase stores objects in S3; ask support for S3 credentials or use the Dashboard download for small buckets.
```

### Configuration
- Export Supabase project config:
  ```bash
  supabase config push    # commits to code
  ```
- Keep `.env.example` and `docs/ENVIRONMENT_SETUP.md` in Git so re-deploying from scratch is possible.

Store backups in at least two separate locations (cloud storage + offline).

---

## 3. Restore

### Restore from PITR (Pro)
1. Supabase Dashboard → Database → Backups → Point-in-time recovery.
2. Pick a timestamp (pre-incident).
3. Supabase spins up a new branch/database; point your app at it by updating `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (or rename the branch back to primary).

### Restore from SQL dump to a fresh Supabase project
1. Create a new Supabase project (new URL + keys).
2. Run migrations in order: 001 → 002 → 003.
3. Restore the dump:
   ```bash
   psql "$NEW_DATABASE_URL" -f backups/kadslabs-20260801-0300.sql
   ```
4. Recreate Storage buckets (migrations do this automatically) and upload any missing files from backup.
5. Update Vercel env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) and redeploy.

### Firebase Auth users export/import
```bash
# Export
firebase auth:export backups/firebase-users-YYYYMMDD.json --format=json
# Import into a new Firebase project
firebase auth:import backups/firebase-users-YYYYMMDD.json --hash-algo=SCRYPT ...
```
Firebase Auth passwords use scrypt; export includes the hash parameters required for import.

---

## 4. Edge Functions & secrets

Edge Function code lives in `supabase/functions/` in Git — they redeploy with `supabase functions deploy`.

Secrets (Resend, SMTP, FCM) are stored via `supabase secrets set` and can be backed up:
```bash
supabase secrets list  # capture the list of keys (not values) in your password manager
```
Values are stored in your password manager / Vercel env vars as the source of truth.

---

## 5. Vercel rollback

Code rollback is one-click: Vercel → Deployments → pick a prior successful deployment → Promote to Production. No rebuild needed.

This is the fastest way to undo a bad release while you prepare a fix.

---

## 6. RTO / RPO targets

| Target | Value |
|---|---|
| RPO (data loss) | ≤ 1 hour (PITR with 15-minute checkpoints) |
| RTO (downtime) | ≤ 30 minutes (Vercel rollback or hot-fix deploy) |
| Backup frequency | Daily automated; weekly manual offsite |
| Restore drills | Quarterly (test DB restore + Firebase user import into staging) |

---

## 7. Restore points in-app

- Founder Console → Settings → Backup & Restore (reserved for future UI; currently relies on Supabase PITR + CLI).
- Manual audit log export via Founder Dashboard → Audit Logs → CSV download (future feature; infrastructure in place).

---

## 8. Common failure scenarios

| Scenario | Action |
|---|---|
| Bad deployment (runtime errors) | Vercel rollback to previous deploy |
| Bad migration (schema break) | Restore from PITR just before migration; fix migration; redeploy |
| Data corruption (e.g. mass delete) | PITR restore; export corrected records; replay from audit_logs if partial |
| Supabase outage | Vercel serves static marketing pages with demo-mode banner; forms buffer in localStorage until connectivity returns (fallback planned) |
| Firebase outage | Auth unavailable; existing sessions continue until token refresh; clients show "Sign-in unavailable, please try again" |
| Lost credentials | Rotate keys in Vercel + Supabase Dashboard; invalidate old service_role key; redeploy |

---

## 9. Verification

After every restore drill, verify:
1. Founder can sign in and sees correct role.
2. Recent tickets appear in the Inbox.
3. Files in Storage are accessible.
4. Realtime subscriptions work (submit a test contact form, see it appear within seconds).
5. Email Edge Function still sends with the restored SMTP/Resend secret.
