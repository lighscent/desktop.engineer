<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n'

const direction = ref('openssh-to-putty')
const keyInput = ref('')
const result = ref('')

const { t } = useI18n()

function detect() {
  if (!keyInput.value.trim()) { result.value = ''; return }

  const text = keyInput.value
  let detected = ''
  if (/^PuTTY-User-Key-File-2/m.test(text)) detected = 'putty'
  else if (/^-{5}BEGIN.*PRIVATE KEY-{5}/m.test(text)) detected = 'openssh'
  else if (/^ssh-(rsa|ed25519|dss|ecdsa)/m.test(text)) detected = 'openssh-pub'
  else detected = 'inconnu'

  const dir = direction.value

  if (dir === 'openssh-to-putty') {
    if (detected.startsWith('openssh')) {
      result.value = `# Conversion OpenSSH → PuTTY (.ppk)
# Méthode 1 : avec PuTTYgen (Windows)
#   1. Ouvrez PuTTYgen
#   2. Conversions → Import key
#   3. Sélectionnez votre fichier de clé OpenSSH
#   4. Cliquez sur "Save private key"

# Méthode 2 : avec puttygen en ligne de commande
puttygen id_rsa -o id_rsa.ppk

# Méthode 3 : avec ssh-keygen + puttygen (Linux)
ssh-keygen -p -m PEM -f id_rsa
puttygen id_rsa -o id_rsa.ppk

# ${detected === 'openssh-pub' ? t('tools.keyFormatConverter.detectedPublic') : t('tools.keyFormatConverter.detectedPrivate')}`
    } else if (detected === 'putty') {
      result.value = t('tools.keyFormatConverter.alreadyPutty')
    } else {
      result.value = t('tools.keyFormatConverter.notRecognized')
    }
  } else {
    if (detected === 'putty') {
      result.value = `# Conversion PuTTY (.ppk) → OpenSSH
# Méthode 1 : avec PuTTYgen (Windows)
#   1. Ouvrez PuTTYgen
#   2. File → Load private key
#   3. Conversions → Export OpenSSH key

# Méthode 2 : avec puttygen en ligne de commande
puttygen id_rsa.ppk -O private-openssh -o id_rsa

# Méthode 3 : sur Linux avec le paquet putty-tools
sudo apt install putty-tools
puttygen id_rsa.ppk -O private-openssh -o id_rsa

# ${t('tools.keyFormatConverter.detectedPutty')}`
    } else if (detected.startsWith('openssh')) {
      result.value = t('tools.keyFormatConverter.alreadyOssh')
    } else {
      result.value = t('tools.keyFormatConverter.notRecognizedPutty')
    }
  }
}

function copy() {
  navigator.clipboard.writeText(result.value)
}
</script>

<template>
  <div>
    <h1 class="text-2xl md:text-3xl font-mono font-bold mb-2"><i class="fas fa-arrows-rotate mr-2"></i>{{ t('tools.keyFormatConverter.title') }}</h1>
    <p class="text-base-content/70 mb-8">{{ t('tools.keyFormatConverter.desc') }}</p>

    <div class="card bg-base-200 border border-base-300 p-4 sm:p-6 mb-6 w-full min-w-0">
      <div class="form-control mb-4">
        <label class="label"><span class="label-text">{{ t('tools.keyFormatConverter.direction') }}</span></label>
        <div class="flex gap-4">
          <label class="label cursor-pointer justify-start gap-3">
            <input v-model="direction" type="radio" class="radio radio-sm" value="openssh-to-putty" />
            <span class="label-text">{{ t('tools.keyFormatConverter.osshToPutty') }}</span>
          </label>
          <label class="label cursor-pointer justify-start gap-3">
            <input v-model="direction" type="radio" class="radio radio-sm" value="putty-to-openssh" />
            <span class="label-text">{{ t('tools.keyFormatConverter.puttyToOssh') }}</span>
          </label>
        </div>
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text">{{ t('tools.keyFormatConverter.pasteKey') }}</span></label>
        <textarea
          v-model="keyInput"
          class="textarea textarea-bordered font-mono text-sm min-h-32"
          :placeholder="t('tools.keyFormatConverter.keyPlaceholder')"
        ></textarea>
      </div>
    </div>

    <button class="btn btn-success mb-6" @click="detect"><i class="fas fa-arrows-rotate mr-1"></i>{{ t('tools.keyFormatConverter.convert') }}</button>

    <div v-if="result" class="mt-4">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-xl font-mono font-bold">{{ t('tools.keyFormatConverter.instructions') }}</h2>
        <button class="btn btn-outline btn-sm" @click="copy"><i class="fas fa-copy mr-1"></i>{{ t('tools.keyFormatConverter.copy') }}</button>
      </div>
      <pre class="mockup-code p-4 text-sm whitespace-pre-wrap overflow-x-auto max-w-full">{{ result }}</pre>
    </div>
  </div>
</template>
