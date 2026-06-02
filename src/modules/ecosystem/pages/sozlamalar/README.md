# Ecosystem settings (Sozlamalar)

Admin settings sections inside `SozlamalarPage.tsx`, routed under `/ecosystem/settings/*`. Section resolver switches UI by pathname.

## Routes

| Path                                                           | Section                                                                                           |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `/ecosystem/settings/leadership`                               | Governance grouping                                                                               |
| `/ecosystem/settings/organizations`                            | Organization CRUD                                                                                 |
| `/ecosystem/settings/templates`                                | SMS templates (local); hidden from ecosystem sidebar (`moduleKind: coming-soon` in menu)          |
| `/ecosystem/settings/general`                                  | General toggles/inputs (local); hidden from ecosystem sidebar (`moduleKind: coming-soon` in menu) |
| `/ecosystem/settings/object-types`, `call-types`, `work-hours` | Coming soon placeholders                                                                          |

File: `src/modules/ecosystem/pages/sozlamalar/SozlamalarPage.tsx`.
