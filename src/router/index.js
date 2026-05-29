import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },

  // Catégorie 1 : SSH & Gestion des Accès
  { path: '/ssh-key-generator', name: 'SshKeyGenerator', component: () => import('@/views/SshKeyGenerator.vue') },
  { path: '/public-key-analyzer', name: 'PublicKeyAnalyzer', component: () => import('@/views/PublicKeyAnalyzer.vue') },
  { path: '/ssh-config-generator', name: 'SshConfigGenerator', component: () => import('@/views/SshConfigGenerator.vue') },
  { path: '/key-format-converter', name: 'KeyFormatConverter', component: () => import('@/views/KeyFormatConverter.vue') },
  { path: '/ssh-install-assistant', name: 'SshInstallAssistant', component: () => import('@/views/SshInstallAssistant.vue') },
  { path: '/chmod-cheat-sheet', name: 'ChmodCheatSheet', component: () => import('@/views/ChmodCheatSheet.vue') },

  // Catégorie 2 : Sécurité & Secrets Locaux
  { path: '/password-generator', name: 'PasswordGenerator', component: () => import('@/views/PasswordGenerator.vue') },
  { path: '/env-key-generator', name: 'EnvKeyGenerator', component: () => import('@/views/EnvKeyGenerator.vue') },
  { path: '/hash-checker', name: 'HashChecker', component: () => import('@/views/HashChecker.vue') },

  // Catégorie 3 : Réseau & Configurations Serveur
  { path: '/subnet-calculator', name: 'SubnetCalculator', component: () => import('@/views/SubnetCalculator.vue') },
  { path: '/nginx-generator', name: 'NginxGenerator', component: () => import('@/views/NginxGenerator.vue') },
  { path: '/cron-generator', name: 'CronGenerator', component: () => import('@/views/CronGenerator.vue') },

  // Catégorie 4 : Manipulation de Données
  { path: '/format-converter', name: 'FormatConverter', component: () => import('@/views/FormatConverter.vue') },
  { path: '/linter-formatter', name: 'LinterFormatter', component: () => import('@/views/LinterFormatter.vue') },
  { path: '/swiss-knife-encoder', name: 'SwissKnifeEncoder', component: () => import('@/views/SwissKnifeEncoder.vue') },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
