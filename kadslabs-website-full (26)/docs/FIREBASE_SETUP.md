# Firebase Authentication Setup

KADS LABS uses **Firebase Authentication** as the single source of truth for user identity — Google OAuth, Email/Password sign-in, password reset, session persistence, and automatic token refresh. Supabase Auth is NOT used for end-user login; Supabase stores application data, files, and runs RLS.

The production Firebase project is **already provisioned**:

| Key | Value |
|---|---|
| Project ID | `kads-labs-3` |
| Auth Domain | `kads-labs-3.firebaseapp.com` |
| Storage Bucket | `kads-labs-3.firebasestorage.app` |
| Messaging Sender ID | `266393889706` |
| App ID | `1:266393889706:web:addebe84f8594341abd9d3` |
| Measurement ID | `G-B0TF48PQQ4` |
| API Key | `AIzaSyDvYHTi1O9XeBUG5jjRvsKxNt01d1qC--4` |

---

## 1. Verify auth providers are enabled

1. Open Firebase Console → https://console.firebase.google.com/project/kads-labs-3/authentication/providers
2. Confirm **Email/Password** is **Enabled** (Email link optional).
3. Confirm **Google** is **Enabled** with a public support email set for the OAuth consent screen.
4. Do **not** enable Anonymous, Phone, or other providers unless explicitly required (they create accounts that don't bind to an email and will not receive roles correctly).

---

## 2. Authorized domains

Firebase Console → Authentication → Settings → Authorized domains. Ensure the following are listed:

- `localhost` (default — enables local dev)
- `kads-labs-3.firebaseapp.com` (default)
- `kadslabs.com`
- `www.kadslabs.com`
- Any Vercel preview domains you want to test on (e.g. `kadslabs-website-git-*.vercel.app`, or add `*.vercel.app` broadly for previews — acceptable in low-risk contexts)

Add `file://` if you test the static ZIP build from Android file://.

---

## 3. Web app configuration

The web app is registered. Environment variables are already committed in `.env.example` and populated in `.env.local` with the production values. They are:

```dotenv
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDvYHTi1O9XeBUG5jjRvsKxNt01d1qC--4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kads-labs-3.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kads-labs-3
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kads-labs-3.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=266393889706
NEXT_PUBLIC_FIREBASE_APP_ID=1:266393889706:web:addebe84f8594341abd9d3
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-B0TF48PQQ4
```

In Vercel, add all seven under Project Settings → Environment Variables for **Production**, **Preview**, and **Development**.

The API key is **not a secret** — Firebase API keys are meant to be public and are restricted by Authorized Domains and API key restrictions (see §6).

---

## 4. Email templates

Firebase Console → Authentication → Templates:

| Template | Purpose |
|---|---|
| Email address verification | Sent after sign-up |
| Password reset | Triggered from `/auth/reset` |
| SMTP settings (optional) | Customise `no-reply@kadslabs.com` via SendGrid/Resend/Google Workspace SMTP |

Customise the action URL to point to production:
- For password reset: redirect users to `https://kadslabs.com/auth/reset/` after they click the reset link.
  (Configure under "Customise action URL" or via Firebase Hosting rewrites.)

---

## 5. Seed the founder account

1. Firebase Console → Authentication → Users → **Add user**
2. Email: `ceo@kadslabs.com`
3. Password: generate a strong password (store it in the company password manager)
4. Repeat for `founderskadslabs@gmail.com` (co-founder).

Both accounts are auto-granted `founder` role on first sign-in (the Supabase RPC `upsert_firebase_profile` detects these emails and assigns the role).

After signing in once with each founder, you can invite the rest of the team via `/super` → Invite Team Member (no SQL editor needed).

---

## 6. Restrict the API key (recommended)

The Firebase API key is public but can be locked to your origins:

1. Open https://console.cloud.google.com/apis/credentials?project=kads-labs-3
2. Click **Browser key (auto created by Google Service)** (the one matching `AIzaSyDvYHTi1O9XeBUG5jjRvsKxNt01d1qC--4`).
3. **Application restrictions** → **HTTP referrers (web sites)** → Add:
   - `https://kadslabs.com/*`
   - `https://www.kadslabs.com/*`
   - `https://*.vercel.app/*` (previews)
   - `http://localhost:*` (local dev)
4. **API restrictions** → Restrict key → select:
   - Identity Toolkit API
   - Token Service API
   - Firebase Installations API
   - Cloud Storage for Firebase API (if using Firebase Storage for avatars)
   - Firebase Realtime Database (not used — can leave off)
   - Cloud Messaging API (if using push)
5. Save. Changes propagate within 5 minutes.

---

## 7. How auth works in code

- `lib/firebase.ts` — lazy-initialises Firebase App and Auth. Exposes:
  - `auth.onAuthStateChanged(cb)` for reactive session
  - `signInWithEmail(email,password)` / `signUpWithEmail` / `signInWithGoogle` / `sendPasswordReset(email)` / `signOut()` / `getIdToken(forceRefresh)`
  - Falls back to a demo-mode client when credentials are missing (local previews only).
- `app/components/AuthProvider.tsx` — wraps Firebase into the React `useAuth()` hook, syncs the user to Supabase on login, provides role booleans (`isFounder`/`isAdmin`/`isDeveloper`/`isHR`/`isClient`).
- `lib/sync-profile.ts` — calls the Supabase RPC `upsert_firebase_profile(firebase_uid, email, full_name, avatar_url)` which upserts `public.profiles`, assigns the role, writes `login_history`, and is idempotent (throttled to once per 10 minutes per user client-side).
- Session persistence uses `browserLocalPersistence` (remember-me across restarts) with automatic token refresh.
- For "logout from all devices", Firebase provides `revokeRefreshTokens(uid)` via the Admin SDK (used from a trusted server; not exposed to the client).

---

## 8. Verification checklist

After configuring, verify each scenario end-to-end on **localhost, Vercel Preview, and kadslabs.com**:

- [ ] Google sign-in popup opens (or redirects on mobile), returns user signed in
- [ ] Email/password sign-up creates a new Firebase user; verification email received
- [ ] Email/password sign-in works for existing user
- [ ] Wrong password shows a friendly error message
- [ ] Password reset email delivers; the reset link lands on `/auth/reset/` and accepts new password
- [ ] Session persists across hard refresh (no need to log in again)
- [ ] Session persists across browser restart (remember-me)
- [ ] Sign-out clears session and returns to `/`
- [ ] Founder email lands on `/founder` with full access
- [ ] A new client sign-up lands on `/client`
- [ ] Invitation link (from `/super`) successfully signs up the recipient with the pre-assigned role
- [ ] Firebase Console → Users shows new sign-ups
- [ ] Supabase `profiles` table shows a new row with matching `firebase_uid`, `email`, and `role`
- [ ] No red "Configuration Required" banner on production
- [ ] Login with a non-authorized domain (e.g. random host) is blocked by Firebase with `auth/unauthorized-domain`

---

## 9. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `auth/unauthorized-domain` popup | Origin not in Authorized Domains | Add domain in Firebase Auth → Settings |
| `auth/api-key-not-valid` on production | API key referrer restrictions too tight | Add referrer pattern in Google Cloud Console |
| `auth/operation-not-allowed` | Provider disabled | Enable Email/Password and Google in Firebase → Auth → Sign-in method |
| Google sign-in returns `auth/popup-blocked` | Browser blocked popup | Code auto-falls back to `signInWithRedirect`; users can allow popups too |
| New user signs in but has `guest` role | Supabase sync failed (check console) | Run migration 003; verify `upsert_firebase_profile` exists; re-sign-in |
| Reset email links go to `localhost` | Action URL not customised in Firebase | Firebase → Templates → Password reset → customize action URL to `https://kadsl.com/__/auth/action` or set up a custom handler |
| Session lost after browser close | Third-party cookie blocking | Firebase Auth uses IndexedDB (first-party), rarely blocked; check browser privacy settings |
| New user isn't appearing in Supabase profiles | RLS blocks upsert or credentials missing | Check browser console; ensure anon key is correct; verify migrations ran |
| Login works on preview but not on kadslabs.com | Custom domain not in Authorized Domains, or CSP blocks Google | Add `kadslabs.com` to Firebase Authorized Domains; confirm CSP `connect-src` includes `*.googleapis.com identitytoolkit.googleapis.com securetoken.googleapis.com` (already in middleware) |

---

## 10. Security notes

- Never expose the **Firebase Admin SDK** service account JSON client-side. Admin operations (revoke tokens, list users, set custom claims) must run in Supabase Edge Functions or a trusted server.
- Passwords are stored by Firebase with scrypt hashing; we never see them.
- The `firebase_uid` column in Supabase is the binding key between Firebase identity and application profile.
- Production security alerts: enable Firebase App Check (reCAPTCHA Enterprise or Play Integrity) as a future hardening step — not required for launch.
