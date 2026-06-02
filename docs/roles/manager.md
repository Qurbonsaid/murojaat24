# Manager

**Review completed specialist work** and **view organization statistics**. **Manage dispatcher and specialist staff** on a dedicated users page. Verify/reject uses `PUT /api/requests/{id}/verify`.

## Identifier

- Code value: `manager`
- Post-login home: `/manager/review`

## Routes

| Path                  | Component                    | Gate               |
| --------------------- | ---------------------------- | ------------------ |
| `/manager/review`     | `ManagerReviewPage`          | `manager`, `admin` |
| `/manager/statistics` | `ManagerStatisticsPage`      | `manager`, `admin` |
| `/manager/users`      | `ManagerUsersPage`           | `manager`, `admin` |
| `/manager-dashboard`  | Redirect → `/manager/review` | `manager`, `admin` |
| `/profile`            | `Profile` + `ManagerSidebar` | all staff roles    |

Managers cannot access `/ecosystem/*` (including admin `/ecosystem/murojaat24/users`).

## Actions

- Login, logout, update profile.
- List appeals for their organization (`GET /api/requests/`).
- Open review modal; approve or reject completed work (`PUT /api/requests/{id}/verify`).
- View statistics and export Excel for their organization.
- List, search, and filter staff on `/manager/users` via `GET /api/users` (`organizations`, `role`, `search`); add/edit/delete dispatcher and specialist (mutations may return **403** until backend allows manager access).

## Data read / write

**Reads:** `CurrentUser`; `GET /api/requests` (organization filter); `GET /api/requests/:id`; statistics endpoints (`dashboard`, `daily`, `by-organization`, `specialists`); `GET /api/users` (`organizations`, `role`, `search`).

**Writes:** auth/profile API; verify request; `POST`/`PUT`/`DELETE` users via manager modals (subject to backend role checks).

## Feature docs

- Review & statistics: `src/pages/manager-dashboard/README.md`
- Staff users: `src/pages/manager-users/README.md`
- Auth: `src/lib/api/README.md`
- Profile: `src/pages/profile/README.md`

## Permission checks

- Route gate in `murojaat24/config/routes.tsx`.
- `ProtectedRoute` at runtime.
- Appeals list passes manager `organization` from `GET /api/auth/me`.
- Add/edit modals only offer `dispatcher` and `specialist` roles; list filtering uses API query params (`organizations`, `role`).
