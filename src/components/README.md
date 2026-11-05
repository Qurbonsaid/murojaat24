# Shared workflow components

## Request review and details

`ReviewModal.tsx` loads the selected request through `useRequest` and displays the initial problem and photos, citizen, address, assigned specialist, completion report and photos, citizen signature, and timeline. Images support full-size preview.

Manager review uses the default mode with status-dependent review actions. The admin appeals list uses `readOnly` mode for every request status: the title describes request details, and verification, rejection, and wrong-organization return controls are hidden. Loading and API errors use the same handling in both modes.

Feature entry points: `src/pages/manager-dashboard/README.md` and `src/modules/ecosystem/pages/murojaat24/README.md`.
