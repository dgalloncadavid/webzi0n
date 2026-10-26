<script setup>
/* Cripto · cómo funciona: cuatro pasos sobre un riel que se llena al aparecer. */
import SectionHeader from '@/design-system/components/SectionHeader.vue'
import StepCard from '@/design-system/components/StepCard.vue'
import { useT } from '@/design-system/composables/useLang'

const { t } = useT()
const steps = [
  { tone: 'aurora', icon: 'qrcode', title: 'Instalas por QR', text: 'Activa tu entorno seguro en minutos.' },
  { tone: 'aurora', icon: 'eye-off', title: 'Aíslas tus apps', text: 'Las wallets y apps que más valor tienen quedan en una capa aparte.' },
  { tone: 'signal', icon: 'refresh', title: 'Operas como siempre', text: 'Mismas apps, mismo flujo, en tiempo real.' },
  { tone: 'alert', icon: 'trash', title: 'Si algo sale mal, se borra', text: 'El sistema se elimina antes de dar acceso.' }
]
</script>

<template>
<section class="sec" id="pasos" :aria-label="t('Cómo funciona')">
  <div class="glowbg" style="--rgb:var(--rgb-aurora);right:-12%;top:0"></div>
  <div class="wrap">
    <SectionHeader v-reveal class="rv" :eyebrow="t('Cómo funciona')" :title="t('Protección en cuatro pasos')" />
    <div v-reveal class="steps" id="steps">
      <div class="srail" aria-hidden="true"><i></i></div>
      <StepCard v-for="(s, k) in steps" :key="k" :style="'--i:' + k" :number="k + 1" :tone="s.tone" :icon="s.icon" :title="t(s.title)" :text="t(s.text)" />
    </div>
  </div>
</section>
</template>

<style scoped>
.steps{position:relative;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--zn-space-24);padding-top:var(--zn-space-28)}
.srail{position:absolute;left:44px;right:44px;top:0;height:3px;border-radius:3px;background:rgba(var(--rgb-ice),.14)}
.srail i{position:absolute;inset:0;border-radius:3px;background:linear-gradient(90deg,var(--color-aurora),var(--color-signal) 66%,var(--color-alert));box-shadow:0 0 10px rgba(var(--rgb-signal),.6);transform:scaleX(0);transform-origin:left;transition:transform var(--zn-dur-2200) var(--ease) .2s}
.steps.in .srail i{transform:scaleX(1)}
.step::before{content:"";position:absolute;left:44px;top:-33px;width:13px;height:13px;border-radius:var(--radius-round);background:var(--color-ink);border:2px solid rgba(var(--rgb-ice),.4);transition:background var(--zn-dur-400),border-color var(--zn-dur-400),box-shadow var(--zn-dur-400);transition-delay:calc(.4s + var(--i)*.5s)}
.steps.in .step::before{background:var(--color-signal);border-color:var(--color-signal);box-shadow:0 0 12px var(--color-signal)}
.steps.in .step:last-child::before{background:var(--color-alert);border-color:var(--color-alert);box-shadow:0 0 12px var(--color-alert)}
.steps.in :deep(.nbadge){background:rgba(var(--rgb),.3);box-shadow:0 0 18px rgba(var(--rgb),.45)}
/* .steps .step iguala la prioridad que tenía .js .step frente a .card:hover en el original */
.steps .step{opacity:0;transform:translateY(18px);transition:opacity var(--zn-dur-700) var(--ease),transform var(--zn-dur-700) var(--ease),border-color var(--dur-medium),box-shadow var(--dur-medium);transition-delay:calc(var(--i)*.12s)}
.steps.in .step{opacity:1;transform:none}
@media (max-width:1023px){
  .steps{grid-template-columns:repeat(2,minmax(0,1fr));padding-top:0}
  .srail,.step::before{display:none}
}
@media (max-width:640px){
  .steps{grid-template-columns:1fr 1fr;gap:var(--zn-space-12)}
}
@media (prefers-reduced-motion:reduce){
  .steps .step{opacity:1;transform:none}
}
</style>
