<script setup>
/* Cripto · hero con comparador de capas, chips flotantes y alerta de cable. */
import { asset } from '@/design-system/asset'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Button from '@/design-system/components/Button.vue'
import FloatingChip from '@/design-system/components/FloatingChip.vue'
import LayerCompare from '@/design-system/components/LayerCompare.vue'
import { useT } from '@/design-system/composables/useLang'
import { prefersReducedMotion } from '@/design-system/composables/useMedia'

const { t } = useT()
const hero = ref(null)
const box = ref(null)
const hs = ref('1.0000')
const flash = ref(false)
function fit() { hs.value = Math.min(1, box.value.clientWidth / 568).toFixed(4) }

let ro = null
let tm = null
let off = null
onMounted(() => {
  fit()
  ro = new ResizeObserver(fit)
  ro.observe(box.value)
  if (!prefersReducedMotion()) {
    tm = setInterval(() => {
      flash.value = true
      off = setTimeout(() => { flash.value = false }, 1200)
    }, 4200)
  }
})
onBeforeUnmount(() => { if (ro) ro.disconnect(); clearInterval(tm); clearTimeout(off) })
</script>

<template>
<section ref="hero" class="sec hero" id="hero" :aria-label="t('Zi0n Cripto')">
  <div class="wrap hero-in">
    <div class="copy">
      <h1 v-reveal class="h1 rv">{{ t('Tus wallets de siempre. Una capa que nadie más ve.') }}</h1>
      <p v-reveal class="body-lg rv" style="--d:.08s">{{ t('Opera con MetaMask, Trust Wallet, Phantom o la app que ya usas. Si alguien tiene tu celular en la mano, solo ve un teléfono común.') }}</p>
      <div v-reveal class="ctas rv" style="--d:.16s">
        <Button to="/compra?tipo=prueba" size="lg" variant="primary">{{ t('Probar 15 días gratis') }}</Button>
        <Button to="#pasos" size="lg" variant="ghost">{{ t('Ver cómo funciona') }}</Button>
      </div>
      <p v-reveal class="mono muted rv" style="--d:.24s">{{ t('Instalación por QR en minutos · Sin compromiso') }}</p>
    </div>

    <div ref="box" class="hvbox" :style="{ '--hs': hs }">
      <LayerCompare
        variant="cripto"
        :parallax-area="hero"
        :aria-label="t('Comparador: lo que ve otra persona y tu capa oculta')"
        :handle-label="t('Deslizar para comparar las dos capas')"
        :base="{ src: asset('assets/cripto/phone-oculta.png'), width: 600, height: 596, alt: t('Teléfono con la capa oculta de Zi0n: tus wallets y apps cripto') }"
        :visible="{ src: asset('assets/cripto/phone-visible.png'), width: 600, height: 596, alt: t('Teléfono con la capa visible: apps comunes') }"
      >
        <template #back>
          <span class="aurora"></span>
          <span class="ring" style="left:69px;top:115px;width:430px;height:430px;--a:.16"></span>
          <span class="ring" style="left:24px;top:70px;width:520px;height:520px;--a:.10"></span>
          <span class="ring" style="left:-21px;top:25px;width:610px;height:610px;--a:.06"></span>
        </template>
        <FloatingChip variant="float" tone="signal" style="left:-10px;top:120px">{{ t('Capa oculta · activa') }}</FloatingChip>
        <FloatingChip variant="float" tone="alert" class="chip-alert" :class="{ flash }" id="chipCable" style="left:20px;top:470px">{{ t('Cable detectado · PIN requerido') }}</FloatingChip>
        <FloatingChip variant="float" tone="aurora" style="left:350px;top:560px">{{ t('VPN dinámico · on') }}</FloatingChip>
      </LayerCompare>
    </div>
  </div>
</section>
</template>

<style scoped>
.hero{padding:var(--zn-space-40) 0 var(--zn-space-24)}
.hero-in{display:grid;grid-template-columns:minmax(0,568px) minmax(0,1fr);gap:var(--zn-space-48);align-items:center;padding-right:0;min-height:700px}
.copy{display:flex;flex-direction:column;gap:var(--zn-space-24);align-items:flex-start}
.ctas{display:flex;gap:var(--zn-space-16);flex-wrap:wrap}
.hvbox{position:relative;width:100%;max-width:568px;height:calc(620px * var(--hs));justify-self:end}
.aurora{position:absolute;left:64px;top:90px;width:440px;height:440px}
.aurora::before{content:"";position:absolute;inset:-25%;border-radius:var(--radius-round);background:radial-gradient(closest-side,rgba(var(--rgb-signal),.42),rgba(var(--rgb-signal),.12) 55%,rgba(var(--rgb-signal),0));animation:breathe 7s var(--zn-ease-in-out) infinite}
.aurora::after{content:"";position:absolute;left:24%;top:18%;width:90%;height:90%;border-radius:var(--radius-round);background:radial-gradient(closest-side,rgba(var(--rgb-aurora),.3),rgba(var(--rgb-aurora),0));animation:breathe 9s var(--zn-ease-in-out) -3s infinite}
@keyframes breathe{0%,100%{transform:scale(1);opacity:.9}50%{transform:scale(1.08);opacity:1}}
.ring{animation:ringp 6s var(--zn-ease-in-out) infinite}
.ring:nth-child(3){animation-delay:-2s}.ring:nth-child(4){animation-delay:-4s}
@keyframes ringp{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.03);opacity:.55}}
/* el original apunta a .chip:nth-of-type; solo el primer chip (tercer div) recibe el retraso */
.chip:nth-of-type(2){animation-delay:-2s}.chip:nth-of-type(3){animation-delay:-4s}
.chip-alert.flash{border-color:rgba(var(--rgb-alert),.8);box-shadow:0 0 22px rgba(var(--rgb-alert),.45)}
@media (max-width:1023px){
  .hero-in{grid-template-columns:1fr;min-height:0;gap:var(--zn-space-32);padding-right:var(--pad)}
  .hero{padding:var(--zn-space-32) 0 var(--zn-space-8)}
  .hvbox{justify-self:center}
}
@media (max-width:640px){
  .ctas{flex-direction:column;align-items:stretch;width:100%}
  .ctas .btn{width:100%}
}
</style>
