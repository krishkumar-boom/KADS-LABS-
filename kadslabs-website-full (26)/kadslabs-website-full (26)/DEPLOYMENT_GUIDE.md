# KADS LABS v2.0 — Enterprise Deployment Guide

Production-ready build. Zero build errors, zero TypeScript errors, zero ESLint errors.

---

## 1. Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 15.5 / React 19 / TypeScript / Tailwind 3.4 / Framer Motion | UI, SSR, static export |
| **Auth** | **Firebase Authentication** | Google Login, Email/Password, Password Reset, Sessions, Remember-me, Secure Cookies, Auto Token Refresh |
| Database | Supabase (Postgres + RLS) | Profiles, Tickets, Projects, Invoices, Careers, Feedback, Audit Logs |
| Storage | Supabase Storage | Resumes, Screenshots, Avatars, Project Files, Attachments |
| Realtime | Supabase Realtime | Live updates on Tickets/Notifications/Projects |
| Edge Fns | Supabase Edge Functions (TypeScript/Deno) | Email, push notifications, Firebase→Supabase JWT sync |
| Deploy | Vercel | Auto-detected Next.js build, SSR, middleware, security headers |
| PWA | Service Worker + Manifest + Version check | Offline, installable |

---

## 2. Firebase Setup (Authentication)

1. Go to https://console.firebase.google.com → create project (e.g. `kadslabs-prod`).
2. **Enable Authentication**:
   - Authentication → Sign-in method → **Email/Password** → Enable
   - Authentication → Sign-in method → **Google** → Enable (add support email)
3. **Add Web App** (Project Overview → `</>`) → register app → copy config.
4. Copy config values into Vercel (see §6 env vars):
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`  (e.g. `kadslabs-prod.firebaseapp.com`)
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
5. (Optional but recommended) Authorized domains:
   - Auth → Settings → Authorized domains → add `kadslabs.com`, `www.kadslabs.com`, preview `*.vercel.app`.

**Firebase is the only auth provider now.** After Firebase auth signs in, the user token is used to sync profile data into Supabase. Supabase Auth is NOT used; Supabase still runs with anon key and RLS.

---

## 3. Supabase Setup (Database / Storage / Realtime)

1. Create a new Supabase project (e.g. `kadslabs-prod`).
2. SQL Editor → run migrations in order:
   - `supabase/migrations/001_phase3_forms.sql`
   - `supabase/migrations/002_enterprise_tables.sql`
   (Both are idempotent — safe to run multiple times.)
3. Copy Project URL and anon key → Vercel env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Storage buckets** are created by the migration (`resumes`, `screenshots`, `avatars`, `attachments`, `project-files`). Policies are applied automatically.
5. **Realtime**: the migration enables `supabase_realtime` publication on `tickets`, `ticket_messages`, `notifications`, `projects`, `project_tasks`, `career_applications`, `bug_reports`. Go to Supabase → Replication → confirm these tables have realtime enabled.
6. **Edge Functions**: deploy `supabase/functions/send-email` (Resend integration) and `supabase/functions/send-push` via `supabase functions deploy`.
7. **Auth users sync**: When Firebase users sign in, their email is matched against `public.profiles`. The first founder signup should be done with `ceo@kadslabs.com` or `founderskadslabs@gmail.com` — `handle_new_user()` auto-assigns `founder` role to those emails. (For Firebase-created profiles, profiles are upserted automatically by the trigger when the matching email exists; new users default to `client`.)

> To assign roles manually from within the UI, sign in as founder → `/super` (Founder Console) → Users table → pick role from dropdown.

---

## 4. Roles & RBAC

| Role | Access |
|------|--------|
| `founder` / `ceo` | All dashboards, user management, audit logs, everything |
| `director` | Founder dashboard, invoices, projects, teams |
| `admin` | Admin panel (content, media, tickets), CRM |
| `developer` | Developer dashboard, tasks, bugs, deployments |
| `hr` | HR dashboard (applications, candidates) at `/hr` |
| `client` | Client portal at `/client` (own projects/invoices/tickets) |
| `guest` | Public site only |

Routes are protected by middleware (noindex + private cache) AND `AuthProvider` role guards AND Supabase RLS.

Dashboards:
- `/founder` — Founder Dashboard (analytics, KPIs, activity, system health, AI assistant)
- `/developer` — Developer Panel (tasks, bugs, deployments)
- `/hr` — Talent pipeline, applications, candidates
- `/client` — Client portal
- `/admin` — Content/media management
- `/super` — User management (Founder-only; invite/assign/suspend/reset)
- `/profile` — Personal profile, password update
- `/ticket/[id]` — Ticket thread (authenticated users)

---

## 5. Vercel Deployment

1. Push repository to GitHub.
2. In Vercel → New Project → import repo.
3. **Build settings** (Vercel auto-detects Next.js — confirm these defaults):
   - Framework Preset: **Next.js**
   - Build Command: `npm run build` (already default)
   - Output Directory: `.next` (default; do NOT set to `dist`)
   - Install Command: `npm install` (default)
4. Add **Environment Variables** (see §6). Set for **Production**, **Preview**, and **Development**.
5. Deploy.
6. Custom domain: add `kadslabs.com` and `www.kadslabs.com` in Vercel → Settings → Domains.
7. Firebase Auth → Authorized Domains → add Vercel preview domain(s).

`next.config.js` outputs SSR by default (for Vercel). The static export (`dist/`) is only produced when `NEXT_STATIC_EXPORT=true` is set (used for the ZIP/file:// Android builds via `npm run build:static`).

---

## 6. Environment Variables

| Variable | Required | Where to get |
|----------|----------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase → Settings → API → anon public key |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ | Firebase Project Settings → Web App config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ | e.g. `kadslabs-prod.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ | Firebase Project Settings |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ | e.g. `kadslabs-prod.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ | Firebase Project Settings → Cloud Messaging |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ | Firebase Web App config |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Optional | Comma-separated fallback admin emails. Default: `ceo@kadslabs.com,founderskadslabs@gmail.com` |
| `NEXT_PUBLIC_GA4_ID` | Optional | Google Analytics 4 ID (G-XXXXXXXXXX) |
| `NEXT_PUBLIC_CLARITY_ID` | Optional | Microsoft Clarity ID |

**Do NOT commit `.env.local` or `.env.production` to Git.** `.env.example` is committed as a template.

---

## 7. Local Development

```bash
npm install
cp .env.example .env.local   # fill with your dev keys
npm run dev                  # http://localhost:3000
npm run build                # production SSR build (same as Vercel)
npm run build:static         # static export → dist/ (for ZIP / file://)
npm run lint                 # ESLint
npm run typecheck            # TypeScript
```

**Demo mode**: If Firebase/Supabase keys are missing and host is `localhost`/`127.0.0.1`/`file://`, the UI enters demo mode with localStorage-based simulated data. Demo mode is **disabled on production domains** (kadslabs.com, *.vercel.app) — instead a red ConfigError banner tells the deployer to add env vars.

---

## 8. Career System

- Positions listed on `/careers`: Frontend, Backend, React Native, AI Engineer, Cloud, DevOps, UI/UX, Graphic, Jr Video Editor, Video Editor, Videographer, Marketing, Sales, HR, Internship, Motion Designer, Junior Developer, Senior Developer, Full Stack Developer.
- Applications stored in `public.career_applications` (linked to a `tickets` row under `type='career'`, giving each app a TCK-NNNNNN reference).
- Resume upload → Supabase Storage bucket `resumes` (PDF/DOC/DOCX, 10MB max).
- Status workflow: new → shortlisted → interview → hired / rejected / archived.
- HR dashboard (`/hr`) manages pipeline.

---

## 9. Feedback System

- Types: Feedback, Suggestion, Bug Report, Feature Request, Complaint.
- Stored as `tickets` (with `bug_reports` extension table for bug details).
- Realtime updates to Founder and Developer dashboards.

---

## 10. CRM / Tickets / Projects / Invoices

- All submissions (Contact, Quote, Feedback, Career, Bug) flow through unified ticket system (`public.tickets`) with TCK-NNNNNN IDs.
- Projects table with progress, assignees, deadlines, files.
- Invoices auto-numbered INV-NNNNN, with status tracking.
- Notifications are auto-created for admins on new tickets.
- Audit log (`public.audit_logs`) records role changes, status changes, logins.

---

## 11. Security

- **CSP** locked down via middleware (allows Supabase, Google Fonts, GA, Clarity, Vercel Insights).
- **HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy** all set.
- **CSRF**, **rate limiting**, **honeypot**, **input sanitization** in `lib/security.ts`.
- **RLS** enabled on every table; policies prevent cross-tenant access.
- **Private routes** marked `noindex, nofollow, noarchive, nosnippet` and served with `Cache-Control: private`.
- **No console.log** (only warn/debug remain for production diagnostics).
- **XSS** — all user input sanitized; React escapes output by default.
- **Demo mode** disabled on production domains — missing config shows ConfigError, never falls back.

---

## 12. Performance

- `next/image` + `unoptimized` (for static export compatibility), priority images eager with `fetchpriority="high"`.
- Code-split per route; heavy components (globe/shader/legacy sections) are dynamic imports.
- CSS animations are GPU-accelerated (transform/opacity).
- Tailwind purge removes unused CSS.
- Service Worker caches static assets for offline PWA.
- Compression enabled in `next.config.js`.
- Long-term caching for static assets and media; no-cache for HTML/SW/VERSION.

---

## 13. PWA

- Manifest at `/manifest.json`, service worker at `/sw.js`.
- Install prompt supported; offline page at `/offline`.
- Version check (`app/components/VersionCheck.tsx`) polls `/VERSION` and prompts reload when a new deployment is live.

---

## 14. Manual Testing Checklist (before going live)

- [ ] Google login works (pop-up + redirect fallback)
- [ ] Email signup + login works
- [ ] Forgot password email delivered
- [ ] Founder email gets `founder` role automatically
- [ ] Developer / HR / Client logins land on correct dashboards
- [ ] Contact form → ticket created, TCK ID shown, admin notified
- [ ] Quote form → quote ticket
- [ ] Feedback & Bug reports → realtime feed in dashboards
- [ ] Career application → resume upload → HR dashboard visible
- [ ] Client portal filters to only own data
- [ ] Founder Console `/super` can change role, suspend, send reset
- [ ] Sign out clears session properly
- [ ] Session persists on page reload (Remember Me)
- [ ] Theme and language toggles persist
- [ ] PWA installs and works offline
- [ ] All routes responsive on mobile
- [ ] No console errors on production deploy

---

## 15. Troubleshooting

- **Red "Configuration Required" banner on prod**: Missing `NEXT_PUBLIC_SUPABASE_*` or `NEXT_PUBLIC_FIREBASE_*` env vars. Add them in Vercel and redeploy.
- **Google popup blocked**: The code auto-falls back to redirect; users can also enable popups.
- **RLS errors in Supabase**: Make sure both migrations ran and publication `supabase_realtime` exists.
- **Static export build**: use `npm run build:static` (not `npm run build`). The ZIP builder uses this.
- **Vercel build fails with ESLint/TS errors**: This repo ships with zero errors. If a commit introduces one, fix it locally before pushing — both checks run during build and will fail the deploy.
