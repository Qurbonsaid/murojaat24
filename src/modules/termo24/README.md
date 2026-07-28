# Termo24 routes (config only)

This folder defines **standalone Termo24 routes** in `config/routes.tsx`: login, role dashboards, profile, and admin redirect. It does not contain page components.

## Where screens live

| Route area | Code |
| --- | --- |
| Login | `src/pages/login/Login.tsx` |
| Profile | `src/pages/profile/Profile.tsx` |
| Admin shell | `src/modules/ecosystem/` |

## Wiring

`src/App.tsx` maps `termo24Routes` and wraps non-public entries in `ProtectedRoute`. See `docs/architecture/routing.md`.
