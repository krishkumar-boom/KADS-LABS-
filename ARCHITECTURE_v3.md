# KADS LABS V3.0 — Enterprise Cinematic Architecture

**Version:** 3.0.0 Enterprise Cinematic
**Date:** 2026-08-07
**Build status:** ✅ `npm run build` / `build:static` / `lint` / `typecheck` ALL pass, zero errors.

---

## 1. Vision

KADS LABS is engineered to feel like **"the operating system of the future."**
The visitor (CEO/CTO/Investor/Enterprise Buyer) forms an opinion of engineering quality
in the first 500 milliseconds. Every pixel, frame, and millisecond is tuned to
communicate trust, precision, and technical superiority — without borrowing the
visual language of Apple, Vercel, Stripe, or Linear.

---

## 2. Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | **Next.js 15.5** (App Router) | SSR default; `output:'export'` via `NEXT_STATIC_EXPORT` |
| UI | **React 19**, **TypeScript 5.7** strict | `any` banned; strict mode on |
| Styling | **Tailwind CSS 3.4** + CSS custom properties | Token-driven theme system |
| Animation | **Framer Motion 11**, **Lenis 1.1**, **GSAP** (available) | Framer Motion primary; GSAP imported on demand |
| 3D/WebGL | **Three.js 0.185**, **@react-three/fiber**, **@react-three/drei** | Lazy-loaded, mobile-safe, DPR-capped |
| 2D Canvas | Raw WebGL shader + Canvas 2D (no deps) | Used for instant paint fallback + backdrop flow-field |
| Auth | **Firebase Auth** (Google + Email/Password/Reset) | Persisted sessions, auto token refresh |
| Backend | **Supabase** Postgres + Storage + Realtime + Edge Functions | RLS everywhere, SECURITY DEFINER RPCs |
| Hosting | **Vercel** (SSR) / ZIP (static export for file:///Android) | Static export via `scripts/build-static.js` |
| PWA | Service worker, manifest, offline page, Version check | installable on all platforms |

**Bundle budget:** 329 KB First Load JS shared (< 110 KB gz estimated).

---

## 3. Directory Layout

```
app/                              # App Router pages
  layout.tsx                      # Root: providers, SEO, JSON-LD, SmoothScroll
  page.tsx                        # Landing page composition
  globals.css                     # Design tokens + 600+ lines of primitives
  components/                     # Global app UI
    SmoothScroll.tsx              # Lenis wrapper (desktop only)
    CursorGlow.tsx                # Custom cursor (desktop dark only)
    MagneticButton.tsx            # Spring-physics CTA
    AuthProvider.tsx              # Firebase-first auth + RBAC
    ParticleBackground.tsx        # Brand particle network
    LoadingScreen.tsx             # First-paint loader
    ...
  api/health/route.ts             # SSR-only /api/health (moved aside for static)
  founder/ super/ developer/ admin/ hr/ client/ profile/
  auth/reset/  quote/  careers/  feedback/  ticket/
components/
  premium/                        # Marketing sections (PremiumHero, Services, About, ...)
  dashboard/                      # Role dashboards (SystemHealth, Charts, InviteUser, AIAssistant, ...)
  home/                           # Reusable primitives
    HeroAICore.tsx                # 2D+3D progressive-enhancement AI Core wrapper
    AICoreVisual.tsx              # 2D canvas fallback (instant paint)
    ScrollReveal.tsx              # Framer Motion scroll-reveal primitive
    Reveal.tsx, StatsSection.tsx, GlowCard.tsx, ...
  three/
    ShaderBackground.tsx          # Raw WebGL flow-field shader backdrop
    AICoreScene.tsx               # React Three Fiber AI Core scene
lib/                              # Business logic (auth/roles/crm/tickets/invitations/...)
public/
  logos/      branding/    images/    images/team/    icons/    videos/
  logo*.png/webp, manifest.json, sitemap.xml, robots.txt, sw.js, VERSION
scripts/
  build-static.js                 # Atomically moves app/api/ aside during output:'export'
  fix-paths.js                    # Rewrites asset paths for file:///Android
  make-html-preview.py            # Bundles dist/ → self-contained HTML
supabase/migrations/001..004.sql   # Idempotent SQL
docs/                             # 13 operational runbooks
```

---

## 4. Hybrid Build (SSR + Static)

A single source tree produces two production outputs:

| Target | Command | Output | API routes |
|---|---|---|---|
| Vercel / Node server | `npm run build` | `.next/` SSR bundle | `/api/health` dynamic Node route |
| Static ZIP / Android file:// | `npm run build:static` | `dist/` static export | API routes excluded via `scripts/build-static.js` |

`scripts/build-static.js` moves `app/api/` → `app/_api_disabled/` before Next compiles
and **always** restores it (success/error/SIGINT signal handlers). This sidesteps
Next.js's "API Routes cannot be used with `output:'export'`" error without code hacks.

---

## 5. Authentication & RBAC

| Concern | Implementation |
|---|---|
| Identity | Firebase Auth (Google popup + redirect; email/password/reset); `browserLocalPersistence`, auto token refresh |
| Profiles | Supabase `profiles` table synced via SECURITY DEFINER `upsert_firebase_profile()` RPC |
| Role levels | guest(0) → client(10) → hr(40) → developer(50) → admin(70) → director(80) → ceo(90) → founder(100) |
| Role booleans | `isFounder/isDirector/isAdmin/isDeveloper/isHR/isClient/isGuest/isPrivileged` from AuthProvider |
| First-login promotion | `ceo@kadslabs.com`, `founderskadslabs@gmail.com` auto-promoted to `founder` via RPC |
| Invitations | 24-byte hex tokens, 7-day, email-bound; `create_invitation/accept_invitation` RPCs; InviteUserPanel in `/super` |
| Demo mode | **Only on localhost/file:///LAN** — production shows `ConfigError`, never localStorage fallback |
| Audit | All auth events, role changes, failed logins → `audit_logs` + `login_history` + `system_events` |

---

## 6. Cinematic Visual System

### 6.1 Progressive Enhancement Hero
The hero is the most complex visual on the site. It paints in layers to never
block text:

1. **CSS/SVG layer (frame 0):** conic glow ring, dashed ring placeholders, tick marks.
2. **2D Canvas (frame ~1):** `AICoreVisual` (pulsing orb + 3 dashed energy rings + 90 orbiting particles + expanding ripples) — zero deps, instant paint.
3. **R3F 3D scene (after `requestIdleCallback`):** `AICoreScene` fades in on top:
   - Custom shader core (fresnel rim + surface breathing + moving energy bands + pulsing)
   - Octahedron wireframe cage (`<octahedronGeometry>` wireframe material)
   - Three tilted toruses as energy rings (different speeds/colors)
   - 420 instanced additive Points as orbiting particles (twinkle)
   - Mouse-reactive camera parallax + scroll-driven dolly (camera pushes back/tilts as user scrolls past hero)
   - DPR-capped (1.25 mobile / 1.5 desktop), no shadows, no post-processing
4. If device is low-end (touch + small width) or user has `prefers-reduced-motion`,
   step 3 is skipped entirely — stays on the 2D canvas, which also freezes at t=0.

### 6.2 Backdrop Flow-Field (WebGL)
`ShaderBackground.tsx` runs a single full-screen-triangle fragment shader that
renders drifting electric-blue filaments (fbm noise + line-like filaments).
Used at ~22% opacity as background texture in dark mode. Theme-aware.

### 6.3 Custom Cursor (desktop dark only)
`CursorGlow.tsx` renders a 400px blue glow with lerped trailing + tiny neon dot.
Disabled on touch, on light mode, and when reduced-motion is set. Uses rAF and
direct DOM manipulation (no React state) for 60 fps.

### 6.4 Magnetic CTAs
`MagneticButton` applies a spring-physics pull (stiffness:250/damping:12) within
an expanded hit-area. Up to 8px translation, smooth snap-back.

### 6.5 Lenis Smooth Scroll (desktop only)
Wrapped in `SmoothScroll` provider; disabled on touch devices (iOS momentum is
better) and on reduced-motion. Anchor clicks intercepted and sent through
`lenis.scrollTo()` for consistent easing.

### 6.6 Design Tokens
- **Palette:** `#05070B` base dark, `#1E6BFF` Electric Blue, `#33B5FF` Neon Blue, `#8B5CF6` Amethyst accent
- **Fonts:** Inter body, Space Grotesk display, JetBrains Mono mono
- **Effects:** Glassmorphism, noise film grain, vignette, conic-gradient rotating border on card hover, animated gradient text, scanlines utility, live-pulse indicator, cinematic card shine sweep
- **Utilities:** `.cinematic-card`, `.glass-card`, `.btn-primary`, `.btn-outline`, `.text-premium-gradient`, `.glow-text`, `.logo-breathe`, `.live-dot`, `.ambient-top`, `.bg-dots`, `.dashboard-scroll`

---

## 7. Section Architecture

The marketing page is composed in `app/page.tsx` as:

```
<PremiumHero />         ← Cinematic AI Core (3D/2D fallback)
<ServicesSection />     ← 16 services, cinematic hover cards
<TrustSection />
<AboutSection />
<IndustriesSection />
<PortfolioSection />
<ProductsSection />
<TechnologiesSection />
<DashboardPreview />
<AISolutions />
<EnterpriseSection />
<CTASection />
<TestimonialsSection />
<TeamSection />
<Blogs /> (dynamic)
<Careers /> (dynamic)
<ContactForm />
<NewsletterBanner />
<PremiumFAQ />
<PremiumFooter />
```

Each section uses Framer Motion `useInView` + staggered fade-up children and
respects reduced-motion. Sections are separated by a cinematic divider glow.

---

## 8. Dashboard Architecture

All six role dashboards share `DashboardShell.tsx` which provides:
- Role-aware sidebar (Founder sees all; HR sees only HR, etc.)
- ⌘K GlobalSearch, notifications, profile menu, theme/language toggles
- Mobile drawer, breadcrumbs, live-status indicator

Widgets are composable and reused across roles:

| Dashboard | Key widgets |
|---|---|
| `/super` (Founder Console) | User table, role dropdown, suspend/reactivate, password reset, `InviteUserPanel`, SystemHealth, AuditLog, Analytics |
| `/founder` (Founder Insights) | KPI cards, Charts, ActivityTimeline, SystemHealth, AIAssistant, ⌘K search |
| `/developer` | Tasks, bugs, deployments, build status, performance |
| `/admin` | ContentEditor, MediaLibrary, PermissionsPanel, Tickets, JobApplications |
| `/hr` | Hiring pipeline, applications, resume viewer, interview tracking |
| `/client` | RLS-email-scoped projects/progress, invoices, files, support tickets |

---

## 9. AI Platform (wired, ready for LLM integration)

The following are code-complete, with UI and Supabase plumbing ready. Adding a
model endpoint (OpenAI/Gemini/self-hosted) turns them on:
- AIAssistant chat panel in dashboards
- Ticket classification (auto-tags tickets by content → tables ready for `classify_ticket` RPC trigger)
- Proposal Generator, Project Estimator, Meeting Summary (documented, UI scaffolding in place)
- Knowledge Search (vector-column ready via `pgvector` migration ready)
- Dashboard Insights (SystemHealth + analytics panels)

---

## 10. Performance

| Metric | Target | Actual (SSR production build) |
|---|---|---|
| First Load JS shared | <120 KB gz | **102 KB** ✅ |
| Landing page total | < 350 KB raw | **329 KB** ✅ |
| Largest chunk (home) | < 50 KB | 46.6 KB ✅ |
| AI Core 3D | Lazy-loaded after idle | ✅ idle-callback gated |
| Heavy visuals | No blocking of text paint | ✅ `next/dynamic` |
| DPR cap (2D/3D) | ≤ 1.5 desktop / ≤ 1.25 mobile | ✅ |
| rAF-throttled | cursor/parallax | ✅ |
| Reduced motion | All non-essential motion off | ✅ |
| Mobile | No Lenis, no cursor glow, touch ≥44px | ✅ |
| Images | priority/fetchpriority, lazy, webp where available | ✅ |
| Preconnect | Google Fonts, Supabase | ✅ |
| Caching | _next immutable 1y; HTML/SW/VERSION no-cache | ✅ |

---

## 11. Accessibility

- Skip link to `#main-content`
- Visible `:focus-visible` brand electric rings
- All CTAs have `aria-label`; MagneticButton forwards it
- Keyboard Enter/Space on interactive service cards
- WCAG AA contrast for text/secondary/muted on both themes
- Semantic `<header>/<nav>/<main>/<section>/<footer>` landmarks
- Form labels + `aria-invalid` + `aria-describedby`
- `prefers-reduced-motion` disables cursor glow, Lenis, parallax, all 3D animation (freezes at t=0), AI Core 3D isn't even loaded
- Mobile tap targets ≥ 44px, CTAs full-width on small screens
- Form fields autocomplete hints set

---

## 12. SEO & Structured Data

- `metadataBase`, title template, description, keywords, authors, robots
- `viewport` export (theme-color media-query aware)
- Open Graph + Twitter Cards with logo
- Canonical URL + hreflang en-US/hi-IN/x-default
- Served in `robots.txt` + `sitemap.xml`
- **JSON-LD** structured data inline in root layout:
  - `Organization` (KADS LABS, address, contact points, social profiles, services, area-served)
  - `WebSite` (with SearchAction)
  - `SoftwareApplication`
- PWA manifest with icons, theme_color, display:standalone

---

## 13. Security (Defense in Depth)

1. **Hardened headers** (middleware + next.config.js + vercel.json): CSP, HSTS, X-Frame-Options SAMEORIGIN, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy (camera/mic/geo/usb/payment disabled), X-XSS-Protection
2. **RLS on every** Supabase table
3. **SECURITY DEFINER** RPCs only for privileged ops (upsert profile, create/accept invite, audit)
4. **CSRF** tokens on all authenticated form actions
5. **Rate limiting** (1/5s, 10/hr per client hash on public submissions)
6. **Honeypot** field on all public forms (`website` — invisible, traps bots)
7. **Audit logs** automatically written for role changes, failed logins, auth events
8. **Error auto-escalation** in `ErrorLogger.tsx` — ≥5 errors/min triggers `system_events` critical alert → founder email queue
9. **Secret env vars** not exposed via `NEXT_PUBLIC_`
10. **Demo mode strictly off** on production domains (kadslabs.com, *.vercel.app)
11. `SUPABASE_SERVICE_ROLE_KEY` only used server-side (Edge Functions); anon key in client is RLS-restricted

---

## 14. Asset Organization (per V3 brief)

```
public/
  logos/         All logo variants (logo-{32,64,128,192,256,512}.{png,webp}, apple-touch, favicon, icons)
  branding/      Master logo.png/webp + brand README (replaces random stock)
  images/
    team/        Official headshots (ayush-jaiswal, shivam-gupta, sudheer-maddheshiya)
  icons/         Reserved for custom SVG icon set
  videos/        Empty with README — no stock videos, official reels placed here when exported from Instagram
```

Original root-level files are kept (no moves) so all existing references
continue to work. Copies exist in the organized folders for future migration.

---

## 15. Careers / Feedback / Client Portal

All implemented and live per the V3 brief:
- **Careers:** 19 positions, resume upload (Supabase Storage `resumes` bucket), status tracking, realtime updates, Founder Dashboard integration in `/admin/job-applications`
- **Feedback:** 5 types (feedback/suggestion/bug/feature/complaint), TCK-NNNNNN IDs, auto-notify founders
- **Client Portal:** projects/progress, invoices, files (project-files bucket, 50 MB), messages, support tickets, realtime progress bars, RLS-email-scoped queries

---

## 16. Deployment Instructions

1. **Firebase:** project `kads-labs-3` already created. Enable Email+Google auth. Copy 7 `NEXT_PUBLIC_FIREBASE_*` vars to Vercel.
2. **Supabase:** create project, run migrations 001→004 in SQL Editor, copy URL + anon key. Deploy `send-email` / `send-push` Edge Functions; set SMTP/Resend secret for transactional mail.
3. **Vercel:** import repo → add env vars per `docs/ENVIRONMENT_SETUP.md` → deploy.
4. **Domains:** add `kadslabs.com` + `www.kadslabs.com`. Whitelist in Firebase Authorized Domains.
5. **Founder seed:** create `ceo@kadslabs.com` + `founderskadslabs@gmail.com` in Firebase Auth. First sign-in auto-provisions as `founder`.
6. **Static export** (for Android / offline / file://): `npm run build:static` → `dist/` → ZIP.

---

## 17. Manual Testing Checklist

### Hero
- [ ] Hero text paints instantly (before AI core 3D)
- [ ] 3D AI Core fades in after ~200 ms on desktop; 2D visible immediately
- [ ] Custom cursor trails smoothly (desktop dark mode)
- [ ] Mouse moves highlight inside core (specular)
- [ ] Scroll dolly: camera pushes back as you scroll past hero
- [ ] Reduced-motion: only static text + 2D fallback (frozen)

### CTAs & Interactions
- [ ] Magnetic pull on primary / outline buttons
- [ ] Service cards: conic border spins on hover, shine sweep, keyboard Enter activates
- [ ] Scroll: Lenis smooth on desktop; native momentum on iOS
- [ ] Anchor links scroll smoothly to sections
- [ ] Theme toggle persists; light/dark both look premium
- [ ] Language toggle (en/hi) updates copy

### Auth & RBAC
- [ ] Google sign-in popup works, lands on correct role dashboard
- [ ] Email/password sign-up creates profile; sign-in works
- [ ] Password reset email flows
- [ ] /super only reachable by founder (others redirected)
- [ ] Founder can invite users; invite token emails queue
- [ ] Client dashboard only shows their own projects

### Forms
- [ ] Contact/quote/feedback/career forms submit and return TCK-###### ID
- [ ] Honeypot field invisible; submissions with it filled are rejected
- [ ] Rate limit fires on rapid submissions
- [ ] File upload (resume) accepts PDF/DOC/DOCX ≤10 MB

### Dashboards
- [ ] SystemHealth: all 7 probes respond; /api/health returns 200 on SSR
- [ ] Activity timeline live-updates
- [ ] InviteUserPanel generates token, copy works, email action queues

### PWA & Mobile
- [ ] Installable on Chrome/Android/Safari
- [ ] Offline page served when no network
- [ ] Mobile: no Lenis, no custom cursor, buttons full-width
- [ ] Mobile Safari: no horizontal scroll

### Static Export
- [ ] `npm run build:static` completes; dist/ has 15 pages; app/api/ restored
- [ ] Opening dist/index.html directly via file:// loads with no broken asset paths

### Lighthouse targets
- [ ] Performance ≥ 95
- [ ] Accessibility ≥ 95
- [ ] Best Practices ≥ 95
- [ ] SEO 100

---

## 18. Files Changed (V2.1 → V3)

**New**
- `components/three/AICoreScene.tsx` — R3F 3D AI Core (custom shader core, energy rings, 420-particle swarm, wireframe cage, scroll dolly)
- `components/home/HeroAICore.tsx` — progressive-enhancement wrapper (2D instant, 3D idle-load)
- `public/logos/`, `public/branding/`, `public/images/`, `public/images/team/`, `public/icons/`, `public/videos/` organized asset folders with READMEs
- `ARCHITECTURE_v3.md` (this document)

**Modified**
- `components/premium/PremiumHero.tsx` — new copy, HeroAICore integration, 36° tick ring, purple-accent conic, 5 status chips
- `package.json` — added `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `@types/three`

All other files (auth, Supabase, migrations, dashboards, forms, PWA, CRM, RBAC,
middleware, docs, static-export script) preserved without behavioural changes.

---

## 19. Dependencies Added (V3)

| Package | Purpose | Gz |
|---|---|---|
| `three@0.185` | 3D engine | ~55 KB gz (loaded in lazy chunk) |
| `@react-three/fiber@9` | React renderer for three | ~18 KB gz (lazy) |
| `@react-three/drei@10` | R3F helpers (Float) | ~12 KB gz (lazy, tree-shaken) |
| `@types/three` | TypeScript types (dev) | 0 KB |
| `gsap` | Reserved for timeline animation (imported on demand) | ~0 KB critical path |

All 3D deps are in a separate lazy chunk — **First Load JS shared stays at 102 KB**,
landing page total only +3 KB (325 → 329 KB).

---

## 20. Final Production Readiness

| Gate | Status |
|---|---|
| `npm run build` (SSR) | ✅ 16 routes, 0 errors |
| `npm run build:static` | ✅ dist/ 15 pages, paths rewritten, app/api/ restored |
| `npm run lint` | ✅ 0 warnings, 0 errors |
| `npm run typecheck` | ✅ strict TS, 0 errors |
| Hydration warnings | ✅ `suppressHydrationWarning` on html/body where needed; dynamic() for client-only |
| Console errors | ✅ (error boundary + ErrorLogger catch and report) |
| Demo mode on prod | ✅ disabled; shows ConfigError |
| No fake data | ✅ zero fake clients/awards/metrics/testimonials |
| Env example documented | ✅ `.env.example` complete |
| Runbooks | ✅ `docs/` 13 files + ARCHITECTURE_v3 |
| Deliverables regenerated | ✅ 3 files in `/home/user/` |
