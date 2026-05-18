# Manager staff users

Dispatcher and specialist user management for the manager role. Same table and modal UX as admin `foydalanuvchilar`, implemented in dedicated components (not shared with ecosystem admin).

## Entry points

| Route | File |
| --- | --- |
| `/manager/foydalanuvchilar` | `ManagerUsersPage.tsx` |
| Sidebar | `ManagerSidebar.tsx` → Foydalanuvchilar |

Modals: `ManagerAddUserModal.tsx`, `ManagerEditUserModal.tsx`. API: `src/lib/api/users.ts`, `organizations.ts`.

## User-facing behavior

- Search and filter tabs: **Hammasi**, **Dispetcherlar**, **Mutaxassislar**.
- List shows only **dispatcher** and **specialist** rows (client-filter when tab is Hammasi).
- Add user: role choices limited to dispatcher and specialist.
- Edit / delete: same flows as admin; row actions disabled for non-manageable roles.

## Data flow

`useUsers` (deferred search) → filtered table → `ManagerAddUserModal` / `ManagerEditUserModal` → `useCreateUser` / `useUpdateUser` / `useDeleteUser` / `useResetUserPassword` → invalidate `["users"]`.

## Roles

Route gate: `manager`, `admin` in `murojaat24/config/routes.tsx`. Managers cannot open `/ecosystem/murojaat24/foydalanuvchilar`.

## API caveat

- **GET** `/api/users` — allowed for manager (list works).
- **POST / PUT / DELETE / reset-password** — backend is currently **admin-only**; manager mutations may return **403** until the API grants manager access. Errors surface via destructive toasts (`ApiError`).

## Edge cases

- Loading, error, and empty table states.
- Cannot delete the signed-in user row.
- Delete uses toast confirmation action.

## Related docs

- Role: `docs/roles/manager.md`
- Admin equivalent: `src/modules/ecosystem/pages/murojaat24/README.md`
- Auth API: `src/lib/api/README.md`
