# Operator appeal intake

Phone intake form backed by `POST /api/requests/operator`, plus today's appeals list via `GET /api/requests/`.

## User-facing behavior

**New appeal** (`/operator-dashboard/new`): operator enters citizen details, picks an organization from the API, saves, sees a success toast with the server `requestNumber`, form resets.

**Appeals list** (`/operator-dashboard/list`): static KPI cards; table loads today's appeals via `useRequests` (`startDate`/`endDate` = today, `organization` query param omitted for operator role). Organization names resolved from `useOrganizations`. Row **Eye** opens `OperatorRequestDetailModal` → `useRequest` → `GET /api/requests/:id`; appeal photos open full-size in `ImagePreviewDialog` on click.

`/operator-dashboard` redirects to `new`.

## Entry points

| Route | File |
| --- | --- |
| `/operator-dashboard/*` | `OperatorDashboardRoutes.tsx` (nested router) |
| `/operator-dashboard/new` | `OperatorNewAppeal.tsx` |
| `/operator-dashboard/list` | `OperatorAppealsList.tsx` |
| Layout | `OperatorLayout.tsx` |
| Sidebar | `src/components/OperatorSidebar.tsx` |

Organizations for the combobox: `useOrganizations()` → `GET /api/organizations` (organization `_id` sent in the create payload).

## Data flow

```mermaid
sequenceDiagram
  participant Form as OperatorNewAppeal
  participant Orgs as useOrganizations
  participant Hook as useCreateOperatorRequest
  participant API as POST_operator

  Form->>Orgs: GET /api/organizations
  Form->>Form: zod validate + toOperatorCreatePayload
  Form->>Hook: mutateAsync
  Hook->>API: citizenName, citizenPhone, organization, description, address.full
  API-->>Form: requestNumber
  Form->>Form: toast + reset
```

```mermaid
sequenceDiagram
  participant List as OperatorAppealsList
  participant Hook as useRequests
  participant API as GET_requests

  List->>Hook: page, limit, today dates, role operator
  Hook->>API: GET /api/requests (no organization param)
  API-->>List: data + pagination
```

```mermaid
sequenceDiagram
  participant List as OperatorAppealsList
  participant Modal as OperatorRequestDetailModal
  participant Hook as useRequest
  participant API as GET_request_by_id

  List->>Modal: request _id, open
  Modal->>Hook: enabled when open
  Hook->>API: GET /api/requests/:id
  API-->>Modal: citizen, address, timeline, images
```

Payload omits `images`, `priority`, address sub-fields, and coordinates.

Phone is displayed as `+998 90 123 45 67` and normalized to `+998901234567` before POST (`src/lib/phone.ts`).

Auth: `useCurrentUser` for sidebar/profile menu; create requires cookie session (`operator` or `admin`).

## Roles

`operator`, `admin`.

## Sidebar navigation

`OperatorSidebar` links to `/operator-dashboard/new` (Yangi murojaat) and `/operator-dashboard/list` (Murojaatlar ro'yxati). Admin statistics live under `/ecosystem/murojaat24/statistika`, not in the operator shell.

## Edge cases

- Description min 20 / max 1000 characters (matches backend validation).
- Organization combobox disabled while org list loads or on fetch error.
- `ApiError` message shown in destructive toast on submit failure.

## Related docs

- API hooks: `src/lib/api/requests.ts`, `src/lib/api/README.md`
- Role: `docs/roles/operator.md`
- Gotchas: `docs/architecture/gotchas.md`
