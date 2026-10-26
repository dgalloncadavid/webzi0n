<script setup>
/* GrapheneOS · hero con comparador de capas y burbujas flotantes. */
import { asset } from '@/design-system/asset'
import { ref } from 'vue'
import Button from '@/design-system/components/Button.vue'
import FloatingChip from '@/design-system/components/FloatingChip.vue'
import LayerCompare from '@/design-system/components/LayerCompare.vue'
import Icon from '@/design-system/components/Icon.vue'
import { useT } from '@/design-system/composables/useLang'

const { t } = useT()
const hero = ref(null)
</script>

<template>
<section ref="hero" class="sec hero" id="hero" :aria-label="t('Zi0n para GrapheneOS')">
  <div class="frame hero-in">
    <div class="copy">
      <h1 v-reveal class="h1 rv">{{ t('GrapheneOS no perdona errores. Zi0n te cubre.') }}</h1>
      <p v-reveal class="body-lg rv" style="--d:.08s">{{ t('Se instala sobre tu GrapheneOS, borra lo que olvidas y te avisa antes de borrar todo.') }}</p>
      <div v-reveal class="ctas rv" style="--d:.16s">
        <Button to="/compra?tipo=prueba" size="lg" variant="primary">{{ t('Probar 15 días gratis') }}</Button>
        <Button to="#pin" size="lg" variant="secondary">{{ t('Ver cómo funciona') }}</Button>
      </div>
      <p v-reveal class="mono muted rv" style="--d:.24s;width:395px">{{ t('Instalación guiada paso a paso · Sin compromiso') }}</p>
    </div>

    <div class="hvbox">
    <LayerCompare
      variant="graphene"
      :parallax-area="hero"
      :aria-label="t('Comparador: capa visible y capa oculta del teléfono')"
      :handle-label="t('Deslizar para ver la capa oculta')"
      :base="{ src: asset('assets/grapheneos/phone-oculta.png'), alt: t('Teléfono con la capa oculta de Zi0n: apps cripto') }"
      :visible="{ src: asset('assets/grapheneos/phone-visible.png'), alt: t('Teléfono con la capa visible: apps comunes') }"
    >
      <template #back>
        <span class="aurora"></span>
        <span class="ring" style="left:82px;top:114.8px;width:377.2px;height:377.2px;--a:.16"></span>
        <span class="ring" style="left:41px;top:73.8px;width:459.2px;height:459.2px;--a:.10"></span>
        <span class="ring" style="left:0;top:32.8px;width:541.2px;height:541.2px;--a:.06"></span>
      </template>
      <FloatingChip variant="compact" tone="ice" style="left:6.56px;top:524.8px">{{ t('Capa visible') }}</FloatingChip>
      <FloatingChip variant="compact" tone="signal" style="left:385.4px;top:78.72px">{{ t('Capa oculta') }}</FloatingChip>
      <div class="hb c-alt fl" style="left:459.2px;top:270.6px;--fd:0s"><span class="ico"><Icon name="bell-ringing" /></span></div>
      <div class="hb c-sig fl" style="left:-4.92px;top:164px;--fd:-1.4s"><span class="ico"><Icon name="shield-lock" /></span></div>
      <div class="hb c-aur fl" style="left:410px;top:500.2px;--fd:-2.6s"><span class="ico"><Icon name="key-off" /></span></div>
    </LayerCompare>
    </div>
  </div>
</section>
</template>

<style scoped>
.hero-in{height:700px;display:flex;align-items:center;justify-content:space-between;padding:40px 64px 40px 80px}
.copy{width:540px;display:flex;flex-direction:column;gap:var(--zn-space-24);align-items:flex-start}
.ctas{display:flex;gap:var(--zn-space-16);align-items:center}
.aurora{position:absolute;left:57.4px;top:90.2px;width:426.4px;height:426.4px}
.aurora::before{content:"";position:absolute;inset:-25%;border-radius:var(--radius-round);background:radial-gradient(closest-side,rgba(var(--rgb-signal),.42),rgba(var(--rgb-signal),.14) 55%,rgba(var(--rgb-signal),0));animation:breathe 7s var(--zn-ease-in-out) infinite}
.aurora::after{content:"";position:absolute;left:22%;top:20%;width:90%;height:90%;border-radius:var(--radius-round);background:radial-gradient(closest-side,rgba(var(--rgb-aurora),.28),rgba(var(--rgb-aurora),0));animation:breathe 9s var(--zn-ease-in-out) -3s infinite}
@keyframes breathe{0%,100%{transform:scale(1);opacity:.9}50%{transform:scale(1.08);opacity:1}}
.hb{position:absolute;width:51.66px;height:51.66px;display:grid;place-items:center;border-radius:var(--radius-round);background:var(--color-ink);border:1.23px solid rgb(var(--rgb));box-shadow:0 0 18px rgba(var(--rgb),.45);backdrop-filter:blur(var(--zn-blur-4));pointer-events:none}
.hb .ico{width:32.8px;height:32.8px;color:rgb(var(--rgb))}
.fl{animation:floaty 6s var(--zn-ease-in-out) var(--fd,0s) infinite}
@keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@media (max-width:1023px){
  .hero-in{height:auto;flex-direction:column;align-items:stretch;gap:40px;padding:40px var(--pad) 64px}
  .copy{width:auto;gap:var(--zn-space-20)}
  .copy .mono{width:auto!important}
  .ctas{flex-direction:column;align-items:stretch;width:100%;gap:var(--zn-space-12)}
  .ctas .btn{width:100%;touch-action:manipulation}
  .hvbox{display:block;position:relative;width:calc(541.2px * var(--hs,1));height:calc(598.6px * var(--hs,1));margin:0 auto}
  .chip{transform:scale(var(--hinv,1));transform-origin:left bottom}
  /* el original apunta a .chip:nth-of-type(2), que en este DOM no es un chip: no aplica */
  .chip:nth-of-type(2){transform-origin:right top}
}
@media (min-width:600px) and (max-width:1023px){
  .ctas{flex-direction:row;width:auto}
  .ctas .btn{width:auto}
}
@media (max-width:1023px){
  .hero-in{padding-top:32px;padding-bottom:40px;gap:32px}
}
</style>
