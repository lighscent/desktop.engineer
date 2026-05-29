<script setup>
import { ref, computed } from 'vue'

const keyA = ref('')
const keyB = ref('')
const result = ref(null)

function normalizeFingerprint(fp) {
  return fp.replace(/^(SHA256:|MD5:)/, '').replace(/:/g, '').trim()
}

function compare() {
  const a = keyA.value.trim()
  const b = keyB.value.trim()
  if (!a || !b) {
    result.value = { match: false, msg: 'Veuillez saisir deux valeurs.' }
    return
  }

  const normA = normalizeFingerprint(a)
  const normB = normalizeFingerprint(b)

  if (normA === normB) {
    result.value = { match: true, msg: 'Les clés / empreintes correspondent.' }
  } else {
    result.value = { match: false, msg: 'Les clés / empreintes sont différentes.' }
  }
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-mono font-bold mb-2"><i class="fas fa-code-compare mr-2"></i>Comparateur de Clés SSH et Checksum</h1>
    <p class="text-base-content/70 mb-8">Collez deux clés publiques, empreintes SHA256 ou MD5 pour les comparer.</p>

    <div class="grid gap-6 md:grid-cols-2 mb-6">
      <div class="form-control">
        <label class="label"><span class="label-text">Clé / Empreinte A</span></label>
        <textarea
          v-model="keyA"
          class="textarea textarea-bordered font-mono text-sm min-h-32"
          placeholder="ssh-ed25519 AAAA... (ou SHA256:... / MD5:...)"
        ></textarea>
      </div>
      <div class="form-control">
        <label class="label"><span class="label-text">Clé / Empreinte B</span></label>
        <textarea
          v-model="keyB"
          class="textarea textarea-bordered font-mono text-sm min-h-32"
          placeholder="ssh-ed25519 AAAA... (ou SHA256:... / MD5:...)"
        ></textarea>
      </div>
    </div>

    <button class="btn btn-success" @click="compare">Comparer</button>

    <div v-if="result" class="mt-6">
      <div class="alert" :class="result.match ? 'alert-success' : 'alert-error'">
        <i :class="'text-lg fas ' + (result.match ? 'fa-check-circle' : 'fa-times-circle')"></i>
        <span>{{ result.msg }}</span>
      </div>
    </div>

    <div class="mt-12">
      <h2 class="text-xl font-mono font-bold mb-3">Détection automatique de type</h2>
      <div class="overflow-x-auto">
        <table class="table table-zebra text-sm">
          <thead>
            <tr><th>Type</th><th>Format</th><th>Exemple</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Clé publique OpenSSH</td>
              <td><code>algo base64 comment</code></td>
              <td><code>ssh-ed25519 AAAAC3... user@host</code></td>
            </tr>
            <tr>
              <td>Empreinte SHA256</td>
              <td><code>SHA256:base64</code></td>
              <td><code>SHA256:abc123...=</code></td>
            </tr>
            <tr>
              <td>Empreinte MD5</td>
              <td><code>xx:xx:xx:...</code></td>
              <td><code>aa:bb:cc:dd:...</code></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
