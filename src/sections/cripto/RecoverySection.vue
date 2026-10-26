<script setup>
/* Cripto · recuperación: los tres pasos se iluminan en secuencia mientras se ven. */
import { ref, onBeforeUnmount } from 'vue'
import Card from '@/design-system/components/Card.vue'
import { useT } from '@/design-system/composables/useLang'
import { useInView } from '@/design-system/composables/useInView'

const { t } = useT()
const flow = ref(null)
const act = ref(-1)
let tm = null
function go() { act.value = (act.value + 1) % 3 }
useInView(flow, {
  threshold: 0.4,
  onChange(on) {
    if (on) { if (!tm) { go(); tm = setInterval(go, 2400) } }
    else { clearInterval(tm); tm = null }
  }
})
onBeforeUnmount(() => clearInterval(tm))
</script>

<template>
<section class="sec" id="recuperacion" :aria-label="t('Recuperación')">
  <div class="wrap rec">
    <div v-reveal class="rec-copy rv">
      <span class="eyebrow-b">{{ t('Importante') }}</span>
      <h2 class="h2">{{ t('Borrar no es perder tus apps.') }}</h2>
      <p class="body-lg">{{ t('Tus criptos no viven en el celular, viven en la blockchain. Si el sistema se borra, reinstalas Zi0n por QR, reimportas tus credenciales y recuperas el acceso a tus apps.') }}</p>
    </div>
    <Card ref="flow" v-reveal as="div" class="flow rv" id="flow" style="--d:.1s">
      <div class="fstep f1" :class="{ act: act === 0 }"><span class="fnum">1</span><div><h3 class="h5">{{ t('Se borra') }}</h3><p class="small">{{ t('El dispositivo elimina el sistema aislado y sus apps.') }}</p></div>
        <svg class="fill-ill" viewBox="0 0 60 40" aria-hidden="true"><g class="blocks"><rect x="4" y="6" width="12" height="12" rx="3"/><rect x="24" y="6" width="12" height="12" rx="3"/><rect x="44" y="6" width="12" height="12" rx="3"/><rect x="4" y="22" width="12" height="12" rx="3"/><rect x="24" y="22" width="12" height="12" rx="3"/><rect x="44" y="22" width="12" height="12" rx="3"/></g></svg>
      </div>
      <div class="fstep f2" :class="{ act: act === 1 }"><span class="fnum">2</span><div><h3 class="h5">{{ t('Reinstalas por QR') }}</h3><p class="small">{{ t('Escaneas el código y regeneras tu entorno.') }}</p></div>
        <svg class="fill-ill" viewBox="0 0 60 40" aria-hidden="true"><g class="qr"><rect x="16" y="4" width="28" height="32" rx="4"/><rect x="21" y="9" width="7" height="7" rx="1"/><rect x="32" y="9" width="7" height="7" rx="1"/><rect x="21" y="20" width="7" height="7" rx="1"/><rect x="33" y="21" width="3" height="3"/><rect x="36" y="25" width="3" height="3"/></g><line class="scanl" x1="12" y1="8" x2="48" y2="8"/></svg>
      </div>
      <div class="fstep f3" :class="{ act: act === 2 }"><span class="fnum">3</span><div><h3 class="h5">{{ t('Recuperas con tus datos') }}</h3><p class="small">{{ t('Reimportas tus wallets con nuestro módulo de reinstalación.') }}</p></div>
        <svg class="fill-ill" viewBox="0 0 60 40" aria-hidden="true"><circle class="okc" cx="30" cy="20" r="15"/><path class="okp" d="M23 20.5l5 5 9-10" pathLength="30"/></svg>
      </div>
    </Card>
  </div>
</section>
</template>

<style scoped>
.rec{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,553px);gap:var(--zn-space-48);align-items:center}
.rec-copy{display:flex;flex-direction:column;gap:var(--zn-space-16);align-items:flex-start}
.eyebrow-b{display:inline-flex;align-self:center;padding:var(--zn-space-4) var(--zn-space-12);border-radius:var(--radius-pill);background:var(--color-glass);border:1px solid var(--color-line);font:var(--zn-weight-medium) 12px/16px var(--font-mono);letter-spacing:.96px;text-transform:uppercase;color:var(--color-ice)}
.rec-copy .eyebrow-b{align-self:flex-start}
.flow{padding:var(--zn-space-32);display:flex;flex-direction:column;gap:var(--zn-space-16)}
.flow:hover{transform:none}
.fstep{position:relative;display:grid;grid-template-columns:48px 1fr 60px;align-items:center;gap:var(--zn-space-16);padding:var(--zn-space-20);border-radius:var(--zn-radius-16);border:1px solid transparent;transition:background var(--zn-dur-500),border-color var(--zn-dur-500),transform var(--zn-dur-500) var(--ease),box-shadow var(--zn-dur-500)}
.fstep .h5{margin-bottom:var(--zn-space-4)}
.fnum{width:48px;height:48px;border-radius:var(--radius-round);display:grid;place-items:center;font:var(--zn-weight-extrabold) 22px/30px var(--font-mono)}
.f1{background:rgba(var(--rgb-alert),.12)}.f1 .fnum{background:var(--color-alert);color:var(--color-ink)}
.f2{background:rgba(var(--rgb-ice),.07)}.f2 .fnum{background:var(--zn-step-navy);color:var(--color-mist)}
.f3{background:rgba(var(--rgb-signal),.1)}.f3 .fnum{background:var(--color-signal);color:var(--color-ink)}
.fstep.act{transform:scale(1.02);border-color:rgba(var(--rgb),.6);box-shadow:0 0 28px -6px rgba(var(--rgb),.55)}
.f1{--rgb:var(--rgb-alert)}.f2{--rgb:var(--rgb-aurora)}.f3{--rgb:var(--rgb-signal)}
.fill-ill{width:60px;height:40px;fill:none;stroke:var(--color-ice);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.f1 .blocks rect{stroke:var(--color-alert);transform-box:fill-box;transform-origin:center}
.f1.act .blocks rect{animation:fly var(--zn-dur-1600) var(--ease) both}
.f1.act .blocks rect:nth-child(2){animation-delay:.08s}.f1.act .blocks rect:nth-child(3){animation-delay:.16s}.f1.act .blocks rect:nth-child(4){animation-delay:.24s}.f1.act .blocks rect:nth-child(5){animation-delay:.32s}.f1.act .blocks rect:nth-child(6){animation-delay:.4s}
@keyframes fly{0%{opacity:1;transform:none}60%,100%{opacity:0;transform:translateY(-10px) scale(.4)}}
.f2 .scanl{stroke:var(--color-aurora);stroke-width:2;filter:drop-shadow(0 0 4px var(--color-aurora));opacity:0}
.f2.act .scanl{animation:scan var(--zn-dur-1400) var(--zn-ease-in-out) infinite}
@keyframes scan{0%{transform:translateY(0);opacity:1}50%{transform:translateY(24px);opacity:1}100%{transform:translateY(0);opacity:1}}
.f3 .okc{stroke:var(--color-signal);stroke-opacity:.5}
.f3 .okp{stroke:var(--color-signal);stroke-width:2.4;stroke-dasharray:30;stroke-dashoffset:30}
.f3.act .okp{animation:okd var(--zn-dur-800) var(--ease) .2s forwards}
@keyframes okd{to{stroke-dashoffset:0}}
@media (max-width:1023px){
  .rec{grid-template-columns:1fr;gap:var(--zn-space-32)}
}
@media (max-width:640px){
  .flow{padding:var(--zn-space-16)}
  .fstep{grid-template-columns:44px 1fr;padding:var(--zn-space-16);gap:var(--zn-space-14)}
  .fnum{width:44px;height:44px;font-size:20px}
  .fill-ill{display:none}
}
</style>
