<script setup>
/* Checkout · paso 2: tienda de apps (una sola). "Ver las N apps" abre el modal. */
import { inject } from 'vue'
import RadioCard from '@/design-system/components/RadioCard.vue'
import { useT } from '@/design-system/composables/useLang'
import { STORES, STORE_NAMES, appIcon } from './order'

const { t, fmt } = useT()
const c = inject('checkout')
</script>

<template>
      <div class="step" data-step="2">
        <p class="kicker kick" data-k="2">{{ c.kick(2) }}</p>
        <h2 class="h2">{{ t('Elige tu tienda de apps') }}</h2>
        <p class="lead">{{ t('Son las apps que tendrás disponibles para instalar en tu celular. Eliges una tienda; no se pueden mezclar.') }}</p>
        <div class="stores" id="stores" role="radiogroup" :aria-label="t('Tienda de apps')"><RadioCard v-for="s in STORES" :key="s.id" v-model="c.S.tienda" variant="store" name="tienda" :value="s.id" :title="t(STORE_NAMES[s.id])" :text="t(s.desc)" :apps="s.apps.slice(0, 5).map(appIcon)" :more="s.apps.length - 5" :action-label="fmt('Ver las {n} apps', { n: s.apps.length })" @action="c.openStore" /></div>
      </div>
</template>

<style scoped>
.stores{display:grid;grid-template-columns:1fr 1fr;gap:var(--zn-space-12);margin-top:var(--zn-space-8)}
@media (max-width:640px){
  .stores{grid-template-columns:1fr}
}
</style>
