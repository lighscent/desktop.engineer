<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '@/i18n'

const { t } = useI18n()

const domain = ref('example.com')
const ip = ref('192.168.1.100')
const port = ref(3000)
const ssl = ref(true)
const hsts = ref(true)
const websocket = ref(false)
const rootDir = ref('/var/www/example.com')
const siteType = ref('proxy')
const gzip = ref(true)
const staticCache = ref(true)
const php = ref(false)
const phpBackend = ref('unix:/var/run/php/php-fpm.sock')

const config = computed(() => {
  const d = domain.value.trim() || 'example.com'
  const i = ip.value.trim() || '127.0.0.1'
  const p = port.value
  const root = rootDir.value.trim() || '/var/www/' + d

  let lines = []

  if (ssl.value) {
    lines.push(`server {`)
    lines.push(`    listen 443 ssl;`)
    lines.push(`    http2 on;`)
    lines.push(`    server_name ${d} www.${d};`)
    lines.push(``)
    lines.push(`    ssl_certificate /etc/letsencrypt/live/${d}/fullchain.pem;`)
    lines.push(`    ssl_certificate_key /etc/letsencrypt/live/${d}/privkey.pem;`)
    lines.push(`    ssl_protocols TLSv1.2 TLSv1.3;`)
    lines.push(`    ssl_ciphers HIGH:!aNULL:!MD5;`)
    if (hsts.value) {
      lines.push(`    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;`)
    }
    lines.push(`    add_header X-Content-Type-Options nosniff;`)
    lines.push(`    add_header X-Frame-Options DENY;`)
    lines.push(`    add_header X-XSS-Protection "1; mode=block";`)
    if (gzip.value) {
      lines.push(``)
      lines.push(`    gzip on;`)
      lines.push(`    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;`)
      lines.push(`    gzip_min_length 256;`)
    }
    lines.push(``)
    locationBlock(lines, i, p, root)
    if (staticCache.value && siteType.value === 'static') {
      lines.push(``)
      lines.push(`    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|woff2?|ttf|svg|eot)$ {`)
      lines.push(`        expires 365d;`)
      lines.push(`        add_header Cache-Control "public, immutable";`)
      lines.push(`    }`)
    }
    lines.push(`}`)
    lines.push(``)
    lines.push(`server {`)
    lines.push(`    listen 80;`)
    lines.push(`    server_name ${d} www.${d};`)
    lines.push(`    return 301 https://$host$request_uri;`)
    lines.push(`}`)
  } else {
    lines.push(`server {`)
    lines.push(`    listen 80;`)
    lines.push(`    server_name ${d} www.${d};`)
    if (gzip.value) {
      lines.push(``)
      lines.push(`    gzip on;`)
      lines.push(`    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;`)
      lines.push(`    gzip_min_length 256;`)
    }
    lines.push(``)
    locationBlock(lines, i, p, root)
    if (staticCache.value && siteType.value === 'static') {
      lines.push(``)
      lines.push(`    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|woff2?|ttf|svg|eot)$ {`)
      lines.push(`        expires 365d;`)
      lines.push(`        add_header Cache-Control "public, immutable";`)
      lines.push(`    }`)
    }
    lines.push(`}`)
  }

  return lines.join('\n')
})

function locationBlock(lines, i, p, root) {
  if (siteType.value === 'static') {
    lines.push(`    root ${root};`)
    if (php.value) {
      lines.push(`    index index.php index.html;`)
      lines.push(`    location / {`)
      lines.push(`        try_files $uri $uri/ /index.php?$query_string;`)
      lines.push(`    }`)
      lines.push(``)
      lines.push(`    location ~ \\.php$ {`)
      lines.push(`        fastcgi_pass ${phpBackend.value};`)
      lines.push(`        fastcgi_index index.php;`)
      lines.push(`        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;`)
      lines.push(`        include fastcgi_params;`)
      lines.push(`    }`)
    } else {
      lines.push(`    index index.html;`)
      lines.push(`    location / {`)
      lines.push(`        try_files $uri $uri/ /index.html;`)
      lines.push(`    }`)
    }
  } else if (websocket.value) {
    lines.push(`    location / {`)
    lines.push(`        proxy_pass http://${i}:${p};`)
    lines.push(`        proxy_http_version 1.1;`)
    lines.push(`        proxy_set_header Upgrade $http_upgrade;`)
    lines.push(`        proxy_set_header Connection "upgrade";`)
    lines.push(`        proxy_set_header Host $host;`)
    lines.push(`        proxy_set_header X-Real-IP $remote_addr;`)
    lines.push(`        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`)
    lines.push(`        proxy_set_header X-Forwarded-Proto $scheme;`)
    lines.push(`    }`)
  } else {
    lines.push(`    location / {`)
    lines.push(`        proxy_pass http://${i}:${p};`)
    lines.push(`        proxy_set_header Host $host;`)
    lines.push(`        proxy_set_header X-Real-IP $remote_addr;`)
    lines.push(`        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`)
    lines.push(`        proxy_set_header X-Forwarded-Proto $scheme;`)
    lines.push(`    }`)
  }
}

function copy() {
  navigator.clipboard.writeText(config.value)
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-mono font-bold mb-2"><i class="fas fa-server mr-2"></i>{{ t('tools.nginxGenerator.title') }}</h1>
    <p class="text-base-content/70 mb-8">{{ t('tools.nginxGenerator.desc') }}</p>

    <div class="card bg-base-200 border border-base-300 p-6 mb-6">
      <div class="grid gap-4 md:grid-cols-2">
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.nginxGenerator.domain') }}</span></label>
          <input v-model="domain" class="input input-bordered font-mono" :placeholder="t('tools.nginxGenerator.domainPlaceholder')" />
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.nginxGenerator.backendIp') }}</span></label>
          <input v-model="ip" class="input input-bordered font-mono" :disabled="siteType === 'static'" :placeholder="t('tools.nginxGenerator.ipPlaceholder')" />
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.nginxGenerator.backendPort') }}</span></label>
          <input v-model.number="port" type="number" class="input input-bordered font-mono" :disabled="siteType === 'static'" min="1" max="65535" />
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.nginxGenerator.root') }}</span></label>
          <input v-model="rootDir" class="input input-bordered font-mono" :placeholder="t('tools.nginxGenerator.rootPlaceholder')" />
        </div>
      </div>

      <div class="flex gap-4 mt-4">
        <label class="label cursor-pointer justify-start gap-3">
          <input v-model="ssl" type="checkbox" class="checkbox checkbox-sm" />
          <span class="label-text">{{ t('tools.nginxGenerator.ssl') }}</span>
        </label>
        <label class="label cursor-pointer justify-start gap-3">
          <input v-model="hsts" type="checkbox" class="checkbox checkbox-sm" :disabled="!ssl" />
          <span class="label-text">{{ t('tools.nginxGenerator.hsts') }}</span>
        </label>
        <label class="label cursor-pointer justify-start gap-3">
          <input v-model="gzip" type="checkbox" class="checkbox checkbox-sm" />
          <span class="label-text">{{ t('tools.nginxGenerator.gzip') }}</span>
        </label>
        <label class="label cursor-pointer justify-start gap-3">
          <input v-model="staticCache" type="checkbox" class="checkbox checkbox-sm" :disabled="siteType !== 'static'" />
          <span class="label-text">{{ t('tools.nginxGenerator.staticCache') }}</span>
        </label>
      </div>

      <div class="flex gap-4 mt-3">
        <label class="label cursor-pointer justify-start gap-3">
          <input v-model="siteType" type="radio" class="radio radio-sm" value="proxy" />
          <span class="label-text">{{ t('tools.nginxGenerator.proxy') }}</span>
        </label>
        <label class="label cursor-pointer justify-start gap-3">
          <input v-model="siteType" type="radio" class="radio radio-sm" value="static" />
          <span class="label-text">{{ t('tools.nginxGenerator.staticSite') }}</span>
        </label>
      </div>

      <div class="flex flex-wrap gap-4 mt-3">
        <label class="label cursor-pointer justify-start gap-3">
          <input v-model="websocket" type="checkbox" class="checkbox checkbox-sm" :disabled="siteType !== 'proxy'" />
          <span class="label-text">{{ t('tools.nginxGenerator.websocket') }}</span>
        </label>
        <label class="label cursor-pointer justify-start gap-3">
          <input v-model="php" type="checkbox" class="checkbox checkbox-sm" :disabled="siteType !== 'static'" />
          <span class="label-text">{{ t('tools.nginxGenerator.php') }}</span>
        </label>
      </div>
      <div v-if="php" class="mt-3 md:w-1/2">
        <div class="form-control">
          <label class="label"><span class="label-text">{{ t('tools.nginxGenerator.phpBackend') }}</span></label>
          <input v-model="phpBackend" class="input input-bordered font-mono input-sm" :placeholder="t('tools.nginxGenerator.phpBackendPlaceholder')" />
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between mb-3">
      <h2 class="text-xl font-mono font-bold">{{ t('tools.nginxGenerator.generated') }}</h2>
      <button class="btn btn-outline btn-sm" @click="copy"><i class="fas fa-copy mr-1"></i>{{ t('tools.nginxGenerator.copy') }}</button>
    </div>
    <pre class="mockup-code p-4 text-sm whitespace-pre-wrap">{{ config }}</pre>
  </div>
</template>
