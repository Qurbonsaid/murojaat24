# Murojaat24 admin module

Admin views inside the ecosystem for Murojaat24: dashboard summary, appeals list, statistics, and staff user management. Routed under `/ecosystem/murojaat24/*`; section chosen by pathname in `murojaat24/Murojaat24ModulePage.tsx`.

## Entry points

| Route suffix | Section component |
| --- | --- |
| `/ecosystem/murojaat24` | Dashboard in `Murojaat24ModulePage.tsx` (this folder) |
| `.../murojaatlar` | `MurojaatlarSection.tsx` |
| `.../statistika` | `StatistikaSection.tsx` |
| `.../foydalanuvchilar` | User table + modals in `Murojaat24ModulePage.tsx` |

Modals: `src/components/AddUserModal.tsx`, `EditUserModal.tsx`. API: `src/lib/api/users.ts`, `organizations.ts` (for org pickers).

---

## Appeals list (`murojaatlar`)

Static table of mock appeals in `MurojaatlarSection.tsx`. Status badges for completed / in-progress / pending / unknown.

**API:** none. **Roles:** admin only (via ecosystem gate).

**Edge cases:** data is hardcoded literals, not filtered by UI controls.

---

## Statistics (`statistika`)

Charts, filters, governance block, and detail table from local arrays in `StatistikaSection.tsx`. Date/domain filters update UI state but do not filter underlying static data. Excel export button has no handler.

**API:** none for stats. **Roles:** admin; extra governance UI when current user role is admin.

**Edge cases:** badge variants include `new` vs operator’s `pending`; static 2024 sample metrics.

---

## User management (`foydalanuvchilar`)

Search, role filter, table, add/edit/delete, password reset. Backed by `/api/users` hooks.

**Flow:** `useUsers` with deferred search → table; modals call create/update/delete/reset mutations → invalidate `["users"]`.

**Roles:** admin only.

**Edge cases:**

- Loading, error, empty states on table.
- Cannot delete the signed-in admin row.
- Delete uses toast confirmation action.
- Add user roles: operator, dispatcher, specialist, manager; edit modal can set admin.

---

## Related docs

- Ecosystem shell: `src/modules/ecosystem/README.md`
- Auth: `src/lib/api/README.md`
- Admin role: `docs/roles/admin.md`
