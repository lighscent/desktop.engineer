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

- **Zero-Trust & 100% Local:** No backend, no API calls, no analytics. Everything (including SSH key and password generation) happens entirely within your browser. 
- **Offline Ready (PWA):** Install it once, use it anywhere. Thanks to service workers, the toolkit remains fully functional even when you're stuck in a datacenter with no internet access.
- **Bilingual:** Fully translated in English and French.

---

## The Tools

### SSH & Access Management
- **[SSH Key Generator](https://desktop.engineer/ssh-key-generator)** — Generate secure RSA/ECDSA keys directly in the browser.
- **[Public Key Inspector](https://desktop.engineer/public-key-analyzer)** — Analyze algorithms, bit size, and extract MD5/SHA-256 fingerprints.
- **[~/.ssh/config Generator](https://desktop.engineer/ssh-config-generator)** — Clean, multi-host SSH config builder.
- **[OpenSSH ↔ PuTTY Converter](https://desktop.engineer/key-format-converter)** — Quick conversion instructions and formatting.
- **[SSH Install Assistant](https://desktop.engineer/ssh-install-assistant)** — Custom `ssh-copy-id` command generator.
- **[chmod Cheat Sheet](https://desktop.engineer/chmod-cheat-sheet)** — The ultimate reference for SSH file permissions.

### Security & Local Secrets
- **[Password Generator](https://desktop.engineer/password-generator)** — Create strong, CLI-safe passwords.
- **[Application Keys (.env)](https://desktop.engineer/env-key-generator)** — Generate secure random strings for `JWT_SECRET` or `APP_KEY`.
- **[Checksum Verifier](https://desktop.engineer/hash-checker)** — Fast local file hashing for MD5, SHA-1, SHA-256, and SHA-512.

### Network & Server Configs
- **[CIDR Subnet Calculator](https://desktop.engineer/subnet-calculator)** — Instantly calculate network, broadcast, and subnet masks.
- **[Nginx Generator](https://desktop.engineer/nginx-generator)** — Build solid configurations for reverse proxies, HTTPS, PHP, or static sites.
- **[Cron Generator](https://desktop.engineer/cron-generator)** — Visual and interactive crontab expression builder.

### Data Manipulation
- **[JSON / YAML / CSV Converter](https://desktop.engineer/format-converter)** — Seamless universal format conversion.
- **[JSON / YAML Linter](https://desktop.engineer/linter-formatter)** — Quick syntax validation and formatting.
- **[Swiss Knife Encoder/Decoder](https://desktop.engineer/swiss-knife-encoder)** — Instantly toggle between URL, Base64, HTML entities, and Hex.

---

## Tech Stack

This project is engineered for speed and simplicity, relying heavily on modern web standards and native browser APIs:

- **Framework:** Vue 3 + Vue Router 4
- **Styling:** Tailwind CSS v3 + DaisyUI v4
- **Build Tool:** Vite 8
- **Core Libraries:** `js-yaml`, `spark-md5`, `hash.js`
- **PWA Integration:** `vite-plugin-pwa` (Full offline support via Service Workers)

---

## Development

Want to run it locally or contribute? It's incredibly fast to set up.

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev 

# Build for production (outputs to dist/)
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

## License

This project is licensed under the [MIT License](LICENSE).