# Termo24 admin module

Admin views inside the ecosystem for Termo24: dashboard summary, statistics, and staff user management. Routed under `/ecosystem/termo24/*`; section chosen by pathname in `termo24/Termo24ModulePage.tsx`.

## Entry points

| Route suffix | Section component |
| ----------------------- | ----------------------------------------------------- |
| `/ecosystem/termo24` | Dashboard in `Termo24ModulePage.tsx` (this folder) |
| `.../map` | `MapSection.tsx` |
| `.../devices` | `DevicesSection.tsx` |

Modals: `src/components/EditDeviceModal.tsx`.
API: `src/lib/api/termo24.ts`.

---

## Map (`map`)

Map view in `MapSection.tsx` backed by `useTermo24Devices` → `GET /api/termo24/` and
row detail via `DeviceDetailModal` → `useTermo24Device` → `GET /api/termo24/:id` (`src/lib/api/termo24.ts`).

## Devices list (`devices`)

Paginated devices table in `DevicesSection.tsx` backed by
`useTermo24Devices` → `GET /api/termo24/` and row detail via
`DeviceDetailModal` → `useTermo24Device` → `GET /api/termo24/:id` (`src/lib/api/termo24.ts`).
