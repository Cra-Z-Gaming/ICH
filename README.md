# VUS Chat Hub

VUS Chat Hub is a separate chat app with its own Firebase project and a hub catalog loaded from VUS apps.json.

## Setup

1. Configure Firebase in js/core/firebase-config.js.
2. Paste database.rules.json into Firebase Realtime Database Rules and publish it.
3. Host the repository and open index.html.

The app uses username and password sign-in. The VUS catalog is loaded at runtime from the VUS repository.
