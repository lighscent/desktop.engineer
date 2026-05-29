<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '@/i18n'

const rules = [
  {
    path: '~/.ssh/',
    typeKey: 'dirType',
    perms: '700',
    octal: 'drwx------',
    reasonKey: 'dirReason',
    cmd: 'chmod 700 ~/.ssh',
  },
  {
    path: '~/.ssh/id_ed25519',
    typeKey: 'privateKeyType',
    perms: '600',
    octal: '-rw-------',
    reasonKey: 'privateKeyReason',
    cmd: 'chmod 600 ~/.ssh/id_*',
  },
  {
    path: '~/.ssh/id_ed25519.pub',
    typeKey: 'publicKeyType',
    perms: '644',
    octal: '-rw-r--r--',
    reasonKey: 'publicKeyReason',
    cmd: 'chmod 644 ~/.ssh/*.pub',
  },
  {
    path: '~/.ssh/authorized_keys',
    typeKey: 'authorizedKeysType',
    perms: '600',
    octal: '-rw-------',
    reasonKey: 'authorizedKeysReason',
    cmd: 'chmod 600 ~/.ssh/authorized_keys',
  },
  {
    path: '~/.ssh/config',
    typeKey: 'configType',
    perms: '600',
    octal: '-rw-------',
    reasonKey: 'configReason',
    cmd: 'chmod 600 ~/.ssh/config',
  },
  {
    path: '~/.ssh/known_hosts',
    typeKey: 'knownHostsType',
    perms: '644',
    octal: '-rw-r--r--',
    reasonKey: 'knownHostsReason',
    cmd: 'chmod 644 ~/.ssh/known_hosts',
  },
]

const { t } = useI18n()

const selectedPath = ref('')
const customCmd = ref('')
const customOutput = ref('')

function copy(text) {
  navigator.clipboard.writeText(text)
}

function checkCustom() {
  const parts = customCmd.value.trim().split(/\s+/)
  if (parts.length < 2) {
    customOutput.value = t('tools.chmodCheatSheet.invalidFormat')
    return
  }
  const perms = parts[0]
  const path = parts.slice(1).join(' ')
  if (!/^[0-7]{3,4}$/.test(perms)) {
    customOutput.value = t('tools.chmodCheatSheet.invalidPermissions')
    return
  }
  customOutput.value = `chmod ${perms} ${path}`
}
</script>

<template>
  <div>
    <h1 class="text-2xl md:text-3xl font-mono font-bold mb-2"><i class="fas fa-lock mr-2"></i>{{ t('tools.chmodCheatSheet.title') }}</h1>
    <p class="text-base-content/70 mb-8">{{ t('tools.chmodCheatSheet.desc') }}</p>

    <div class="overflow-x-auto mb-8">
      <table class="table table-zebra text-sm">
        <thead>
          <tr><th>{{ t('tools.chmodCheatSheet.file') }}</th><th>{{ t('tools.chmodCheatSheet.type') }}</th><th>{{ t('tools.chmodCheatSheet.permissions') }}</th><th>{{ t('tools.chmodCheatSheet.octal') }}</th><th>{{ t('tools.chmodCheatSheet.command') }}</th><th>{{ t('tools.chmodCheatSheet.reason') }}</th></tr>
        </thead>
        <tbody>
          <tr
            v-for="r in rules"
            :key="r.path"
            class="cursor-pointer"
            :class="{ 'bg-base-300': selectedPath === r.path }"
            @click="selectedPath = r.path"
          >
            <td class="font-mono whitespace-nowrap sm:whitespace-normal">{{ r.path }}</td>
            <td class="whitespace-nowrap sm:whitespace-normal">{{ t('tools.chmodCheatSheet.' + r.typeKey) }}</td>
            <td class="whitespace-nowrap sm:whitespace-normal"><code class="font-mono font-bold">{{ r.octal }}</code></td>
            <td class="whitespace-nowrap sm:whitespace-normal"><code class="font-mono">{{ r.perms }}</code></td>
            <td class="whitespace-nowrap sm:whitespace-normal"><code class="font-mono text-xs">{{ r.cmd }}</code></td>
            <td class="text-xs max-w-xs whitespace-nowrap sm:whitespace-normal">{{ t('tools.chmodCheatSheet.' + r.reasonKey) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="selectedPath" class="card bg-base-200 border border-base-300 p-4 mb-8 w-full min-w-0">
      <div class="flex items-center justify-between">
        <div>
          <span class="font-mono font-bold text-lg">{{ selectedPath }}</span>
          <span class="ml-3 text-sm text-base-content/60">
            <code class="font-mono">{{ rules.find(r => r.path === selectedPath)?.cmd }}</code>
          </span>
        </div>
        <button class="btn btn-outline btn-sm" @click="copy(rules.find(r => r.path === selectedPath)?.cmd || '')">
          <i class="fas fa-copy"></i>
        </button>
      </div>
    </div>

    <div class="card bg-base-200 border border-base-300 p-4 sm:p-6 w-full min-w-0">
      <h2 class="text-xl font-mono font-bold mb-3">{{ t('tools.chmodCheatSheet.checker') }}</h2>
      <p class="text-sm text-base-content/70 mb-3">{{ t('tools.chmodCheatSheet.checkerDesc') }}</p>
      <div class="flex gap-3">
        <input v-model="customCmd" class="input input-bordered font-mono flex-1" :placeholder="t('tools.chmodCheatSheet.checkerPlaceholder')" @keyup.enter="checkCustom" />
        <button class="btn btn-outline" @click="checkCustom"><i class="fas fa-check mr-1"></i>{{ t('tools.chmodCheatSheet.check') }}</button>
      </div>
      <div v-if="customOutput" class="mt-3">
        <pre class="mockup-code p-3 text-sm overflow-x-auto">{{ customOutput }}</pre>
      </div>
    </div>
  </div>
</template>
