<div align="center">
  <h1>desktop.engineer</h1>
  <p><em>The ultimate offline-first toolkit for system engineers, developers, and sysadmins.</em></p>

  [![Vue.js](https://img.shields.io/badge/Vue%203-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)](#)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

  <a href="https://devglobe.app/projects/desktop-engineer?utm_source=badge&utm_medium=embed" target="_blank" rel="noopener">
    <img src="https://devglobe.app/badges/featured-on-devglobe-dark.svg" alt="Featured on DevGlobe" width="250" height="54" />
  </a>
</div>

---

## Why use this toolkit?

When managing server infrastructure, security and speed are critical. **desktop.engineer** is built with strict privacy and utility in mind:

- **Zero-Trust & 100% Local:** No backend, no analytics, no tracking. Everything (including SSH key and password generation) happens entirely within your browser — the only exception is the IP Lookup tool, which queries the free [freeipapi.com](https://freeipapi.com) API (no API key, no data stored).
- **Offline Ready (PWA):** Install it once, use it anywhere. Thanks to service workers, the toolkit remains fully functional even when you're stuck in a datacenter with no internet access — with the exception of IP Lookup, which requires a connection.
- **Bilingual:** Fully translated in English and French.

---

## The Tools

### SSH & Remote Access
- **[SSH Key Generator](https://desktop.engineer/ssh/ssh-key-generator)** — Generate secure RSA/ECDSA keys directly in the browser.
- **[Public Key Inspector](https://desktop.engineer/ssh/public-key-analyzer)** — Analyze algorithms, bit size, and extract MD5/SHA-256 fingerprints.
- **[~/.ssh/config Generator](https://desktop.engineer/ssh/ssh-config-generator)** — Clean, multi-host SSH config builder.
- **[OpenSSH ↔ PuTTY Converter](https://desktop.engineer/ssh/key-format-converter)** — Quick conversion instructions and formatting.
- **[SSH Install Assistant](https://desktop.engineer/ssh/ssh-install-assistant)** — Custom `ssh-copy-id` command generator.
- **[chmod Cheat Sheet](https://desktop.engineer/ssh/chmod-cheat-sheet)** — The ultimate reference for SSH file permissions.

### Security & Encryption
- **[Password Generator](https://desktop.engineer/security/password-generator)** — Create strong, CLI-safe passwords.
- **[Application Keys (.env)](https://desktop.engineer/security/env-key-generator)** — Generate secure random strings for `JWT_SECRET` or `APP_KEY`.
- **[Checksum Verifier](https://desktop.engineer/security/hash-checker)** — Fast local file hashing for MD5, SHA-1, SHA-256, and SHA-512.

### Network
- **[IP Lookup](https://desktop.engineer/network/ip-info)** — Geolocation, ASN, proxy detection and more via the free freeipapi.com API (the only tool that makes a network call).
- **[CIDR Subnet Calculator](https://desktop.engineer/network/subnet-calculator)** — Instantly calculate network, broadcast, and subnet masks.

### Server
- **[Nginx Generator](https://desktop.engineer/server/nginx-generator)** — Build solid configurations for reverse proxies, HTTPS, PHP, or static sites.
- **[Self-Signed SSL Certificate Generator](https://desktop.engineer/server/ssl-cert-generator)** — Generate a local `.crt` with encrypted and plaintext keys in seconds.
- **[Cron Generator](https://desktop.engineer/server/cron-generator)** — Visual and interactive crontab expression builder.

### Data & Dev Tools
- **[JSON / YAML / CSV Converter](https://desktop.engineer/data/format-converter)** — Seamless universal format conversion.
- **[JSON / YAML Linter](https://desktop.engineer/data/linter-formatter)** — Quick syntax validation and formatting.
- **[Swiss Knife Encoder/Decoder](https://desktop.engineer/data/swiss-knife-encoder)** — Instantly toggle between URL, Base64, HTML entities, and Hex.

---

## Tech Stack

This project is engineered for speed and simplicity, relying heavily on modern web standards and native browser APIs:

- **Framework:** Vue 3 + Vue Router 5
- **Styling:** Tailwind CSS v3 + DaisyUI v4
- **Build Tool:** Vite 8
- **Core Libraries:** `js-yaml`, `spark-md5`, `hash.js`, `@peculiar/x509`
- **PWA Integration:** `vite-plugin-pwa` (Full offline support via Service Workers)

---

## Development

Want to run it locally or contribute? It's incredibly fast to set up.

**Requirements:** [Node.js](https://nodejs.org) >= 24 and [pnpm](https://pnpm.io).

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev 

# Build for production (outputs to dist/)
# Also generates PWA icons + static per-route HTML shells for SEO
pnpm build 

# Preview the production build locally
pnpm preview
```

---

## Internationalization (i18n)

The app currently supports French (fr) and English (en).

- The user's language choice is persisted in localStorage under the key de_locale.
- Translation files are located in src/i18n/locales/{fr,en}.js.
- Usage example: t('namespace.key', { param: val }).

*Pull requests to add new languages are always welcome!*

---

## Contributing

Contributions are welcome! Please read our guidelines first:

- [Contributing Guidelines](.github/CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md) — for reporting security vulnerabilities
- [Support](.github/SUPPORT.md) — where to get help

Found a bug or want a new tool? Open an [issue](https://github.com/lighscent/desktop.engineer/issues/new/choose) using the appropriate template.

---

## License

This project is licensed under the [MIT License](LICENSE).