# Manager staff users

Dispatcher and specialist user management for the manager role. Same table and modal UX as admin `foydalanuvchilar`, implemented in dedicated components (not shared with ecosystem admin).

## Entry points

| Route            | File                                    |
| ---------------- | --------------------------------------- |
| `/manager/users` | `ManagerUsersPage.tsx`                  |
| Sidebar          | `ManagerSidebar.tsx` → Foydalanuvchilar |

Modals: `ManagerAddUserModal.tsx`, `ManagerEditUserModal.tsx`. API: `src/lib/api/users.ts`, `organizations.ts`.

## User-facing behavior

- Search and role tabs: **Hammasi** → `role=dispatcher,specialist`; **Dispetcherlar** / **Mutaxassislar** → single role. All requests include `organizations` and optional `search`.
- List is scoped to the signed-in manager’s organization id (`organizations` query param from `GET /api/auth/me`).
- Add user: role choices limited to dispatcher and specialist; new users default to the manager’s organization when set on profile.
- Edit / delete: same flows as admin; edit modal includes work **status** (`active`, `busy`, `inactive`) via `PUT /api/users/:id/status`; cannot delete your own row.

## Data flow

`useCurrentUser` → organization id → `useUsers({ organizations, role?, search? })` → table → modals → mutations → invalidate `["users"]`.

## Roles

Route gate: `manager`, `admin` in `murojaat24/config/routes.tsx`. Managers cannot open `/ecosystem/murojaat24/users`.

## API caveat

- **GET** `/api/users` — `organizations` (comma-separated ids), `role`, `search`, `page`, `limit`.
- **POST / PUT / DELETE / reset-password** — backend may return **403** for manager until role permissions expand. Errors surface via destructive toasts (`ApiError`).

## Edge cases

- Manager without `organization` on profile: list query disabled; message shown.
- Loading, error, and empty table states.
- Signed-in user is omitted from the table (still cannot delete self if shown elsewhere).
- Delete uses toast confirmation action.

## Related docs

- Role: `docs/roles/manager.md`
- Admin equivalent: `src/modules/ecosystem/pages/murojaat24/README.md`
- Auth API: `src/lib/api/README.md`
