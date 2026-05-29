<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n'

const user = ref('root')
const host = ref('192.168.1.100')
const port = ref(22)
const keyPath = ref('~/.ssh/id_ed25519.pub')
const method = ref('ssh-copy-id')
const command = ref('')

const { t } = useI18n()

function generate() {
  const u = user.value.trim() || 'root'
  const h = host.value.trim()
  const p = port.value
  const k = keyPath.value.trim() || '~/.ssh/id_ed25519.pub'
  if (!h) { command.value = ''; return }

  if (method.value === 'ssh-copy-id') {
    command.value = `ssh-copy-id${p !== 22 ? ` -p ${p}` : ''} -i ${k} ${u}@${h}`
  } else {
    command.value = `# Méthode manuelle (quand ssh-copy-id n'est pas disponible) :\ncat ${k} | ssh${p !== 22 ? ` -p ${p}` : ''} ${u}@${h} "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"`
  }
}

function copy() {
  navigator.clipboard.writeText(command.value)
}
</script>

<template>
  <div>
    <h1 class="text-2xl md:text-3xl font-mono font-bold mb-2"><i class="fas fa-cloud-upload-alt mr-2"></i>{{ t('tools.sshInstallAssistant.title') }}</h1>
    <p class="text-base-content/70 mb-8">{{ t('tools.sshInstallAssistant.desc') }}</p>

    <div class="card bg-base-200 border border-base-300 p-4 sm:p-6 mb-6 w-full min-w-0">
      <div class="grid gap-4 md:grid-cols-2">
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.sshInstallAssistant.user') }}</span></label>
          <input v-model="user" class="input input-bordered font-mono" :placeholder="t('tools.sshInstallAssistant.userPlaceholder')" />
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.sshInstallAssistant.host') }}</span></label>
          <input v-model="host" class="input input-bordered font-mono" :placeholder="t('tools.sshInstallAssistant.hostPlaceholder')" />
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.sshInstallAssistant.port') }}</span></label>
          <input v-model.number="port" type="number" class="input input-bordered font-mono" min="1" max="65535" />
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.sshInstallAssistant.keyPath') }}</span></label>
          <input v-model="keyPath" class="input input-bordered font-mono" :placeholder="t('tools.sshInstallAssistant.keyPlaceholder')" />
        </div>
      </div>
      <div class="form-control mt-4">
        <label class="label"><span class="label-text">{{ t('tools.sshInstallAssistant.method') }}</span></label>
        <div class="flex gap-4">
          <label class="label cursor-pointer justify-start gap-3">
            <input v-model="method" type="radio" class="radio radio-sm" value="ssh-copy-id" />
            <span class="label-text">{{ t('tools.sshInstallAssistant.sshCopyId') }}</span>
          </label>
          <label class="label cursor-pointer justify-start gap-3">
            <input v-model="method" type="radio" class="radio radio-sm" value="manual" />
            <span class="label-text">{{ t('tools.sshInstallAssistant.manual') }}</span>
          </label>
        </div>
      </div>
      <button class="btn btn-success mt-4" @click="generate"><i class="fas fa-terminal mr-1"></i>{{ t('tools.sshInstallAssistant.generate') }}</button>
    </div>

    <div v-if="command" class="mt-4">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-xl font-mono font-bold">{{ t('tools.sshInstallAssistant.command') }}</h2>
        <button class="btn btn-outline btn-sm" @click="copy"><i class="fas fa-copy mr-1"></i>{{ t('tools.sshInstallAssistant.copy') }}</button>
      </div>
      <pre class="mockup-code p-4 text-sm whitespace-pre-wrap overflow-x-auto">{{ command }}</pre>
    </div>
  </div>
</template>
