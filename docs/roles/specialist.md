# Specialist

**Mobile-width task execution**: active tasks, detail modal, multi-step completion, history/stats/profile tabs. Task lifecycle is local except auth/profile API calls.

## Identifier

- Code value: `specialist`
- Post-login home: `/specialist-mobile`

## Routes

| Path | Component | Gate |
| --- | --- | --- |
| `/specialist-mobile` | `SpecialistMobile` | `specialist`, `admin` |
| `/profile` | `Profile` (standalone layout from profile tab) | all staff roles |

## Actions

- Login, logout (from profile tab), update profile on `Profile` page.
- View/accept/complete tasks (local state).
- Call citizen (`tel:`), open Google Maps from task detail.
- Completion flow: photo, report text, canvas signature → remove task locally.
- History, stats, profile tab (mostly static local data).
- Change-password modal validates locally — no API wired in current code.

## Data read / write

**Reads:** `CurrentUser`; local tasks, history, stats.

**Writes:** auth/profile API; task and completion state local.

## Feature docs

- Mobile workflow: `src/components/specialist/README.md`
- Auth: `src/lib/api/README.md`
- Profile: `src/pages/profile/README.md`

## Permission checks

- Route gate in `murojaat24/config/routes.tsx`.
- `SpecialistMobile` displays name/avatar from `useCurrentUser`.
