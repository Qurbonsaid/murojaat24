# API contract (OpenAPI)

Machine-readable contract for the Murojaat24 backend. AI agents and developers should use this file—not copied endpoint lists in other docs—when adding or changing `src/lib/api/*` hooks.

## Files

| File | Purpose |
| --- | --- |
| `openapi.json` | Pinned OpenAPI 3.0 spec (committed) |
| `refresh-openapi.sh` | Re-download spec from staging |

## Source URL

- **Staging spec:** https://api-staging.aqllishahar-termizsh.uz/docs/json
- **Staging API base:** https://api-staging.aqllishahar-termizsh.uz
- **Swagger UI:** https://api-staging.aqllishahar-termizsh.uz/docs

## Refresh the spec

When the backend adds or changes routes:

```bash
./docs/api/refresh-openapi.sh
```

Commit `openapi.json` in the same PR as frontend API work when the contract changed.

## Frontend base URL

The SPA reads the API host from `VITE_BASE_URL` (`src/lib/api/client.ts`). Typical values:

| Environment | `VITE_BASE_URL` |
| --- | --- |
| Local | `http://localhost:8080` (or your backend port) |
| Staging | `https://api-staging.aqllishahar-termizsh.uz` |
| Production | Set per deployment (not stored in this repo) |

The OpenAPI `servers` entry is relative (`/`); always combine paths with `VITE_BASE_URL`, not the spec alone.

## Auth and envelope (summary)

- **Staff:** cookie `access_token` (httpOnly JWT). All `apiRequest` calls use `credentials: "include"`.
- **Response:** `{ success, data, message?, pagination? }` on success; `success: false` or non-OK HTTP → `ApiError`.
- **Roles:** `admin`, `manager`, `dispatcher`, `operator`, `specialist` (see spec tags and descriptions).

Full hook patterns: `src/lib/api/README.md`, `docs/architecture/conventions.md`.

## OpenAPI tags (navigation)

| Tag | Typical frontend area |
| --- | --- |
| `Auth` | `src/lib/api/auth.ts`, login, profile |
| `Users` | `src/lib/api/users.ts`, admin/manager user screens |
| `Organizations` | `src/lib/api/organizations.ts`, settings |
| `Requests`, `Requests - Staff`, `Requests - Public` | `src/lib/api/requests.ts`, operator/citizen flows |
| `Assignments` | Dispatcher/specialist (not wired yet) |
| `Statistics` | `src/lib/api/statistics.ts` — admin `StatisticsSection` |
| `Uploads` | `src/lib/api/uploads.ts`, profile avatar |

## Agent task template

```
Implement <feature> per docs/api/openapi.json:
- Paths: <e.g. POST /api/assignments/, GET /api/requests/>
- Auth: cookie session
- Hooks in src/lib/api/<domain>.ts, TanStack Query keys [...]
- Update colocated README.md
```
