# Profile management

API-backed staff profile editor: first name, last name, avatar. Shared across roles; shell (sidebar/layout) depends on role and route.

## User-facing behavior

User opens profile from dashboard profile menu or specialist profile tab. Edits name and avatar image, saves to backend, sees updated name/avatar in menus without full reload.

## Entry points

| Route | Layout |
| --- | --- |
| `/profile` | Role sidebar on operator/dispatcher/manager; standalone for specialist |
| `/ecosystem/profile` | `Profile` with `embedded` inside `EcosystemLayout` (admin) |

| File | Role |
| --- | --- |
| `src/pages/profile/Profile.tsx` | Main form |
| `src/components/UserProfileMenu.tsx` | Navigation from dashboards |
| `src/components/specialist/ProfileTab.tsx` | Link to `/profile` |
| `useUpdateProfile` | `src/lib/api/auth.ts` |

## Data flow

Form → `useUpdateProfile` → `PUT /api/auth/profile` → update `["auth", "me"]` → invalidate `["users"]`.

Admin hitting `/profile` is redirected to `/ecosystem/profile` so the ecosystem sidebar stays visible.

## Roles

All authenticated roles. Public landing `Header` does not expose profile (employees use login first).

## Edge cases

- Avatar: file picker, max 5MB, stored as data URL string in payload; clear sends `null`.
- Save disabled until dirty or while mutation pending.
- Image type validation on client.

## Related docs

- Auth hooks: `src/lib/api/README.md`
- Role route table: `docs/roles/*.md`
