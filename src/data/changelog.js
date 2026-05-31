export default [
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
