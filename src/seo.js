const seoMap = {
  '/': { titleKey: 'home.title', descKey: 'home.subtitle' },
  '/changelog': { titleKey: 'changelog.title', descKey: 'changelog.desc' },
  '/ssh/ssh-key-generator': { titleKey: 'tools.sshKeyGenerator.title', descKey: 'tools.sshKeyGenerator.desc' },
  '/ssh/public-key-analyzer': { titleKey: 'tools.publicKeyAnalyzer.title', descKey: 'tools.publicKeyAnalyzer.desc' },
  '/ssh/ssh-config-generator': { titleKey: 'tools.sshConfigGenerator.title', descKey: 'tools.sshConfigGenerator.desc' },
  '/ssh/key-format-converter': { titleKey: 'tools.keyFormatConverter.title', descKey: 'tools.keyFormatConverter.desc' },
  '/ssh/ssh-install-assistant': { titleKey: 'tools.sshInstallAssistant.title', descKey: 'tools.sshInstallAssistant.desc' },
  '/ssh/chmod-cheat-sheet': { titleKey: 'tools.chmodCheatSheet.title', descKey: 'tools.chmodCheatSheet.desc' },
  '/security/password-generator': { titleKey: 'tools.passwordGenerator.title', descKey: 'tools.passwordGenerator.desc' },
  '/security/env-key-generator': { titleKey: 'tools.envKeyGenerator.title', descKey: 'tools.envKeyGenerator.desc' },
  '/security/hash-checker': { titleKey: 'tools.hashChecker.title', descKey: 'tools.hashChecker.desc' },
  '/network/ip-info': { titleKey: 'tools.ipInfo.title', descKey: 'tools.ipInfo.desc' },
  '/network/subnet-calculator': { titleKey: 'tools.subnetCalculator.title', descKey: 'tools.subnetCalculator.desc' },
  '/server/nginx-generator': { titleKey: 'tools.nginxGenerator.title', descKey: 'tools.nginxGenerator.desc' },
  '/server/cron-generator': { titleKey: 'tools.cronGenerator.title', descKey: 'tools.cronGenerator.desc' },
  '/data/format-converter': { titleKey: 'tools.formatConverter.title', descKey: 'tools.formatConverter.desc' },
  '/data/linter-formatter': { titleKey: 'tools.linterFormatter.title', descKey: 'tools.linterFormatter.desc' },
  '/data/swiss-knife-encoder': { titleKey: 'tools.swissKnifeEncoder.title', descKey: 'tools.swissKnifeEncoder.desc' },
}

export function applySeo(path, t) {
  const meta = seoMap[path]
  if (!meta) return

  const title = path === '/' ? 'desktop.engineer' : `desktop.engineer - ${t(meta.titleKey)}`
  const desc = t(meta.descKey)

  document.title = title

  setMeta('description', desc)
  setMeta('og:title', title)
  setMeta('og:description', desc)
  setMeta('og:url', `https://desktop.engineer${path}`)
  setMeta('twitter:title', title)
  setMeta('twitter:description', desc)

  const canon = document.querySelector('link[rel="canonical"]')
  if (canon) canon.setAttribute('href', `https://desktop.engineer${path}`)
}

function setMeta(prop, content) {
  const el = document.querySelector(`meta[property="${prop}"]`) || document.querySelector(`meta[name="${prop}"]`)
  if (el) el.setAttribute('content', content)
}
