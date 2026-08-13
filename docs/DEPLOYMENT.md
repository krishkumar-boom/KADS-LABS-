# Deployment Checklist

End-to-end checklist for taking KADS LABS to production.

---

## Phase 1 — Services provisioned

- [ ] Firebase project created
- [ ] Firebase Auth → Email/Password **enabled**
- [ ] Firebase Auth → Google **enabled** (with support email set)
- [ ] Supabase project created (region of your choice)
- [ ] Migrations `001_phase3_forms.sql`, `002_enterprise_tables.sql`, `003_firebase_auth_compat.sql` executed in SQL Editor (in that order)
- [ ] Custom domain purchased and DNS ready
- [ ] (Optional) Resend account for transactional email, domain verified
- [ ] (Optional) GA4 property + Clarity project created

## Phase 2 — Vercel project

- [ ] GitHub repo pushed
- [ ] Vercel project created by importing the repo
- [ ] Framework preset: **Next.js** (auto-detected — do NOT override build command/output)
- [ ] Environment variables added for **Production, Preview, Development** (see [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md))
- [ ] `NEXT_PUBLIC_APP_URL` set to the production URL (e.g. `https://kadslabs.com`)
- [ ] Custom domains `kadslabs.com` + `www.kadslabs.com` added and DNS verified
- [ ] First production deploy completed

## Phase 3 — Cross-service configuration

- [ ] Firebase Auth → Authorized Domains includes `kadslabs.com`, `www.kadslabs.com` and any `*.vercel.app` preview domains you want to test on
- [ ] Supabase → Authentication → URL Configuration:
  - Site URL: `https://kadslabs.com`
  - Redirect URLs: `https://kadslabs.com/**`, `https://www.kadslabs.com/**`, preview domains
- [ ] Supabase → Storage → policies applied (migration handles these; verify buckets `resumes, screenshots, avatars, attachments, project-files` exist)
- [ ] Supabase → Replication → `supabase_realtime` publication has tables: `tickets, ticket_messages, notifications, projects, project_tasks, career_applications, bug_reports`
- [ ] Supabase Edge Functions `send-email`, `send-push` deployed (if used):
  ```bash
  supabase functions deploy send-email
  supabase functions deploy send-push
  supabase secrets set RESEND_API_KEY=... SMTP_FROM=...
  ```

## Phase 4 — Smoke tests (production)

Open an incognito window on `https://kadslabs.com`:

- [ ] No red "Configuration Required" banner at the top
- [ ] No console errors or warnings
- [ ] No hydration warnings
- [ ] Theme toggle works and persists after refresh
- [ ] Language toggle works
- [ ] Cookie consent banner appears, dismisses, doesn't return
- [ ] Contact form submits → success with TCK-NNNNNN ID
- [ ] Quote form submits
- [ ] Feedback form submits each type (feedback / suggestion / bug / complaint / feature)
- [ ] Careers page lists 19 positions
- [ ] Applying to a role opens the modal; form submits with TCK ID
- [ ] Auth modal opens via `/#auth` hash
- [ ] Google sign-in popup opens (or redirect on mobile) and returns you signed in
- [ ] Email/password sign-up works → verification received
- [ ] Password-reset email delivers and the reset page accepts a new password
- [ ] Sign-in persists across hard refresh (remember-me)
- [ ] Sign-out clears session and returns to `/`

Test role routing (use the demo-mode email prefixes on localhost or create real users in Firebase for prod):

- [ ] Founder user (`ceo@kadslabs.com`) lands on `/founder`; can open `/super` user management, can access `/admin`, `/hr`, `/developer`, `/client`
- [ ] Developer user lands on `/developer`; blocked from `/super` and `/founder` administration
- [ ] HR user lands on `/hr`; sees applications pipeline
- [ ] Client user lands on `/client`; sees (own) projects / invoices / tickets

Test dashboards:

- [ ] Founder dashboard stats populate; analytics charts render; activity timeline loads; system health probes green
- [ ] Founder Console `/super` lists users, role can be changed, user suspended/reactivated, password reset link sent
- [ ] Client portal shows project progress bars, invoice list, ticket list
- [ ] New contact-form submission appears in Founder → Inbox in near-realtime (realtime)

## Phase 5 — Performance & PWA

- [ ] Lighthouse on `https://kadslabs.com` scores ≥ 95 Performance / ≥ 95 Accessibility / ≥ 95 Best Practices / ≥ 100 SEO
- [ ] PWA install prompt works on Chrome/Android
- [ ] Service worker activates; offline page (`/offline`) works on airplane mode
- [ ] Version check prompts reload when a new deployment is live

## Phase 6 — Hardening

- [ ] HSTS header visible in DevTools → Network → Response Headers
- [ ] CSP visible and blocking inline-eval third parties
- [ ] `X-Robots-Tag: noindex` present on `/founder`, `/developer`, `/hr`, `/admin`, `/super`, `/client`, `/profile`, `/ticket`
- [ ] `robots.txt` references sitemap at `https://kadslabs.com/sitemap.xml`
- [ ] Sitemap contains only public routes
- [ ] Firebase API key restricted to your domains (Firebase Console → Settings → Web API Key restrictions)
- [ ] Supabase anon key is the only public DB key; service_role key only in Edge Function secrets
- [ ] Vercel team access limited to required members; audit log enabled
- [ ] Database PITR enabled in Supabase (≥ 7 days recommended)

## Post-launch

- [ ] Monitor Vercel Analytics + Supabase logs for 48h
- [ ] Subscribe to Firebase + Supabase status pages
- [ ] Confirm contact/quote/career emails are delivered (not in spam)
- [ ] Set up weekly backups export to external storage (see [BACKUP_AND_RESTORE.md](BACKUP_AND_RESTORE.md))
