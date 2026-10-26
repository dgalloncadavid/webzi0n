<script setup>
/* Tarjeta de opción única (radio) del checkout.
   variant: option (ícono, título, texto y etiqueta)
            plan   (duración, precio, precio por día y etiqueta de ahorro)
            store  (tienda: nombre, descripción, íconos de apps y enlace "ver todas")
   El input real queda oculto y accesible con teclado. Se adapta al tema. */
import Icon from './Icon.vue'
import Badge from './Badge.vue'

const props = defineProps({
  variant: { type: String, default: 'option' },
  name: { type: String, required: true },
  value: { type: String, required: true },
  modelValue: { type: String, default: null },
  icon: { type: String, default: '' },
  tone: { type: String, default: 'signal' },
  title: { type: String, required: true },
  text: { type: String, default: '' },
  /** { label, tone: 'signal' | 'amber' } */
  tag: { type: Object, default: null },
  price: { type: String, default: '' },
  currency: { type: String, default: '' },
  /** íconos de la tienda (rutas) y cuántas apps quedan fuera */
  apps: { type: Array, default: () => [] },
  more: { type: Number, default: 0 },
  actionLabel: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue', 'action'])
const TONE = { signal: 'c-sig', aurora: 'c-aur', alert: 'c-alt' }
function change() { emit('update:modelValue', props.value) }
function act(e) { e.preventDefault(); emit('action', props.value) }
</script>

<template>
<label v-if="variant === 'option'" class="opt"><input type="radio" :name="name" :value="value" :checked="modelValue === value" @change="change"><span class="oi" :class="TONE[tone]"><Icon :name="icon" /></span><span class="ot"><b>{{ title }}</b><small>{{ text }}</small></span><Badge v-if="tag" variant="tag" :tone="tag.tone">{{ tag.label }}</Badge></label>
<label v-else-if="variant === 'plan'" class="plan"><input type="radio" :name="name" :value="value" :checked="modelValue === value" @change="change"><span class="pr"><Badge v-if="tag" variant="tag" :tone="tag.tone">{{ tag.label }}</Badge><span class="rd"></span><b class="pd">{{ title }}</b><span class="pp">{{ price }} <small>{{ currency }}</small></span><span class="pday">{{ text }}</span></span></label>
<label v-else class="store"><input type="radio" :name="name" :value="value" :checked="modelValue === value" @change="change"><span class="st-h"><b>{{ title }}</b><span class="rd"></span></span><span class="st-d">{{ text }}</span><span class="icons"><img v-for="a in apps" :key="a" :src="a" width="34" height="34" alt="" loading="lazy"><span class="more">+{{ more }}</span></span><button type="button" class="seeall" @click="act">{{ actionLabel }}</button></label>
</template>

<style scoped>
.opt,.store,.plan{position:relative;cursor:pointer}
.opt input,.store input,.plan input{position:absolute;opacity:0;pointer-events:none}
.opt:has(input:focus-visible),.store:has(input:focus-visible),.plan:has(input:focus-visible){outline:2px solid var(--ui-focus);outline-offset:3px}

/* opción */
.opt{display:flex;align-items:center;gap:var(--zn-space-16);padding:var(--zn-space-16) var(--zn-space-18);border-radius:var(--zn-radius-16);border:1px solid var(--ui-line);background:var(--ui-option);transition:border-color var(--dur-base),background var(--dur-base),box-shadow var(--dur-base),transform var(--dur-base) var(--ease)}
.opt:hover{border-color:var(--ui-border);transform:translateY(-1px)}
.oi{width:42px;height:42px;border-radius:var(--zn-radius-12);display:grid;place-items:center;background:rgba(var(--rgb),.14);color:var(--tone,rgb(var(--rgb)))}
.oi svg{width:22px;height:22px}
.ot{flex:1;display:flex;flex-direction:column;gap:2px}
.ot b{font:var(--zn-weight-semibold) 16px/22px var(--font-sans);color:var(--ui-text)}
.ot small{font:var(--zn-weight-regular) 14px/20px var(--font-sans);color:var(--ui-text-2)}
.opt:has(input:checked){border-color:var(--ui-active-border);background:var(--ui-active);box-shadow:0 0 0 1px var(--ui-active-border) inset,0 10px 30px -14px rgba(var(--rgb-signal),.45)}

/* radio */
.rd{width:20px;height:20px;border-radius:var(--radius-round);border:1.5px solid var(--ui-border);display:grid;place-items:center;flex:none;transition:var(--dur-base)}
.rd::after{content:"";width:10px;height:10px;border-radius:var(--radius-round);background:var(--ui-active-border);transform:scale(0);transition:transform var(--dur-base) var(--ease)}
.store:has(input:checked) .rd,.plan:has(input:checked) .rd{border-color:var(--ui-active-border)}
.store:has(input:checked) .rd::after,.plan:has(input:checked) .rd::after{transform:scale(1)}

/* tienda */
.store{display:flex;flex-direction:column;gap:var(--zn-space-12);padding:var(--zn-space-18);border-radius:var(--radius-card-checkout);border:1px solid var(--ui-line);background:var(--ui-option);color:var(--ui-text);transition:border-color var(--dur-base),background var(--dur-base),box-shadow var(--dur-base),transform var(--dur-base) var(--ease)}
.store:hover{border-color:var(--ui-border);transform:translateY(-2px)}
.store:has(input:checked){border-color:var(--ui-active-border);background:rgba(var(--rgb-signal),.07);box-shadow:0 0 0 1px var(--ui-active-border) inset,0 14px 34px -16px rgba(var(--rgb-signal),.45)}
.st-h{display:flex;align-items:center;justify-content:space-between;gap:var(--zn-space-8)}
.st-h b{font:var(--zn-weight-extrabold) 16px/22px var(--font-mono)}
.st-d{font:var(--zn-weight-regular) 13px/19px var(--font-sans);color:var(--ui-text-2)}
.icons{display:flex;align-items:center}
.icons img{width:34px;height:34px;border-radius:var(--zn-radius-9);margin-right:-8px;box-shadow:0 0 0 2px var(--ui-ring);transition:transform var(--dur-medium) var(--ease)}
.store:hover .icons img{transform:translateY(-2px)}
.store:hover .icons img:nth-child(2){transition-delay:.03s}.store:hover .icons img:nth-child(3){transition-delay:.06s}.store:hover .icons img:nth-child(4){transition-delay:.09s}.store:hover .icons img:nth-child(5){transition-delay:.12s}
.icons .more{margin-left:14px;font:var(--zn-weight-medium) 12px/16px var(--font-mono);color:var(--ui-muted)}
.seeall{align-self:flex-start;font:var(--zn-weight-semibold) 13px/18px var(--font-sans);color:var(--ui-accent-aurora);text-decoration:underline;text-underline-offset:3px;position:relative;z-index:2}
.seeall:hover{color:var(--ui-text)}

/* plan */
.pr{position:relative;display:flex;flex-direction:column;gap:6px;padding:var(--zn-space-18);border-radius:var(--radius-card-checkout);border:1px solid var(--ui-line);background:var(--ui-option);color:var(--ui-text);height:100%;transition:border-color var(--dur-base),background var(--dur-base),box-shadow var(--dur-base),transform var(--dur-base) var(--ease)}
.plan:hover .pr{border-color:var(--ui-border);transform:translateY(-2px)}
.plan:has(input:checked) .pr{border-color:var(--ui-active-border);background:var(--ui-active);box-shadow:0 0 0 1px var(--ui-active-border) inset,0 14px 34px -16px rgba(var(--rgb-signal),.45)}
.pr .tag{position:absolute;top:14px;right:14px}
.pr .rd{margin-bottom:8px}
.pd{font:var(--zn-weight-extrabold) 22px/28px var(--font-mono)}
.plan:has(input:checked) .pd{color:var(--ui-accent-signal)}
.pp{font:var(--zn-weight-semibold) 18px/26px var(--font-sans)}
.pp small{font-size:13px;color:var(--ui-muted);font-weight:var(--zn-weight-medium)}
.pday{font:var(--zn-weight-regular) 13px/18px var(--font-sans);color:var(--ui-muted)}

@media (max-width:640px){
  .plan .pr{flex-direction:row;flex-wrap:wrap;align-items:center;column-gap:12px;row-gap:2px;padding:var(--zn-space-16)}
  .plan .pr .rd{margin:0}
  .plan .pd{font-size:19px}
  .plan .pp{margin-left:auto}
  .plan .pday{width:100%;padding-left:32px}
  .plan .pr .tag{position:static;order:5;margin-left:32px}
  .opt{padding:var(--zn-space-14);gap:var(--zn-space-12)}
  .oi{width:38px;height:38px}
  .opt .tag{position:absolute;top:10px;right:10px}
}
</style>
