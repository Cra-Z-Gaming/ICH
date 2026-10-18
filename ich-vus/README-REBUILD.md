# ICH + VUS rebuild

This is a separate, local-first rebuild of ICH. It uses ICH as the main interface and reads the complete VUS catalog from `Cra-Z-Gaming/VUS` `apps.json` at runtime.

## Before running

1. Create a **new** Firebase project and Realtime Database. Do not point this app at the existing ICH database.
2. Put that new project's web configuration in `js/core/firebase-config.js` (a placeholder is included; `firebase-config.example.js` is the shareable template).
3. Add the development/deployment host to Firebase Authentication's authorized domains.
4. Write new Realtime Database rules for this app before enabling public writes.

## Privacy direction

The rebuild is being converted to account-only moderation: no IP lookup, no VPN/proxy check, and no IP-ban records. Existing legacy IP endpoint files are not part of the target deployment and will be removed as the terms/moderation flow is replaced.

## Catalog

`js/games/game-hubs.js` fetches all valid HTTPS entries in the `apps`, `hubs`, `tools`, and `links` arrays from VUS `apps.json`. It treats the remote catalog strictly as data and preserves ICH's safe text rendering.
