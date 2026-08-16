const SITE = 'https://desktop.engineer'

const seoMap = {
  '/': { titleKey: 'home.title', descKey: 'home.subtitle', kind: 'home' },
  '/changelog': { titleKey: 'changelog.title', descKey: 'changelog.desc', kind: 'page' },
  '/ssh/ssh-key-generator': { titleKey: 'tools.sshKeyGenerator.title', descKey: 'tools.sshKeyGenerator.desc', kind: 'tool', catKey: 'ssh' },
  '/ssh/public-key-analyzer': { titleKey: 'tools.publicKeyAnalyzer.title', descKey: 'tools.publicKeyAnalyzer.desc', kind: 'tool', catKey: 'ssh' },
  '/ssh/ssh-config-generator': { titleKey: 'tools.sshConfigGenerator.title', descKey: 'tools.sshConfigGenerator.desc', kind: 'tool', catKey: 'ssh' },
  '/ssh/key-format-converter': { titleKey: 'tools.keyFormatConverter.title', descKey: 'tools.keyFormatConverter.desc', kind: 'tool', catKey: 'ssh' },
  '/ssh/ssh-install-assistant': { titleKey: 'tools.sshInstallAssistant.title', descKey: 'tools.sshInstallAssistant.desc', kind: 'tool', catKey: 'ssh' },
  '/ssh/chmod-cheat-sheet': { titleKey: 'tools.chmodCheatSheet.title', descKey: 'tools.chmodCheatSheet.desc', kind: 'tool', catKey: 'ssh' },
  '/security/password-generator': { titleKey: 'tools.passwordGenerator.title', descKey: 'tools.passwordGenerator.desc', kind: 'tool', catKey: 'securite' },
  '/security/env-key-generator': { titleKey: 'tools.envKeyGenerator.title', descKey: 'tools.envKeyGenerator.desc', kind: 'tool', catKey: 'securite' },
  '/security/hash-checker': { titleKey: 'tools.hashChecker.title', descKey: 'tools.hashChecker.desc', kind: 'tool', catKey: 'securite' },
  '/network/ip-info': { titleKey: 'tools.ipInfo.title', descKey: 'tools.ipInfo.desc', kind: 'tool', catKey: 'reseau' },
  '/network/subnet-calculator': { titleKey: 'tools.subnetCalculator.title', descKey: 'tools.subnetCalculator.desc', kind: 'tool', catKey: 'reseau' },
  '/server/nginx-generator': { titleKey: 'tools.nginxGenerator.title', descKey: 'tools.nginxGenerator.desc', kind: 'tool', catKey: 'serveur' },
  '/server/ssl-cert-generator': { titleKey: 'tools.sslCertGenerator.title', descKey: 'tools.sslCertGenerator.desc', kind: 'tool', catKey: 'serveur' },
  '/server/cron-generator': { titleKey: 'tools.cronGenerator.title', descKey: 'tools.cronGenerator.desc', kind: 'tool', catKey: 'serveur' },
  '/data/format-converter': { titleKey: 'tools.formatConverter.title', descKey: 'tools.formatConverter.desc', kind: 'tool', catKey: 'donnees' },
  '/data/linter-formatter': { titleKey: 'tools.linterFormatter.title', descKey: 'tools.linterFormatter.desc', kind: 'tool', catKey: 'donnees' },
  '/data/swiss-knife-encoder': { titleKey: 'tools.swissKnifeEncoder.title', descKey: 'tools.swissKnifeEncoder.desc', kind: 'tool', catKey: 'donnees' },
}

export function applySeo(path, t) {
  const meta = seoMap[path]
  if (!meta) return

  const title = meta.kind === 'home' ? t(meta.titleKey) : `${t(meta.titleKey)} — desktop.engineer`
  const desc = t(meta.descKey)
  const url = SITE + path
  const image = `${SITE}/pwa-512x512.png`

  document.title = title

  setMeta('description', desc)
  setMeta('og:title', title)
  setMeta('og:description', desc)
  setMeta('og:url', url)
  setMeta('og:image', image)
  setMeta('twitter:title', title)
  setMeta('twitter:description', desc)
  setMeta('twitter:image', image)

  const canon = document.querySelector('link[rel="canonical"]')
  if (canon) canon.setAttribute('href', url)

  setJsonLd(meta, path, t, desc)
}

function setMeta(prop, content) {
  const el = document.querySelector(`meta[property="${prop}"]`) || document.querySelector(`meta[name="${prop}"]`)
  if (el) el.setAttribute('content', content)
}

function setJsonLd(meta, path, t, desc) {
  const url = SITE + path
  const graphs = []

  if (meta.kind === 'home') {
    graphs.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'desktop.engineer',
      url: SITE + '/',
      description: desc,
      inLanguage: ['fr', 'en'],
    })
  } else {
    graphs.push(buildBreadcrumb(meta, path, t))
  }

  graphs.push({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: meta.kind === 'home' ? 'desktop.engineer' : t(meta.titleKey),
    url,
    description: desc,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    inLanguage: ['fr', 'en'],
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    publisher: { '@type': 'Organization', name: 'desktop.engineer', url: SITE + '/' },
  })

  let el = document.getElementById('seo-jsonld')
  if (!el) {
    el = document.createElement('script')
    el.id = 'seo-jsonld'
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(graphs)
}

function buildBreadcrumb(meta, path, t) {
  const items = [
    { '@type': 'ListItem', position: 1, name: t('nav.home'), item: SITE + '/' },
  ]
  if (meta.catKey) {
    items.push({ '@type': 'ListItem', position: 2, name: t(`nav.${meta.catKey}`) })
  }
  items.push({ '@type': 'ListItem', position: 3, name: t(meta.titleKey), item: SITE + path })
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items }
}

export { SITE, seoMap }