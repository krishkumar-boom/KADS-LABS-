# KADS LABS — Enterprise Website & Platform

> Building Smarter Solutions.

Production-grade marketing site, CRM, dashboards and client portal for **KADS LABS** — built with Next.js 15, React 19, TypeScript, Tailwind CSS, Firebase Authentication and Supabase.

---

## Highlights

- 🚀 **Next.js 15 App Router** with SSR for Vercel and static export for ZIP/file:// builds
- 🔐 **Firebase Authentication** — Google OAuth, email/password, password reset, secure sessions, remember-me
- 🛡️ **Supabase** (Postgres + RLS + Storage + Realtime + Edge Functions) for data, files and live updates
- 👥 **Full RBAC** — Founder / Director / Admin / Developer / HR / Client / Guest with dedicated dashboards
- 💼 **Founder Dashboard** — analytics, KPIs, activity timeline, system health, AI assistant, ⌘K global search
- 👨‍💻 **Developer Panel** — tasks, bugs, deployments, error logs
- 🧑‍💼 **HR Dashboard** — career applications pipeline, candidate management
- 🧑‍🤝‍🧑 **Client Portal** — projects, invoices, support tickets, file downloads
- 🛠️ **Founder Console** (`/super`) — invite users, assign roles, suspend, reset passwords, view audit logs
- 📨 **Unified ticket system** — contact / quote / feedback / bug / career applications all use TCK-NNNNNN IDs
- 📁 **Resume uploads** to Supabase Storage (PDF/DOC/DOCX, 10 MB cap)
- 📣 **Realtime** updates for tickets / notifications / projects
- 🔒 **Enterprise security** — CSP, HSTS, CORS, rate limiting, CSRF, honeypot, input sanitization, XSS/SQLi protection
- 📱 **PWA** — installable, offline-capable, version-update detection
- 🌗 Theme toggle (dark/light) + bilingual (EN/HI) content
- 🏛️ Genuine MSME registration display (no fake stats/awards/testimonials)

---

## Quick start

```bash
# 1. Install
npm install

# 2. Configure env
cp .env.example .env.local
#    edit .env.local with Firebase + Supabase credentials

# 3. Run locally
npm run dev        # http://localhost:3000

# 4. Production build
npm run build
npm start

# 5. Static export (for ZIP / file:// / Android local hosting)
npm run build:static   # outputs to dist/
```

Full setup → [`docs/INSTALLATION.md`](docs/INSTALLATION.md)
Deploy to Vercel → [`docs/VERCEL_SETUP.md`](docs/VERCEL_SETUP.md)
Firebase auth setup → [`docs/FIREBASE_SETUP.md`](docs/FIREBASE_SETUP.md)
Supabase / DB setup → [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md)

---

## Dashboards

| Route | Who can access | Purpose |
|---|---|---|
| `/` | Public | Marketing site |
| `/careers` | Public | Open positions + applications |
| `/feedback` | Public | Feedback, bugs, feature requests |
| `/quote` | Public | Request a quote |
| `/auth/reset` | Public | Password reset |
| `/profile` | Any authenticated user | Edit name, company, phone, avatar, password |
| `/client` | Client role | Own projects, invoices, tickets |
| `/developer` | Developer+ | Tasks, bugs, deployments |
| `/hr` | HR+ | Talent pipeline, applications |
| `/admin` | Admin+ | Content editor, media library |
| `/founder` | Admin+ (Director+) | Analytics, activity, system health, AI |
| `/super` | Founder only | User management, role assignment, audit |

---

## Project structure

```
app/                       # Next.js App Router pages + layout
  page.tsx                 # Home
  layout.tsx               # Root layout (providers, metadata, JSON-LD)
  globals.css              # Tailwind + design tokens + animations
  components/              # App-wide UI (AuthProvider, Navbar, CookieConsent, etc.)
  sections/                # Landing-page sections (legacy dynamic imports)
  founder/, developer/, hr/, client/, admin/, super/, profile/, auth/,
    careers/, feedback/, quote/, ticket/   # Dashboards & form pages
components/
  premium/                 # Premium landing-page components (Hero, Footer, About, etc.)
  dashboard/               # Dashboard shell, charts, activity, AI assistant, search
  home/                    # Hero dashboard preview & reveal components
lib/
  firebase.ts              # Firebase Auth client
  supabase.ts              # Supabase JS client (safe proxy when credentials missing)
  sync-profile.ts          # Firebase → Supabase profile sync
  tickets.ts               # Unified ticket API (contact, quote, feedback, bug, career)
  security.ts              # Rate limiting, CSRF, honeypot, sanitization
  roles.ts                 # Profile listing, role assignment, status updates
  client.ts                # Client-portal queries
  env.ts                   # Production-domain / demo-mode detection
  storage.ts, hooks/, site-data.ts, icons.ts, translations.ts, utils.ts, ...
supabase/
  migrations/              # SQL migrations (run in order 001 → 002 → 003)
  functions/               # Edge Functions (send-email, send-push)
public/                    # Static assets, manifest, sw.js, robots, sitemap, team photos
scripts/                   # Build helpers (fix-paths, image optimizer, html preview)
docs/                      # Full documentation
middleware.ts              # CSP, HSTS, security headers, noindex for private routes
next.config.js             # Hybrid SSR/static config, security headers
tailwind.config.ts         # Design tokens (brand colors, typography)
tsconfig.json              # Strict TypeScript
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production SSR build (Vercel) |
| `npm run build:static` | Static export to `dist/` (for ZIP/file://) |
| `npm start` | Serve production build |
| `npm run lint` | ESLint (zero warnings / errors enforced) |
| `npm run typecheck` | TypeScript `tsc --noEmit` (strict, zero errors) |

---

## Brand

- Dark primary: `#05070B`
- Deep navy: `#08111F`
- Electric Blue: `#1E6BFF`
- Neon Blue: `#33B5FF`
- Tagline: **Building Smarter Solutions**
- MSME: Government of India MSME Registered, UDYAM-UP-21-0061122

---

## Documentation index

| Document | Covers |
|---|---|
| [INSTALLATION.md](docs/INSTALLATION.md) | Local dev setup, prerequisites, scripts |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | End-to-end deployment checklist |
| [VERCEL_SETUP.md](docs/VERCEL_SETUP.md) | Vercel project configuration, domains, env vars |
| [FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md) | Firebase project, Auth providers, authorized domains |
| [SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) | Supabase project, running migrations, buckets, RLS, realtime |
| [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | Every table, column, index, policy and trigger |
| [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) | Client-side APIs and form flows |
| [ROLE_MANAGEMENT.md](docs/ROLE_MANAGEMENT.md) | Roles, permissions, how to assign / change / suspend |
| [SECURITY.md](docs/SECURITY.md) | Threat model, CSP, CSRF, RLS, headers, hardening |
| [BACKUP_AND_RESTORE.md](docs/BACKUP_AND_RESTORE.md) | PITR, exports, storage backups, restore playbook |
| [ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md) | Every environment variable explained |
| [CHANGELOG.md](docs/CHANGELOG.md) | Version history |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Concise deploy cheat-sheet |

---

## License

Private — KADS LABS. All rights reserved.
