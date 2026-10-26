<script setup>
/* Tarjeta de plan para secciones claras.
   highlight: plan destacado (fondo tinta y borde animado en degradado).
   price: texto del precio (el conteo animado lo maneja la sección). */
import Card from './Card.vue'
import Icon from './Icon.vue'
import Badge from './Badge.vue'
import Button from './Button.vue'

defineProps({
  name: { type: String, required: true },
  price: { type: String, required: true },
  currency: { type: String, default: '' },
  period: { type: String, required: true },
  note: { type: String, default: '' },
  /** { label, tone } */
  badge: { type: Object, default: null },
  gift: { type: Boolean, default: false },
  highlight: { type: Boolean, default: false },
  ctaLabel: { type: String, required: true },
  ctaTo: { type: String, required: true }
})
</script>

<template>
<Card variant="light" class="plan" :class="{ hi: highlight }">
        <div class="ptop2"><span class="eyebrow">{{ name }}</span><span v-if="gift" class="gift ico"><Icon name="gift" /></span><Badge v-if="badge" variant="outline" size="sm" :tone="badge.tone">{{ badge.label }}</Badge></div>
        <div class="price"><span class="num">{{ price }}</span><span v-if="currency" class="cur">{{ currency }}</span></div>
        <h3 class="h5">{{ period }}</h3>
        <p class="small">{{ note }}</p>
        <Button :to="ctaTo" size="md" :variant="highlight ? 'primary' : 'navy'">{{ ctaLabel }}</Button>
</Card>
</template>

<style scoped>
.plan{display:flex;flex-direction:column;gap:var(--zn-space-14);padding:var(--zn-space-28) var(--zn-space-24)}
.ptop2{display:flex;align-items:center;justify-content:space-between;min-height:26px}
.gift{width:22px;height:22px;color:var(--zn-gift)}
.price{display:flex;align-items:baseline;gap:var(--zn-space-8)}
.price .num{font:var(--zn-weight-extrabold) 44px/52px var(--font-mono);letter-spacing:-1.2px;color:var(--color-navy)}
.price .cur{font:var(--zn-weight-medium) 14px/20px var(--font-mono);color:var(--color-muted)}
.plan .btn{margin-top:auto}
.plan .small{margin-bottom:var(--zn-space-12)}
.plan .badge{color:var(--color-navy)}
.plan.hi{position:relative;background:var(--color-ink);border-color:transparent;box-shadow:0 24px 50px -24px rgba(var(--rgb-signal),.5)}
.plan.hi::before{content:"";position:absolute;inset:-1.5px;border-radius:var(--zn-radius-25);padding:1.5px;background:conic-gradient(from var(--ang,0deg),var(--color-signal),var(--color-aurora),var(--color-signal));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:spin 6s linear infinite;pointer-events:none}
@property --ang{syntax:'<angle>';inherits:false;initial-value:0deg}
@keyframes spin{to{--ang:360deg}}
.plan.hi .eyebrow{color:var(--color-muted)}
.plan.hi .h5,.plan.hi .price .num{color:var(--color-mist)}
.plan.hi .small{color:var(--color-ice)}
.plan.hi .badge{color:var(--color-mist)}
@media (max-width:640px){
  .plan{padding:var(--zn-space-22)}
  .plan.hi{order:-1}
}
@media (hover:none){.plan:hover{transform:none}}
</style>
