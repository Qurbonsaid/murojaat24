# Documentation index

Stable docs live here; **feature behavior** lives in `README.md` files next to the code. Start at [`AGENTS.md`](../AGENTS.md) for onboarding.

## Update rules

1. Change code under `src/<feature>/` → update that folder’s `README.md` in the same change.
2. Change role permissions or role-wide routes → `docs/roles/`.
3. Change app structure, routing shape, or global patterns → `docs/architecture/`.
4. Change onboarding facts → `AGENTS.md`.
5. No line-number citations; point to file paths. Do not copy types or endpoint lists into docs.

## Architecture (`docs/architecture/`)

| File | Contents |
| --- | --- |
| `overview.md` | System shape, API vs mock split |
| `project-structure.md` | Folder map |
| `routing.md` | Route tables and role gates |
| `conventions.md` | API, auth, state, forms, UI rules |
| `gotchas.md` | Traps and mismatches |
| `implementation-gaps.md` | Mock vs API inventory, missing features, UI-only actions |

## Roles (`docs/roles/`)

| File | Role |
| --- | --- |
| `admin.md` | Ecosystem + Murojaat24 admin |
| `operator.md` | Intake dashboard |
| `dispatcher.md` | Assignment dashboard |
| `manager.md` | Review dashboard |
| `specialist.md` | Mobile tasks |

Each role doc links to colocated feature READMEs — not duplicated workflows.

## Feature READMEs (`src/**/README.md`)

See the table in [`AGENTS.md`](../AGENTS.md#feature-docs).
