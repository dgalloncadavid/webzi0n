<script setup>
/* Preguntas frecuentes: una abierta a la vez (la primera arranca abierta).
   variant: line (landings: línea inferior que se llena) | bar (GrapheneOS: barra superior)
   columns: reparte los ítems en columnas que comparten el estado (Cripto usa 2)
   reveal:  agrega el revelado al hacer scroll a cada ítem (inicio) */
import { ref, computed } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
  /** [{ q, a }] ya traducidos */
  items: { type: Array, required: true },
  variant: { type: String, default: 'line' },
  columns: { type: Array, default: null },
  reveal: { type: Boolean, default: false },
  buttonType: { type: String, default: undefined },
  listId: { type: String, default: 'faqList' }
})

const open = ref(0)
function toggle(i) { open.value = open.value === i ? -1 : i }
const groups = computed(() => {
  const idx = props.items.map((_, i) => i)
  if (!props.columns) return null
  let start = 0
  return props.columns.map((n) => { const g = idx.slice(start, start + n); start += n; return g })
})
</script>

<template>
<div class="faq" :class="'faq--' + variant" :id="listId">
  <template v-if="groups">
    <div v-for="(g, gi) in groups" :key="gi" class="fcol"><div v-for="i in g" :key="i" class="fi" :class="{ open: open === i }"><i v-if="variant === 'bar'" class="fbar"></i><button class="fq" :class="{ h3: variant === 'bar' }" :type="buttonType" :aria-expanded="String(open === i)" @click="toggle(i)"><span>{{ items[i].q }}</span><span class="pm"><span class="ico p"><Icon name="plus" /></span><span class="ico m"><Icon name="minus" /></span></span></button><div class="fa"><div><p :class="{ body: variant === 'bar' }">{{ items[i].a }}</p></div></div></div></div>
  </template>
  <template v-else>
    <div v-for="(it, i) in items" :key="i" v-reveal class="fi" :class="{ open: open === i, rv: reveal }"><i v-if="variant === 'bar'" class="fbar"></i><button class="fq" :class="{ h3: variant === 'bar' }" :type="buttonType" :aria-expanded="String(open === i)" @click="toggle(i)"><span>{{ it.q }}</span><span class="pm"><span class="ico p"><Icon name="plus" /></span><span class="ico m"><Icon name="minus" /></span></span></button><div class="fa"><div><p :class="{ body: variant === 'bar' }">{{ it.a }}</p></div></div></div>
  </template>
</div>
</template>

<style scoped>
/* Se adapta al tema: todos los colores salen de --ui-* (ver tokens.json > theme). */
.pm .ic{stroke-width:2}

/* ---------- line · landings ---------- */
.faq--line{display:grid;grid-template-columns:1fr 1fr;gap:var(--zn-space-24)}
.faq--line .fi{position:relative;border-bottom:1px solid var(--ui-divider)}
.faq--line .fi::before{content:"";position:absolute;left:0;bottom:-1px;width:100%;height:1px;background:linear-gradient(90deg,var(--ui-accent-signal),var(--ui-accent-aurora));transform:scaleX(0);transform-origin:left;transition:transform var(--zn-dur-600) var(--ease)}
.faq--line .fi.open::before{transform:scaleX(1)}
.faq--line .fq{display:flex;align-items:center;gap:var(--zn-space-16);width:100%;padding:var(--zn-space-20) var(--zn-space-4);font:var(--zn-weight-extrabold) 18px/26px var(--font-mono);color:rgba(var(--ui-text-rgb),.78);transition:color var(--dur-medium)}
.faq--line .fq>span:first-child{flex:1}
.faq--line .fi.open .fq,.faq--line .fq:hover{color:var(--ui-text)}
.faq--line .pm{position:relative;width:32px;height:32px;flex:none;border-radius:var(--radius-round);border:1px solid var(--ui-icon-border);background:var(--ui-option);display:grid;place-items:center;transition:background var(--dur-medium),border-color var(--dur-medium)}
.faq--line .pm .ico{position:absolute;width:16px;height:16px;color:var(--ui-text-2);transition:opacity var(--dur-medium),transform var(--zn-dur-400) var(--ease)}
.faq--line .pm .m{opacity:0;transform:rotate(-90deg)}
.faq--line .fi.open .pm{background:var(--color-signal);border-color:var(--ui-active-border)}
.faq--line .fi.open .pm .p{opacity:0;transform:rotate(90deg)}
.faq--line .fi.open .pm .m{opacity:1;transform:none;color:var(--ui-on-accent)}
.faq--line .fa{display:grid;grid-template-rows:0fr;transition:grid-template-rows var(--zn-dur-500) var(--ease)}
.faq--line .fa>div{overflow:hidden}
.faq--line .fa p{padding:0 52px 22px 4px;font:var(--zn-weight-regular) 16px/24px var(--font-sans);color:var(--ui-text-2);opacity:0;transition:opacity var(--zn-dur-400)}
.faq--line .fi.open .fa{grid-template-rows:1fr}
.faq--line .fi.open .fa p{opacity:1;transition-delay:var(--zn-dur-150)}
@media (max-width:1023px){
  .faq--line{grid-template-columns:1fr;gap:0}
}
@media (max-width:640px){
  .faq--line .fq{font-size:16px;line-height:23px;padding:var(--zn-space-18) 0}
  .faq--line .fa p{padding:0 0 var(--zn-space-20)}
}

/* ---------- bar · GrapheneOS ---------- */
.faq--bar .fi{position:relative;border-top:1px solid var(--ui-divider-graphene)}
.faq--bar .fbar{position:absolute;left:0;top:-1px;width:680px;height:2px;background:linear-gradient(90deg,var(--ui-accent-signal),var(--ui-accent-aurora));box-shadow:0 0 8px rgba(var(--rgb-signal),.7);transform:scaleX(0);transform-origin:left;transition:transform var(--zn-dur-600) var(--ease)}
.faq--bar .fi.open .fbar{transform:scaleX(1)}
.faq--bar .fq{display:block;width:100%;padding:28px 56px 25px 0;color:var(--ui-text-soft);transition:color var(--dur-medium);min-height:83px}
.faq--bar .fi.open .fq,.faq--bar .fq:hover{color:var(--ui-text)}
.faq--bar .pm{position:absolute;right:0;top:23px;width:36px;height:36px;border-radius:var(--radius-round);background:var(--ui-raised);border:1px solid var(--ui-icon-border);display:grid;place-items:center;transition:background var(--dur-medium),border-color var(--dur-medium)}
.faq--bar .pm .ico{position:absolute;width:18px;height:18px;color:var(--ui-text-2);transition:opacity var(--dur-medium),transform var(--zn-dur-400) var(--ease)}
.faq--bar .pm .m{opacity:0;transform:rotate(-90deg)}
.faq--bar .fi.open .pm{background:var(--color-signal);border-color:var(--ui-text-2)}
.faq--bar .fi.open .pm .p{opacity:0;transform:rotate(90deg)}
.faq--bar .fi.open .pm .m{opacity:1;transform:none;color:var(--ui-on-accent)}
.faq--bar .fa{display:grid;grid-template-rows:0fr;transition:grid-template-rows var(--zn-dur-500) var(--ease)}
.faq--bar .fa>div{overflow:hidden}
.faq--bar .fa p{width:560px;padding-top:14px;padding-bottom:29px;opacity:0;transition:opacity var(--zn-dur-400)}
.faq--bar .fi.open .fa{grid-template-rows:1fr}
.faq--bar .fi.open .fa p{opacity:1;transition-delay:var(--zn-dur-150)}
@media (max-width:1023px){
  .faq--bar .fbar{width:100%}
  .faq--bar .fq{padding:22px 52px 20px 0;min-height:0;font-size:17px;line-height:24px;touch-action:manipulation}
  .faq--bar .pm{top:18px}
  .faq--bar .fa p{width:auto;padding-bottom:22px}
}
</style>
