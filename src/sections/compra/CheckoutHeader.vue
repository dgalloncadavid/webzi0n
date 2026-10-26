<script setup>
/* Checkout · encabezado: logo, pasos con barra de progreso (compra)
   o sello del procesador de pago (páginas de pago), y selector de idioma. */
import { asset } from '@/design-system/asset'
import { RouterLink } from 'vue-router'
import Icon from '@/design-system/components/Icon.vue'
import LangSwitch from '@/design-system/components/LangSwitch.vue'
import { useT } from '@/design-system/composables/useLang'

defineProps({
  /** [{ go, label, num, hidden, cur, ok }] (solo en /compra) */
  steps: { type: Array, default: null },
  fill: { type: String, default: '0%' },
  safe: { type: String, default: '' }
})
const emit = defineEmits(['step'])
const { t } = useT()
</script>

<template>
<header class="top">
  <div class="top-in">
    <RouterLink to="/" class="logo" :aria-label="t('Volver a Zi0n')"><img :src="asset('assets/logo-white.svg')" width="138" height="32" alt="Zi0n"></RouterLink>
    <nav v-if="steps" class="stepper" id="stepper" :aria-label="t('Pasos de la compra')">
      <button v-for="s in steps" :key="s.go" type="button" class="sp" :class="{ cur: s.cur, ok: s.ok }" :data-go="s.go" :hidden="s.hidden" :aria-current="s.cur ? 'step' : 'false'" @click="emit('step', s.go)"><b>{{ s.num }}</b><span>{{ t(s.label) }}</span></button>
    </nav>
    <div class="top-r">
      <span v-if="safe" class="safe"><span class="ico"><Icon name="lock" /></span><span>{{ t(safe) }}</span></span>
      <LangSwitch variant="compact" :mark-lang="false" />
    </div>
  </div>
  <i v-if="steps" class="sbar"><i id="sfill" :style="{ width: fill }"></i></i>
</header>
</template>

<style scoped>
.top{position:sticky;top:0;z-index:20;background:rgba(var(--rgb-ink),.86);backdrop-filter:blur(var(--zn-blur-12));-webkit-backdrop-filter:blur(var(--zn-blur-12));border-bottom:1px solid var(--color-line);padding-top:env(safe-area-inset-top)}
.top-in{max-width:var(--layout-max-width-checkout);margin:0 auto;padding:0 var(--pad);height:var(--layout-header-height-checkout);display:flex;align-items:center;justify-content:space-between;gap:var(--zn-space-24)}
.logo img{height:22.4px;width:auto}
.top-r{display:flex;align-items:center;gap:var(--zn-space-16)}
.safe{display:inline-flex;align-items:center;gap:var(--zn-space-8);font:var(--zn-weight-medium) 12px/16px var(--font-mono);letter-spacing:.6px;text-transform:uppercase;color:var(--color-ice)}
.safe .ico{width:16px;height:16px;color:var(--color-signal)}

.stepper{position:relative;flex:1;display:flex;justify-content:center;gap:28px;max-width:none;margin:0;padding:0}
.sp{display:flex;align-items:center;gap:var(--zn-space-8);font:var(--zn-weight-medium) 12px/18px var(--font-mono);letter-spacing:.3px;color:var(--color-muted);cursor:default}
.sp b{width:24px;height:24px;border-radius:var(--radius-round);display:grid;place-items:center;border:1.5px solid var(--color-line-strong);font:var(--zn-weight-extrabold) 12px/1 var(--font-mono);transition:var(--dur-medium)}
.sp.cur{color:var(--color-mist)}.sp.cur b{border-color:var(--color-signal);color:var(--color-signal);box-shadow:0 0 14px rgba(var(--rgb-signal),.4)}
.sp.ok{color:var(--color-ice);cursor:pointer}.sp.ok b{background:var(--color-signal);border-color:var(--color-signal);color:var(--color-ink)}
.sp.ok:hover span{color:var(--color-mist);text-decoration:underline;text-underline-offset:3px}
.sp[hidden]{display:none}
.sbar{position:absolute;left:0;right:0;bottom:-1px;height:2px;border-radius:0;background:transparent;overflow:hidden}
.sbar>i{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:0 2px 2px 0;background:linear-gradient(90deg,var(--color-aurora),var(--color-signal));box-shadow:0 0 10px rgba(var(--rgb-signal),.6);transition:width var(--zn-dur-600) var(--ease)}

@media (max-width:980px){
  .stepper{gap:18px}
  .sp span{display:none}
}
@media (max-width:640px){
  .top-in{height:60px;gap:var(--zn-space-10)}
  .logo img{height:19.2px}
  .safe span:last-child{display:none}
  .stepper{gap:8px}
  .sp{letter-spacing:0;text-align:center}
  .sp b{width:26px;height:26px}
  .top-r :deep(.lang button){padding:3px 8px;font-size:12px}
}
</style>
