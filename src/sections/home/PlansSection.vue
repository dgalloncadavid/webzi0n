<script setup>
/* Inicio · planes (sección clara): los precios cuentan desde $0 al aparecer. */
import { ref } from 'vue'
import SectionHeader from '@/design-system/components/SectionHeader.vue'
import PlanCard from '@/design-system/components/PlanCard.vue'
import Icon from '@/design-system/components/Icon.vue'
import { useT } from '@/design-system/composables/useLang'
import { useInView } from '@/design-system/composables/useInView'
import { useCountUp } from '@/design-system/composables/useCountUp'
import { prefersReducedMotion } from '@/design-system/composables/useMedia'

const { t } = useT()
const plans = [
  { name: 'Prueba', to: 0, cur: '', period: '15 días', note: 'Para probar todo antes de pagar', cta: 'Empezar prueba', href: '/compra?tipo=prueba', gift: true },
  { name: 'Trimestral', to: 150, cur: 'USD', period: '90 días', note: '$50 por mes', cta: 'Elegir 90 días', href: '/compra?tipo=activacion&plan=90', d: '.06s' },
  { name: 'Semestral', to: 269, cur: 'USD', period: '180 días', note: '$44,8 por mes', cta: 'Elegir 180 días', href: '/compra?tipo=activacion&plan=180', d: '.12s', badge: { label: 'Ahorras 10%', tone: 'aurora' } },
  { name: 'Anual', to: 500, cur: 'USD', period: '360 días', note: '$41,7 por mes', cta: 'Elegir 360 días', href: '/compra?tipo=activacion&plan=360', d: '.18s', badge: { label: 'Ahorras 17%', tone: 'signal' }, hi: true }
]
const count = useCountUp(plans.map((p) => p.to), { duration: 1200, stagger: 120, format: (n) => '$' + n })
const grid = ref(null)
let done = false
useInView(grid, {
  threshold: 0.4,
  onChange(on) {
    if (!on || done) return
    done = true
    count.start({ skip: (to) => prefersReducedMotion() || !to })
  }
})
</script>

<template>
<section class="sec light" id="planes" aria-labelledby="p-t">
  <div class="wrap">
    <SectionHeader v-reveal class="rv" :eyebrow="t('Planes')" :title="t('Un precio claro, sin letra pequeña')" title-id="p-t" :lead="t('Prueba gratis y elige luego cuánto tiempo quieres a Zi0n en tu teléfono.')" />
    <div ref="grid" class="plans">
      <PlanCard v-for="(p, k) in plans" :key="p.name" v-reveal class="rv" :style="p.d ? '--d:' + p.d : undefined" :name="t(p.name)" :price="count.values.value[k]" :currency="p.cur" :period="t(p.period)" :note="t(p.note)" :badge="p.badge ? { label: t(p.badge.label), tone: p.badge.tone } : null" :gift="!!p.gift" :highlight="!!p.hi" :cta-label="t(p.cta)" :cta-to="p.href" />
    </div>
    <p v-reveal class="paynote rv"><span class="ico"><Icon name="qrcode" /></span>{{ t('Pagas con stablecoins (USDT o USDC) o tarjeta de crédito · Recibes tu QR de activación al terminar') }}</p>
  </div>
</section>
</template>

<style scoped>
.plans{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--zn-space-20)}
.paynote{display:flex;align-items:center;gap:var(--zn-space-12);width:fit-content;margin:var(--zn-space-32) auto 0;padding:var(--zn-space-10) var(--zn-space-18);border-radius:var(--radius-pill);background:var(--zn-light-note);font:var(--zn-weight-regular) 14px/20px var(--font-sans);color:var(--color-light-text)}
.paynote .ico{width:18px;height:18px;flex:none}
@media (max-width:1180px){
  .plans{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (max-width:640px){
  .plans{grid-template-columns:1fr;gap:var(--zn-space-14)}
  .paynote{border-radius:var(--zn-radius-16);align-items:flex-start;padding:var(--zn-space-14) var(--zn-space-16)}
}
</style>
