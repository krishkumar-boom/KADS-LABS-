# Security

KADS LABS applies a defense-in-depth security model spanning transport, application, database and client layers. This document summarizes the controls in place and how to extend them.

---

## 1. Transport security

- **HTTPS everywhere**: Vercel provisions TLS automatically; HSTS is enforced via middleware.
- **HSTS** `max-age=63072000; includeSubDomains; preload` (2 years).
- **X-Frame-Options: SAMEORIGIN** prevents clickjacking.
- **X-Content-Type-Options: nosniff** blocks MIME sniffing.
- **Referrer-Policy: strict-origin-when-cross-origin** limits referrer leakage.
- **Permissions-Policy** disables camera, microphone, geolocation, payment, USB, and interest-cohort by default; autoplay/fullscreen self-only.
- **Content-Security-Policy** (see §3).

All headers are set in `middleware.ts` (Edge) and mirrored in `next.config.js` and `vercel.json` for defense-in-depth.

---

## 2. Authentication

- **Firebase Authentication** with:
  - Google OAuth 2.0
  - Email/Password with Firebase's built-in rate-limiting and breach detection
  - Password reset emails
  - Secure sessions via `browserLocalPersistence` (IndexedDB/localStorage; HTTPS-only by virtue of the transport)
  - Automatic ID token refresh
- **No password stored in our DB** — Firebase stores credentials with industry-standard hashing (scrypt).
- **Sessions bind to a Supabase profile** via `firebase_uid`; see `lib/sync-profile.ts`.
- **Production vs demo guard**: demo mode (localStorage-only auth) is **disabled on production domains** (`kadslabs.com`, `*.vercel.app`). Instead a red `ConfigError` banner shows until Firebase + Supabase env vars are configured.

---

## 3. Content Security Policy

Applied via middleware (Edge). Current directives:

| Directive | Value |
|---|---|
| default-src | `'self'` |
| script-src | `'self' 'unsafe-inline' 'unsafe-eval'` *.googletagmanager.com *.clarity.ms *.supabase.co cdn.vercel-insights.com |
| style-src | `'self' 'unsafe-inline'` fonts.googleapis.com |
| font-src | `'self'` fonts.gstatic.com data: |
| img-src | `'self'` data: blob: https: http: |
| connect-src | `'self'` *.supabase.co wss://*.supabase.co google-analytics.com analytics.google.com *.clarity.ms va.vercel-scripts.com |
| media-src | `'self'` blob: |
| worker-src | `'self'` blob: (PWA service worker) |
| frame-src | `'self'` www.google.com (reCAPTCHA placeholder — captcha is removed but kept for future) |
| object-src | `'none'` |
| base-uri | `'self'` |
| form-action | `'self'` |
| manifest-src | `'self'` |

`'unsafe-inline'` for scripts is required while we inline the theme-init script; nonces can be added in a future iteration.

---

## 4. Input validation & injection protection

- **React default escaping** prevents HTML/XSS injection in rendered output.
- **Server-side-style form sanitization** (`lib/security.ts`):
  - `sanitizeText`: strips tags, control chars, and trims.
  - `sanitizeEmail` / `sanitizePhone`: normalizes and rejects malformed values.
  - `isValidEmail` regex check.
- **SQL injection**: all database access uses the Supabase JS client with parameterized queries; no raw SQL concatenation.
- **CSRF**: double-submit cookie token (`getCsrfToken`/`validateCsrfToken`) available for forms that mutate privileged data.
- **Honeypot** hidden field (`website`) on every public form — bots that fill it are silently rejected.
- **Rate limiting**: client-side sliding window (`clientRateLimit`) per IP/UA hash limits submissions to 1/5s and 10/hr per client. Server-side rate limits should additionally be applied at the Edge / API gateway.

---

## 5. Authorization (RBAC + RLS)

See [ROLE_MANAGEMENT.md](ROLE_MANAGEMENT.md). Summary:
- Routes protected by middleware (noindex/private cache) + client redirects.
- UI components gated with `RoleGate` and `useAuth()` booleans.
- Every table has Row Level Security enabled; policies enforce per-row access.
- Server-only `SUPABASE_SERVICE_ROLE_KEY` is never exposed to the client.
- The `upsert_firebase_profile` and `log_audit` helpers are defined `SECURITY DEFINER` with search_path set explicitly to prevent search_path hijacking.

---

## 6. Cookies & storage

- `safeStorage` helper guards `localStorage` access (SSR-safe, quota-safe).
- No sensitive data (tokens, passwords) stored in cookies; Firebase persists to IndexedDB/localStorage over HTTPS.
- Cookie consent banner (`CookieConsent`) fires a `kads:consent` event before analytics scripts load.
- Demo-mode data stored in localStorage is namespaced (`kads_demo_*`) to avoid collisions.

---

## 7. Error handling & logging

- `app/components/ErrorLogger.tsx` captures `window.onerror`, `unhandledrejection`, and LCP metrics; each error gets a digest ID and is persisted as a `bug_reports` row.
- Global error boundary (`app/global-error.tsx`) shows a user-friendly error page with the digest ID and retry/home buttons.
- `console.log` statements are removed; only `console.warn`/`console.error` remain for actionable diagnostics.
- PWA service worker updates are detected via `/VERSION` polling and surface a reload prompt.

---

## 8. Third-party dependencies

- All dependencies pinned in `package-lock.json`. `npm audit` runs in CI.
- Only well-known libraries: Next.js, React, Framer Motion, Supabase JS, Firebase, Lucide, Zod, react-hook-form, Tailwind.
- Regular `npm outdated` / Dependabot PRs recommended.

---

## 9. Privacy & compliance

- Cookie consent for non-essential analytics (GA/Clarity).
- MSME / business identification in footer.
- No fake testimonials/awards/aggregate ratings.
- Forms are honest about what data is collected; data retention follows Supabase backup policies.
- GDPR-style "Reject All" cookie option is provided.

---

## 10. Hardening checklist (production)

- [ ] Restrict Firebase API key to production/preview referrers (Google Cloud Console).
- [ ] Enable Supabase PITR (≥ 7 days).
- [ ] Network-restrict Supabase to Vercel IP ranges (if feasible).
- [ ] Add server-side rate limiting (Edge middleware or Vercel KV).
- [ ] Add CSP nonce for inline theme script to remove `'unsafe-inline'` from script-src.
- [ ] Add WAF / DDoS (Vercel includes baseline; Cloudflare optional).
- [ ] Rotate `JWT_SECRET`, `ENCRYPTION_KEY`, `COOKIE_SECRET` on a schedule.
- [ ] Set up security.txt at `/.well-known/security.txt` with a security contact.
- [ ] Enable Vercel Deployment Protection (password / SSO) for previews if sensitive.
- [ ] Subscribe to security advisories for Next.js, Firebase and Supabase.

---

## 11. Incident response

1. **Assess** — collect error digest IDs from logs; reproduce from dashboard / audit logs.
2. **Contain** — if a vulnerability is confirmed, suspend affected accounts via `/super` or roll back Vercel deployment (one-click).
3. **Fix** — patch code, add regression test, ship new release.
4. **Recover** — reactivate suspended accounts; notify affected users if data was exposed.
5. **Review** — post-mortem in audit logs; update this document.

---

## 12. Reporting vulnerabilities

Email `founderskadslabs@gmail.com` or `ceo@kadslabs.com` with subject `[SECURITY]`. We do not currently run a public bug-bounty program but will acknowledge valid reports.
