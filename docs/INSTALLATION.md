# Installation

Prerequisites and setup steps for running KADS LABS locally.

---

## Prerequisites

| Tool | Recommended version | Install |
|---|---|---|
| Node.js | ≥ 20.x (LTS) | https://nodejs.org |
| npm | ≥ 10.x (bundled with Node) | bundled |
| Git | any | https://git-scm.com |
| Supabase CLI (optional, for migrations/Edge Fns) | ≥ 1.150 | https://supabase.com/docs/guides/cli |
| Firebase CLI (optional, for deploying rules/functions) | ≥ 13 | `npm i -g firebase-tools` |

Verify:
```bash
node -v   # v20+
npm -v    # 10+
```

---

## Clone & install

```bash
git clone <repo-url> kadslabs-website
cd kadslabs-website
npm install
```

---

## Configure environment

Copy the example and fill in values:

```bash
cp .env.example .env.local
```

Minimum for a working local build (all other services optional):
```dotenv
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_ADMIN_EMAILS=ceo@kadslabs.com,founderskadslabs@gmail.com
```

Without Firebase/Supabase keys, the site runs in **demo mode** on localhost — forms save to localStorage, sign-in accepts any email/password and routes you to the right dashboard based on your email prefix (`ceo@...`, `dev@...`, `hr@...`, anything else → client).

Full env var reference → [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md).

---

## Run the dev server

```bash
npm run dev
# → http://localhost:3000
```

The dev server has hot module reloading, React strict mode, and shows lint/TS errors inline.

---

## Verify the build locally

```bash
npm run lint        # ESLint — should print ✔ No ESLint warnings or errors
npm run typecheck   # TypeScript — should exit 0
npm run build       # Production SSR build (same as Vercel)
npm start           # Serve the production build on :3000
```

For the static (ZIP/file://) build:
```bash
npm run build:static
# outputs to dist/ — open dist/index.html in any browser, file:// works
```

---

## Seed a founder account

1. Create a Firebase user (via Firebase Console → Authentication → Add user) with email `ceo@kadslabs.com` and any password.
2. Run the SQL migrations (see [SUPABASE_SETUP.md](SUPABASE_SETUP.md)).
3. Sign in on the dev server with that email; you will:
   - Land on `/founder` (analytics/dashboard)
   - Have full access to `/super` (user management)
   - Auto-create a Supabase `profiles` row with `role = 'founder'`.

Without Firebase: in demo mode, type `ceo@kadslabs.com` with any password → founder.

---

## Common issues

- **`next: command not found`** → run `npm install`.
- **Firebase popup says "domain not authorized"** → add `localhost` to Firebase Auth → Settings → Authorized domains (it is there by default).
- **Supabase returns `{code:'42501'}` RLS errors** → run all 3 migrations, verify `profiles` row exists for your user.
- **Port 3000 in use** → `npx kill-port 3000` or `PORT=3001 npm run dev`.

---

## IDE recommendations

- VS Code + extensions: **ESLint**, **Prettier**, **Tailwind CSS IntelliSense**, **PostCSS Language Support**.
- Enable `editor.formatOnSave` + ESLint auto-fix.
- Use TypeScript in strict mode (already enabled in `tsconfig.json`).

---

## Scripts cheat-sheet

```bash
npm run dev          # dev server
npm run build        # SSR production build
npm run build:static # static export → dist/
npm start            # run built SSR server
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
```
