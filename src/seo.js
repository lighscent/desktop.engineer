const seoMap = {
  '/': { titleKey: 'home.title', descKey: 'home.subtitle' },
  '/ssh-key-generator': { titleKey: 'tools.sshKeyGenerator.title', descKey: 'tools.sshKeyGenerator.desc' },
  '/public-key-analyzer': { titleKey: 'tools.publicKeyAnalyzer.title', descKey: 'tools.publicKeyAnalyzer.desc' },
  '/ssh-config-generator': { titleKey: 'tools.sshConfigGenerator.title', descKey: 'tools.sshConfigGenerator.desc' },
  '/key-format-converter': { titleKey: 'tools.keyFormatConverter.title', descKey: 'tools.keyFormatConverter.desc' },
  '/ssh-install-assistant': { titleKey: 'tools.sshInstallAssistant.title', descKey: 'tools.sshInstallAssistant.desc' },
  '/chmod-cheat-sheet': { titleKey: 'tools.chmodCheatSheet.title', descKey: 'tools.chmodCheatSheet.desc' },
  '/password-generator': { titleKey: 'tools.passwordGenerator.title', descKey: 'tools.passwordGenerator.desc' },
  '/env-key-generator': { titleKey: 'tools.envKeyGenerator.title', descKey: 'tools.envKeyGenerator.desc' },
  '/hash-checker': { titleKey: 'tools.hashChecker.title', descKey: 'tools.hashChecker.desc' },
  '/subnet-calculator': { titleKey: 'tools.subnetCalculator.title', descKey: 'tools.subnetCalculator.desc' },
  '/nginx-generator': { titleKey: 'tools.nginxGenerator.title', descKey: 'tools.nginxGenerator.desc' },
  '/cron-generator': { titleKey: 'tools.cronGenerator.title', descKey: 'tools.cronGenerator.desc' },
  '/format-converter': { titleKey: 'tools.formatConverter.title', descKey: 'tools.formatConverter.desc' },
  '/linter-formatter': { titleKey: 'tools.linterFormatter.title', descKey: 'tools.linterFormatter.desc' },
  '/swiss-knife-encoder': { titleKey: 'tools.swissKnifeEncoder.title', descKey: 'tools.swissKnifeEncoder.desc' },
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
