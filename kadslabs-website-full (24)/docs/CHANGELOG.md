# Changelog

All notable changes to KADS LABS are documented here. The format is based on Keep a Changelog. Versioning follows `MAJOR.MINOR.PATCH`.

---

## [2.0.0] — 2026-08-06 — Enterprise GA

This release ships enterprise-grade authentication, full RBAC, four dedicated dashboards, Firebase-as-auth, Supabase-as-data, PWA, and zero build/lint/type errors.

### Added
- **Firebase Authentication** (replaces Supabase Auth as the user-identity provider):
  - Google OAuth popup + redirect fallback
  - Email/password sign-in and sign-up
  - Password reset via Firebase email templates
  - Remember-me sessions with `browserLocalPersistence`, automatic token refresh
  - Demo-mode stub for localhost (no credentials required)
- **New dashboards**:
  - Founder Console at `/super` — user management (invite, role assignment, suspend/reactivate, send password reset)
  - HR Dashboard at `/hr` — talent pipeline, candidate status management
  - Client Portal at `/client` rewritten with `DashboardShell` — projects/progress/invoices/tickets
  - Founder Dashboard `/founder` analytics, KPIs, activity timeline, system health, AI assistant, ⌘K search
  - Developer Panel `/developer` tasks, bugs, deployments
  - Admin Panel `/admin` content/media/submissions
- **New SQL migration `003_firebase_auth_compat.sql`**:
  - Drops `user_id` FKs that pointed to `auth.users` so Firebase UIDs work
  - Adds `profiles.firebase_uid` unique column
  - Adds SECURITY DEFINER RPC `upsert_firebase_profile()` that auto-assigns founder role, updates `last_login_at`, writes `login_history`
  - Adds profiles to `supabase_realtime` publication
- **Role hierarchy**: founder/ceo/director/admin/developer/hr/client/guest with per-role dashboards, middleware guards and RLS
- `lib/sync-profile.ts` — idempotent Firebase→Supabase profile sync on every login
- `lib/client.ts` rewritten to query real `projects/invoices/tickets` tables (client-email scoped)
- `lib/roles.ts` rewritten to list/update/suspend users with audit logging
- `/client/layout.tsx` and `/hr/layout.tsx` metadata + noindex
- 4 career positions added (Junior Developer, Senior Developer, Full Stack Developer, Motion Designer) → 19 total
- `project_files` table, `project-files` storage bucket (50 MB deliverables, per-project visibility flag)
- `projects.progress` column (0-100) with CHECK
- `lead_counter` table for analytics
- HR and Admin nav sets in `DashboardShell` with role-aware labels/icons
- Version-update detection (PWA) with service worker caching + offline page

### Changed
- **Auth**: migrated from Supabase Auth to Firebase Auth across all components (`AuthProvider`, `AuthModal`, all dashboards)
- **Build config**:
  - `next.config.js` now sets `distDir: "dist"` and `output: "export"` only when `NEXT_STATIC_EXPORT=true` (Vercel builds SSR by default)
  - ESLint now runs during Vercel builds (no `ignoreDuringBuilds`)
  - TypeScript strict mode enforced (`ignoreBuildErrors: false`)
- `eslint` + `eslint-config-next@^15` added to devDependencies
- ESLint warnings resolved across the codebase (useCallback deps, stable constants, valid anchor tags, Lucide icon typing)
- Migration `002_enterprise_tables.sql` widened roles enum, added projects.progress, project_files table, project-files bucket, realtime publication
- `app/global-error.tsx` uses Next `<Link>` instead of raw `<a>` (fixes Next.js lint error)
- `app/components/admin/MediaLibrary.tsx` fixed Lucide `Image` vs `ImageIcon` naming collision (runtime ReferenceError)
- `app/components/ConfigError.tsx` now reports both missing Supabase and missing Firebase credentials
- `middleware.ts` added `/hr` to protected/noindex prefixes
- All demo/role email-detection logic centralised in `AuthProvider.emailToRole()`
- `.env.example` fully documented with every public and secret variable
- PWA manifest cached with no-cache headers in vercel.json

### Fixed
- Build crash: `ReferenceError: Image is not defined` (lucide icon aliasing)
- Build crash: `ESLint must be installed`
- Vercel distDir conflict (distDir forced even on SSR builds)
- Global-error invalid `<a>` tag
- Dashboard stat card icon typing (was passing JSX elements; now passes Lucide components)
- useCallback/useEffect dependency warnings
- Hero dashboard bar animation hook warning
- ContentProvider useCallback closure over language/localizeSiteData

### Removed
- Legacy `lib/roles.ts` API (`listRoles`, `assignRole`, `removeRole`, `RoleRecord`) that referenced non-existent `user_roles` table — replaced with profile-based API
- Legacy `lib/client.ts` that referenced non-existent `client_projects` table
- `isContentManager` and `isSuperDeveloper` booleans kept as compatibility aliases (now derived from isPrivileged/isFounder)
- Captcha is not present (already removed in prior phases; re-verified zero captcha references)

### Security
- HSTS preload, CSP, Referrer-Policy, Permissions-Policy locked down in middleware
- Demo mode is **disabled on production** — missing env vars show ConfigError
- All tables have RLS; policies tightened for project_files, project_tasks client visibility
- CSRF token helpers, honeypot, rate limiter, sanitizers retained
- Storage bucket policies created for new `project-files` bucket
- Secret variables (`SUPABASE_SERVICE_ROLE_KEY`, SMTP, JWT_SECRET, RESEND_API_KEY, OPENAI_API_KEY, FCM_SERVER_KEY) are server-only and not exposed via NEXT_PUBLIC_

### Docs
- New `docs/` folder with: INSTALLATION, DEPLOYMENT, VERCEL_SETUP, FIREBASE_SETUP, SUPABASE_SETUP, DATABASE_SCHEMA, API_DOCUMENTATION, ROLE_MANAGEMENT, SECURITY, BACKUP_AND_RESTORE, ENVIRONMENT_SETUP, CHANGELOG
- README rewritten with quick start, script reference, project structure and doc index
- DEPLOYMENT_GUIDE.md expanded to cover Firebase + Supabase + Vercel end-to-end

### Performance
- First Load JS shared: 102 kB (stable)
- All images: eager priority + fetchpriority for above-the-fold; lazy elsewhere
- Long-term caching: static assets immutable 1y, HTML/SW/VERSION no-cache
- Compression enabled, React strict mode, tree-shaken Tailwind

### Build tooling
- `scripts/build-static.js` added: a robust pre/post-build wrapper that moves `app/api/` aside during `output:'export'` builds and restores it afterwards (Next.js refuses to compile any `app/api/**/route.ts` with server config when exporting, so this avoids code-level hacks). `npm run build:static` is now `node scripts/build-static.js && node scripts/fix-paths.js`. SSR builds (`npm run build`) are unaffected and ship the `/api/health` server route as normal.
- Health endpoint `/api/health` expanded to report 7 services: database (Supabase), Firebase Auth, Supabase Auth, Storage, API, Realtime, Email (SMTP presence).
- `SystemHealth` dashboard widget probes `/api/health` with graceful degrade to "Edge unreachable" when running from a static bundle (file:///Android/ZIP).

---

## [1.x — Legacy]
Earlier phases (1-6) covered the public marketing site, Supabase form back-end, premium UI, dark/light theme, PWA, career/feedback pages, initial dashboards, security headers, MSME badge, capability marquee, and removal of fake testimonials/awards. See PRODUCTION_READINESS_REPORT.md and PHASE6_COMPLETION_REPORT.md (legacy, kept for reference).
