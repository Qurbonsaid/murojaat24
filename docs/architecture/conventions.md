# Conventions

Cross-cutting patterns in the codebase. For feature-specific flows, see colocated `src/**/README.md` files.

## Project layout

| Layer | Location | Rule |
| --- | --- | --- |
| Router | `src/App.tsx`, `menu.ts`, `murojaat24/config/routes.tsx` | Routes are centralized, not declared inside pages. |
| Screens | `src/pages/*`, `src/modules/ecosystem/pages/*` | One primary component per route or menu section. |
| Workflow UI | `src/components/*` | Reusable pieces shared across dashboards. |
| Primitives | `src/components/ui/*` | shadcn/Radix; avoid business logic here. |
| API | `src/lib/api/*` | Types + React Query hooks per domain file. |

Import alias: `@/` → `src/`.

## API layer

**Where:** `src/lib/api/client.ts` (transport), `auth.ts`, `users.ts`, `organizations.ts`, `requests.ts` (hooks).

**Rules:**

- All requests use `apiRequest(path, init)`.
- Base URL: `import.meta.env.VITE_BASE_URL` or `http://localhost:8080`.
- Always `credentials: "include"` (cookie session).
- JSON body unless `FormData`; set `Accept` and `Content-Type: application/json` for JSON.
- Parse `{ success, data, message?, pagination? }`; throw `ApiError` when HTTP fails or `success === false`.
- Add new endpoints as hooks in the matching `lib/api/*.ts` file; invalidate the same query keys the list hooks use.
- Call sites often branch on `error instanceof ApiError` and show Uzbek fallback copy.

Appeals: `requests.ts` exposes operator create today; list/assignment hooks belong here when wired.

## Auth and authorization

**Where:** `src/lib/api/auth.ts` (`UserRole`, `getRoleRedirectPath`, hooks), `src/components/ProtectedRoute.tsx`, `src/pages/login/Login.tsx`.

**Rules:**

- Role strings: `admin`, `operator`, `dispatcher`, `specialist`, `manager` — not `dispetcher`.
- After login, cache user at query key `["auth", "me"]`; `ProtectedRoute` reads `useCurrentUser`.
- Redirects: admin → `/ecosystem/modullar`; others → their dashboard paths (see `getRoleRedirectPath`).
- `ProtectedRoute`: loading skeleton; 401/403 → `/login`; other errors → inline message; wrong role → `Forbidden`.
- Logout: `POST /api/auth/logout`, remove auth query, clear legacy `localStorage` keys if present.
- Profile update: `PUT /api/auth/profile` via `useUpdateProfile`; updates auth cache and invalidates `["users"]`.

Route-level gates: `requiredRoles` on `murojaat24Routes`; `/ecosystem` wrapped with `requiredRoles={["admin"]}` in `App.tsx`.

## State

**Where:** `src/App.tsx` (`QueryClientProvider`), hooks in `src/lib/api/*`, page/modal `useState`.

**Rules:**

- Server data: TanStack Query only through `lib/api` hooks.
- Typical query keys: `["auth", "me"]`, `["users", normalizedParams]`, `["organizations"]`.
- Mutations invalidate their resource key after success; login sets `["auth", "me"]` directly.
- Mock workflows (appeals, assignment, tasks, review): keep state in the page or modal — do not add fake API hooks.
- Toasts: `useToast` from `src/hooks/use-toast.ts` and/or `sonner` — both appear in the app.

No global Redux/Zustand store.

## Forms

**Where:** screens using `react-hook-form` + `@hookform/resolvers/zod`.

**Rules:**

- Define `zod` schema in the same file as the form (or colocated module).
- Map submit payload to API input types in the handler or a colocated mapper (e.g. `toOperatorCreatePayload` in `requests.ts`) before `mutateAsync`.
- Phone display vs API: use `src/lib/phone.ts` (`formatPhoneInput` for UI, `normalizePhone` for JSON).

## UI

**Where:** Tailwind classes on components; tokens in `src/index.css`; config in `tailwind.config.ts`.

**Rules:**

- Prefer existing `components/ui` primitives over new raw HTML controls.
- Icons: `lucide-react`.
- Role labels in UI may differ from `UserRole` strings (e.g. “Dispetcher”).

## TypeScript and lint

`tsconfig` disables strict unused checks in places; ESLint may not flag unused imports. Verify manually when removing code.
