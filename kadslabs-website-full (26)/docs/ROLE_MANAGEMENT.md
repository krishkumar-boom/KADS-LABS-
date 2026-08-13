# Role-Based Access Control (RBAC)

KADS LABS implements RBAC at three layers:
1. **Client-side** hooks/components for UI rendering and routing.
2. **Middleware** that adds `X-Robots-Tag: noindex` and `Cache-Control: private` on protected routes.
3. **Database (RLS)** policies that enforce access control regardless of client.

This defense-in-depth means a tampered client cannot access unauthorized data.

---

## Role hierarchy

| Role | Level | Dashboard |
|---|---|---|
| `founder` | 100 | `/founder`, `/super`, all others |
| `ceo` | 90 | `/founder`, all admin dashboards |
| `director` | 80 | `/founder`, `/admin`, `/hr`, `/developer`, `/client` |
| `admin` | 70 | `/admin`, content/media, tickets |
| `developer` | 50 | `/developer` (own tasks, assigned bugs) |
| `hr` | 40 | `/hr` (talent pipeline, applications) |
| `client` | 10 | `/client` (own data only) |
| `guest` (unauth) | 0 | Public routes only |

Level comparison:
```ts
roleMeetsMinimum(userRole, requiredRole) // true if user level >= required
```

---

## Role booleans in `useAuth()`

```ts
const {
  isFounder,        // founder | ceo
  isDirector,       // founder | ceo | director
  isAdmin,          // founder | ceo | director | admin
  isDeveloper,      // isAdmin | developer
  isHR,             // isAdmin | hr
  isPrivileged,     // isDeveloper | isContentManager (internal team)
  isClient,         // role === 'client'
  isGuest,          // !user or role === 'guest'
  isSuperDeveloper, // alias for isFounder
  isContentManager, // admin+ for legacy content-manager role
  isAuthenticated,  // !!user
  userRole,         // exact role string
} = useAuth()
```

---

## Route map

| Path | Minimum role |
|---|---|
| `/`, `/careers`, `/feedback`, `/quote`, `/auth/reset`, `/offline` | guest |
| `/profile` | any authenticated |
| `/client` | client+ (clients see own data; staff can also open) |
| `/ticket` | any authenticated |
| `/developer` | developer+ |
| `/hr` | hr+ |
| `/admin` | admin+ |
| `/founder` | admin+ |
| `/super` | founder only |

Middleware ensures all these routes are `noindex` and not cached. Client components add redirect guards.

---

## How roles are assigned

### Automatic (first sign-in)
- `ceo@kadslabs.com`, `founderskadslabs@gmail.com` → `founder` (detected by `upsert_firebase_profile` RPC and by the client `emailToRole()`).
- Email prefix matching (demo/dev environment convenience):
  - `dev*@` or `*developer*@` → `developer`
  - `hr*@` or `*hr@` → `hr`
  - `admin*@` → `admin`
- All others → `client`

### Manual (Founder Console `/super`)
1. Sign in as founder → `/super`.
2. User table shows every profile.
3. Pick a role from the dropdown for any user.
4. Suspend / Reactivate user.
5. Send password-reset email (triggers Firebase `sendPasswordResetEmail`).

No SQL editor required for day-to-day role management.

### Programmatically (server)
Use `lib/roles.ts`:
```ts
import { listProfiles, updateUserRole, updateUserStatus } from "@/lib/roles"
await updateUserRole(profileId, "developer")
await updateUserStatus(profileId, "suspended")
```
Both functions log to `audit_logs` with action `role_change` / `user_status_change`.

---

## Supabase RLS (database layer)

Key policies (migration 002):

| Table | Policy |
|---|---|
| `profiles` | Users read their own row; privileged roles read all; insert/update via SECURITY DEFINER functions only |
| `tickets` | Public insert; select where `user_id = auth.uid()` OR `email = current_user_email`; privileged full CRUD |
| `ticket_messages` | Select if ticket belongs to user OR privileged; public insert; privileged full CRUD |
| `career_applications` | Public insert; privileged full CRUD |
| `projects` | Select where `client_id = auth.uid()` OR privileged; privileged CRUD |
| `project_tasks` | Select where assigned OR client of project OR privileged; privileged CRUD |
| `project_files` | Select if visible_to_client AND client owns project OR privileged; privileged CRUD |
| `invoices` | Select where client_id matches OR admin; admin CRUD |
| `notifications` | Users see/update own; system can insert |
| `audit_logs` | Admin+ select; service insert |
| `login_history` | Users see own; privileged see all; service insert |
| `bug_reports` | Public insert; privileged CRUD |

---

## Client components

### `RoleGate`
```tsx
<RoleGate required="hr" fallback={<p>Not authorized</p>}>
  <HRCareersPanel />
</RoleGate>

<RoleGate requireAny={["admin", "founder"]}>
  <SuperAdminButton />
</RoleGate>
```

### Route guards (in page components)
Every dashboard page redirects when the role is insufficient (example from `/developer`):
```ts
useEffect(() => {
  if (isLoading) return
  if (!isAuthenticated && !demoMode) router.push("/#auth")
  if (!demoMode && !isDeveloper && !isPrivileged) router.push("/client")
  loadData()
}, [isLoading, isAuthenticated, isDeveloper, isPrivileged, demoMode, router, loadData])
```

---

## Suspension & banning

Set `profiles.status = 'suspended'` (from `/super`). The UI respects this by checking `profile.status === 'active'` — suspended users are signed out on next reload and cannot sign in again until reactivated.

Add a middleware / client check early after sign-in:
```ts
if (profile?.status === "suspended") { signOut(); router.push("/?suspended=1") }
```
(Left as a follow-up hardening point; the UI already hides privileged routes for non-active users.)

---

## Audit trail

Every role/status change writes an `audit_logs` row:
```json
{
  "action": "role_change",
  "entity_type": "profiles",
  "entity_id": "<profile-uuid>",
  "new_data": { "role": "developer" },
  "user_id": "<acting-user-uuid>"
}
```
Founders view these in Founder Dashboard → Audit Logs panel.

---

## Adding a new role

1. Add the role string to the `KadsRole` union in `app/components/AuthProvider.tsx`.
2. Insert the role into the profiles role CHECK constraint (new migration `ALTER TABLE profiles DROP CONSTRAINT … ADD CHECK …`).
3. Add the role to `roleMeetsMinimum` ordering.
4. Add a boolean helper (e.g. `isSupport`) to AuthProvider if used in guards.
5. (Optional) Create a dashboard route under `app/<role>/page.tsx` and add it to the DashboardShell nav sets and middleware `PROTECTED_PREFIXES`.
6. (Optional) Add RLS policies that grant/revoke access to the role.
