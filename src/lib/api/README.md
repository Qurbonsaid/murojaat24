# Authentication (API & session)

Cookie-based employee auth: login, current user, logout, profile update, and forgot-password hooks. Route guards and login UI live outside this folder but depend on these hooks.

## User-facing behavior

Staff sign in with phone + password on `/login`. Successful login redirects by role. Protected screens load only after `GET /api/auth/me` succeeds. Profile dropdowns offer logout and profile navigation.

## Entry points

| Concern | Path |
| --- | --- |
| Hooks & roles | `auth.ts` |
| File uploads | `uploads.ts` |
| HTTP transport | `client.ts` |
| Login page | `src/pages/login/Login.tsx` |
| Route guard | `src/components/ProtectedRoute.tsx` |
| Profile update | `src/pages/profile/Profile.tsx` (see `src/pages/profile/README.md`) |
| Route list | `src/modules/murojaat24/config/routes.tsx` |

## Data flow

```mermaid
sequenceDiagram
  participant UI as Login
  participant Hook as useLogin
  participant API as apiRequest
  participant Cache as React Query

  UI->>Hook: phone, password
  Hook->>API: POST /api/auth/login
  API-->>Hook: CurrentUser
  Hook->>Cache: set auth/me
  UI->>UI: navigate via getRoleRedirectPath
```

`ProtectedRoute` uses `useCurrentUser` before rendering children. Non-OK session → `/login` or `Forbidden`.

## Roles

All five roles. Redirect targets defined in `getRoleRedirectPath` in `auth.ts`.

## Edge cases

- Authenticated user visiting `/login` is redirected away.
- Login errors show destructive toast; `ApiError` message preferred when available.
- Logout clears `["auth", "me"]` and legacy `localStorage` keys.
- Forgot-password hooks exist in `auth.ts`; wiring on UI may be partial — verify `Login.tsx` before documenting new flows.

## Related docs

- Profile page (avatar upload): `src/pages/profile/README.md`
- Avatar upload: `useUploadAvatar` in `uploads.ts` → `POST /api/uploads/avatar`; profile save uses URL via `useUpdateProfile` in `auth.ts`
- Conventions: `docs/architecture/conventions.md`
