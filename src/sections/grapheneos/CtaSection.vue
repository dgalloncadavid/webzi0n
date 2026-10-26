<script setup>
/* GrapheneOS · CTA final con botón magnético y burbujas flotantes. */
import { ref } from 'vue'
import Icon from '@/design-system/components/Icon.vue'
import { useT } from '@/design-system/composables/useLang'
import { useMagnetic } from '@/design-system/composables/useMagnetic'
import { useLinkTo } from '@/design-system/composables/useLinkTo'

const { t } = useT()
const sec = ref(null)
const cta = ref(null)
/* en esta landing el botón también sigue al dedo (el original no filtraba por tipo de puntero) */
useMagnetic(cta, sec, { kx: 0.22, ky: 0.3, mouseOnly: false })
const link = useLinkTo('/compra?tipo=prueba')
</script>

<template>
<section ref="sec" class="sec s08" id="prueba" :aria-label="t('Probar Zi0n')">
  <div class="frame" style="height:640px">
    <div class="dec">
      <span class="glow" style="left:200px;top:-40px;width:640px;height:640px;--rgb:var(--rgb-signal);--a:.34;transform:translate(0,120px)"></span>
      <span class="glow" style="left:560px;top:90px;width:600px;height:600px;--rgb:var(--rgb-aurora);--a:.36"></span>
      <span class="ring" style="left:380px;top:60px;width:520px;height:520px;--a:.18"></span>
      <span class="ring" style="left:290px;top:-30px;width:700px;height:700px;--a:.10"></span>
      <span class="ring" style="left:192px;top:-128px;width:896px;height:896px;--a:.06"></span>
    </div>
    <h2 v-reveal class="h-display abs cta-h rv" style="left:140px;top:216px;width:1000px">{{ t('Un GrapheneOS que perdona.') }}</h2>
    <p v-reveal class="body-lg abs cta-p rv" style="--d:.08s;left:240px;top:292px;width:800px">{{ t('Se instala sobre tu teléfono con una guía paso a paso.') }}</p>
    <a ref="cta" :href="link.href.value" class="cta-btn abs" id="cta" style="left:515px;top:360px" @click="link.onClick"><span>{{ t('Probar 15 días gratis') }}</span></a>

    <div class="ob c-aur" style="left:84px;top:64px;width:92px;height:92px;--fd:0s"><span class="ico"><Icon name="lock" /></span></div>
    <div class="ob c-alt" style="left:1108px;top:68px;--fd:-1.4s"><span class="ico"><Icon name="bell-ringing" /></span></div>
    <div class="ob c-sig" style="left:1096px;top:486px;width:88px;height:88px;--fd:-2.2s"><span class="ico"><Icon name="eye-off" /></span></div>
    <div class="ob c-ice" style="left:100px;top:490px;width:80px;height:80px;--fd:-3.1s"><span class="ico"><Icon name="key-off" /></span></div>
  </div>
</section>
</template>

<style scoped>
.cta-h,.cta-p{text-align:center}
.cta-btn{display:inline-flex;padding:20px 36px;border-radius:var(--radius-pill);background:var(--color-signal);box-shadow:0 0 40px rgba(var(--rgb-signal),.65);font:var(--zn-weight-semibold) 16px/24px var(--font-sans);color:var(--color-ink);white-space:nowrap;transition:box-shadow var(--dur-medium),transform var(--zn-dur-150) linear;will-change:transform}
.cta-btn:hover{box-shadow:0 0 64px rgba(var(--rgb-signal),.9)}
.cta-btn span{display:block;transition:transform var(--zn-dur-150) linear}
@media (max-width:1023px){
  .s08>.frame{padding:96px var(--pad)!important;align-items:center;text-align:center}
  .s08>.frame::before{content:"";position:absolute;left:50%;top:50%;width:520px;height:520px;transform:translate(-50%,-50%);border-radius:var(--radius-round);background:radial-gradient(closest-side,rgba(var(--rgb-signal),.3),rgba(var(--rgb-aurora),.16) 60%,rgba(var(--rgb-aurora),0));pointer-events:none}
  .s08 .ob{display:none}
  .cta-h{margin-bottom:12px!important}
  .cta-btn{margin-top:32px;transform:none!important}
}
</style>
