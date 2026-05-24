# Implementation gaps and mock inventory

Snapshot of what is **wired to the backend** versus **local/mock/UI-only** in the Murojaat24 frontend. Use this when planning API work or prioritizing features. Feature-level behavior also lives in colocated `src/**/README.md` files.

**Last reviewed:** May 2026 — admin `Murojaatlar` list/detail, `StatisticsSection` API integration, ecosystem sidebar visibility, settings submenu hiding, organization delete confirmation.

---

## Summary

| Layer | Status |
| --- | --- |
| Auth, profile, avatar upload | API-backed |
| Staff users CRUD (admin + manager routes) | API-backed |
| Organizations CRUD (settings) | API-backed (delete uses `AlertDialog` confirmation) |
| Operator: create appeal + today’s list | Partially API-backed (KPI cards still static; list detail via `GET /api/requests/:id`) |
| Admin: appeals list + row detail | **API-backed** (`GET /api/requests/`, `GET /api/requests/:id`, filters, pagination) |
| Admin: dashboard KPIs | Still mock/local |
| Admin: statistics page (`StatisticsSection`) | API-backed (daily, by-organization, specialists, export) |
| Appeal lifecycle (assign → execute → review) | Almost entirely mock/local |
| Citizen in-app flows | Built but **not routed**; production landing uses an external portal |
| Ecosystem modules (non-Murojaat24) | Mostly **coming soon**; sidebar hides `coming-soon` menu entries |

There is **no** frontend API module for dispatcher assignment, specialist tasks, manager verification, or request update/delete beyond what `requests.ts` / `statistics.ts` already expose.

---

## API surface today

Implemented in `src/lib/api/`:

| Module | Endpoints (representative) | Used by |
| --- | --- | --- |
| `client.ts` | Transport, `VITE_BASE_URL`, envelope | All hooks |
| `auth.ts` | `/api/auth/login`, `me`, `logout`, `profile`; forgot-password hooks | Login, guards, profile, modals |
| `users.ts` | `/api/users` CRUD, reset password | Admin Murojaat24 users, manager users, modals |
| `organizations.ts` | `/api/organizations` CRUD | Settings, operator org picker, user modals, admin appeals org filter |
| `requests.ts` | `GET /api/requests/`, `GET /api/requests/:id`, `POST /api/requests/operator` | Operator list + new appeal; **admin `MurojaatlarSection`** (list filters, detail modal) |
| `statistics.ts` | `GET /api/statistics/daily`, `by-organization`, `specialists`, `export` | Admin **`StatisticsSection`** |
| `uploads.ts` | `POST /api/uploads/avatar` | Profile |

**Not implemented in the frontend** (no hooks/files): assignment, specialist task fetch/update, completion upload, manager approve/reject, citizen public submit/track, notifications/templates persistence, general settings persistence, real-time map, optional `GET /api/statistics/dashboard` for ecosystem KPI cards.

Forgot-password hooks exist in `auth.ts` (`useRequestOtp`, `useVerifyOtp`, `useResetPassword`) but **`Login.tsx` has no forgot-password UI**.

---

## Partial implementations

### Operator dashboard

| Piece | Path | Reality |
| --- | --- | --- |
| New appeal form | `src/pages/operator-dashboard/OperatorNewAppeal.tsx` | `POST /api/requests/operator` via `useCreateOperatorRequest`; orgs from `useOrganizations` |
| Today’s appeals table | `src/pages/operator-dashboard/OperatorAppealsList.tsx` | `useRequests` with today’s date range; org names from API |
| KPI cards on list page | Same file | **Hardcoded** values (23, 8, 15, `"3.5 soat"`) — not derived from `useRequests` |
| Row “Eye” action | Same file | Opens `OperatorRequestDetailModal` → `useRequest` / `GET /api/requests/:id` |
| Organization column | Same file | Assumes `request.organization._id`; OpenAPI list often returns **string id** — may show `"—"` (admin list uses `resolveOrganizationName`) |

### Admin Murojaat24 module

| Piece | Path | Reality |
| --- | --- | --- |
| Dashboard KPI cards | `src/modules/ecosystem/pages/murojaat24/Murojaat24ModulePage.tsx` | Static numbers (e.g. 45 users, 145 appeals) |
| Foydalanuvchilar | Same + `AddUserModal` / `EditUserModal` | **API-backed** (`useUsers`, create/update/delete) |
| Murojaatlar | `MurojaatlarSection.tsx` | **API-backed**: `useRequests` (paginated, `search`, `status`, `organization`, `priority`, `startDate`, `endDate`); `OperatorRequestDetailModal` → `useRequest` |
| Statistika | `StatisticsSection.tsx` | **API-backed** via `statistics.ts` (daily, by-organization, specialists, export) |

### Manager

| Piece | Path | Reality |
| --- | --- | --- |
| User management | `src/pages/manager-users/` | **API-backed** (parallel to admin users UI) |
| Review dashboard | `src/pages/manager-dashboard/ManagerDashboard.tsx` | Static `reviewRequests`, static KPIs, placeholder images |
| Approve / reject | `src/components/ReviewModal.tsx` | **Toast only** — no API, list does not update |

### Settings (Sozlamalar)

| Piece | Path | Reality |
| --- | --- | --- |
| Rahbariyat / Tashkilotlar | `SozlamalarPage.tsx` | Organizations **API-backed**; delete confirmed via **AlertDialog** |
| Shablonlar / Umumiy | Same + routes still registered | Local/mock UI; **hidden from ecosystem sidebar** (`moduleKind: coming-soon` in menu) |
| Obyekt turi, Chaqiruv turi, Ish vaqtlari | Menu + routes | Coming-soon / stub; hidden from sidebar |

---

## Fully mock or local-only workflows

### Dispatcher (`/dispatcher-dashboard`)

| Data / action | Source | Notes |
| --- | --- | --- |
| New request queue | Inline array in `DispatcherDashboard.tsx` | `MUR-2024-*`, Tashkent-style addresses |
| Daily stats | `StatsCard` literals | 145 / 32 / 98 / 15 |
| Specialist roster | Inline array | Availability badges not from API |
| Map | `src/components/MapView.tsx` | Percentage-position **mock markers**, not a map SDK |
| Assignment | `src/components/AssignModal.tsx` | Static specialist list; confirm → **toast**, no `POST` |
| Sidebar anchors | `DispatcherSidebar.tsx` | `#new`, `#map`, `#stats` — dashboard has **no matching section `id`s** |

### Specialist mobile (`/specialist-mobile`)

| Data / action | Source | Notes |
| --- | --- | --- |
| Task list | `initialTasks` in `SpecialistMobile.tsx` | Local `useState`; accept/complete mutates client state only |
| History tab | `src/components/specialist/HistoryTab.tsx` | Static `historyData` |
| Stats / badges | `src/components/specialist/StatsTab.tsx` | Static weekly bars and gamification badges |
| Task completion | `src/components/specialist/TaskCompletionModal.tsx` | Multi-step UI; success animation — **no upload/report API** |
| Change password | `src/components/specialist/ChangePasswordModal.tsx` | **Sonner toast only** — not `useResetPassword` / profile API |
| Personal info modal | `src/components/specialist/PersonalInfoModal.tsx` | Defaults like `"Akmal Rahimov"`; `handleSave` comment: no API |
| Profile tab | `src/components/specialist/ProfileTab.tsx` | Logout uses API; link to `/profile` for real profile edits |

Header uses `useCurrentUser` (API); tasks do not.

### Admin appeals analytics

`StatisticsSection.tsx` loads charts and specialist rankings from `GET /api/statistics/*` (see `src/lib/api/statistics.ts`). Unmounted `src/pages/citizen/Statistics.tsx` remains a **static** duplicate — not routed.

**Closed gap:** `MurojaatlarSection.tsx` no longer uses a static `mockRequests` table — see partial implementations above.

### Settings — non-organization sections

| Section | Path | Reality |
| --- | --- | --- |
| Rahbariyat / Tashkilotlar | `SozlamalarPage.tsx` | Organizations **API-backed** |
| Shablonlar | Same | Static `smsTemplates`; edit buttons **without handlers**; route exists, sidebar hidden |
| Umumiy | Same | Switches/inputs local; **Saqlash** does not persist; route exists, sidebar hidden |
| Obyekt turi, Chaqiruv turi, Ish vaqtlari | Menu → `coming-soon` | Not built; hidden from sidebar |

---

## Static data libraries

| Asset | Path | Consumers |
| --- | --- | --- |
| Org names + governance (legacy list) | `src/lib/organizations.ts` | Citizen `SubmitRequest` org combobox; statistics helpers — **not** operator/admin appeals lists (those use API orgs) |
| Demo appeal rows | Dispatcher/manager/specialist pages, citizen `Statistics.tsx` | Role dashboards — **not** admin `MurojaatlarSection` or `StatisticsSection` |
| Map markers | `MapView.tsx` | Dispatcher |
| Landing copy / stats | `src/pages/landing/*`, `src/components/Statistics.tsx` | Public marketing — intentional static |
| Module catalog cards | `ModullarPage.tsx` | Most modules `available: false` except Murojaat24 |

Sample IDs and dates overwhelmingly use **`MUR-2024-*`** and **2024** on mock screens — visual/demo convention, not live data.

---

## Missing routes and placeholder modules

### Unregistered pages (code exists, router does not mount)

| Component | Path | Behavior if wired |
| --- | --- | --- |
| `SubmitRequest` | `src/pages/citizen/SubmitRequest.tsx` | `setTimeout` fake submit; random tracking id; geolocation sets **hardcoded** `"Toshkent shahar, Yunusobod tumani"` |
| `TrackRequest` | `src/pages/citizen/TrackRequest.tsx` | Search delay then always shows **same** `mockRequestData` |
| `Statistics` | `src/pages/citizen/Statistics.tsx` | Full static dashboard; Excel button inert |

Production citizen CTA: external URL in `src/components/Header.tsx` / `Hero.tsx` → `https://murojaat.aqllishahar-termizsh.uz`.

See `src/pages/citizen/README.md`, `docs/architecture/routing.md`.

### Ecosystem “coming soon” and sidebar visibility

`src/modules/ecosystem/config/menu.ts` marks many entries `moduleKind: "coming-soon"`. `getVisibleEcosystemMenuItems()` (used by `EcosystemLayout.tsx`) **omits** those items from the admin sidebar; routes still resolve (e.g. direct URL or module grid).

**Hidden from sidebar (representative):** Toza hudud, Kommunal chaqiruvlar, Nazorat 24, Shahar passporti, Hududlar taqsimoti (+ children), Hisobotlar (+ children); under **Sozlamalar**: Obyekt turi, Chaqiruv turi, Ish vaqtlari, Bildirishnoma shablonlari, Umumiy sozlamalar.

**Typically visible in sidebar:** Modullar, Murojaat24 (+ murojaatlar, statistika, foydalanuvchilar), Sozlamalar (+ Rahbariyat, Tashkilotlar only).

Placeholder pages: `ComingSoonPage.tsx` for top-level coming-soon modules.

### Other routing gaps

| Item | Notes |
| --- | --- |
| `/role-select` | Redirects to `/login` — no role picker |
| `/admin-dashboard` | Redirect to `/ecosystem/modullar` |
| Manager vs admin | `/ecosystem/*` is **admin-only**; managers use `/manager/*` routes, not ecosystem user admin |

---

## UI-only actions (no backend effect)

| Location | Control | Effect |
| --- | --- | --- |
| `AssignModal` | Tayinlash | Toast |
| `ReviewModal` | Tasdiqlash / Rad etish | Toast |
| `citizen/Statistics` | Excel ga yuklash | None (unmounted page) |
| `SozlamalarPage` | Shablon edit, Umumiy Saqlash | None / local state only |
| `ChangePasswordModal` (specialist) | Saqlash | Success toast only |
| `PersonalInfoModal` | Saqlash | Closes edit mode locally |
| `TaskCompletionModal` | Yakunlash | Removes task from local list after animation |

**Previously UI-only, now wired:**

| Location | Control | Effect |
| --- | --- | --- |
| `OperatorAppealsList` / `MurojaatlarSection` | Eye icon | `OperatorRequestDetailModal` → `GET /api/requests/:id` |
| `SozlamalarPage` (Tashkilotlar) | Trash | `AlertDialog` confirm → `useDeleteOrganization` |

---

## Auth and session edges

| Topic | Detail |
| --- | --- |
| Demo accounts on login | `Login.tsx` shows phone numbers and password `murojaat24` in UI |
| Legacy storage | `clearLegacySessions` on logout; `saveLegacySession` exists but login path does not write legacy keys |
| Role labeling | API `dispatcher` vs UI “Dispetcher” / “Dispatcher” |
| Admin access | `admin` in `requiredRoles` for all role dashboards — admins can open mock operator/dispatcher/specialist/manager UIs |
| Profile routes | `/profile` vs `/ecosystem/profile` — admins steered to ecosystem profile |

---

## Data model mismatches (when API is connected)

| Area | Issue |
| --- | --- |
| Operator list org column | `organization` may be a **string id** per OpenAPI; list cell uses `request.organization._id` — use `resolveOrganizationName` like admin list |
| `StaffUser.organization` | May be object, string, or null — some tables assume object shape |
| Relaxed TypeScript | Unused imports / loose null checks (e.g. specialist profile while loading) may hide integration bugs |

**Resolved for admin appeals list:** statuses use API enums via `RequestStatusBadge` (`new`, `assigned`, `in-progress`, `completed`, `verified`, `rejected`); filters exposed in `MurojaatlarSection`.

---

## Suggested backend capabilities (frontend not started)

Grouped by workflow stage — names are illustrative; align with `docs/api/openapi.json`.

1. **Dispatcher:** list unassigned/new requests; list specialists with load/location; `POST` assignment; optional map coordinates on requests.
2. **Specialist:** list assigned tasks; accept/start; upload completion photos and report; signature payload; history and stats endpoints.
3. **Manager:** queue of `completed` awaiting verification; approve/reject with comment; KPI aggregates.
4. **Admin statistics:** core charts/export **done** in `StatisticsSection`; optional `GET /api/statistics/dashboard` for ecosystem KPI cards (list/detail **done** for `MurojaatlarSection`).
5. **Citizen (if in-app):** public create/track (or keep external portal only).
6. **Settings:** SMS template CRUD; general settings persistence (pages exist; sidebar hidden until ready).
7. **Cross-cutting:** file upload beyond avatar; WebSocket or polling for dispatcher map (if real-time is required); `PUT`/`DELETE` on requests if product needs admin/dispatcher edits from UI.

---

## Related documentation

| Doc | Contents |
| --- | --- |
| `docs/architecture/overview.md` | High-level API vs mock diagram |
| `docs/architecture/gotchas.md` | Traps and quick mismatches |
| `docs/architecture/routing.md` | Full route tables |
| `docs/roles/*.md` | Per-role routes and mock notes |
| `src/lib/api/README.md` | Auth, requests, uploads hooks |
| Colocated `src/**/README.md` | Feature behavior per folder |

When closing a gap, update the **feature README** in the same change; update this file only when the overall mock/API boundary shifts.
