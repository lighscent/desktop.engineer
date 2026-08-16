import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/changelog', name: 'Changelog', component: () => import('@/views/Changelog.vue') },

  // Catégorie 1 : SSH & Accès Distant
  { path: '/ssh/ssh-key-generator', name: 'SshKeyGenerator', component: () => import('@/views/ssh/SshKeyGenerator.vue') },
  { path: '/ssh/public-key-analyzer', name: 'PublicKeyAnalyzer', component: () => import('@/views/ssh/PublicKeyAnalyzer.vue') },
  { path: '/ssh/ssh-config-generator', name: 'SshConfigGenerator', component: () => import('@/views/ssh/SshConfigGenerator.vue') },
  { path: '/ssh/key-format-converter', name: 'KeyFormatConverter', component: () => import('@/views/ssh/KeyFormatConverter.vue') },
  { path: '/ssh/ssh-install-assistant', name: 'SshInstallAssistant', component: () => import('@/views/ssh/SshInstallAssistant.vue') },
  { path: '/ssh/chmod-cheat-sheet', name: 'ChmodCheatSheet', component: () => import('@/views/ssh/ChmodCheatSheet.vue') },

  // Catégorie 2 : Sécurité & Chiffrement
  { path: '/security/password-generator', name: 'PasswordGenerator', component: () => import('@/views/security/PasswordGenerator.vue') },
  { path: '/security/env-key-generator', name: 'EnvKeyGenerator', component: () => import('@/views/security/EnvKeyGenerator.vue') },
  { path: '/security/hash-checker', name: 'HashChecker', component: () => import('@/views/security/HashChecker.vue') },

  // Catégorie 3 : Réseau
  { path: '/network/ip-info', name: 'IpInfo', component: () => import('@/views/network/IpInfo.vue') },
  { path: '/network/subnet-calculator', name: 'SubnetCalculator', component: () => import('@/views/network/SubnetCalculator.vue') },

  // Catégorie 4 : Serveur
  { path: '/server/nginx-generator', name: 'NginxGenerator', component: () => import('@/views/server/NginxGenerator.vue') },
  { path: '/server/ssl-cert-generator', name: 'SslCertGenerator', component: () => import('@/views/server/SslCertGenerator.vue') },
  { path: '/server/cron-generator', name: 'CronGenerator', component: () => import('@/views/server/CronGenerator.vue') },

  // Catégorie 5 : Données & Dev
  { path: '/data/format-converter', name: 'FormatConverter', component: () => import('@/views/data/FormatConverter.vue') },
  { path: '/data/linter-formatter', name: 'LinterFormatter', component: () => import('@/views/data/LinterFormatter.vue') },
  { path: '/data/swiss-knife-encoder', name: 'SwissKnifeEncoder', component: () => import('@/views/data/SwissKnifeEncoder.vue') },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
