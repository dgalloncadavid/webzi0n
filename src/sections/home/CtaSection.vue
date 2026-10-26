<script setup>
/* Inicio · CTA final con botón magnético. */
import { ref } from 'vue'
import Button from '@/design-system/components/Button.vue'
import { useT } from '@/design-system/composables/useLang'
import { useMagnetic } from '@/design-system/composables/useMagnetic'

const { t } = useT()
const sec = ref(null)
const cta = ref(null)
useMagnetic(() => cta.value.$el, sec, { kx: 0.2, ky: 0.28, mouseOnly: true })
</script>

<template>
<section ref="sec" class="sec end" id="prueba" aria-labelledby="e-t">
  <div class="wrap">
    <div v-reveal class="band rv">
      <span class="tglow t1"></span><span class="tglow t2"></span>
      <h2 class="h2" id="e-t">{{ t('Empieza hoy, con 15 días gratis') }}</h2>
      <p class="body-lg">{{ t('Instala Zi0n en tu Samsung, pruébalo en tu día a día y decide después.') }}</p>
      <div class="ctas">
        <Button ref="cta" to="/compra?tipo=prueba" size="lg" variant="primary" class="cta-btn" id="cta">{{ t('Probar 15 días gratis') }}</Button>
        <Button to="#planes" size="lg" variant="ghost">{{ t('Ver planes') }}</Button>
      </div>
    </div>
  </div>
</section>
</template>

<style scoped>
.end{padding-top:0!important}
.band{position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;gap:var(--zn-space-24);padding:var(--zn-space-72) var(--zn-space-48);border-radius:var(--radius-card);background:var(--color-navy);border:1px solid var(--color-line);box-shadow:0 0 40px rgba(var(--rgb-aurora),.25);text-align:center}
.band>*:not(.tglow){position:relative}
.tglow{position:absolute;width:520px;height:520px;border-radius:var(--radius-round);pointer-events:none}
.t1{left:-160px;top:-260px;background:radial-gradient(closest-side,rgba(var(--rgb-signal),.28),rgba(var(--rgb-signal),0));animation:drift1 12s var(--zn-ease-in-out) infinite}
.t2{right:-180px;bottom:-280px;background:radial-gradient(closest-side,rgba(var(--rgb-aurora),.4),rgba(var(--rgb-aurora),0));animation:drift2 14s var(--zn-ease-in-out) infinite}
@keyframes drift1{0%,100%{transform:translate(0,0)}50%{transform:translate(120px,60px)}}
@keyframes drift2{0%,100%{transform:translate(0,0)}50%{transform:translate(-120px,-50px)}}
.cta-btn{position:relative;transition:transform var(--zn-dur-150) linear,box-shadow var(--dur-medium)}
.cta-btn::after{content:"";position:absolute;inset:0;border-radius:var(--radius-button);box-shadow:0 0 0 0 rgba(var(--rgb-signal),.5);animation:ctap 2.6s var(--zn-ease-out) infinite}
@keyframes ctap{0%{box-shadow:0 0 0 0 rgba(var(--rgb-signal),.45)}100%{box-shadow:0 0 0 16px rgba(var(--rgb-signal),0)}}
.ctas{display:flex;gap:var(--zn-space-16);flex-wrap:wrap}
.band .ctas{justify-content:center}
@media (max-width:640px){
  .ctas{flex-wrap:nowrap;gap:var(--zn-space-10)}
  .ctas .btn{flex:1 1 0;padding:var(--zn-space-12) var(--zn-space-10);font-size:15px;line-height:22px}
  .band{padding:var(--zn-space-44) var(--zn-space-22)}
  .band .ctas{flex-direction:column;align-items:stretch;width:100%}
  .band .ctas .btn{flex:none;padding:var(--zn-space-16) var(--zn-space-20);font-size:16px}
}
@media (max-width:380px){
  .ctas .btn{font-size:14px}
}
</style>
