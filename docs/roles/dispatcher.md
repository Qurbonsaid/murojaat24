# Dispatcher

**Appeals assignment** UI: new appeals table, specialist assignment modal, and assignments list with cancel confirmation. Backed by `requests`, `assignments`, and `users` API hooks.

## Identifier

- Code value: `dispatcher` (UI may label “Dispetcher”)
- Post-login home: `/dispatcher-dashboard/appeals`

## Routes

| Path | Component | Gate |
| --- | --- | --- |
| `/dispatcher-dashboard/appeals` | `DispatcherNewAppeals` | `dispatcher`, `admin` |
| `/dispatcher-dashboard/assignments` | `DispatcherAssignments` | `dispatcher`, `admin` |
| `/profile` | `Profile` + `DispatcherSidebar` | all staff roles |

## Actions

- Login, logout, update profile.
- List new appeals (`status=new`), filter by organization, view detail.
- Assign specialist to appeal (`POST /api/assignments`).
- List assignments, filter by status, cancel with confirmation (`PUT /api/assignments/:id/cancel`).

## Data read / write

**Reads:** `useCurrentUser`; `useRequests` (new appeals); `useOrganizations`; `useAssignments`; `useSpecialists`.

**Writes:** auth/profile API; `useCreateAssignment`; `useCancelAssignment`.

## Feature docs

- Dashboard: `src/pages/dispatcher-dashboard/README.md`
- Auth: `src/lib/api/README.md`
- Profile: `src/pages/profile/README.md`

## Permission checks

- Route gate in `murojaat24/config/routes.tsx`.
- `ProtectedRoute` at runtime.
