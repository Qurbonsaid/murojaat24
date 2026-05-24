# Admin

Top-level role for the Termiz aqlli shahar **ecosystem shell** and Murojaat24 administration. `admin` is also allowed on every standalone role dashboard route.

## Identifier

- Code value: `admin` (`UserRole` in `src/lib/api/auth.ts`)
- Post-login home: `/ecosystem/modullar` via `getRoleRedirectPath`
- Legacy redirect: `/admin-dashboard` → `/ecosystem/modullar`

## Routes

**Public:** `/`, `/login`, `/role-select` (login redirects if already authenticated).

**Admin-only (`/ecosystem/*`):** module catalog, Murojaat24 sections, settings, and many `coming-soon` modules — full table in `docs/architecture/routing.md`. Explicit profile: `/ecosystem/profile`.

**Also allowed:** `/operator-dashboard`, `/dispatcher-dashboard`, `/specialist-mobile`, `/manager-dashboard`, `/profile` (redirects to ecosystem profile).

Gate: `ProtectedRoute` with `requiredRoles={["admin"]}` on `/ecosystem` in `src/App.tsx`; per-route lists in `murojaat24/config/routes.tsx`.

## Actions

| Area | What admin can do | API |
| --- | --- | --- |
| Session | Login, logout, update own profile | `auth` hooks |
| Ecosystem | Navigate modules, open coming-soon placeholders | — |
| Murojaat24 admin | View dashboard/statistics (mock); appeals list via API; manage staff users | `users` for staff; `requests` for appeals list/detail; stats mock |
| Settings | Org/governance CRUD; view local template/general UI | `organizations` for orgs; templates not persisted |
| Role dashboards | Same local actions as operator/dispatcher/specialist/manager when visiting those routes | Mostly mock |

## Data read / write

**Reads:** `CurrentUser`; `StaffUser` lists; `Organization[]`; local mock appeal/statistics/module data.

**Writes:** user CRUD, org CRUD, profile update, logout; local-only state on mock dashboards and non-persisted settings controls.

## Feature docs

- Shell: `src/modules/ecosystem/README.md`
- Murojaat24 admin (appeals, stats, users): `src/modules/ecosystem/pages/murojaat24/README.md`
- Settings: `src/modules/ecosystem/pages/sozlamalar/README.md`
- Auth: `src/lib/api/README.md`
- Profile: `src/pages/profile/README.md`
- Operator / dispatcher / specialist / manager UIs: respective `src/pages/*/README.md` or `src/components/specialist/README.md`

## Permission checks

- Ecosystem parent: admin-only `ProtectedRoute`.
- Murojaat24 statistika may show extra governance blocks when `currentUser.role === "admin"`.
- User delete disabled for the signed-in admin account (see user management README).
