<script setup>
/* Barra de acciones fija abajo del checkout: atrás, "aún tengo dudas", aviso,
   total y botón principal. backTo convierte "Atrás" en enlace.
   Superficie fija: oscura. */
import Icon from './Icon.vue'
import Button from './Button.vue'
import { useT } from '../composables/useLang'

defineProps({
  showBack: { type: Boolean, default: true },
  backTo: { type: String, default: null },
  doubtTo: { type: String, default: '/#faq' },
  hint: { type: String, default: '' },
  total: { type: String, default: '-' },
  nextLabel: { type: String, required: true },
  nextDisabled: { type: Boolean, default: null },
  nextIcon: { type: Boolean, default: false }
})
const emit = defineEmits(['back', 'next'])
const { t } = useT()
</script>

<template>
<div class="bar" id="bar" data-theme="dark">
  <div class="bar-in">
    <div class="bar-l">
      <Button :to="backTo" size="xl" variant="ghost" id="bBack" :hidden="!showBack" @click="!backTo && emit('back')"><span class="ico"><Icon name="arrow-left" /></span><span class="bl">{{ t('Atrás') }}</span></Button>
      <Button :to="doubtTo" size="xl" variant="text" id="bDoubt">{{ t('Aún tengo dudas') }}</Button>
    </div>
    <div class="bar-r">
      <p class="bar-hint" :class="{ on: !!hint }" id="bHint" role="alert">{{ hint }}</p>
      <div class="bar-tot"><span>{{ t('Total') }}</span><b id="bTotal">{{ total }}</b></div>
      <Button size="xl" variant="primary" id="bNext" :disabled="nextDisabled" @click="emit('next')"><span id="bNextT">{{ nextLabel }}</span><span v-if="nextIcon" class="ico"><Icon name="arrow-right" /></span></Button>
    </div>
  </div>
</div>
</template>

<style scoped>
.bar{position:fixed;left:0;right:0;bottom:0;z-index:40;background:rgba(var(--rgb-ink),.9);backdrop-filter:blur(var(--zn-blur-14));-webkit-backdrop-filter:blur(var(--zn-blur-14));border-top:1px solid var(--color-line-strong);box-shadow:var(--shadow-bar);padding-bottom:env(safe-area-inset-bottom);animation:barIn var(--zn-dur-500) var(--ease)}
@keyframes barIn{from{transform:translateY(100%)}to{transform:none}}
.bar-in{max-width:var(--layout-max-width-checkout);margin:0 auto;padding:var(--zn-space-14) var(--pad);display:flex;align-items:center;justify-content:space-between;gap:var(--zn-space-16)}
.bar-l,.bar-r{display:flex;align-items:center;gap:var(--zn-space-12)}
.bar-r{flex:1;justify-content:flex-end}
.bar .btn{min-height:52px}
.bar #bNext{min-width:240px}
.bar-tot{display:flex;flex-direction:column;align-items:flex-end;line-height:1}
.bar-tot span{font:var(--zn-weight-medium) 11px/14px var(--font-mono);letter-spacing:.6px;text-transform:uppercase;color:var(--color-muted)}
.bar-tot b{font:var(--zn-weight-extrabold) 20px/26px var(--font-mono);color:var(--color-mist)}
.bar-hint{flex:1;text-align:right;font:var(--zn-weight-medium) 13px/18px var(--font-sans);color:var(--color-amber);opacity:0;transform:translateY(4px);transition:var(--dur-base) var(--ease)}
.bar-hint.on{opacity:1;transform:none}
@media (max-width:640px){
  .bar-in{padding:var(--zn-space-10) var(--pad) var(--zn-space-12);flex-wrap:wrap;gap:var(--zn-space-8)}
  .bar-l{order:2;gap:var(--zn-space-6)}
  .bar-r{order:1;width:100%;flex:none;flex-wrap:wrap;gap:var(--zn-space-8)}
  .bar-hint{order:-1;width:100%;text-align:center;flex:none}
  .bar-hint:not(.on){display:none}
  .bar-tot{order:0}
  .bar #bNext{flex:1;min-width:0}
  .bar-l{width:100%;justify-content:space-between}
  .bar .btn{min-height:48px}
  .bar .btn-ghost{padding:var(--zn-space-10) var(--zn-space-14)}
  .btn-text{padding:var(--zn-space-10) var(--zn-space-4);font-size:14px}
}
</style>
