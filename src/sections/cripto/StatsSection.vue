<script setup>
/* Cripto · cifras: los números cuentan desde 0 al aparecer. */
import { ref } from 'vue'
import { useT } from '@/design-system/composables/useLang'
import { useInView } from '@/design-system/composables/useInView'
import { useCountUp } from '@/design-system/composables/useCountUp'
import { prefersReducedMotion } from '@/design-system/composables/useMedia'

const { t } = useT()
const panel = ref(null)
const count = useCountUp([52, 33, 124, 20], { duration: 1400, stagger: 120 })
const n = count.values
let done = false
useInView(panel, {
  threshold: 0.5,
  onChange(on) {
    if (!on || done) return
    done = true
    count.start({ reduce: prefersReducedMotion() })
  }
})
</script>

<template>
<section class="sec stats" :aria-label="t('Cifras')">
  <div class="wrap">
    <div ref="panel" v-reveal class="panel rv" id="stats">
      <div class="srow">
        <div class="stat"><p class="sn"><span class="cnt">{{ n[0] }}</span></p><p class="small">{{ t('ataques físicos verificados contra holders, primer semestre de 2026') }}</p></div>
        <div class="stat"><p class="sn c-sig">+<span class="cnt">{{ n[1] }}</span>%</p><p class="small">{{ t('frente al mismo periodo de 2025') }}</p></div>
        <div class="stat"><p class="sn c-aur"><span class="cnt">{{ n[2] }}</span> M USD</p><p class="small">{{ t('en exposición registrada') }}</p></div>
        <div class="stat"><p class="sn c-alt"><span class="cnt">{{ n[3] }}</span> {{ t('de 52') }}</p><p class="small">{{ t('fueron invasiones a domicilio, frente a 1 en el primer semestre de 2025') }}</p></div>
      </div>
      <p class="caption">{{ t('Fuente: CertiK, Intel3D H1 2026 Wrench Attacks Report.') }}</p>
    </div>
  </div>
</section>
</template>

<style scoped>
.stats{padding-top:8px}
.panel{position:relative;overflow:hidden;border-radius:var(--radius-card);border:1px solid var(--color-line);background:var(--color-glass);backdrop-filter:blur(var(--zn-blur-16));-webkit-backdrop-filter:blur(var(--zn-blur-16));padding:var(--zn-space-32);display:flex;flex-direction:column;gap:var(--zn-space-24)}
.panel::after{content:"";position:absolute;top:0;left:-60%;width:50%;height:1px;background:linear-gradient(90deg,transparent,var(--color-ice),var(--color-signal),transparent);transition:left var(--zn-dur-1600) var(--ease)}
.panel.in::after{left:120%}
.srow{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--zn-space-24)}
.stat{display:flex;flex-direction:column;gap:var(--zn-space-8)}
.sn{font:var(--zn-weight-extrabold) 40px/48px var(--font-mono);letter-spacing:-.4px;white-space:nowrap;color:var(--color-mist);font-variant-numeric:tabular-nums}
.sn.c-sig{color:var(--color-signal)}.sn.c-aur{color:var(--color-aurora)}.sn.c-alt{color:var(--color-alert)}
@media (max-width:1180px){
  .srow{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:var(--zn-space-32)}
}
@media (max-width:640px){
  .panel{padding:var(--zn-space-24) var(--zn-space-20)}
  .srow{gap:var(--zn-space-24) var(--zn-space-16)}
  .sn{font-size:26px;line-height:34px}
}
</style>
