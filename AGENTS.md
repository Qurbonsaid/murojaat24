# Murojaat24 — Agent guide

Primary entry point for AI agents working in this repository. Read this first, then open the specific feature `README.md` next to the code you are changing.

## What this is

A Vite + React SPA for **Termiz aqlli shahar** employee workflows around citizen appeals (Murojaat24): a public marketing landing, role-specific operational dashboards, and an **admin ecosystem shell** for cross-module navigation, user/org administration, and mock appeal analytics. The backend is consumed via cookie-based JSON APIs; many appeal workflow screens still use **local mock data** (see `docs/architecture/overview.md`).

## Roles

| Role | Purpose |
| --- | --- |
| `admin` | Ecosystem shell at `/ecosystem/*`, Murojaat24 admin sections, settings; may also open every role dashboard. |
| `operator` | Phone intake form and mock “today’s appeals” list. |
| `dispatcher` | API-backed new appeals + assignments (`assignments.ts`); two-route sidebar (appeals, assignments). |
| `specialist` | Mobile task UI on `/specialist-mobile` (mock tasks); login PWA install gate (`MobileQRCode`, bypass in dev); history/stats/profile tabs. |
| `manager` | Mock completed-work review table and approve/reject modal (toast only). |

Canonical role strings live in `src/lib/api/auth.ts` (`UserRole`). UI labels may say “Dispetcher” while the code value is `dispatcher`.

## Repository map

### Root

- `package.json`, `vite.config.ts`, `tailwind.config.ts` — build and tooling.
- `vercel.json` — SPA rewrite to `index.html`.
- `index.html` — app entry.
- `AGENTS.md` — this file.
- `docs/` — stable architecture, routing, roles, conventions (not feature-deep).
- `docs/api/openapi.json` — committed OpenAPI 3.0 contract (refresh via `docs/api/refresh-openapi.sh`).

### `src/`

| Path | Owns |
| --- | --- |
| `src/App.tsx` | `QueryClientProvider`, router, `/ecosystem` nest, maps `murojaat24Routes`. |
| `src/pages/<feature>/` | Route-level screens + colocated `README.md` (landing, login, dashboards, profile, citizen, errors). |
| `src/components/` | Shared workflow UI, sidebars, modals, landing sections; `ui/` = shadcn primitives; `specialist/` = mobile tabs. |
| `src/lib/api/` | `client.ts` + domain hooks (`auth`, `users`, `organizations`). |
| `src/lib/organizations.ts` | Static org list for mock flows (not the API). |
| `src/modules/ecosystem/` | Admin menu, layout, module pages, settings. |
| `src/modules/murojaat24/` | Route config only — see `src/modules/murojaat24/README.md`; screens under `src/pages/<feature>/`. |
| `src/hooks/` | Toast helper, mobile breakpoint. |

Feature-level behavior is documented in colocated `README.md` files under these trees (see [Feature docs](#feature-docs)).

## How routing works

Three sources compose the route table (full list: `docs/architecture/routing.md`):

1. **`src/App.tsx`** — `/`, nested `/ecosystem/*` (admin-only `ProtectedRoute`), explicit `/ecosystem/profile`, catch-all `*`.
2. **`src/modules/ecosystem/config/menu.ts`** — flattens menu items into ecosystem child routes; `App.tsx` picks the page component by `moduleKind` (`modullar`, `murojaat24`, `sozlamalar`, `coming-soon`).
3. **`src/modules/murojaat24/config/routes.tsx`** — `/login`, role dashboards, `/profile`, `/admin-dashboard` redirect.

Unmounted pages: `src/pages/citizen/{SubmitRequest,TrackRequest,Statistics}.tsx` (see `src/pages/citizen/README.md`).

## How auth and role gating work

Session is **cookie-based** from the browser’s perspective: `apiRequest` in `src/lib/api/client.ts` always sends `credentials: "include"`. After login, `useCurrentUser` loads `GET /api/auth/me` into React Query key `["auth", "me"]`. `getRoleRedirectPath` in `src/lib/api/auth.ts` sends each role to its home route; admins go to `/ecosystem/modullar`.

`ProtectedRoute` (`src/components/ProtectedRoute.tsx`) wraps protected elements: loading skeleton, redirect to `/login` on 401/403, generic error for other failures, `Forbidden` when `requiredRoles` excludes the user’s role. Login page: `src/pages/login/Login.tsx`.

Details: `src/lib/api/README.md`, `docs/architecture/conventions.md` (Auth section).

## API contract

- **OpenAPI:** `docs/api/openapi.json` (source: https://api-staging.aqllishahar-termizsh.uz/docs/json — refresh with `docs/api/refresh-openapi.sh`).
- **Staging base URL:** `https://api-staging.aqllishahar-termizsh.uz`
- **Local / deployed base URL:** `VITE_BASE_URL` in `.env` (see `src/lib/api/client.ts`; fallback `http://localhost:8080`).
- **Auth:** httpOnly cookie `access_token`; all staff calls use `credentials: "include"`.
- **Envelope:** `{ success, data, message?, pagination? }`; failures throw `ApiError`.

When integrating a new endpoint, read the spec first (path, method, body, query, tags). Do not duplicate the spec in markdown—point to `docs/api/openapi.json`. Details: `docs/api/README.md`.

## How the API layer works

All HTTP goes through `apiRequest` in `src/lib/api/client.ts`.

Domain hooks live beside the client (see `docs/api/README.md` for tag → file mapping):

- `src/lib/api/auth.ts` — session, login/logout, profile, forgot-password helpers.
- `src/lib/api/users.ts` — staff CRUD and list filters.
- `src/lib/api/organizations.ts` — organization CRUD.
- `src/lib/api/requests.ts` — appeals list, detail, operator create.
- `src/lib/api/statistics.ts` — admin statistics (daily, by-organization, specialists, export).
- `src/lib/api/assignments.ts` — dispatcher list/create/cancel; specialist `my/*` paths in spec but not hooked.
- `src/lib/api/uploads.ts` — avatar upload.
- `src/lib/pwa.ts` — specialist install gate helpers (`shouldBypassSpecialistInstallWall`, SW register).

Dispatcher assignment is API-backed; specialist tasks, manager verify, and some admin KPIs remain mock. Specialist assignment endpoints exist in the spec but lack frontend hooks.

Details: `docs/architecture/conventions.md` (API section), `docs/architecture/implementation-gaps.md`.

## How state is organized

- **Server-backed:** TanStack Query via hooks in `src/lib/api/*`. Default `QueryClient` in `src/App.tsx` (no custom global config). Typical keys: `["auth", "me"]`, `["users", params]`, `["organizations"]`. Mutations invalidate their resource keys; login sets auth cache; logout removes it.
- **Workflow / mock UI:** `useState` (and similar) inside pages and modals — operator intake, dispatcher assignment, specialist tasks, manager review, static charts.
- **Toasts:** `src/hooks/use-toast.ts` (shadcn) and `sonner` in some components.
- **Legacy:** `src/lib/api/auth.ts` can clear old `localStorage` session keys on logout; login does not write them.

Details: `docs/architecture/conventions.md` (State section).

## Coding conventions

- **Layers:** routes → `pages/` or `modules/.../pages/` → workflow `components/` → `components/ui/`.
- **Paths:** `@/` alias → `src/` (Vite + tsconfig).
- **Routes:** declare in `App.tsx`, `menu.ts`, or `murojaat24/config/routes.tsx` — not inside page files.
- **Forms:** `react-hook-form` + `zod` schemas, usually colocated with the screen.
- **Styling:** Tailwind utilities + shadcn/Radix under `components/ui/`; tokens in `src/index.css`.
- **TypeScript:** strict checks are relaxed in tsconfig; do not rely on the compiler to catch unused symbols.
- **Docs in code:** when you change behavior under a feature folder, update that folder’s `README.md` in the same change.

Full conventions: `docs/architecture/conventions.md`. Footguns: `docs/architecture/gotchas.md`.

## Documentation rules

1. **Feature code** (`src/pages/...`, `src/components/...`, `src/modules/...`, `src/lib/api/...`): update the **colocated `README.md`** in the same PR/commit as the code change. Do not edit unrelated feature docs.
2. **Role docs** (`docs/roles/*.md`): change only when role permissions, routes, or role-wide workflows change.
3. **Architecture docs** (`docs/architecture/*.md`): change only when app structure, routing shape, or cross-cutting conventions change.
4. **This file (`AGENTS.md`):** update when onboarding facts change (new top-level area, new role, new global pattern).
5. No line-number citations in docs; point to file paths. No copied TypeScript types or hand-maintained endpoint inventories in feature/architecture docs — use `docs/api/openapi.json` for routes and schemas.

## Where to read next

### Stable docs

- `docs/README.md` — index.
- `docs/api/README.md` — OpenAPI contract, refresh, environments.
- `docs/api/openapi.json` — API paths and schemas (agents: read this for integrations).
- `docs/architecture/overview.md` — system shape, API vs mock split.
- `docs/architecture/project-structure.md` — folder map.
- `docs/architecture/routing.md` — route tables and gates.
- `docs/architecture/conventions.md` — API, auth, state, UI patterns.
- `docs/architecture/gotchas.md` — traps and mismatches.
- `docs/roles/` — per-role routes, actions, data, links to features.

### Feature docs

| Topic | README |
| --- | --- |
| Auth API, login, guards | `src/lib/api/README.md` |
| Staff profile page | `src/pages/profile/README.md` |
| Public landing | `src/pages/landing/README.md` |
| Admin ecosystem shell | `src/modules/ecosystem/README.md` |
| Operator intake | `src/pages/operator-dashboard/README.md` |
| Murojaat24 admin (appeals, stats, users) | `src/modules/ecosystem/pages/murojaat24/README.md` |
| Dispatcher dashboard | `src/pages/dispatcher-dashboard/README.md` |
| Specialist mobile | `src/pages/specialist-mobile/README.md`, `src/components/specialist/README.md` |
| Manager review | `src/pages/manager-dashboard/README.md` |
| Settings (orgs, templates, general) | `src/modules/ecosystem/pages/sozlamalar/README.md` |
| Unrouted citizen pages | `src/pages/citizen/README.md` |
