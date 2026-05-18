# Gotchas

Current traps and mismatches. Snapshot of behavior in the repo — not a backlog.

## Routes and links

- `src/pages/citizen/SubmitRequest.tsx`, `TrackRequest.tsx`, `Statistics.tsx` are **not** registered in the router. Citizen CTA on the landing goes to an external URL (`Header`, `Hero`), not these components.
- `OperatorSidebar` links `/statistika` — no matching route in `App.tsx` or `murojaat24Routes`.
- `/role-select` immediately redirects to `/login`; there is no role-picker screen.
- Operator, dispatcher, and manager sidebars use hash links (`#new`, `#stats`, …) but dashboard pages often lack matching element `id`s.

## Environment and build

- Root `README.md` may mention `VITE_API_URL`; the client reads **`VITE_BASE_URL`** (`src/lib/api/client.ts`).
- `package.json` may reference `build:public` / `public-landing/vite.config.ts` — that folder may be absent in this tree.
- `src/App.css` is Vite scaffold; `main.tsx` imports `index.css` only.

## Auth and labels

- API role value is `dispatcher`; UI strings sometimes say “Dispetcher” or “Dispatcher”.
- Legacy `localStorage` session keys are cleared on logout but not written on login in current flow.
- `legacySessionKeys` maps both `admin` and `operator` to `operator_session`.

## Mock-only workflows

No backend call for: operator appeal submit, dispatcher assignment, specialist task lifecycle, manager approve/reject, admin Murojaatlar/statistika tables, sozlamalar templates/general save, citizen submit/track simulations.

Static org names for mocks: `src/lib/organizations.ts` (separate from `GET /api/organizations`).

## Role access

- `/ecosystem/*` is **admin-only**; managers cannot reach API user management through registered routes.
- `admin` is included in every role dashboard route’s `requiredRoles`, so admins can open operator/dispatcher/specialist/manager UIs.
- Admin profile: prefer `/ecosystem/profile`; standalone `/profile` redirects admins into the ecosystem shell.

## Runtime edges

- `StaffUser.organization` may be object, string, or null — table rendering assumes object shape in places.
- Specialist `ProfileTab` may read `user.profile` without optional chaining on `user` while loading.
- `Statistics.tsx` may import unused symbols without compile errors due to relaxed TS settings.

## Static and demo data

Many lists use hardcoded `MUR-2024-*` ids and 2024 dates. Login screen may show demo credentials in the UI.
