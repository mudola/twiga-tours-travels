---
name: Authentication architecture
description: The public traveller experience and the separate admin CMS use different authentication transports.
---

Public web users authenticate through Replit-managed Clerk with same-origin session cookies; browser API calls must not attach Clerk bearer tokens. The admin CMS uses its existing JWT bearer flow independently.

**Why:** Clerk's web session model and the admin CMS's staff authorization model have different security and routing needs; combining them would make both harder to reason about.

**How to apply:** Keep public user-facing auth inside ClerkProvider and use Clerk middleware for protected public API routes. Keep `/admin` authentication on the admin JWT middleware and never replace it with browser Clerk token handling.