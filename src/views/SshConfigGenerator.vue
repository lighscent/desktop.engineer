<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '@/i18n'

const hosts = ref([
  { label: '', host: 'mon-serveer', hostname: '', user: '', port: 22, identityFile: '', extra: '' },
])

const { t } = useI18n()

function addHost() {
  hosts.value.push({ label: '', host: '', hostname: '', user: '', port: 22, identityFile: '', extra: '' })
}

function removeHost(idx) {
  hosts.value.splice(idx, 1)
}

const generatedConfig = computed(() => {
  return hosts.value
    .filter(h => h.host.trim())
    .map(h => {
      const lines = [`Host ${h.host.trim()}`]
      if (h.hostname.trim()) lines.push(`  HostName ${h.hostname.trim()}`)
      if (h.user.trim()) lines.push(`  User ${h.user.trim()}`)
      if (h.port && h.port !== 22) lines.push(`  Port ${h.port}`)
      if (h.identityFile.trim()) lines.push(`  IdentityFile ${h.identityFile.trim()}`)
      if (h.extra.trim()) lines.push(`  ${h.extra.trim()}`)
      return lines.join('\n')
    })
    .join('\n\n')
})

function copyConfig() {
  navigator.clipboard.writeText(generatedConfig.value)
}

function downloadConfig() {
  const blob = new Blob([generatedConfig.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'config'
  a.click()
  URL.revokeObjectURL(url)
}

const templates = [
  { labelKey: 'githubBtn', host: 'github.com', hostname: 'github.com', user: 'git', port: 22, identityFile: '~/.ssh/id_ed25519', extra: 'StrictHostKeyChecking accept-new' },
  { labelKey: 'standardBtn', host: 'myserver', hostname: '192.168.1.100', user: 'admin', port: 22, identityFile: '~/.ssh/id_rsa', extra: '' },
  { labelKey: 'jumpBtn', host: 'bastion', hostname: 'bastion.example.com', user: 'jumpuser', port: 22, identityFile: '~/.ssh/id_ed25519', extra: 'ForwardAgent yes' },
]

function applyTemplate(tpl) {
  hosts.value.push({ ...tpl })
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-mono font-bold mb-2"><i class="fas fa-gear mr-2"></i>{{ t('tools.sshConfigGenerator.title') }}</h1>
    <p class="text-base-content/70 mb-8">{{ t('tools.sshConfigGenerator.desc') }}</p>

    <div class="mb-6 flex flex-wrap gap-2">
      <span class="text-sm font-bold self-center mr-2">{{ t('tools.sshConfigGenerator.templates') }}</span>
      <button
        v-for="(tpl, i) in templates"
        :key="i"
        class="btn btn-outline btn-xs"
        @click="applyTemplate(tpl)"
      >
        + {{ t('tools.sshConfigGenerator.' + tpl.labelKey) }}
      </button>
    </div>

    <div
      v-for="(h, idx) in hosts"
      :key="idx"
      class="collapse collapse-arrow bg-base-200 border border-base-300 mb-3"
    >
      <input type="checkbox" :checked="true" />
      <div class="collapse-title font-mono font-semibold">
        {{ h.host || t('tools.sshConfigGenerator.hostDefault') + ' ' + (idx + 1) }}
      </div>
      <div class="collapse-content">
        <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <div class="form-control">
            <label class="label"><span class="label-text">{{ t('tools.sshConfigGenerator.alias') }}</span></label>
            <input v-model="h.host" class="input input-bordered input-sm font-mono" :placeholder="t('tools.sshConfigGenerator.hostPlaceholder')" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">{{ t('tools.sshConfigGenerator.hostname') }}</span></label>
            <input v-model="h.hostname" class="input input-bordered input-sm font-mono" :placeholder="t('tools.sshConfigGenerator.hostnamePlaceholder')" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">{{ t('tools.sshConfigGenerator.user') }}</span></label>
            <input v-model="h.user" class="input input-bordered input-sm font-mono" :placeholder="t('tools.sshConfigGenerator.userPlaceholder')" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">{{ t('tools.sshConfigGenerator.port') }}</span></label>
            <input v-model.number="h.port" type="number" class="input input-bordered input-sm font-mono" min="1" max="65535" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">{{ t('tools.sshConfigGenerator.identityFile') }}</span></label>
            <input v-model="h.identityFile" class="input input-bordered input-sm font-mono" :placeholder="t('tools.sshConfigGenerator.identityPlaceholder')" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">{{ t('tools.sshConfigGenerator.extraOptions') }}</span></label>
            <input v-model="h.extra" class="input input-bordered input-sm font-mono" :placeholder="t('tools.sshConfigGenerator.extraPlaceholder')" />
          </div>
        </div>
        <button class="btn btn-outline btn-error btn-sm mt-3" @click="removeHost(idx)">{{ t('tools.sshConfigGenerator.remove') }}</button>
      </div>
    </div>

    <button class="btn btn-success mb-8" @click="addHost">{{ t('tools.sshConfigGenerator.addHost') }}</button>

    <div v-if="generatedConfig" class="mt-4">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-xl font-mono font-bold">{{ t('tools.sshConfigGenerator.generated') }}</h2>
        <div class="flex gap-2">
          <button class="btn btn-outline btn-sm" @click="copyConfig">{{ t('tools.sshConfigGenerator.copy') }}</button>
          <button class="btn btn-outline btn-sm" @click="downloadConfig">{{ t('tools.sshConfigGenerator.download') }}</button>
        </div>
      </div>
      <pre class="mockup-code p-4 text-sm overflow-x-auto whitespace-pre-wrap">{{ generatedConfig }}</pre>
    </div>
  </div>
</template>
