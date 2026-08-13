# Vercel Deployment

KADS LABS is a standard Next.js 15 app — Vercel auto-detects and builds it with zero configuration. This guide documents how to wire it up correctly.

---

## 1. Import the repository

1. Push your code to GitHub / GitLab / Bitbucket.
2. Go to https://vercel.com/new → import the repo.
3. Vercel detects Framework Preset: **Next.js**. Leave everything default.

**Do NOT override these settings:**
- Build Command: `next build` (default)
- Output Directory: leave blank (Vercel manages `.next`)
- Install Command: `npm install` (default)
- Node.js Version: **20.x** (Project → Settings → General → Node.js Version)

### Why no `output: 'export'` on Vercel?
The `next.config.js` only sets `output: 'export'` and `distDir: 'dist'` when `NEXT_STATIC_EXPORT=true`. Static export is used for ZIP/file:// builds (e.g. offline/Android hosting). Vercel needs SSR for middleware, security headers, redirects and future API routes.

---

## 2. Environment Variables

In Vercel → Project → **Settings → Environment Variables**, add every variable listed in [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md). Pay attention:

| Variable | Scope |
|---|---|
| `NEXT_PUBLIC_*` (Firebase, Supabase URL/anon, APP_URL, GA4, Clarity, VAPID) | Production, Preview, Development |
| Secrets (`SUPABASE_SERVICE_ROLE_KEY`, `SMTP_*`, `JWT_SECRET`, `ENCRYPTION_KEY`, `COOKIE_SECRET`, `FCM_SERVER_KEY`, `OPENAI_API_KEY`, `RESEND_API_KEY`) | Production (add to Preview only if you test those features) |
| `NEXT_PUBLIC_ADMIN_EMAILS` | All three scopes |

After adding, trigger a **Redeploy** so the build picks them up.

---

## 3. Domains

Vercel → Project → **Settings → Domains** → add:
- `kadslabs.com` (apex; Vercel will instruct you to set A/CNAME records)
- `www.kadslabs.com` (redirect to apex, or vice versa — your choice)

Once DNS is verified and HTTPS is provisioned (automatic):

1. Add `https://kadslabs.com` to Firebase Auth → Authorized Domains.
2. Add `https://kadslabs.com` and `https://www.kadslabs.com` to Supabase → Authentication → Redirect URLs.
3. Update `NEXT_PUBLIC_APP_URL` to `https://kadslabs.com`.

---

## 4. Preview deployments

Every PR gets a preview URL (e.g. `kadslabs-git-feature-kadslabs.vercel.app`). To make Firebase auth work on previews:

- Add `*.vercel.app` to Firebase Auth → Authorized Domains
- Add `https://*.vercel.app/**` to Supabase auth redirect URLs
- Set `NEXT_PUBLIC_APP_URL` preview value to the preview URL pattern (or leave the production value; the auth flow will redirect to the current host if the code uses `window.location.origin` — which it does)

---

## 5. Build & runtime checks

After deploy, confirm these in Vercel's build log:

```
✓ Compiled successfully
⚠ Linting and checking validity of types ... (no errors)
✓ Generating static pages (N/N)
ƒ Middleware  34.9 kB
```

And confirm runtime:

- Vercel → Project → Functions tab shows a single SSR function for the App Router.
- Edge Functions include your middleware.
- Analytics tab (if enabled) shows green health.

---

## 6. Security headers

`next.config.js` and `vercel.json` both add security headers (defense-in-depth). After deploy, verify with:
```bash
curl -I https://kadslabs.com
```
You should see:
```
x-content-type-options: nosniff
x-frame-options: SAMEORIGIN
strict-transport-security: max-age=63072000; includeSubDomains; preload
referrer-policy: strict-origin-when-cross-origin
permissions-policy: camera=(), microphone=(), geolocation=(), ...
content-security-policy: default-src 'self'; ...
```

---

## 7. Vercel project settings (recommended)

| Setting | Value |
|---|---|
| Framework | Next.js (auto) |
| Node.js | 20.x |
| Build command | `next build` |
| Output | `.next` (auto) |
| Root directory | `/` (unless you move the app in a monorepo) |
| Images (remote patterns) | Not needed; `images.unoptimized = true` for static export compat |
| GitHub integration | Enabled — auto-deploy on push to `main` |
| Preview comments | Optional |

---

## 8. Rollback

Vercel keeps every production deployment. To roll back:
- Vercel → Deployments → click the previous good deploy → `...` → Promote to Production.

Rollback is instant — no rebuild.

---

## 9. Custom server / non-Vercel

The app is portable to any Node 20 host using `next build && next start`. If you self-host:

1. Run the app behind HTTPS (Caddy, Nginx, Cloudflare).
2. Ensure websocket/upgrade is allowed for HMR dev only (not needed in prod).
3. Match the security headers from `next.config.js` and `vercel.json` in your reverse proxy if you run without Vercel.
4. For static file hosting (S3 + CloudFront, Netlify, GitHub Pages, Android file://) use `npm run build:static` and upload `dist/`.

---

## 10. Troubleshooting Vercel builds

| Build error | Fix |
|---|---|
| `ESLint must be installed` | Dependencies didn't install; run `npm install` and push `package-lock.json`. We have `eslint` + `eslint-config-next` in devDeps. |
| `Type error: X is not assignable to Y` | Run `npm run typecheck` locally to see TS errors — production builds fail on any TS error (by design). |
| `Env var not found` at runtime (ConfigError banner) | Add the missing `NEXT_PUBLIC_FIREBASE_*` or `NEXT_PUBLIC_SUPABASE_*` in Vercel and redeploy. |
| Middleware errors on Edge | The middleware uses standard Web APIs; ensure no Node-only modules are imported into `middleware.ts`. |
| Build hangs or OOM | Increase Function memory (Vercel → Settings → Functions → 1024MB / default is usually fine). |
| Preview deploy shows "Configuration Required" banner | Add `*.vercel.app` to Firebase authorized domains + Supabase redirect URLs. |
