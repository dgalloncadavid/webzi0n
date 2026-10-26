<script setup>
/* Paso numerado.
   variant: card    (tarjeta oscura con número en círculo e ícono en la esquina)
            compact (fila de lista: número, título y texto; checkout)
   tone: aurora | signal | alert (color del número en la variante card) */
import Card from './Card.vue'
import Icon from './Icon.vue'

defineProps({
  number: { type: [Number, String], required: true },
  title: { type: String, required: true },
  text: { type: String, default: '' },
  icon: { type: String, default: '' },
  tone: { type: String, default: 'aurora' },
  variant: { type: String, default: 'card' }
})
const TONE = { aurora: 'c-aur', signal: 'c-sig', alert: 'c-alt' }
</script>

<template>
<li v-if="variant === 'compact'" class="step-c"><span>{{ number }}</span><div><b>{{ title }}</b><p>{{ text }}</p></div></li>
<Card v-else class="step"><span class="nbadge" :class="TONE[tone]">{{ number }}</span><span v-if="icon" class="sico"><Icon :name="icon" /></span><h3 class="h5">{{ title }}</h3><p class="small">{{ text }}</p></Card>
</template>

<style scoped>
.step{display:flex;flex-direction:column;gap:var(--zn-space-16)}
.nbadge{width:40px;height:40px;border-radius:var(--radius-round);display:grid;place-items:center;background:rgba(var(--rgb),.16);font:var(--zn-weight-extrabold) 18px/26px var(--font-mono);color:var(--color-mist);transition:box-shadow var(--zn-dur-500),background var(--zn-dur-500);transition-delay:calc(.4s + var(--i,0)*.5s)}
.sico{position:absolute;right:24px;top:28px;width:26px;height:26px;color:rgba(var(--rgb-ice),.35);transition:color var(--zn-dur-400),transform var(--zn-dur-400) var(--ease)}
.step:hover .sico{color:var(--color-ice);transform:scale(1.1)}
@media (max-width:640px){
  .step{padding:var(--zn-space-18);gap:var(--zn-space-12)}
  .step .sico{right:16px;top:22px;width:22px;height:22px}
}

.step-c{display:flex;gap:var(--zn-space-14);align-items:flex-start;padding:var(--zn-space-14) var(--zn-space-16);border-radius:var(--zn-radius-14);background:var(--color-glass-checkout);border:1px solid var(--color-line)}
.step-c>span{width:30px;height:30px;border-radius:var(--radius-round);display:grid;place-items:center;background:rgba(var(--rgb-aurora),.18);font:var(--zn-weight-extrabold) 14px/1 var(--font-mono);flex:none}
.step-c b{font:var(--zn-weight-semibold) 15px/22px var(--font-sans)}
.step-c p{font:var(--zn-weight-regular) 13px/19px var(--font-sans);color:var(--color-ice)}
</style>
