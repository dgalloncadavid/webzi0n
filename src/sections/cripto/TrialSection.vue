<script setup>
/* Cripto · prueba gratuita con CTA magnético. */
import { ref } from 'vue'
import SectionHeader from '@/design-system/components/SectionHeader.vue'
import Button from '@/design-system/components/Button.vue'
import Icon from '@/design-system/components/Icon.vue'
import { useT } from '@/design-system/composables/useLang'
import { useMagnetic } from '@/design-system/composables/useMagnetic'

const { t } = useT()
const sec = ref(null)
const cta = ref(null)
useMagnetic(cta, sec, { kx: 0.2, ky: 0.28, mouseOnly: true })
const checks = ['Configuración en menos de 5 minutos', 'Soporte técnico 24/7', 'Cancelación sin compromiso']
</script>

<template>
<section ref="sec" class="sec" id="prueba" :aria-label="t('Prueba gratuita')">
  <div class="wrap">
    <div v-reveal class="trial rv">
      <span class="tglow t1"></span><span class="tglow t2"></span>
      <SectionHeader :eyebrow="t('Prueba gratuita')" :title="t('¿No sabes si Zi0n es para ti? Pruébalo 15 días.')" :lead="t('Configúralo en minutos y decide después. Sin compromiso.')" />
      <Button ref="cta" to="/compra?tipo=prueba" size="lg" variant="primary" class="cta-btn" id="cta">{{ t('Empezar prueba gratis') }}</Button>
      <ul class="checks">
        <li v-for="c in checks" :key="c"><span class="ck"><span class="ico"><Icon name="check" /></span></span>{{ t(c) }}</li>
      </ul>
    </div>
  </div>
</section>
</template>

<style scoped>
.trial{position:relative;overflow:hidden;max-width:928px;margin:0 auto;padding:var(--zn-space-48);border-radius:var(--radius-card);background:var(--color-navy);border:1px solid var(--color-line);box-shadow:0 0 40px rgba(var(--rgb-aurora),.3);display:flex;flex-direction:column;align-items:center;gap:var(--zn-space-32);text-align:center}
.trial .shead{margin:0;max-width:720px;position:relative}
.tglow{position:absolute;width:520px;height:520px;border-radius:var(--radius-round);pointer-events:none}
.t1{left:-160px;top:-260px;background:radial-gradient(closest-side,rgba(var(--rgb-signal),.28),rgba(var(--rgb-signal),0));animation:drift1 12s var(--zn-ease-in-out) infinite}
.t2{right:-180px;bottom:-280px;background:radial-gradient(closest-side,rgba(var(--rgb-aurora),.4),rgba(var(--rgb-aurora),0));animation:drift2 14s var(--zn-ease-in-out) infinite}
@keyframes drift1{0%,100%{transform:translate(0,0)}50%{transform:translate(120px,60px)}}
@keyframes drift2{0%,100%{transform:translate(0,0)}50%{transform:translate(-120px,-50px)}}
.cta-btn{position:relative;transition:transform var(--zn-dur-150) linear,box-shadow var(--dur-medium)}
.cta-btn::after{content:"";position:absolute;inset:0;border-radius:var(--radius-button);box-shadow:0 0 0 0 rgba(var(--rgb-signal),.5);animation:ctap 2.6s var(--zn-ease-out) infinite}
@keyframes ctap{0%{box-shadow:0 0 0 0 rgba(var(--rgb-signal),.45)}100%{box-shadow:0 0 0 16px rgba(var(--rgb-signal),0)}}
.checks{position:relative;display:flex;flex-wrap:wrap;justify-content:center;gap:var(--zn-space-12) var(--zn-space-32)}
.checks li{display:flex;align-items:center;gap:var(--zn-space-8);font:var(--zn-weight-regular) 14px/20px var(--font-sans);color:var(--color-ice)}
.ck{width:18px;height:18px;border-radius:var(--radius-round);display:grid;place-items:center;background:var(--color-signal);color:var(--color-ink);flex:none}
.ck .ico{width:11px;height:11px}
.ck .ic{stroke-width:2}
@media (max-width:640px){
  .trial{padding:var(--zn-space-36) var(--zn-space-20);gap:var(--zn-space-24)}
  .checks{flex-direction:column;align-items:flex-start;gap:var(--zn-space-10)}
}
</style>
