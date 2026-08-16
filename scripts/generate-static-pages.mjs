import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import en from '../src/i18n/locales/en.js'
import { SITE, seoMap } from '../src/seo.js'

const DIST = 'dist'

const NS_BY_PATH = {
  '/': 'home',
  '/ssh/chmod-cheat-sheet': 'chmod',
  '/ssh/ssh-install-assistant': 'sshInstall',
  '/data/linter-formatter': 'linter',
}

function t(key) {
  return key.split('.').reduce((o, k) => (o == null ? o : o[k]), en) ?? key
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function jsonLd(meta, path, desc) {
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
    const items = [{ '@type': 'ListItem', position: 1, name: t('nav.home'), item: SITE + '/' }]
    if (meta.catKey) {
      items.push({ '@type': 'ListItem', position: 2, name: t(`nav.${meta.catKey}`) })
    }
    items.push({ '@type': 'ListItem', position: 3, name: t(meta.titleKey), item: url })
    graphs.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items })
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

  return graphs
}

function noscript(meta, path, title, desc) {
  const ns = NS_BY_PATH[path]
  const parts = [
    '<noscript>',
    '<main style="font-family: system-ui, -apple-system, sans-serif; max-width: 44rem; margin: 0 auto; padding: 1.5rem 1rem; line-height: 1.65; color: #e6e6e6; background: #1d232a; min-height: 100vh">',
    `<h1>${escapeHtml(title)}</h1>`,
    `<p>${escapeHtml(desc)}</p>`,
  ]

  if (ns) {
    const points = Array.from({ length: parseInt(t(`seo.${ns}.pointsCount`), 10) || 0 }, (_, i) => t(`seo.${ns}.p${i + 1}`))
    parts.push(
      `<h2>${escapeHtml(t(`seo.${ns}.h2`))}</h2>`,
      `<p>${escapeHtml(t(`seo.${ns}.intro`))}</p>`,
      '<ul>',
      ...points.map((p) => `<li>${escapeHtml(p)}</li>`),
      '</ul>',
      `<p>${escapeHtml(t(`seo.${ns}.outro`))}</p>`
    )
  }

  parts.push('<h2>All tools</h2>', '<ul>')
  for (const [p, m] of Object.entries(seoMap)) {
    if (p === path) continue
    parts.push(`<li><a href="${SITE}${p}">${escapeHtml(t(m.titleKey))}</a></li>`)
  }
  parts.push('</ul>', '</main>', '</noscript>')

  return parts.join('')
}

const html = readFileSync(join(DIST, 'index.html'), 'utf8')

for (const [path, meta] of Object.entries(seoMap)) {
  const url = SITE + path
  const title = meta.kind === 'home' ? t(meta.titleKey) : `${t(meta.titleKey)} — desktop.engineer`
  const desc = t(meta.descKey)

  let out = html
  out = out.replace('<html lang="fr"', '<html lang="en"')
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
  out = out.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${escapeHtml(desc)}"`)
  out = out.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${escapeHtml(title)}"`)
  out = out.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${escapeHtml(desc)}"`)
  out = out.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}"`)
  out = out.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${escapeHtml(title)}"`)
  out = out.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${escapeHtml(desc)}"`)
  out = out.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`)
  out = out.replace(
    /<script type="application\/ld\+json" id="seo-jsonld">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="seo-jsonld">${JSON.stringify(jsonLd(meta, path, desc))}</script>`
  )
  out = out.replace('</body>', `${noscript(meta, path, title, desc)}</body>`)

  const target = path === '/' ? join(DIST, 'index.html') : join(DIST, path.slice(1), 'index.html')
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, out)
  console.log(`generated ${target}`)
}