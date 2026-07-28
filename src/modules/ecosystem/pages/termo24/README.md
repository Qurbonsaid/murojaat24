# Termo24 admin module

Admin views inside the ecosystem for Termo24: dashboard summary, statistics, and staff user management. Routed under `/ecosystem/termo24/*`; section chosen by pathname in `termo24/Termo24ModulePage.tsx`.

## Entry points

| Route suffix | Section component |
| ----------------------- | ----------------------------------------------------- |
| `/ecosystem/termo24` | Dashboard in `Termo24ModulePage.tsx` (this folder) |
| `.../map` | `MapSection.tsx` |
| `.../devices` | `DevicesSection.tsx` |

Modals: `src/components/EditTermo24DeviceModal.tsx`.
API: `src/lib/api/termo24.ts`.

---

## Map (`map`)

Map view in `MapSection.tsx` backed by `useTermo24Devices` → `GET /api/termo24/all` and
rendered with the shared React Leaflet map component in `src/components/termo24/Termo24Map.tsx`.
The page now centers on the geometric center of all valid device coordinates, uses the single device coordinate directly when only one device is available, and falls back to Termiz city when no valid coordinates exist.
The page view stays passive, while the modal uses the same shared component in selection mode so users can click to place a pin or use the location button to drop a pin at the browser's current position.
Device popups now show status, input/output temperatures, and the last update timestamp.

## Devices list (`devices`)

Paginated devices table in `DevicesSection.tsx` backed by
`useTermo24Devices` → `GET /api/termo24/all` and row editing via
`EditTermo24DeviceModal`.
