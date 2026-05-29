<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '@/i18n'

const { t } = useI18n()

const input = ref('192.168.1.0/24')
const result = ref(null)

function parseCIDR(str) {
  const m = str.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)\/(\d+)$/)
  if (!m) return null
  const octets = [parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), parseInt(m[4])]
  const bits = parseInt(m[5])
  if (bits < 0 || bits > 32) return null
  if (octets.some(o => o < 0 || o > 255)) return null
  return { octets, bits }
}

function ipToInt(octets) {
  return ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0
}

function intToIp(n) {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.')
}

function calculate() {
  const parsed = parseCIDR(input.value.trim())
  if (!parsed) {
    result.value = { error: t('tools.subnetCalculator.invalidCidr') }
    return
  }

  const ipInt = ipToInt(parsed.octets)
  const mask = ~0 << (32 - parsed.bits) >>> 0
  const network = (ipInt & mask) >>> 0
  const broadcast = (ipInt | ~mask) >>> 0
  const totalHosts = Math.pow(2, 32 - parsed.bits)
  const usableHosts = totalHosts > 2 ? totalHosts - 2 : totalHosts

  const maskOctets = [
    (mask >>> 24) & 255,
    (mask >>> 16) & 255,
    (mask >>> 8) & 255,
    mask & 255,
  ]

  const wildcardOctets = [
    (~mask >>> 24) & 255,
    (~mask >>> 16) & 255,
    (~mask >>> 8) & 255,
    ~mask & 255,
  ]

  result.value = {
    network: intToIp(network),
    broadcast: intToIp(broadcast),
    mask: maskOctets.join('.'),
    wildcard: wildcardOctets.join('.'),
    firstHost: totalHosts > 2 ? intToIp(network + 1) : '—',
    lastHost: totalHosts > 2 ? intToIp(broadcast - 1) : '—',
    totalHosts,
    usableHosts,
    cidr: input.value.trim(),
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl md:text-3xl font-mono font-bold mb-2"><i class="fas fa-network-wired mr-2"></i>{{ t('tools.subnetCalculator.title') }}</h1>
    <p class="text-base-content/70 mb-8">{{ t('tools.subnetCalculator.desc') }}</p>

    <div class="form-control mb-6">
      <label class="label"><span class="label-text">{{ t('tools.subnetCalculator.cidr') }}</span></label>
      <div class="flex gap-3">
        <input
          v-model="input"
          class="input input-bordered font-mono flex-1"
          :placeholder="t('tools.subnetCalculator.cidrPlaceholder')"
          @keyup.enter="calculate"
        />
        <button class="btn btn-success" @click="calculate"><i class="fas fa-calculator mr-1"></i>{{ t('tools.subnetCalculator.calculate') }}</button>
      </div>
    </div>

    <div v-if="result">
      <div v-if="result.error" class="alert alert-error">{{ result.error }}</div>
      <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div class="stat bg-base-200 rounded-box border border-base-300 w-full min-w-0">
          <div class="stat-title">{{ t('tools.subnetCalculator.network') }}</div>
          <div class="stat-value text-lg font-mono">{{ result.network }}</div>
        </div>
        <div class="stat bg-base-200 rounded-box border border-base-300 w-full min-w-0">
          <div class="stat-title">{{ t('tools.subnetCalculator.broadcast') }}</div>
          <div class="stat-value text-lg font-mono">{{ result.broadcast }}</div>
        </div>
        <div class="stat bg-base-200 rounded-box border border-base-300 w-full min-w-0">
          <div class="stat-title">{{ t('tools.subnetCalculator.mask') }}</div>
          <div class="stat-value text-lg font-mono">{{ result.mask }}</div>
        </div>
        <div class="stat bg-base-200 rounded-box border border-base-300 w-full min-w-0">
          <div class="stat-title">{{ t('tools.subnetCalculator.wildcard') }}</div>
          <div class="stat-value text-lg font-mono">{{ result.wildcard }}</div>
        </div>
        <div class="stat bg-base-200 rounded-box border border-base-300 w-full min-w-0">
          <div class="stat-title">{{ t('tools.subnetCalculator.firstHost') }}</div>
          <div class="stat-value text-lg font-mono">{{ result.firstHost }}</div>
        </div>
        <div class="stat bg-base-200 rounded-box border border-base-300 w-full min-w-0">
          <div class="stat-title">{{ t('tools.subnetCalculator.lastHost') }}</div>
          <div class="stat-value text-lg font-mono">{{ result.lastHost }}</div>
        </div>
        <div class="stat bg-base-200 rounded-box border border-base-300 w-full min-w-0">
          <div class="stat-title">{{ t('tools.subnetCalculator.total') }}</div>
          <div class="stat-value text-lg font-mono">{{ result.totalHosts.toLocaleString() }}</div>
        </div>
        <div class="stat bg-base-200 rounded-box border border-base-300 w-full min-w-0">
          <div class="stat-title">{{ t('tools.subnetCalculator.usable') }}</div>
          <div class="stat-value text-lg font-mono">{{ result.usableHosts.toLocaleString() }}</div>
        </div>
      </div>
    </div>

    <div class="mt-12">
      <h2 class="text-xl font-mono font-bold mb-3">{{ t('tools.subnetCalculator.cidrMask') }}</h2>
      <div class="overflow-x-auto">
        <table class="table table-zebra text-sm">
          <thead><tr><th>{{ t('tools.subnetCalculator.cidrHeader') }}</th><th>{{ t('tools.subnetCalculator.maskHeader') }}</th><th>{{ t('tools.subnetCalculator.hostsHeader') }}</th></tr></thead>
          <tbody>
            <tr><td>/32</td><td>255.255.255.255</td><td>1</td></tr>
            <tr><td>/31</td><td>255.255.255.254</td><td>2</td></tr>
            <tr><td>/30</td><td>255.255.255.252</td><td>4</td></tr>
            <tr><td>/29</td><td>255.255.255.248</td><td>8</td></tr>
            <tr><td>/28</td><td>255.255.255.240</td><td>16</td></tr>
            <tr><td>/27</td><td>255.255.255.224</td><td>32</td></tr>
            <tr><td>/26</td><td>255.255.255.192</td><td>64</td></tr>
            <tr><td>/25</td><td>255.255.255.128</td><td>128</td></tr>
            <tr><td>/24</td><td>255.255.255.0</td><td>256</td></tr>
            <tr><td>/23</td><td>255.255.254.0</td><td>512</td></tr>
            <tr><td>/22</td><td>255.255.252.0</td><td>1 024</td></tr>
            <tr><td>/21</td><td>255.255.248.0</td><td>2 048</td></tr>
            <tr><td>/20</td><td>255.255.240.0</td><td>4 096</td></tr>
            <tr><td>/19</td><td>255.255.224.0</td><td>8 192</td></tr>
            <tr><td>/18</td><td>255.255.192.0</td><td>16 384</td></tr>
            <tr><td>/17</td><td>255.255.128.0</td><td>32 768</td></tr>
            <tr><td>/16</td><td>255.255.0.0</td><td>65 536</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
