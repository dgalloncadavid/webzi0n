<script setup>
/* Checkout · modal con todas las apps de una tienda. */
import { ref, computed } from 'vue'
import Button from '@/design-system/components/Button.vue'
import Icon from '@/design-system/components/Icon.vue'
import { useT } from '@/design-system/composables/useLang'
import { STORES, STORE_NAMES, appIcon } from './order'

const emit = defineEmits(['pick'])
const { t, fmt } = useT()
const dlg = ref(null)
const id = ref('exchange')
const store = computed(() => STORES.find((s) => s.id === id.value))
function open(s) {
  id.value = s
  if (dlg.value.showModal) dlg.value.showModal(); else dlg.value.setAttribute('open', '')
}
function close() { if (dlg.value.close) dlg.value.close(); else dlg.value.removeAttribute('open') }
function pick() { emit('pick', id.value); close() }
defineExpose({ open })
</script>

<template>
<dialog ref="dlg" class="modal" id="storeModal" aria-labelledby="mTitle" @click="$event.target === dlg && close()">
  <div class="m-in">
    <button type="button" class="m-x" id="mClose" :aria-label="t('Cerrar')" @click="close"><span class="ico"><Icon name="x" /></span></button>
    <p class="kicker" id="mKick">{{ fmt('{n} apps disponibles', { n: store.apps.length }) }}</p>
    <h2 class="h3" id="mTitle">{{ t(STORE_NAMES[id]) }}</h2>
    <p class="lead sm" id="mDesc">{{ t(store.desc) }}</p>
    <div :key="id" class="m-grid" id="mGrid"><span v-for="(a, i) in store.apps" :key="a" class="app" :style="'--i:' + i"><img :src="appIcon(a)" width="56" height="56" alt="">{{ a }}</span></div>
    <div class="actions">
      <Button size="xl" variant="ghost" id="mOther" @click="close">{{ t('Ver otra tienda') }}</Button>
      <Button size="xl" variant="primary" id="mPick" @click="pick">{{ t('Elegir esta tienda') }}</Button>
    </div>
  </div>
</dialog>
</template>

<style scoped>
.modal{width:min(760px,calc(100vw - 32px));max-height:calc(100dvh - 48px);padding:0;border:1px solid var(--color-line-strong);border-radius:var(--zn-radius-28);background:var(--zn-surface-checkout);color:var(--color-mist);box-shadow:var(--shadow-modal)}
.modal::backdrop{background:rgba(var(--zn-night-rgb),.72);backdrop-filter:blur(6px)}
.modal[open]{animation:pop .35s var(--ease)}
@keyframes pop{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}
.m-in{position:relative;padding:var(--zn-space-32);display:flex;flex-direction:column;gap:var(--zn-space-10)}
.m-x{position:absolute;top:18px;right:18px;width:40px;height:40px;border-radius:var(--zn-radius-12);display:grid;place-items:center;border:1px solid var(--color-line);color:var(--color-ice)}
.m-x .ico{width:18px;height:18px}
.m-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:16px 10px;margin:14px 0 6px}
.app{display:flex;flex-direction:column;align-items:center;gap:var(--zn-space-8);font:var(--zn-weight-regular) 12px/16px var(--font-sans);color:var(--color-ice);text-align:center;animation:appIn .4s var(--ease) both;animation-delay:calc(var(--i)*18ms)}
.app img{width:56px;height:56px;border-radius:var(--zn-radius-14)}
@keyframes appIn{from{opacity:0;transform:translateY(8px) scale(.9)}to{opacity:1;transform:none}}
@media (max-width:640px){
  .m-in{padding:24px 18px}
  .m-grid{grid-template-columns:repeat(4,1fr);gap:14px 6px}
  .app img{width:48px;height:48px;border-radius:var(--zn-radius-12)}
}
</style>
