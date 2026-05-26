# Specialist

**Mobile-width task execution** on `/specialist-mobile`: active tasks, detail modal, multi-step completion, history/stats/profile tabs. Task list, accept, start, history, completion, and stats are **API-backed**.

## Identifier

- Code value: `specialist`
- Post-login home: `/specialist-mobile` (after optional PWA gate on `/login`)
- Demo account (shown on login card): `+998 90 123 45 72`, password `murojaat24`

## Routes

| Path | Component | Gate |
| --- | --- | --- |
| `/login` | `Login` → `MobileQRCode` when session is specialist and install wall active | public login; specialist session shows install gate |
| `/specialist-mobile` | `SpecialistMobile` | `specialist`, `admin` |
| `/profile` | `Profile` (standalone layout from profile tab) | all staff roles |

`ProtectedRoute` on `/specialist-mobile` checks role only — it does **not** enforce PWA install or device permissions. A logged-in specialist can open `/specialist-mobile` directly and skip `MobileQRCode`.

## Login and PWA install gate

After a successful specialist login (or when `/login` loads with an existing specialist session), `Login.tsx` normally renders `MobileQRCode` instead of redirecting immediately.

| Step | Desktop (`!isMobile`) | Mobile |
| --- | --- | --- |
| 1 | QR code pointing at `/login` | Prompt to install PWA (`beforeinstallprompt`) |
| 2 | — | Open app in **standalone** mode (home screen / installed app) |
| 3 | — | Grant notifications, camera, and location |
| 4 | — | `localStorage` key `specialist_pwa_permissions_granted` → redirect `/specialist-mobile` |

Helpers: `src/lib/pwa.ts`, UI: `src/components/specialist/MobileQRCode.tsx`. Service worker `/sw.js` registers from `MobileQRCode` when `shouldEnableSpecialistPwa` is true (specialist + viewport ≤767px + wall not bypassed). Logout calls `unregisterSpecialistPwa()` from `auth.ts`.

**Development bypass:** `shouldBypassSpecialistInstallWall()` is true when `import.meta.env.DEV` or `VITE_BYPASS_SPECIALIST_PWA_WALL=true`. Specialists then redirect straight to `/specialist-mobile` (no QR/install UI). See `src/components/specialist/README.md`.

## Actions

- Login, logout (`ProfileTab`, `MobileQRCode`).
- Update profile on `/profile` (`useUpdateProfile`, `useUploadAvatar`).
- View / accept / start tasks — `useMyCurrentAssignments`, `useAcceptAssignment`, `useStartAssignment` in `SpecialistMobile.tsx`.
- Complete tasks — `TaskCompletionModal` → `POST /api/requests/:id/images`, `PUT /api/requests/:id/complete` (`useSubmitRequestCompletion`).
- Call citizen (`tel:`), open Google Maps from task detail.
- Completion: photo upload, report, canvas signature → `useSubmitRequestCompletion`.
- History tab — API with infinite scroll; period `Select` does not filter rows.
- Stats tab — static demo data.
- Change-password modal — client validation + Sonner toast only (not `useResetPassword`).

## Data read / write

| Concern | Source |
| --- | --- |
| Session, profile | API — `useCurrentUser`, `useUpdateProfile`, `useUploadAvatar` |
| Active tasks, accept, start | API — `assignments.ts` (`my/current`, accept, start) |
| History | API — `useMyAssignmentHistory` in `HistoryTab` |
| Stats | API — `useSpecialistDetailStatistics` (`GET /api/statistics/specialist/{id}`); monthly chart via `GET /api/statistics/monthly` |
| Task completion evidence | API — `useSubmitRequestCompletion` in `requests.ts` |

Admin statistics hook `useSpecialistStatistics` (`GET /api/statistics/specialists`) is for the ecosystem statistics page, not the specialist mobile stats tab.

## Permission checks

- Route gate: `src/modules/murojaat24/config/routes.tsx`.
- PWA + permissions: `/login` + `MobileQRCode` only (bypassable in dev).
- `admin` may open `/specialist-mobile` for support or QA.

## Feature docs

| Topic | README |
| --- | --- |
| Page shell, tabs, API tasks | `src/pages/specialist-mobile/README.md` |
| Tabs, modals, PWA gate UI | `src/components/specialist/README.md` |
| Auth / redirects | `src/lib/api/README.md` |
| Profile | `src/pages/profile/README.md` |
| Mock vs API inventory | `docs/architecture/implementation-gaps.md` |

## Remaining integration

1. Optional: wire history period filter to API date query params if the backend adds them.
