# Phase 3 Setup — Backend / Forms / CRM / Email / Leads

## 1. Run the SQL migration
In your Supabase Dashboard → SQL Editor, run **both** files:

1. `supabase/setup.sql` (initial schema — if not already applied)
2. `supabase/migrations/001_phase3_forms.sql` (Phase 3 additions)

This adds:
- `lead_id` auto-generated KADS-000001 IDs on `contact_submissions`, `quote_requests`, `meeting_requests`, `job_applications`
- `newsletter_subscribers` table
- `meeting_requests` table
- `lead_counter` sequence for atomic lead IDs
- RLS policies (public insert, privileged read/write)
- Performance indexes

## 2. Configure Email Notifications
In Supabase Dashboard → Edge Functions → `send-email` → Secrets, set one of:
- `RESEND_API_KEY` (recommended): add a domain at resend.com
- `BREVO_API_KEY` (alternative)
- `EMAIL_FROM` (optional, default `KADS LABS <founders@kadslabs.com>`)

Without these, the Edge Function logs simulated emails (leads still save to DB).

## 3. Deploy the Edge Functions
```bash
supabase functions deploy send-email
supabase functions deploy send-push
```

## 4. WhatsApp Business API (optional upgrade)
- Current: Click-to-chat `wa.me/917524979551` deep links with pre-filled messages. Works on any phone with WhatsApp installed.
- For automated template notifications (order confirmations, lead routing), connect official WhatsApp Business Platform via Meta for Developers → Gupshup / Twilio / Wati / BSP. A new `send-whatsapp` Edge Function can be added similar to `send-email`.

## 5. Forms wired in Phase 3
| Form | Table | Lead ID | Notifies |
|---|---|---|---|
| Homepage "Send Message" | `contact_submissions` | auto KADS-###### | Email to founders@ |
| CTA cards (Book/Contact/WhatsApp/Quote) | mailto + wa.me + quote/ | — | Direct |
| /quote page | `quote_requests` | auto KADS-###### | Email to founders@ |
| Careers / Job application | `job_applications` | auto KADS-###### | Email to founders@ |
| Newsletter (home + footer) | `newsletter_subscribers` | — | Email to founders@ |
| Meeting Request (mailto) | email (manual) | — | Email + WhatsApp fallback |
| Floating WhatsApp widget | wa.me deep link | — | Instant chat |

## 6. Spam Protection (invisible — no CAPTCHA)
- **Honeypot field** (`website`) — invisible to humans, filled by bots
- **Time check** — forms submitted in <1.5s are suspicious (honeypot catches most)
- **Client rate-limit** — 5 submissions/hour, 15-second minimum between (localStorage)
- **Webdriver detection** — rejects headless automation
- **Server RLS** — anonymous users can only INSERT; SELECT/UPDATE/DELETE restricted to privileged roles
- **Pseudo-fingerprint** — hashed UA/screen/lang stored as `ip_hash` (no PII)
- **UTM capture** — source/medium/campaign auto-attached from URL params

## 7. Test a Lead
1. Open the website
2. Scroll to the "Let's start a conversation" form
3. Fill test data and submit
4. Check: success toast shows, Lead ID appears
5. In Supabase → Table Editor → `contact_submissions` you'll see the row
6. (If Resend/Brevo key is set) founderskadslabs@gmail.com receives the email
