# Operator

Call-center style **appeal intake** on the operator dashboard. New appeals via `POST /api/requests/operator`; today's list via `GET /api/requests/` (`useRequests`).

## Identifier

- Code value: `operator`
- Post-login home: `/operator-dashboard/new`

## Routes

| Path | Component | Gate |
| --- | --- | --- |
| `/operator-dashboard` | redirect → `new` | `operator`, `admin` |
| `/operator-dashboard/new` | `OperatorNewAppeal` | `operator`, `admin` |
| `/operator-dashboard/list` | `OperatorAppealsList` | `operator`, `admin` |
| `/profile` | `Profile` + `OperatorSidebar` | all staff roles |

Public: `/`, `/login`, `/role-select`.

## Actions

- Login, logout, update profile (`auth` API).
- View dashboard KPI cards on the list page via `useDashboardStatistics`.
- Submit intake form (name, phone, organization, priority, description, address) → `POST /api/requests/operator`; success toast shows `requestNumber`.
- Pick organization from `GET /api/organizations` (stores organization `_id`).
- View today's appeals list (`useRequests` with today's `startDate`/`endDate`; returned rows shown only in the amber returned card).
- View returned appeals queue when present (`useRequests` with `incorrectOrganization: true`, all dates).
- Open appeal detail from the list (Eye) → `GET /api/requests/:id` via `useRequest`.
- Edit organization on **new** or **returned** appeals (Pencil) → `PUT /api/requests/:id` via `useUpdateRequest`.

## Data read / write

**Reads:** `CurrentUser`; organizations via `useOrganizations`; appeals list via `useRequests`; dashboard KPIs via `useDashboardStatistics` on list page.

**Writes:** auth/profile API; operator appeal create via `useCreateOperatorRequest`; organization update on new/returned appeals via `useUpdateRequest` (clears `incorrectOrganization` when fixing a return).

## Feature docs

- Intake: `src/pages/operator-dashboard/README.md`
- Auth: `src/lib/api/README.md`
- Profile: `src/pages/profile/README.md`

## Permission checks

- Route: `requiredRoles` on `/operator-dashboard/*` in `murojaat24/config/routes.tsx`.
- Runtime: `ProtectedRoute` + `useCurrentUser`.
