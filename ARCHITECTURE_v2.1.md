# KADS LABS v2.1 — Architecture Overview

**Version:** 2.1.0 Cinematic Enterprise
**Date:** 2026-08-07
**Status:** ✅ Production-ready — zero build/lint/TS errors, SSR + static export both pass.

---

## 1. Design Philosophy

The KADS LABS website is engineered to feel like **"the operating system of the future."**
Rather than copying Apple/Vercel/Stripe/Linear, we created an original identity
rooted in three principles:

1. **Depth over flatness.** Every surface has a reason to exist — energy rings,
   glow halos, glassmorphism, noise film grain, conic gradient lighting, and
   layered orbs create a cinematic, luxury depth without sacrificing legibility.
2. **Motion with purpose.** Animations communicate hierarchy and state: the AI
   Core pulses like a living reactor, cards react to the cursor, and scroll
   tells a continuous story. Nothing spins or fades just for flair.
3. **Enterprise seriousness.** The dark luxury palette (navy-950 base, electric
   blue `#1E6BFF`, neon blue `#33B5FF`) is anchored by generous whitespace, sharp
   typography (Space Grotesk for display / Inter for body), and precision grid
   alignment so the brand never reads as "flashy tech startup" — it reads as
   **mission-critical engineering partner**.

---

## 2. High-Level Stack

```
┌─────────────────────────────────────────────────────────────┐
│                         Vercel (SSR/Edge)                   │
├─────────────────────────────────────────────────────────────┤
│  Next.js 15 (App Router)  ·  React 19  ·  TypeScript strict │
│  Tailwind 3.4  ·  Framer Motion 11  ·  Lenis (smooth scroll)│
├──────────────┬──────────────────────────────────────────────┤
│   Client     │  Firebase Auth (Google + Email/Password)     │
│   (Browser)  │  Supabase JS (DB/Storage/Realtime/RPC)       │
│              │  Custom WebGL shader (hero backdrop)         │
│              │  Canvas 2D AI Core (no Three.js — 0KB cost)  │
├──────────────┴──────────────────────────────────────────────┤
│  Supabase Postgres  ·  Storage buckets  ·  Realtime         │
│  Edge Functions (send-email, send-push)  ·  RLS everywhere  │
└─────────────────────────────────────────────────────────────┘
```

**Bundle philosophy:** We deliberately avoided heavy 3D libraries
(`three`, `@react-three/fiber`, `drei`, `@react-spring/three`, `gsap`)
because they add 150-300 KB gz and hurt Lighthouse. Instead we built the
cinematic visuals on:
- **Raw WebGL 1** for the drifting flow-line field (`ShaderBackground.tsx`) — 0 deps.
- **Canvas 2D** for the hero AI Core (`AICoreVisual.tsx`) — 0 deps, 60fps on mobile.
- **Framer Motion** (already installed) for all UI/scroll/parallax work.
- **Lenis** (~5 KB) for buttery smooth scrolling, disabled on touch devices.

Total shared JS on the landing page: **326 KB** (down from most enterprise
agency sites which ship 800 KB+).

---

## 3. Directory Layout

```
app/                       # Next.js App Router
  layout.tsx               # Root layout, SEO, providers, JSON-LD
  page.tsx                 # Landing page (composes sections)
  globals.css              # Design system (tokens, components, utilities)
  components/              # Shared app-level UI
    AuthProvider.tsx       # Firebase-first auth + role booleans
    SmoothScroll.tsx       # Lenis wrapper (desktop only)
    CursorGlow.tsx         # Custom cursor glow (desktop dark mode)
    MagneticButton.tsx     # Spring-physics magnetic CTAs
    ParticleBackground.tsx # Brand-blue particle network
    LoadingScreen.tsx      # First-paint loader
    ...
  api/health/route.ts      # SSR-only uptime endpoint (excluded from static builds)
  founder/, super/, developer/, admin/, hr/, client/, profile/
  auth/reset/, quote/, careers/, feedback/, ticket/
components/
  premium/                 # Marketing-site sections (PremiumHero, Services, ...)
  dashboard/               # Role dashboards (SystemHealth, InviteUserPanel, Charts, ...)
  home/                    # Reusable primitives (Reveal, ScrollReveal, StatsSection, ...)
  three/                   # WebGL backdrops (ShaderBackground)
lib/                       # Business logic (no UI)
  firebase.ts              # Firebase Auth client
  supabase.ts              # Safe Supabase proxy
  sync-profile.ts          # Firebase → Supabase profile sync
  invitations.ts           # Invite tokens (create/accept/list)
  roles.ts                 # RBAC helpers
  client.ts                # Client dashboard queries
  tickets.ts, crm.ts, audit.ts, storage.ts, email.ts, push.ts ...
supabase/migrations/       # Idempotent SQL (001..004)
scripts/
  build-static.js          # Moves app/api/ aside for output:'export', restores after
  fix-paths.js             # Rewrites asset paths for file:///Android
  make-html-preview.py     # Bundles dist/ into a self-contained HTML
docs/                      # 13 operational runbooks
```

---

## 4. Hybrid Build (SSR + Static Export)

A single `next.config.js` supports two production targets from the same codebase:

| Mode | Command | Output | Deploy Target | API Routes |
|---|---|---|---|---|
| SSR (default) | `npm run build` | `.next/` | Vercel | `/api/health` dynamic Node route |
| Static export | `npm run build:static` | `dist/` | ZIP / file:// / Android static hosting | Excluded (moved aside by `scripts/build-static.js`) |

`scripts/build-static.js` atomically renames `app/api/` → `app/_api_disabled/`
before Next.js starts and **always** restores it (success, error, SIGINT — try/finally
with signal handlers). This lets Next.js compile the static export without any
API route errors, and the source tree is left intact afterwards. `scripts/fix-paths.js`
then rewrites `_next/…` asset URLs to relative paths so the bundle opens from
`file://` on Android.

---

## 5. Authentication & RBAC

| Concern | Implementation |
|---|---|
| Identity provider | **Firebase Auth** (`lib/firebase.ts`) — Google popup, email/password, reset, `browserLocalPersistence`, auto token refresh. |
| Profile/RBAC store | **Supabase `profiles` table** synced on every login via SECURITY DEFINER RPC `upsert_firebase_profile()` (migration 003). |
| Role hierarchy | guest(0) → client(10) → hr(40) → developer(50) → admin(70) → director(80) → ceo(90) → founder(100). `roleMeetsMinimum()` guards every dashboard. |
| Role booleans | `isFounder/isDirector/isAdmin/isDeveloper/isHR/isClient/isGuest/isPrivileged` exposed from AuthProvider. |
| Session sync | After Firebase sign-in, `syncProfileToSupabase()` calls the RPC which auto-promotes `ceo@kadslabs.com` / `founderskadslabs@gmail.com` → founder and writes `login_history`. |
| Invitations | `invitations` table (24-byte hex tokens, 7-day, email-bound), `create_invitation/accept_invitation` SECURITY DEFINER RPCs, UI in Founder Console. |
| Demo mode | Only on `localhost` / `file://` / LAN IPs — production domains (`kadslabs.com`, `*.vercel.app`) show `ConfigError` instead of falling back to localStorage. |

---

## 6. Cinematic Visual System

### 6.1 AI Core (`components/home/AICoreVisual.tsx`)
A 2D canvas visualisation (no WebGL cost) delivering a "futuristic reactor" feel:
- Central gradient sphere with pulsating core, inner rotating hex geometry, and a mouse-reactive specular highlight
- Three dashed energy rings rotating at different speeds
- Conic outer glow (CSS) + 90 orbiting particle "data nodes" across 3 orbital bands
- Expanding ripple rings (reactor emission)
- Scroll-linked fade/scale via `scrollProgress` prop
- DPR-capped (1.25 mobile, 1.75 desktop), reduced-motion safe (freezes at t=0)

### 6.2 Drifting Flow Lines (`components/three/ShaderBackground.tsx`)
Raw WebGL 1 full-screen-triangle shader — FBM noise warps UVs to produce subtle electric-blue filaments that drift across the viewport. Used at ~20% opacity as a **texture**, not a focal graphic. Theme-aware (dark/light).

### 6.3 Custom Cursor (`CursorGlow.tsx`)
Desktop + dark mode only (hidden on touch/light/reduced-motion). Uses rAF lerping for a trailing 400px blue glow + tiny 6px neon dot. Applied with `cursor: none` via `.cursor-glow-enabled` so CSS cursors are consistently replaced.

### 6.4 Magnetic Buttons (`MagneticButton.tsx`)
Spring-physics magnetic pull — buttons translate up to 8px toward the cursor within an expanded hit-area, snap back on leave with `stiffness:250, damping:12`.

### 6.5 Smooth Scroll (`SmoothScroll.tsx`)
Lenis wrapper, disabled on touch + reduced-motion. Anchor clicks are intercepted and `lenis.scrollTo()` is used for consistent smoothness.

### 6.6 Particle Network (`ParticleBackground.tsx`)
Existing canvas particle network retained for brand continuity.

### 6.7 Global Effects
- Animated gradient orbs (drifting blobs) in hero
- Conic spin on outer AI Core ring (30s loop)
- Grid backdrop + vignette for cinematic dark theme
- Noise film grain overlay via inline SVG (0 network request)
- Mouse spotlight on hero (radial gradient follows cursor)
- `animate-spin-slow`, `orb-drift-1/2/3`, `float`, `shimmer` keyframes in tailwind config

---

## 7. Performance Budget

| Metric | Budget | Actual (SSR build) |
|---|---|---|
| First Load JS shared | < 120 KB gz | **102 KB** ✅ |
| Landing page total | < 350 KB gz | **326 KB** ✅ |
| Largest route chunk (home) | < 60 KB | 44.6 KB ✅ |
| Heavy visuals | Lazy (dynamic import) | ✅ ShaderBackground, AICoreVisual |
| Animations | 60fps target | DPR-capped, rAF-throttled, reduced-motion ✅ |
| Static export | Zero errors | ✅ 15 pages → `dist/` |

Performance tactics:
- All heavy visuals (`ShaderBackground`, `AICoreVisual`) are loaded with `next/dynamic({ ssr:false })` so hero text paints first.
- WebGL/Canvas DPR capped (≤1.25 mobile / ≤1.75 desktop) to keep fill-rate cheap.
- Tailwind purge; no unused CSS.
- `next/image` + `SafeImage` wrapper for proper sizing and priority hints.
- Long-term caching of static assets (immutable 1y), HTML/SW/VERSION no-cache in `vercel.json`.
- Preconnect to Supabase + Google Fonts.
- Lenis disabled on touch (native iOS momentum is faster/better).

---

## 8. Accessibility

- Skip link (`SkipLink.tsx`) jumps to `#main-content`.
- Focus-visible rings in brand electric blue.
- All CTAs have `aria-label` (MagneticButton forwards).
- Service cards with `role="button"` support keyboard Enter/Space.
- `prefers-reduced-motion` disables: cursor glow, smooth scroll, parallax, AI Core animation (freezes at t=0), ShaderBackground (frozen frame), all decorative float/orb animations.
- Color contrast: white/secondary/muted text on dark navy passes WCAG AA.
- Semantic HTML5 landmarks (`<main>`, `<section id>`, `<header>`, `<nav>`, `<footer>`).
- Forms have labels, aria-invalid, aria-describedby for errors.
- Touch targets ≥ 44px on mobile (enforced via CSS).

---

## 9. SEO & Structured Data

- Full `metadata` + `viewport` exports (Next.js 15 Metadata API).
- `Organization`, `WebSite`, `SoftwareApplication` JSON-LD in root layout.
- Open Graph + Twitter Cards with logo.
- Canonical + `x-default` hreflang + `en-US`/`hi-IN` alternates.
- `robots.txt` + `sitemap.xml` pre-generated in public.
- FAQ schema can be added to FAQ sections (documented in docs/).
- `category`, `classification`, `authors`, `creator` all set.

---

## 10. Security

Layered defense:
1. **Security headers** in middleware + next.config.js + vercel.json: CSP, HSTS, X-Frame-Options SAMEORIGIN, X-Content-Type-Options, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy (camera/mic/geolocation/usb/payment disabled), XSS-Protection.
2. **RLS on every Supabase table** with role-aware policies.
3. **SECURITY DEFINER** RPCs for profile upsert, invitations, audit logging — no direct client writes to protected columns.
4. **CSRF** token helpers for forms.
5. **Rate limiting** (ticket submissions: 1/5s, 10/hr per client hash).
6. **Honeypot** on all public forms (`website` field — invisible to real users, traps bots). Captcha removed per brief (we use honeypot + rate-limit + domain checks).
7. **Audit logs** table (`audit_logs`) and login history (`login_history`) automatically written.
8. **Secret env vars** (`SUPABASE_SERVICE_ROLE_KEY`, SMTP, JWT_SECRET, RESEND_API_KEY, OPENAI_API_KEY, FCM_SERVER_KEY) never exposed via `NEXT_PUBLIC_` — server-only.
9. **Error escalation** in `ErrorLogger.tsx` — client errors flow into `system_events`; ≥5 errors auto-escalates to founder alerts.

---

## 11. Dashboard Architecture

All role dashboards share `components/dashboard/DashboardShell.tsx` which provides:
- Sidebar navigation (role-aware: Founder sees all, HR sees only HR, etc.)
- Top command bar (GlobalSearch with ⌘K, notifications, profile menu, theme/language toggles)
- Breadcrumb + page title
- Responsive drawer on mobile
- Realtime online indicator

Widgets are composable and composed per role:

| Dashboard | Key Widgets |
|---|---|
| Founder (`/super`) | User table, role dropdown, suspend/reactivate, password reset, InviteUserPanel, SystemHealth, AuditLog, Analytics |
| Founder Insights (`/founder`) | KPIs, Charts, ActivityTimeline, SystemHealth, AIAssistant, ⌘K search |
| Developer (`/developer`) | Assigned tasks, bugs, deployments, build status, performance metrics |
| Admin (`/admin`) | ContentEditor, MediaLibrary, PermissionsPanel, TicketsPanel, JobApplicationsPanel |
| HR (`/hr`) | Hiring pipeline, applications, resume viewer, interview tracking |
| Client (`/client`) | Projects (RLS-email-scoped), progress, invoices, files, support tickets |

---

## 12. Deployment Instructions (short form)

1. **Firebase** → create project `kads-labs-3` (already done), enable Email+Google, register web app, copy the 7 `NEXT_PUBLIC_FIREBASE_*` vars to `.env.local` / Vercel.
2. **Supabase** → create project, run migrations 001→004 in SQL Editor, copy URL + anon key.
3. **Vercel** → import GitHub repo, add env vars per `docs/ENVIRONMENT_SETUP.md`, deploy.
4. **Domains** → add `kadslabs.com` + `www.kadslabs.com`, add to Firebase Authorized Domains.
5. **Founder seed** → create `ceo@kadslabs.com` and `founderskadslabs@gmail.com` in Firebase Auth. First sign-in auto-provisions them as founder via the upsert RPC.
6. **Edge Functions** → deploy `send-email`, `send-push`, set SMTP/Resend secrets.
7. **Smoke test** per `docs/DEPLOYMENT.md` Phase 4 checklist.

Full runbooks: see `docs/` (13 files) and `DEPLOYMENT_GUIDE.md`.

---

## 13. Files Modified (v2.0 → v2.1 cinematic pass)

**New files**
- `components/home/AICoreVisual.tsx` — Cinematic AI Core canvas
- `components/home/ScrollReveal.tsx` — Reusable scroll-reveal wrapper
- `app/components/SmoothScroll.tsx` — Lenis smooth-scroll provider
- `scripts/build-static.js` — Static-export API route work-around
- `ARCHITECTURE_v2.1.md` — this document

**Modified (marketing-site upgrades)**
- `components/premium/PremiumHero.tsx` — New headline, cinematic AI Core, conic energy rings, tick marks, 5 floating status chips, noise + vignette, improved spacing/typography
- `components/premium/ServicesSection.tsx` — Cinematic conic-border hover, keyboard support, shine sweep
- `app/globals.css` — Added cinematic utility classes (animated gradient text, cinematic conic border, service card shine, logo breathe, live/pulse indicators, ambient lighting, scanlines, dot grid, cinematic scrollbars, status pill)
- `app/layout.tsx` — Integrated SmoothScroll provider
- `package.json` — Added `lenis@1.1.20`, new `build:static` script path via build-static.js

**Modified (build tooling)**
- `next.config.js` — unchanged (hybrid SSR/static from v2.0)
- `app/api/health/route.ts` — Simplified, SSR-only (moved aside by build-static.js during static export)

All existing files (auth, Supabase migrations, dashboards, forms, PWA, CRM, RBAC) are preserved **without behavioural changes** to protect production stability.

---

## 14. New Dependencies

| Package | Version | Purpose | Gz Size |
|---|---|---|---|
| `lenis` | 1.1.20 | Buttery smooth scroll (desktop only) | ~5 KB |

No other dependencies were added. Three.js/R3F/GSAP were intentionally avoided.

---

## 15. Verification Checklist (v2.1)

- [x] `npm run lint` — 0 warnings, 0 errors
- [x] `npm run typecheck` — 0 errors (TS strict)
- [x] `npm run build` (SSR) — 16 routes, 0 errors, 326 KB shared JS
- [x] `npm run build:static` — 15 pages → `dist/`, paths rewritten for file://
- [x] `app/api/` always restored after static build (signal-safe)
- [x] Auth flow code unchanged (Firebase)
- [x] Supabase migrations 001–004 intact
- [x] Dashboards unchanged (founder/super/dev/admin/hr/client)
- [x] Mobile: touch-native (no Lenis, no cursor glow, tap targets ≥44px)
- [x] Reduced-motion: all non-essential animation disabled
- [x] Demo mode still off on production domains
- [x] SEO meta/JSON-LD unchanged
- [x] Deliverables regenerated:
      `/home/user/kadslabs-website.html` (~587 KB self-contained preview)
      `/home/user/kadslabs-website.zip` (~1.7 MB dist bundle)
      `/home/user/kadslabs-website-full.zip` (~5.4 MB full source)

---

## 16. Manual Testing Checklist

For QA after live deploy:

- [ ] Landing page: hero text paints before AI core (no CLS)
- [ ] AI Core pulses, particles orbit, rings rotate; mouse moves specular highlight
- [ ] Scroll: Lenis smooth on desktop; native momentum on iOS/Android
- [ ] Magnetic buttons: CTA attracts to cursor within ~8px radius, springs back
- [ ] Custom cursor visible on desktop dark mode; hidden on light/mobile
- [ ] Services cards: conic glow appears on hover, keyboard-accessible (Enter/Space)
- [ ] Theme toggle works; light/dark both look premium
- [ ] Language toggle works (English / Hindi)
- [ ] Google sign-in opens popup; on first sign-in creates profile with correct role
- [ ] Email/password sign-in, sign-up, password reset all work
- [ ] Role-gated routes: /super requires founder (redirects otherwise)
- [ ] Founder Console can invite users; invite emails queue (email_queue table)
- [ ] SystemHealth widget shows green when Firebase/Supabase configured
- [ ] Contact/quote/feedback/careers forms submit → TCK-NNNNNN ID returned → email_queue row
- [ ] Honeypot field is invisible; submitting with it filled silently discards
- [ ] Rate limit: hammering contact form triggers 429-style cooldown
- [ ] PWA installs, works offline (offline page)
- [ ] Lighthouse: Performance ≥95, Accessibility ≥95, SEO 100, Best Practices ≥95
- [ ] Static export ZIP opens from `file://` with no console errors
- [ ] Mobile Safari: no horizontal scroll, buttons are full-width touch-friendly
- [ ] Reduced-motion OS setting freezes all decorative animation
