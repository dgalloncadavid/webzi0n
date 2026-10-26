<script setup>
/* Tarjeta de ruta: enlace grande a otra página, con spotlight que sigue al puntero.
   tone: aurora | signal */
import { ref } from 'vue'
import Icon from './Icon.vue'
import Button from './Button.vue'
import { useLinkTo } from '../composables/useLinkTo'
import { useSpotlight } from '../composables/useSpotlight'

const props = defineProps({
  to: { type: String, required: true },
  tone: { type: String, default: 'aurora' },
  tags: { type: Array, default: () => [] },
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  text: { type: String, default: '' },
  items: { type: Array, default: () => [] },
  ctaLabel: { type: String, required: true }
})
const el = ref(null)
useSpotlight(el)
const link = useLinkTo(props.to)
</script>

<template>
<a ref="el" class="route" :class="tone === 'signal' ? 'c-sig' : 'c-aur'" :href="link.href.value" @click="link.onClick">
        <span class="spot"></span>
        <div class="tags"><span v-for="tg in tags" :key="tg">{{ tg }}</span></div>
        <span class="eyebrow acc">{{ eyebrow }}</span>
        <h3 class="h2">{{ title }}</h3>
        <p class="body">{{ text }}</p>
        <ul class="rlist">
          <li v-for="it in items" :key="it"><span class="ck ico"><Icon name="check" /></span>{{ it }}</li>
        </ul>
        <Button inert size="lg" variant="primary" class="rbtn">{{ ctaLabel }} <span class="ico ar"><Icon name="arrow-right" /></span></Button>
</a>
</template>

<style scoped>
.route{position:relative;overflow:hidden;display:flex;flex-direction:column;gap:var(--zn-space-20);padding:var(--zn-space-40);border-radius:var(--radius-card);border:1px solid var(--color-line);background:linear-gradient(135deg,rgba(var(--rgb),.22) 0%,rgba(var(--rgb),0) 60%),var(--color-navy);transition:transform var(--dur-slow) var(--ease),border-color var(--zn-dur-350),box-shadow var(--zn-dur-350)}
.route:hover{transform:translateY(-6px);border-color:rgba(var(--rgb),.55);box-shadow:0 30px 60px -30px rgba(var(--rgb),.55)}
.route .spot{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity var(--dur-medium);background:radial-gradient(360px circle at var(--mx,50%) var(--my,50%),rgba(var(--rgb),.18),transparent 60%)}
.route:hover .spot{opacity:1}
.route>*:not(.spot){position:relative}
.tags{display:flex;gap:var(--zn-space-8);flex-wrap:wrap}
.tags span{padding:var(--zn-space-5) var(--zn-space-10);border-radius:var(--radius-pill);border:1px solid var(--color-line);font:var(--zn-weight-medium) 12px/16px var(--font-mono);letter-spacing:.96px;text-transform:uppercase;color:var(--color-ice)}
.eyebrow.acc{color:rgb(var(--rgb))}
.rlist{display:flex;flex-direction:column;gap:var(--zn-space-12)}
.rlist li{display:flex;align-items:flex-start;gap:var(--zn-space-12);font:var(--zn-weight-regular) 14px/20px var(--font-sans);color:var(--color-mist)}
.ck{border-radius:var(--radius-round);display:grid;place-items:center;flex:none}
.ck .ic{stroke-width:2}
.rlist .ck{width:24px;height:24px;background:rgba(var(--rgb),.16);color:rgb(var(--rgb))}
.rlist .ck .ico,.rlist .ck svg{width:14px;height:14px}
.rbtn{align-self:flex-start;margin-top:auto}
.rbtn .ar{width:18px;height:18px;transition:transform var(--dur-medium) var(--ease)}
.route:hover .rbtn .ar{transform:translateX(4px)}
@media (max-width:640px){
  .route{padding:var(--zn-space-28) var(--zn-space-22);gap:var(--zn-space-18)}
  .route .h2{font-size:24px;line-height:32px}
  .rbtn{align-self:stretch}
}
@media (hover:none){.route:hover{transform:none}}
</style>
