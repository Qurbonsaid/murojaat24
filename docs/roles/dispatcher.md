# Dispatcher

**Monitoring and assignment** UI: new request cards, map markers, specialist availability, assignment modal. Assignment is local state + toast — no assignment API.

## Identifier

- Code value: `dispatcher` (UI may label “Dispetcher”)
- Post-login home: `/dispatcher-dashboard`

## Routes

| Path | Component | Gate |
| --- | --- | --- |
| `/dispatcher-dashboard` | `DispatcherDashboard` | `dispatcher`, `admin` |
| `/profile` | `Profile` + `DispatcherSidebar` | all staff roles |

## Actions

- Login, logout, update profile.
- View mock new requests and open assignment modal.
- Select specialist and confirm (toast only).
- View percentage-based map markers and specialist cards.

## Data read / write

**Reads:** `CurrentUser`; local `newRequests`, specialists, map markers.

**Writes:** auth/profile API; modal selection state local.

## Feature docs

- Dashboard: `src/pages/dispatcher-dashboard/README.md`
- Auth: `src/lib/api/README.md`
- Profile: `src/pages/profile/README.md`

## Permission checks

- Route gate in `murojaat24/config/routes.tsx`.
- `ProtectedRoute` at runtime.
