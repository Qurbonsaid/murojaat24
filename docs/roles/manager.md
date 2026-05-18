# Manager

**Review completed specialist work** in the manager dashboard. **Manage dispatcher and specialist staff** on a dedicated users page. Approve/reject on the dashboard show toasts only — no review API.

## Identifier

- Code value: `manager`
- Post-login home: `/manager-dashboard`

## Routes

| Path | Component | Gate |
| --- | --- | --- |
| `/manager-dashboard` | `ManagerDashboard` | `manager`, `admin` |
| `/manager/foydalanuvchilar` | `ManagerUsersPage` | `manager`, `admin` |
| `/profile` | `Profile` + `ManagerSidebar` | all staff roles |

Managers cannot access `/ecosystem/*` (including admin `/ecosystem/murojaat24/foydalanuvchilar`).

## Actions

- Login, logout, update profile.
- View review KPIs and completed-work table (mock).
- Open review modal (before/after, timeline).
- Approve or reject (toast only).
- List, search, add, edit, and delete **dispatcher** and **specialist** users on `/manager/foydalanuvchilar` (UI uses same patterns as admin; create/update/delete may return **403** until backend allows manager mutations).

## Data read / write

**Reads:** `CurrentUser`; `GET /api/users` for staff list; local `reviewRequests` on dashboard.

**Writes:** auth/profile API; `POST`/`PUT`/`DELETE` users via manager modals (subject to backend role checks); dashboard modal state local.

## Feature docs

- Review UI: `src/pages/manager-dashboard/README.md`
- Staff users: `src/pages/manager-users/README.md`
- Auth: `src/lib/api/README.md`
- Profile: `src/pages/profile/README.md`

## Permission checks

- Route gate in `murojaat24/config/routes.tsx`.
- `ProtectedRoute` at runtime.
- Add/edit modals only offer `dispatcher` and `specialist` roles; table client-filters to those roles.
