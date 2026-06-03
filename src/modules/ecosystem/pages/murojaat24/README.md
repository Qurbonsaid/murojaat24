# Murojaat24 admin module

Admin views inside the ecosystem for Murojaat24: dashboard summary, appeals list, statistics, and staff user management. Routed under `/ecosystem/murojaat24/*`; section chosen by pathname in `murojaat24/Murojaat24ModulePage.tsx`.

## Entry points

| Route suffix            | Section component                                     |
| ----------------------- | ----------------------------------------------------- |
| `/ecosystem/murojaat24` | Dashboard in `Murojaat24ModulePage.tsx` (this folder) |
| `.../appeals`           | `MurojaatlarSection.tsx`                              |
| `.../statistics`        | `StatisticsSection.tsx`                               |
| `.../users`             | User table + modals in `Murojaat24ModulePage.tsx`     |

Modals: `src/components/AddUserModal.tsx`, `EditUserModal.tsx`. API: `src/lib/api/users.ts`, `organizations.ts` (for org pickers).

---

## Appeals list (`murojaatlar`)

Paginated appeals table in `MurojaatlarSection.tsx` backed by `useRequests` → `GET /api/requests/` and row detail via `OperatorRequestDetailModal` → `useRequest` → `GET /api/requests/:id` (`src/lib/api/requests.ts`).

**Filters (query params):** `search`, `status`, `organization`, `priority`, `startDate`, `endDate` (`yyyy-MM-dd` from `DatePicker` in `components/ui/date-picker.tsx`). Options from `REQUEST_STATUS_OPTIONS` and `REQUEST_PRIORITY_OPTIONS`; organizations from `useOrganizations`. Pass `options.role: "admin"` so `organization` is sent when filtered. Changing any filter resets to page 1.

**Table columns:** request number, citizen name, organization (via `resolveOrganizationName`), priority label, created time (`formatRequestDateTime`), `RequestStatusBadge`, Eye action.

**Roles:** admin only (via ecosystem gate).

**Edge cases:** loading spinner, `ApiError` message, empty “Murojaatlar topilmadi”; Eye disabled when `_id` missing; pagination Prev/Next when `pagination.pages > 1`. Detail modal images open in `ImagePreviewDialog` on click.

---

## Statistics (`statistika`)

Admin analytics in `StatisticsSection.tsx` backed by `src/lib/api/statistics.ts`:

| UI block                                    | Hook                                                                    | Endpoint                              |
| ------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------- |
| KPI cards (Jami, Bajarilgan, Jarayonda, Bugun) | `useDashboardStatistics`                                             | `GET /api/statistics/dashboard`       |
| Filter bar + Excel yuklash                  | `useExportStatistics`                                                   | `GET /api/statistics/export`          |
| Rahbariyat bo'yicha statistika (admin only) | `useOrganizationStatistics` + `groupOrganizationStatisticsByGovernance` | `GET /api/statistics/by-organization` |
| Tashkilotlar bo'yicha taqsimot (pie)        | `useOrganizationStatistics`                                             | `GET /api/statistics/by-organization` |
| Kunlik dinamika (line)                      | `useDailyStatistics(days)`                                              | `GET /api/statistics/daily?days=`     |

**Not used on this page:** `GET /api/statistics/specialists` / `useSpecialistStatistics` (no Mutaxassislar table).

Filters: date range (`DatePicker` → export `startDate`/`endDate`; daily `days` computed from range, default 7), organization select (export query param + client-side filter on org/governance charts). Rahbariyat card renders when `currentUser.role === "admin"` and governance data is non-empty.

**Dashboard** (`/ecosystem/murojaat24`): KPI cards use `useDashboardStatistics` (request counts) and `useUsers` with `isActive: true` (active staff total from pagination).

**Roles:** admin ecosystem (`/ecosystem/murojaat24/statistics`).

**Edge cases:** response normalizers tolerate varying envelope shapes; export opens `GET /api/statistics/export` in a new tab so the backend serves the `.xlsx` directly (session cookie on the API origin).

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
