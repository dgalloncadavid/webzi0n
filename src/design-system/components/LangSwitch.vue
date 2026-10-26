<script setup>
/* Selector ESP / ENG. Cambia el idioma de todo el sitio y lo guarda en 'zion-lang'.
   variant: default (landings) | compact (checkout: 13 px y sin transición) */
import { lang, setLang, useT } from '../composables/useLang'

defineProps({
  variant: { type: String, default: 'default' },
  /** Las landings marcan cada botón con su atributo lang; el checkout no */
  markLang: { type: Boolean, default: true }
})
const { t } = useT()
</script>

<template><div class="lang" :class="'lang--' + variant" role="group" :aria-label="t('Idioma')"><button :class="{ on: lang === 'es' }" type="button" :aria-pressed="String(lang === 'es')" :lang="markLang ? 'es' : undefined" @click="setLang('es')">ESP</button><button :class="{ on: lang === 'en' }" type="button" :aria-pressed="String(lang === 'en')" :lang="markLang ? 'en' : undefined" @click="setLang('en')">ENG</button></div></template>

<style scoped>
.lang{display:flex;gap:var(--zn-space-4);padding:var(--zn-space-4);border-radius:var(--radius-pill);background:var(--color-glass);border:1px solid var(--color-line)}
.lang button{padding:var(--zn-space-4) var(--zn-space-12);border-radius:var(--radius-pill);font:var(--zn-weight-medium) 14px/20px var(--font-mono);color:var(--color-ice);border:1px solid transparent;transition:var(--dur-fast)}
.lang button.on{background:rgba(var(--rgb-signal),.16);border-color:var(--color-signal);color:var(--color-mist)}
.lang--compact{background:var(--color-glass-checkout)}
.lang--compact button{font-size:13px;transition:none}
</style>
