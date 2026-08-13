# Post-Deployment Operations Runbook

This document covers all operational requirements **after** a successful production deployment on https://kadslabs.com.

---

## 1. Founder email alerts

Founders (`ceo@kadslabs.com`, `founderskadslabs@gmail.com`) receive email alerts via the Supabase `email_queue` table for the following events:

| Alert | Trigger | Source |
|---|---|---|
| New contact submission | After-insert trigger on `tickets` where `type='contact'` | DB trigger `trg_notify_founders_ticket` |
| New quote request | After-insert trigger on `tickets` where `type='quote'` | DB trigger |
| New career application | After-insert trigger on `tickets` where `type='career'` | DB trigger |
| New feedback / suggestion / complaint | After-insert trigger on `tickets` where `type in ('feedback','suggestion','complaint')` | DB trigger |
| New support ticket | After-insert trigger on `tickets` where `type='support'` | DB trigger |
| Critical system errors | After-insert trigger on `system_events` where `level in ('error','critical')` | DB trigger `trg_critical_alert` (client error logger feeds this table) |

Email delivery:
- Rows in `email_queue` are picked up by the `send-email` Supabase Edge Function running on a cron schedule (pg_cron or external cron).
- Configure `RESEND_API_KEY` or SMTP secrets via `supabase secrets set RESEND_API_KEY=... SMTP_FROM="KADS LABS <no-reply@kadslabs.com>"`.
- Email body uses the branded HTML template defined in the `notify_founders_email` and `alert_critical_error` functions.

To dispatch immediately the Edge Function can be invoked on demand:
```bash
supabase functions deploy send-email
# attach a cron job using supabase cron or external service (e.g. GitHub Actions every minute)
```

---

## 2. Daily automated backup status

- Supabase Pro plan retains daily backups for 14 days + PITR.
- Configure the `backup-status` Edge Function / GitHub Action to:
  - Query Supabase backup list API
  - Send a digest email to founders (or Slack webhook) reporting last successful backup time and size
- Store weekly manual SQL dumps in external object storage (S3/Cloudflare R2) via a scheduled GitHub Action:
  ```yaml
  # .github/workflows/backup.yml (suggested)
  on:
    schedule:
      - cron: "0 18 * * *"  # daily 23:30 IST
  ```

---

## 3. Weekly database health report

Every Monday morning the founder receives a report covering:
- Table row counts (profiles, tickets, projects, invoices, career_applications)
- Index bloat, cache hit ratio, active connections
- Open ticket count by priority/status
- New sign-ups in the last 7 days
- Storage bucket usage
- Top errors from `system_events`

Implement as a Supabase Edge Function invoked by pg_cron or GitHub Actions. The report SQL views are defined in migration 004 for easy querying.

---

## 4. Monthly analytics report

- GA4 + Clarity provide website traffic analytics automatically.
- A Founder dashboard analytics page aggregates leads, revenue, visitors, career applications, feedback, projects, conversion rate and monthly growth (already wired in `/founder`).
- For monthly distribution, export the dashboard charts via the CSV/PDF export button (future UI) or schedule an Edge Function that runs on the 1st of every month and emails a PDF summary to founders.

---

## 5. Failed login monitoring

- Every failed login attempt is written to `login_history(success=false, failure_reason, email, ip_address)` via the `record_failed_login()` helper (defined in migration 004).
- Founders receive an immediate email alert if more than 5 failed attempts occur on a single account within 10 minutes (recommended follow-on trigger).
- Founders can audit login history in Founder Dashboard → Security panel (backed by `login_history` table).
- Firebase Auth additionally logs anomalous sign-in attempts and can block suspicious IPs automatically.

---

## 6. Founder security alerts

- Critical system errors → immediate email (see §1).
- Privilege/role changes → logged to `audit_logs` (with old_data/new_data) and surfaced in Founder Console → Audit Logs.
- Suspicious activity (multiple password reset requests, multiple failed logins) → email alert via the same `system_events` mechanism.
- New founder-level account creation → immediate email to all existing founders (trigger recommended).

---

## 7. Automatic activity audit logs

`audit_logs` table records every privileged action. Sources:
- Role changes (`role_change`) from `updateUserRole()` in `lib/roles.ts`.
- Status changes (`user_status_change`) from `updateUserStatus()`.
- Invitation acceptances (`invitation_accepted`) from `accept_invitation()` RPC.
- Custom events can be logged client-side via `supabase.rpc('log_audit', { p_action:..., p_entity_type:..., p_entity_id:..., p_new_data:... })`.
- Founders view logs in Founder Dashboard → Audit Logs panel.

RLS: only `admin+` can select; service role can insert; all writes go through the SECURITY DEFINER RPC to prevent tampering.

---

## 8. Login history for privileged accounts

Every sign-in (successful or failed) is captured in `login_history`:
- `user_id` / `firebase_uid` / `email` (migration 004 adds `email` column)
- `ip_address`, `user_agent`, `device_type`, `location_country/city` (populated by GeoIP lookup in Edge Function when configured)
- `success` boolean, `failure_reason`, `created_at`
- Founders can filter by role or email in the Founder Console.

Data retention: keep at least 90 days; archive older rows to cold storage.

---

## 9. Two-Factor Authentication (2FA)

Required for privileged roles: Founder, Director, Admin, Developer.

Firebase Auth supports 2FA via:
1. **Google multi-factor authentication (TOTP)** (Firebase Auth with MFA enabled):
   - Firebase Console → Authentication → Sign-in method → Multi-factor authentication → Enable with TOTP.
2. After first sign-in, privileged users are prompted to enrol an authenticator app (Google Authenticator, Authy, 1Password, etc.).
3. Recovery codes are generated once at enrolment; store them securely.
4. Enforcement: add a post-signin check in `AuthProvider` that checks `user.multiFactor.enrolledFactors`. If role is privileged and no factors enrolled, redirect to `/auth/2fa-setup`.
5. SMS 2FA is optional and requires billing on Firebase Blaze plan; TOTP is free.

Initial rollout:
- Step 1 (week 1): Enable MFA but don't enforce; founders/co-founders enrol first.
- Step 2 (week 2): Enforce for Founder and Director roles.
- Step 3 (week 3): Enforce for Admin and Developer roles.

---

## 10. Invitation-based onboarding

- Users cannot self-assign roles. All role assignments flow from:
  1. **Auto-founder detection** on first sign-up for the two founder emails.
  2. **Invitations** generated in Founder Console → Invite Team Member panel (`/super` → InviteUserPanel).
- Invitation flow:
  1. Founder selects email + role → `createInvitation(email, role)` generates a 24-byte random token.
  2. A row is inserted into `invitations` (7-day expiry, one-time use).
  3. Founder copies the link or sends it via email.
  4. Recipient clicks link → signs up with matching email → `accept_invitation(token, email)` is called which upserts a profile with the pre-assigned role, marks the invitation `accepted_at`, writes an audit log.
  5. Invited users have the specified role on first login.
- Tokens are 48 hex chars (~192 bits) unguessable; single-use; expires after 7 days; email-bound.
- Founders see all invitations in the Founder Console (future: invitations panel listing pending/accepted/expired).

---

## 11. Automatic deployment verification

Vercel automatically runs:
- `npm install`
- `npm run lint`
- `npm run build` (which includes TypeScript + ESLint strict checks)

After each deployment (including previews):
- GitHub Actions runs a smoke test calling `/api/health` and expects 200 with all services healthy.
- A status check fails the deploy if the health endpoint returns 503.

Suggested GitHub Action (`.github/workflows/verify.yml`):
```yaml
name: Verify deploy
on: deployment_status
jobs:
  health:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - run: curl -fsS "${{ github.event.deployment_status.environment_url }}/api/health" | grep -q '"status":"healthy"'
```

---

## 12. Automatic health monitoring

Endpoints probed every 60 seconds by an external monitor (UptimeRobot/Cronitor):

| Service | Probe | Healthy when |
|---|---|---|
| Marketing site | `GET https://kadslabs.com/` | 200, `< 3s` |
| API | `GET https://kadslabs.com/api/health` | 200, `status=healthy` |
| Firebase Auth | client-side probe in SystemHealth component | auth init succeeds |
| Supabase DB | `HEAD /rest/v1/profiles?select=id&limit=0` via /api/health | 200 |
| Supabase Storage | `supabase.storage.listBuckets()` via /api/health | buckets returned |
| Supabase Realtime | Realtime channel ping from client | pong received |
| Email (send-email) | daily test email via Edge Function cron | delivery status=sent |

The Founder dashboard `SystemHealth` panel shows live status (Database, Firebase Auth, Supabase Auth, Storage, API, Realtime, Email) with latency and auto-refreshes every 60 seconds.

---

## 13. Automatic error reporting

- `ErrorLogger` captures `window.onerror` + `unhandledrejection` and writes to `system_events` with level `error` (escalates to `critical` if more than 5 errors fire in a single page load).
- Critical errors trigger the email alert trigger (§1).
- Founders view recent errors in Founder Dashboard → System Events.
- For future enhancement: integrate Sentry by adding `@sentry/nextjs` with the DSN as `NEXT_PUBLIC_SENTRY_DSN`.

---

## 14. Automatic broken link detection

Run weekly via GitHub Actions / Vercel Cron:
- Crawl the sitemap (`/sitemap.xml`)
- Check every `<a href>` returns 200 (excluding mailto/tel/# and external domains)
- Email a broken-link report to founders if any 4xx/5xx detected

---

## 15. Automatic database integrity verification

Daily Edge Function runs these checks:
- Referential integrity: `applications.ticket_id` exists in `tickets.id`; `invoices.project_id` exists in `projects.id`; `project_tasks.project_id` exists in `projects.id`.
- Required fields: no `tickets.email` is null; no `profiles.email` is null.
- No orphan files: storage objects with no corresponding DB row.
- Counter tables monotonically increasing.
- Anomalies (e.g. >100 ticket submissions from one IP in an hour) reported as warnings.
- Failures produce a `system_events` row at level `error` which triggers an email alert.

---

## 16. Automatic storage cleanup for orphan files

Weekly job:
- List objects in `attachments`, `resumes`, `screenshots`, `project-files`.
- Cross-reference with DB (`resume_url`, `screenshot_url`, `attachment_url`, `file_url` columns).
- Delete objects older than 90 days with no DB reference.
- Report freed bytes in the weekly database health report.

---

## 17. Automatic security scan

- Dependabot / `npm audit` on every PR (Vercel does this automatically).
- Weekly GitHub Action runs `npm audit --production` and alerts on high/critical CVEs.
- Monthly run of `npx next-pwa-audit` (or Lighthouse CI) for CSP/HSTS regressions.
- CSP violation reports sent to `csp-reports@kadslabs.com` via `report-uri` directive in middleware (add after verifying CSP is stable).
- Supabase Dashboard → Database → Roles confirms RLS is enabled on every public table (migration 004/002 enforces it).

---

## 18. Automatic dependency vulnerability scan

- Dependabot opens PRs when CVEs are disclosed.
- CI (`npm audit --production --audit-level=high`) must pass before merge.
- Weekly digest of open updates emailed to dev team.

---

## 19. Automatic sitemap validation

- Sitemap is generated at `/sitemap.xml` (static routes).
- Weekly validator: fetch sitemap, check every URL returns 200, check lastmod matches latest deployment, ensure no private routes (`/founder`, `/admin`, `/super`, `/hr`, `/developer`, `/client`, `/profile`, `/ticket`) are in the sitemap.

---

## 20. Automatic robots.txt validation

- `/robots.txt` is served with correct `Allow: /` and `Sitemap: https://kadslabs.com/sitemap.xml`.
- Monthly check ensures disallowed paths stay consistent with middleware.

---

## On-Call

Founder/CEO (`ceo@kadslabs.com`) is primary on-call. All alerts go to the founders mailing list. Production incidents follow the Incident Response process in SECURITY.md §11.
