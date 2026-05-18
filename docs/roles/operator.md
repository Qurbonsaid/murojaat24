# Operator

Call-center style **appeal intake** on the operator dashboard. Appeal creation is validated locally with a simulated save — no appeal API in the frontend.

## Identifier

- Code value: `operator`
- Post-login home: `/operator-dashboard`

## Routes

| Path | Component | Gate |
| --- | --- | --- |
| `/operator-dashboard` | `OperatorDashboard` | `operator`, `admin` |
| `/profile` | `Profile` + `OperatorSidebar` | all staff roles |

Public: `/`, `/login`, `/role-select`.

## Actions

- Login, logout, update profile (`auth` API).
- View dashboard KPI cards (static).
- Submit intake form (name, phone, organization, description, address, optional notes) — toast + generated tracking-style number, no POST.
- Pick organization from static list (`src/lib/organizations.ts`).
- View “today’s appeals” list (local mock array).

## Data read / write

**Reads:** `CurrentUser`; static organizations; local `mockRequests`.

**Writes:** auth/profile API only; form and list state local.

## Feature docs

- Intake: `src/pages/operator-dashboard/README.md`
- Auth: `src/lib/api/README.md`
- Profile: `src/pages/profile/README.md`

## Permission checks

- Route: `requiredRoles` on `/operator-dashboard` in `murojaat24/config/routes.tsx`.
- Runtime: `ProtectedRoute` + `useCurrentUser`.
