# Settings (Sozlamalar)

Admin settings sections inside `SozlamalarPage.tsx`, routed under `/ecosystem/sozlamalar/*`. Section resolver switches UI by pathname.

## Entry points

| Route | Section |
| --- | --- |
| `/ecosystem/sozlamalar/rahbariyat` | Governance grouping |
| `/ecosystem/sozlamalar/tashkilotlar` | Organization CRUD |
| `/ecosystem/sozlamalar/shablonlar` | SMS templates (local) |
| `/ecosystem/sozlamalar/umumiy` | General toggles/inputs (local) |
| `obyekt-turi`, `chaqiruv-turi`, `ish-vaqtlari` | In-page coming-soon card (menu may point to `ComingSoonPage` for some) |

File: `src/modules/ecosystem/pages/sozlamalar/SozlamalarPage.tsx`.

---

## Organizations and governance

Lists organizations from `useOrganizations`, groups by governance for rahbariyat view, supports search, create, edit, delete via `src/lib/api/organizations.ts`.

**Edge cases:** loading/error/empty states; save disabled until name and governance filled; failures show destructive toast.

---

## Notification templates and general settings

**Shablonlar:** static `smsTemplates` cards; edit buttons without handlers.

**Umumiy:** switches and inputs with default values; “Saqlash” without submit handler — changes are not persisted.

**API:** none for these sections.

---

## Roles

`admin` only (ecosystem parent gate).

## Related docs

- Ecosystem shell: `src/modules/ecosystem/README.md`
- API hooks: `src/lib/api/organizations.ts`
