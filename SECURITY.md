# Security Policy

## Supported Versions

Only the latest deployed version is supported. Fixes ship with the next deployment.

## Reporting a Vulnerability

Report privately via GitHub: **https://github.com/lighscent/desktop.engineer/security/advisories/new**

Do not open a public issue for security bugs. Include the affected tool/URL, steps to reproduce, and impact. You'll get an acknowledgment within 5 business days.

## Scope

**In scope:** the client-side code (`src/`, `public/`, build pipeline, service worker).

**Out of scope:**
- Third-party services: [freeipapi.com](https://freeipapi.com) (IP Lookup), Google Fonts / Font Awesome CDNs
- User environments — this is a 100% client-side tool; we can't guarantee security on compromised devices

## Security model

- No backend, no server, no analytics — nothing leaves the browser (except IP Lookup → freeipapi.com)
- No secrets committed; no `.env` files, API keys, or tokens
- Randomness uses `crypto.getRandomValues()` / Web Crypto API
- localStorage is cookie-gated and never stores private keys or passwords

Thanks for helping keep desktop.engineer safe.