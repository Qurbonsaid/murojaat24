# Murojaat24 admin module

Admin views inside the ecosystem for Murojaat24: dashboard summary, appeals list, statistics, and staff user management. Routed under `/ecosystem/murojaat24/*`; section chosen by pathname in `murojaat24/Murojaat24ModulePage.tsx`.

## Entry points

| Route suffix | Section component |
| --- | --- |
| `/ecosystem/murojaat24` | Dashboard in `Murojaat24ModulePage.tsx` (this folder) |
| `.../murojaatlar` | `MurojaatlarSection.tsx` |
| `.../statistika` | `StatisticsSection.tsx` |
| `.../foydalanuvchilar` | User table + modals in `Murojaat24ModulePage.tsx` |

Modals: `src/components/AddUserModal.tsx`, `EditUserModal.tsx`. API: `src/lib/api/users.ts`, `organizations.ts` (for org pickers).

---

## Appeals list (`murojaatlar`)

Paginated appeals table in `MurojaatlarSection.tsx` backed by `useRequests` → `GET /api/requests/` and row detail via `OperatorRequestDetailModal` → `useRequest` → `GET /api/requests/:id` (`src/lib/api/requests.ts`).

**Filters (query params):** `search`, `status`, `organization`, `priority`, `startDate`, `endDate` (`yyyy-MM-dd` from `DatePicker` in `components/ui/date-picker.tsx`). Options from `REQUEST_STATUS_OPTIONS` and `REQUEST_PRIORITY_OPTIONS`; organizations from `useOrganizations`. Pass `options.role: "admin"` so `organization` is sent when filtered. Changing any filter resets to page 1.

**Table columns:** request number, citizen name, organization (via `resolveOrganizationName`), priority label, created time (`formatRequestDateTime`), `RequestStatusBadge`, Eye action.

**Roles:** admin only (via ecosystem gate).

**Edge cases:** loading spinner, `ApiError` message, empty “Murojaatlar topilmadi”; Eye disabled when `_id` missing; pagination Prev/Next when `pagination.pages > 1`.

---

## Statistics (`statistika`)

Admin analytics in `StatisticsSection.tsx` backed by `src/lib/api/statistics.ts`:

| UI block | Hook | Endpoint |
| --- | --- | --- |
| Kunlik dinamika | `useDailyStatistics(days)` | `GET /api/statistics/daily?days=` |
| Tashkilotlar taqsimoti | `useOrganizationStatistics` | `GET /api/statistics/by-organization` |
| Rahbariyat (admin) | Derived from organization stats | Same |
| Mutaxassislar jadvali | `useSpecialistStatistics` | `GET /api/statistics/specialists` |
| Excel yuklash | `useExportStatistics` | `GET /api/statistics/export` |

Filters: date range (`DatePicker` → export `startDate`/`endDate`; daily `days` computed from range, default 7), organization select (export + labels only — list endpoints have no org query in spec). Loading spinner, per-query error message, empty states.

**Roles:** admin ecosystem; governance tabs when `currentUser.role === "admin"`.

**Edge cases:** response normalizers tolerate varying envelope shapes; export downloads blob via `Content-Disposition` filename when present.

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
