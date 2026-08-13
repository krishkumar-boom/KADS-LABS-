# Environment Variables — Complete Reference

This document explains **every** environment variable KADS LABS uses, where to get each one, whether it is public or secret, and how to verify it's correctly set.

---

## Quick reference

| Variable | Visibility | Required | Used by |
|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Public | Required for prod | Client, OAuth redirects, SEO |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Public | Required | Browser (auth init) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Public | Required | Browser (auth redirects) |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Public | Required | Browser + Server |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Public | Optional | Browser (avatars) |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Public | Optional | Push |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Public | Required | Browser |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Public | Optional | GA via Firebase |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Required | Browser + Server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Required | Browser (RLS-respected) |
| `SUPABASE_SERVICE_ROLE_KEY` | **SECRET** | Optional | Server only |
| `SMTP_HOST` | **SECRET** | Optional | Edge Fns (email) |
| `SMTP_PORT` | **SECRET** | Optional | Edge Fns |
| `SMTP_USER` | **SECRET** | Optional | Edge Fns |
| `SMTP_PASSWORD` | **SECRET** | Optional | Edge Fns |
| `SMTP_FROM` | **SECRET** | Optional | Edge Fns |
| `NEXT_PUBLIC_GA4_ID` | Public | Optional | Browser analytics |
| `NEXT_PUBLIC_CLARITY_ID` | Public | Optional | Browser analytics |
| `JWT_SECRET` | **SECRET** | Optional (server) | CSRF, invites |
| `ENCRYPTION_KEY` | **SECRET** | Optional | Local encryption |
| `COOKIE_SECRET` | **SECRET** | Optional | Cookie signing |
| `SUPABASE_STORAGE_BUCKET` | Either | Optional | Media library |
| `FCM_SERVER_KEY` | **SECRET** | Optional | Push notifications |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | Public | Optional | Web push |
| `OPENAI_API_KEY` | **SECRET** | Optional | AI assistant |
| `RESEND_API_KEY` | **SECRET** | Optional | Email |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Public | Optional | Founder seed |

> **Public** variables are prefixed `NEXT_PUBLIC_` and ship to the browser. **Secret** variables must never be prefixed that way — Next.js will refuse to expose them to client bundles.

---

## Variable-by-variable

### `NEXT_PUBLIC_APP_URL`
- **Purpose**: Canonical site URL. Used for `<link rel="canonical">`, absolute OG image URLs, password-reset and email-verification redirects, OAuth `redirectTo` callbacks.
- **Where to get it**: Your custom domain (`https://kadslabs.com`) or Vercel preview URL pattern.
- **Public/Secret**: Public.
- **Used in**: `app/layout.tsx`, auth flows, email templates.
- **Common mistakes**: Forgetting the `https://`, or leaving a trailing slash.
- **Verification**: Visit `/` in production → view page source → `<link rel="canonical">` should show the exact value.

### `NEXT_PUBLIC_FIREBASE_API_KEY`
- **Purpose**: Firebase Web API key (it is NOT a secret; it identifies your Firebase project).
- **Where to get it**: Firebase Console → Project Settings → General → Your apps → Web App → `apiKey`.
- **Public/Secret**: Public (ships in bundle).
- **Used in**: `lib/firebase.ts` — initializes `initializeApp()`.
- **Common mistakes**: Copying the Admin SDK key by mistake. Must be the **web client** key.
- **Verification**: Sign-up/Sign-in in the browser works; Firebase Auth console shows new users.

### `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- **Purpose**: OAuth redirect domain (e.g. `kadslabs-prod.firebaseapp.com`).
- **Where to get it**: Firebase web app config → `authDomain`.
- **Public/Secret**: Public.
- **Used in**: Google login popup/redirect, password-reset email links.
- **Common mistakes**: Not adding your custom domain (`kadslabs.com`) and Vercel preview domains to Firebase Auth → Settings → Authorized domains (login will fail with `auth/unauthorized-domain`).
- **Verification**: Google sign-in popup opens without a "domain not authorized" error.

### `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- **Purpose**: Firebase project identifier; needed for token verification and FCM.
- **Where to get it**: Firebase web app config.
- **Public/Secret**: Public.

### `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- **Purpose**: Firebase Storage bucket (for user avatars uploaded via Firebase SDK). We mostly use Supabase Storage, but Firebase Storage bucket ID is required for Firebase to initialize cleanly.
- **Where to get it**: Firebase web app config; looks like `xxx.appspot.com`.
- **Public/Secret**: Public.
- **Optional**: if you don't use Firebase Storage, leave blank.

### `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- **Purpose**: Numeric ID for FCM web push.
- **Where to get it**: Firebase web app config (or Cloud Messaging settings).
- **Public/Secret**: Public.

### `NEXT_PUBLIC_FIREBASE_APP_ID`
- **Purpose**: Firebase web app identifier.
- **Where to get it**: Firebase web app config (1:xxx:web:yyy).
- **Public/Secret**: Public.
- **Required** for Firebase Analytics to initialize.

### `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- **Purpose**: Google Analytics 4 ID used when you enable Google Analytics for Firebase. If you use a standalone GA4 property, use `NEXT_PUBLIC_GA4_ID` instead.
- **Where to get it**: Firebase → Project Settings → Integrations → Google Analytics.
- **Optional**.

### `NEXT_PUBLIC_SUPABASE_URL`
- **Purpose**: URL of your Supabase project; forms the base for all PostgREST, Storage, Auth and Realtime requests.
- **Where to get it**: Supabase Dashboard → Project Settings → API → Project URL.
- **Public/Secret**: Public (paired with the anon key, RLS enforces security).
- **Used in**: `lib/supabase.ts` — every database call.
- **Common mistakes**: Copying the `https://api.supabase.co/...` URL instead of the project-specific `https://<ref>.supabase.co`.
- **Verification**: Founder dashboard → System Health panel shows DB status green.

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Purpose**: Public anon key for the Supabase JS client. Safe to ship — RLS policies restrict access.
- **Where to get it**: Supabase Dashboard → Project Settings → API → anon public key.
- **Public/Secret**: Public.
- **Common mistakes**: Copying the `service_role` key instead — that key bypasses RLS and must NEVER be exposed to the browser.
- **Verification**: Submit the contact form on `/` and see the ticket appear in Supabase Table Editor → `tickets`.

### `SUPABASE_SERVICE_ROLE_KEY`
- **Purpose**: Admin-level key that bypasses RLS. Only used by server-side code (Edge Functions, migration scripts, invite flows).
- **Where to get it**: Supabase Dashboard → Project Settings → API → service_role key (click "Reveal").
- **Public/Secret**: **SECRET** — must never ship to the client bundle. Do not prefix with `NEXT_PUBLIC_`.
- **Common mistakes**: Accidentally committing this to Git, or setting it as a public env var.
- **Verification**: Edge Function runs that need to bypass RLS (e.g. syncing Firebase UIDs to Supabase profiles) succeed.

### `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_FROM`
- **Purpose**: SMTP credentials for transactional email (contact-form acknowledgement, password reset, invoice notices, ticket updates). Used by the `send-email` Supabase Edge Function.
- **Where to get them**: Your email provider (Resend, SendGrid, Postmark, Gmail App Passwords, AWS SES).
- **Public/Secret**: **SECRET** (server-side only).
- **Default port**: 587 (STARTTLS).
- **Common mistakes**: Using Gmail personal password (must use an App Password with 2FA enabled); forgetting SPF/DKIM which causes spam foldering.
- **Verification**: Submit the contact form; recipient receives the acknowledgement email.

### `NEXT_PUBLIC_GA4_ID`
- **Purpose**: Google Analytics 4 Measurement ID (format `G-XXXXXXXXXX`). Standalone from Firebase Analytics.
- **Where to get it**: analytics.google.com → Admin → Data Streams → Web stream → Measurement ID.
- **Public/Secret**: Public.
- **Used in**: GTM/GA script in `app/layout.tsx`.
- **Verification**: GA Realtime report shows your visit.

### `NEXT_PUBLIC_CLARITY_ID`
- **Purpose**: Microsoft Clarity ID (alphanumeric, ~10 chars) for session recordings + heatmaps.
- **Where to get it**: clarity.microsoft.com → Project Setup.
- **Public/Secret**: Public.
- **Verification**: Clarity dashboard shows incoming sessions.

### `JWT_SECRET`
- **Purpose**: Signs internal JWTs for CSRF tokens and invite links.
- **Generate**: `node -e "console.log(crypto.randomBytes(32).toString('base64'))"`.
- **Public/Secret**: **SECRET** (server-side only).
- **Verification**: CSRF tokens on form submissions are accepted without 403.

### `ENCRYPTION_KEY`
- **Purpose**: 32-byte (64 hex chars) key used to encrypt sensitive localStorage data (draft forms, private notes) before persisting.
- **Generate**: `node -e "console.log(crypto.randomBytes(32).toString('hex'))"`.
- **Public/Secret**: **SECRET** (used client-side but not committed; each deployment uses the same key so encrypted data remains readable across page loads).

### `COOKIE_SECRET`
- **Purpose**: Signs any future httpOnly session cookies and demo-mode guards.
- **Generate**: Same as JWT_SECRET — 32 random bytes.
- **Public/Secret**: **SECRET** (server-only).

### `SUPABASE_STORAGE_BUCKET`
- **Purpose**: Override for default storage bucket used by the admin media library.
- **Default**: `attachments` (created by migration 002).
- **Other buckets created by migration**: `resumes`, `screenshots`, `avatars`, `project-files`.

### `FCM_SERVER_KEY`
- **Purpose**: Legacy server key for sending Firebase Cloud Messaging push notifications from the `send-push` Edge Function.
- **Where to get it**: Firebase → Cloud Messaging → Project credentials → Server key.
- **Public/Secret**: **SECRET** (server-only).
- **Preferred approach**: Use the newer **HTTP v1 API** with a service account JSON file (placed in Supabase Edge Function secrets).

### `NEXT_PUBLIC_FIREBASE_VAPID_KEY`
- **Purpose**: VAPID public key required for browser `PushManager.subscribe()` (web push).
- **Where to get it**: Firebase → Cloud Messaging → Web configuration → Generate key pair.
- **Public/Secret**: Public (the matching private key is kept server-side).

### `OPENAI_API_KEY`
- **Purpose**: Enables the AI Founder Assistant (`/founder` → floating chat) to summarize tickets, draft replies, provide insights.
- **Where to get it**: platform.openai.com → API keys.
- **Public/Secret**: **SECRET** (server-only, called via Edge Function so the key never ships to the browser).
- **Common mistakes**: Exposing it client-side (would leak credits); never call OpenAI from browser code.

### `RESEND_API_KEY`
- **Purpose**: Preferred email service for transactional mail (higher deliverability than raw SMTP). Used by `send-email` Edge Function when set.
- **Where to get it**: resend.com → API Keys.
- **Public/Secret**: **SECRET**.
- **Verification**: Re-send domain in Resend → DNS records verified.

### `NEXT_PUBLIC_ADMIN_EMAILS`
- **Purpose**: Comma-separated list of emails that auto-receive the `founder` role on first sign-up and trigger notifications.
- **Default**: `ceo@kadslabs.com,founderskadslabs@gmail.com`.
- **Public/Secret**: Public.
- **Verification**: Sign in with `ceo@kadslabs.com` → you land on `/founder` with super-admin access.

---

## Where to set them

### Local development
Create `.env.local` in the project root (it's git-ignored). Copy from `.env.example`:
```bash
cp .env.example .env.local
# fill in real values
```

### Vercel (production + preview + dev)
1. Open Vercel Dashboard → Your project → Settings → Environment Variables.
2. Add each variable with the correct Environment scope (Production / Preview / Development).
3. For secrets (`SUPABASE_SERVICE_ROLE_KEY`, `SMTP_*`, `JWT_SECRET`, `OPENAI_API_KEY`, `RESEND_API_KEY`, `FCM_SERVER_KEY`), ensure they are NOT prefixed with `NEXT_PUBLIC_` — Vercel will only expose them to server bundles.
4. Redeploy.

### Supabase Edge Functions
```bash
supabase secrets set SMTP_HOST=... SMTP_PORT=587 SMTP_USER=... SMTP_PASSWORD=... SMTP_FROM=... RESEND_API_KEY=... FCM_SERVER_KEY=... JWT_SECRET=...
```

---

## Verification checklist after deploy

1. `NEXT_PUBLIC_APP_URL` — canonical tag in rendered HTML.
2. Firebase variables — Google + email login complete without "config" errors.
3. Supabase variables — form submissions appear in `tickets` table.
4. `SMTP_*` or `RESEND_API_KEY` — contact form triggers a receipt email.
5. `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_CLARITY_ID` — network tab shows collect requests.
6. `NEXT_PUBLIC_ADMIN_EMAILS` — founder email can access `/super` user management.
7. No `ConfigError` red banner on `kadslabs.com` (banner only appears when a required var is missing on production).

---

## Common mistakes → fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| Red "Configuration Required" banner on production | Missing Firebase or Supabase public var | Add all `NEXT_PUBLIC_FIREBASE_*` and `NEXT_PUBLIC_SUPABASE_*` in Vercel |
| Google login says "auth/unauthorized-domain" | Domain not in Firebase Authorized Domains | Add the custom domain + Vercel preview domains |
| RLS errors on forms (permission denied) | Used service_role key client-side OR migrations not run | Use anon key; re-run migrations 001-003 in SQL Editor |
| Emails don't send | SMTP/Resend key missing | Add `RESEND_API_KEY` or SMTP vars to Supabase Edge Function secrets |
| Password reset link points to localhost | `NEXT_PUBLIC_APP_URL` not set or points to dev URL | Set to production https URL |
| Build fails on Vercel but works locally | Env var missing in Vercel | Add all vars to Vercel; trigger redeploy |
| `.env.local` works but Vercel doesn't see vars | Secret variables incorrectly prefixed `NEXT_PUBLIC_` (Vercel strips server-only vars in client bundles incorrectly) | Leave secret vars unprefixed; set them with all scopes |
