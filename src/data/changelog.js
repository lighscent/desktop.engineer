export default [
  {
  version: '0.1.9',
  date: '2026-08-17',
  title: { en: 'Unbiased random generation (CWE-327)', fr: 'Génération aléatoire sans biais (CWE-327)' },
  changes: {
    en: [
      'Fixed biased random generation in the SSL/password tools (CWE-327) by switching to crypto-random-string — rejection sampling, uniform distribution',
      'CodeQL now scans the master branch (push and pull requests)',
    ],
    fr: [
      'Correction du biais de génération aléatoire dans les outils SSL/mot de passe (CWE-327) via crypto-random-string — échantillonnage par rejet, distribution uniforme',
      'CodeQL analyse désormais la branche master (push et pull requests)',
    ],
  },
},
  {
  version: '0.1.8',
  date: '2026-08-16',
  title: { en: 'SEO overhaul, static pages & security policy', fr: 'Refonte SEO, pages statiques & politique de sécurité' },
  changes: {
    en: [
      'Major SEO overhaul: keyword-rich titles/descriptions, JSON-LD structured data (WebSite, WebApplication, BreadcrumbList) and canonical URLs on every page',
      'Build now generates static per-route HTML shells (English) so search engines see unique, indexable content for each tool page',
      'Fixed the Vercel SPA rewrite to serve the static pages; PWA manifest updated to English',
      'New SECURITY.md security policy — vulnerabilities are reported privately via GitHub Security Advisory',
      'Added contributing guidelines and improved issue/PR templates',
    ],
    fr: [
      'Refonte SEO majeure : titres/descriptions riches en mots-clés, données structurées JSON-LD (WebSite, WebApplication, BreadcrumbList) et URLs canoniques sur chaque page',
      'Le build génère désormais des coquilles HTML statiques par route (anglais) pour un contenu unique et indexable sur chaque outil',
      'Rewrite Vercel corrigé pour servir les pages statiques ; manifest PWA traduit en anglais',
      'Nouvelle politique de sécurité SECURITY.md — les vulnérabilités se signalent en privé via GitHub Security Advisory',
      'Ajout des guidelines de contribution et amélioration des templates issue/PR',
    ],
  },
},
  {
  version: '0.1.7',
  date: '2026-08-16',
  title: { en: 'New tool: Self-Signed SSL Certificate Generator', fr: 'Nouvel outil : Générateur de Certificat SSL Auto-signé' },
  changes: {
    en: [
      'New tool: Self-Signed SSL Certificate Generator — generate a .crt with encrypted (PBES2) and plaintext private keys'
    ],
    fr: [
      'Nouvel outil : Générateur de Certificat SSL Auto-signé — génère un .crt avec clés privées chiffrée (PBES2) et non chiffrée'
    ],
  },
},
  {
    version: '0.1.6',
    date: '2026-08-15',
    title: { en: 'Security hardening & dependency refresh', fr: 'Durcissement sécurité & mise à jour des dépendances' },
    changes: {
      en: [
        'Updated README: clarified privacy, offline and network usage guarantees',
        'Updated some dependencies to latest secure versions',
        'Patched 4 security advisories: CVE-2026-13676, CVE-2026-59869, CVE-2026-13149, CVE-2026-67214',
        'Restored compatibility with js-yaml 5 ESM exports in the JSON/YAML tools',
        'Pinned Node.js to v24 minimum',
      ],
      fr: [
        'README mis à jour : garanties de confidentialité, hors ligne et usage réseau clarifiées',
        'Certaines dépendances mises à jour vers leurs dernières versions sécurisées',
        '4 avis de sécurité corrigés : CVE-2026-13676, CVE-2026-59869, CVE-2026-13149, CVE-2026-67214',
        'Compatibilité rétablie avec les exports ESM de js-yaml 5 dans les outils JSON/YAML',
        'Node.js fixé à v24 minimum',
      ],
    },
  },
  {
    version: '0.1.5',
    date: '2026-06-17',
    title: { en: 'Security update', fr: 'Update de sécurité' },
    changes: {
      en: [
        'Updated js-yaml to ^4.2.0 and vite to ^8.0.16',
      ],
      fr: [
        'Mise à jour js-yaml ^4.2.0 et vite ^8.0.16',
      ],
    },
  },
  {
    version: '0.1.4',
    date: '2026-05-31',
    title: { en: 'Categories, IP Lookup, URL restructure & cookie hardening', fr: 'Catégories, Recherche IP, nouvelles URLs & cookies' },
    changes: {
      en: [
        'New tool: IP Lookup — geolocation, ASN, proxy detection via freeipapi.com',
        'Reorganized tools into 5 categories: SSH, Security, Network, Server, Data',
        'View files restructured into category folders',
        'URLs now match folders: /ssh/, /security/, /network/, /server/, /data/',
        'Cookie consent fully enforced — no localStorage writes without acceptance',
        'Starring tools blocked until cookies are accepted',
        'Added auto-release GitHub workflow on version change',
        'Updated robots.txt and sitemap.xml with all routes',
        'Added DevGlobe badge to README',
        'Added changelog page',
      ],
      fr: [
        'Nouvel outil : Recherche IP — géolocalisation, ASN, détection proxy via freeipapi.com',
        'Réorganisation des outils en 5 catégories : SSH, Sécurité, Réseau, Serveur, Données',
        'Fichiers des outils restructurés en dossiers par catégorie',
        'Nouvelles URLs reflétant les dossiers : /ssh/, /security/, /network/, /server/, /data/',
        'Consentement cookie strict — rien dans localStorage sans accord',
        'Favoris bloqués sans acceptation des cookies',
        'Ajout d\'un workflow GitHub pour release automatique',
        'Mise à jour du robots.txt et sitemap.xml',
        'Ajout du badge DevGlobe dans le README',
        'Ajout de la page des versions',
      ],
    },
  },
]
