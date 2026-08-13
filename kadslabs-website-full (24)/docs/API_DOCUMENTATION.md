# API Documentation

KADS LABS does not expose a separate REST API. All data operations are performed through:

1. **Supabase PostgREST** (auto-generated, secured by RLS) via the Supabase JS client.
2. **Supabase Edge Functions** for privileged / third-party operations (send-email, send-push).
3. **Client-side helper modules** in `lib/` that wrap these.

This document describes the public client-facing API surface used by the UI.

---

## Client helpers

| Module | Purpose |
|---|---|
| `lib/firebase.ts` | Auth client (Google/Email sign-in, sign-up, reset, sign-out, token refresh) |
| `lib/supabase.ts` | Supabase singleton (safe proxy when credentials missing) |
| `lib/sync-profile.ts` | Syncs Firebase user to Supabase profiles on login |
| `lib/tickets.ts` | Unified ticket submission (contact, quote, feedback, bug, career) |
| `lib/client.ts` | Client-portal queries (projects, invoices, tickets) |
| `lib/roles.ts` | Admin operations (listProfiles, updateUserRole, updateUserStatus) |
| `lib/security.ts` | Rate limit, CSRF, honeypot, sanitizers |
| `lib/env.ts` | Production-domain detection, demo-mode logic |
| `lib/storage.ts` | Safe localStorage wrapper |
| `lib/applications.ts` | Career application submit (wraps `submitCareerApplication`) |
| `lib/audit.ts`, `lib/crm.ts`, `lib/leads.ts`, `lib/media.ts`, `lib/quotes.ts` | Domain helpers |

---

## Tickets

### `submitTicket(payload): Promise<{ok, ticketId?, error?}>`
Used by contact, quote, feedback and generic support forms.

`payload`:
```ts
{
  type: "contact"|"support"|"quote"|"career"|"feedback"|"bug"|"suggestion"|"complaint",
  subject: string,
  description: string,
  priority?: "low"|"normal"|"high"|"urgent",
  name?: string,
  email: string,
  phone?: string,
  company?: string,
  category?: string,
  metadata?: Record<string, any>,
  screenshot_url?: string,
  website?: string   // honeypot — must be empty for the submission to be accepted
}
```
Behavior:
- Client-side rate limit (1 submission per 5s, 10 per hour per client hash).
- Honeypot check (`website` field hidden by CSS; bots fill it).
- Sanitizes text/email/phone.
- Inserts `tickets` row (DB trigger assigns `ticket_id = TCK-NNNNNN`).
- Inserts matching extension row when `type=bug` (bug_reports) or `type=career` (via `submitCareerApplication`).
- In demo mode (no credentials) writes to localStorage.

### `submitCareerApplication(payload)`
Career-form payload (extends ticket):
```ts
{
  position: string,
  name: string, email: string, phone?: string, city?: string,
  resume_url?: string, resume_filename?: string,
  portfolio_url?: string, github_url?: string, linkedin_url?: string,
  experience_years?: string, expected_salary?: string, notice_period?: string,
  cover_letter?: string
}
```
Inserts both a `tickets(type='career')` row and a `career_applications` row.

### `submitBugReport(payload)`
Bug-form payload:
```ts
{
  name?: string, email: string, subject: string, description: string,
  severity?: "low"|"medium"|"high"|"critical",
  page_url?: string, browser?: string, device?: string,
  steps_to_reproduce?: string, expected_behavior?: string, actual_behavior?: string,
  screenshot_url?: string
}
```

### `listTickets(userId?)`, `updateTicketStatus(id,status)`, `replyToTicket(id,message)`
Used by client portal and dashboards. All respect RLS.

---

## Auth (Firebase)

All auth methods are exported by `lib/firebase.ts` and wrapped by `AuthProvider` (`app/components/AuthProvider.tsx`). The React hook is:

```ts
const {
  user,            // KadsUser | null
  profile,         // { id, role, full_name, company, status } | null
  isLoading,
  isAuthenticated,
  isFounder, isDirector, isAdmin, isDeveloper, isHR, isClient, isPrivileged,
  userRole,
  signIn,          // (email, password)
  signUp,          // (email, password, metadata?)
  signInWithGoogle,
  signOut,
  resetPassword,
  updateProfile,
  updatePassword,
  demoMode
} = useAuth()
```

`lib/firebase.ts` exposes `hasFirebaseCredentials()` so callers can detect config status.

### Session lifecycle
- Firebase persistence: `browserLocalPersistence` (survives tab close, remember-me default).
- On auth state change: `syncProfileToSupabase(user)` upserts `public.profiles` via the `upsert_firebase_profile` RPC and writes `login_history`.

---

## Projects / Invoices / Client portal

`lib/client.ts`:
```ts
listClientProjects(userId?, email?):   Promise<ClientProject[]>
listClientInvoices(userId?, email?):   Promise<ClientInvoice[]>
listClientTickets(userId?, email?):    Promise<ClientTicket[]>
```
All RLS-restricted by `client_id` / `client_email`.

---

## Roles / user management

`lib/roles.ts` (privileged only):
```ts
listProfiles(): Promise<ProfileRecord[]>
updateUserRole(profileId, newRole): Promise<{error?}>
updateUserStatus(profileId, status):  Promise<{error?}>
```
These functions log to `audit_logs` via `log_audit` RPC.

---

## Edge Functions

Deployed under `supabase/functions/`:

### `send-email` (POST)
Sends transactional email (Resend preferred; SMTP fallback). Expected payload:
```json
{
  "to": "user@example.com",
  "subject": "Your KADS LABS ticket TCK-000001",
  "html": "<p>...</p>",
  "text": "..."
}
```
Requires `RESEND_API_KEY` secret (or SMTP_* secrets). Returns `{ ok: true, messageId }`.

### `send-push` (POST)
Sends web push notification via FCM. Payload:
```json
{
  "tokens": ["<fcm-token>"],
  "title": "New ticket received",
  "body": "TCK-000001 — ...",
  "link": "/founder#tickets"
}
```

Call Edge Functions from the client via:
```ts
const { data, error } = await supabase.functions.invoke("send-email", { body: {...} })
```

---

## Realtime subscriptions

All realtime channels use Supabase Realtime. Example (new tickets):
```ts
supabase.channel("tickets-ch")
  .on("postgres_changes",
      { event: "INSERT", schema: "public", table: "tickets" },
      (payload) => { /* update UI */ })
  .subscribe()
```
Tables on the realtime publication:
`tickets`, `ticket_messages`, `notifications`, `projects`, `project_tasks`, `career_applications`, `bug_reports`, `profiles`.

---

## Security primitives (`lib/security.ts`)

| Export | Purpose |
|---|---|
| `clientRateLimit(key, windowMs, max)` | In-memory sliding window rate limiter (1-per-5s, 10-per-hour defaults) |
| `getCsrfToken()` / `validateCsrfToken(token)` | Double-submit CSRF token bound to session |
| `generateRandomId(prefix, length)` | Cryptographically random ID for forms |
| `isHoneypotFilled(value)` | Returns true if honeypot field has non-empty value |
| `sanitizeText/Email/Phone(input)` | Strip HTML/control chars, normalize |
| `isValidEmail(email)` | RFC-ish validation |
| `hashClientId()` | Stable anonymous client hash (SHA-256 of IP+UA, for rate limits) |

---

## Storage uploads

Client uploads flow through `supabase.storage.from(bucket).upload(...)` (bucket policies restrict who can write):
- Public bug screenshot uploads → `screenshots` bucket
- Authenticated resume uploads → `resumes`
- Profile avatars → `avatars`
- Deliverables uploaded by team → `project-files`
- Ticket attachments → `attachments`

Signed URLs for private buckets are created via `storage.from(bucket).createSignedUrl(path, expiresIn)`.

---

## Analytics events

The UI emits events on the `dataLayer` for GA4 / Clarity automatically; pageviews are tracked via Next.js navigation hooks. Custom events are dispatched as `kads:*` CustomEvents on `window`.

---

## Error reporting

Client errors are captured by `app/components/ErrorLogger.tsx`:
- `window.onerror`, `unhandledrejection`
- LCP observer
- Each error gets a digest ID and is sent to `bug_reports` table when Supabase credentials are present (otherwise shown in console with a copyable error ID)
- Global error boundary (`app/global-error.tsx`) shows a retry/home screen with the error ID.
