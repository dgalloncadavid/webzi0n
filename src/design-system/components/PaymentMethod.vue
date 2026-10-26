<script setup>
/* Método de pago (radio): título, detalle y logos.
   cards: los logos van sobre una placa blanca (tarjetas de crédito). */
const props = defineProps({
  name: { type: String, default: 'metodo' },
  value: { type: String, required: true },
  modelValue: { type: String, default: null },
  title: { type: String, required: true },
  text: { type: String, default: '' },
  /** [{ src, width, height, alt }] */
  logos: { type: Array, default: () => [] },
  cards: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])
</script>

<template><label class="method"><input type="radio" :name="name" :value="value" :checked="modelValue === value" @change="emit('update:modelValue', value)"><span class="mr"><span class="rd"></span><span class="mt"><b>{{ title }}</b><small>{{ text }}</small></span><span class="mlogos" :class="{ cards }"><img v-for="l in logos" :key="l.src" :src="l.src" :width="l.width" :height="l.height" :alt="l.alt"></span></span></label></template>

<style scoped>
.method{position:relative;cursor:pointer}
.method input{position:absolute;opacity:0;pointer-events:none}
.method:has(input:focus-visible){outline:2px solid var(--color-signal);outline-offset:3px}
.mr{display:flex;align-items:center;gap:var(--zn-space-14);padding:var(--zn-space-16) var(--zn-space-18);border-radius:var(--zn-radius-16);border:1px solid var(--color-line);background:var(--color-glass-checkout);transition:border-color var(--dur-base),background var(--dur-base),box-shadow var(--dur-base)}
.mr b{flex:1;font:var(--zn-weight-semibold) 16px/22px var(--font-sans)}
.method:hover .mr{border-color:var(--color-line-strong)}
.method:has(input:checked) .mr{border-color:var(--color-signal);background:rgba(var(--rgb-signal),.08);box-shadow:var(--shadow-selected)}
.rd{width:20px;height:20px;border-radius:var(--radius-round);border:1.5px solid var(--color-line-strong);display:grid;place-items:center;flex:none;transition:var(--dur-base)}
.rd::after{content:"";width:10px;height:10px;border-radius:var(--radius-round);background:var(--color-signal);transform:scale(0);transition:transform var(--dur-base) var(--ease)}
:checked~* .rd,.method:has(input:checked) .rd{border-color:var(--color-signal)}
.method:has(input:checked) .rd::after{transform:scale(1)}
.mlogos{display:flex;align-items:center;gap:var(--zn-space-6)}
.mlogos img{border-radius:var(--radius-round)}
.mlogos.cards{gap:var(--zn-space-6);padding:5px 8px;border-radius:var(--zn-radius-8);background:var(--color-white)}
.mlogos.cards img{border-radius:2px;object-fit:contain}
.mt{flex:1;display:flex;flex-direction:column;gap:2px}
.mt b{font:var(--zn-weight-semibold) 16px/22px var(--font-sans)}
.mt small{font:var(--zn-weight-regular) 13px/18px var(--font-sans);color:var(--color-ice)}
.mr b{flex:none}
</style>
