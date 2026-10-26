<script setup>
/* Pie de página.
   variant: home     (marca + columnas con título)
            cripto   (marca + fila de enlaces)
            graphene (igual que cripto, en el lienzo de 1280 px)
            compact  (checkout: una línea con copyright y enlaces legales)
   columns: [{ title, links: [{ label, to }] }]  (home)
   links:   [{ label, to }]                       (cripto, graphene, compact)
   Se adapta al tema (enlaces, textos, divisor y logo). graphene tiene fondo tinta propio:
   superficie fija oscura. */
import { asset } from '@/design-system/asset'
import { RouterLink } from 'vue-router'
import { useT } from '../composables/useLang'
import { isRouteLink } from '../composables/useLinkTo'

defineProps({
  variant: { type: String, default: 'cripto' },
  tagline: { type: String, default: 'Lo que llevas en el celular no debería depender de quién lo tenga en la mano.' },
  copyright: { type: String, required: true },
  columns: { type: Array, default: () => [] },
  links: { type: Array, default: () => [] }
})
const { t } = useT()
const is = (to) => (isRouteLink(to) ? RouterLink : 'a')
const bind = (to) => (isRouteLink(to) ? { to } : { href: to })
</script>

<template>
<footer v-if="variant === 'compact'" class="foot">
  <div class="foot-in">
    <p>{{ t(copyright) }}</p>
    <nav><component :is="is(l.to)" v-for="l in links" :key="l.label" v-bind="bind(l.to)">{{ t(l.label) }}</component></nav>
  </div>
</footer>
<footer v-else class="footer" :class="['footer--' + variant, { sec: variant === 'graphene' }]" :data-theme="variant === 'graphene' ? 'dark' : undefined">
  <div :class="variant === 'graphene' ? 'frame foot-in' : 'wrap'">
    <div class="ftop">
      <div class="brand">
        <img class="logo-dk" :src="asset('assets/logo-white.svg')" width="138" height="32" alt="Zi0n">
        <img class="logo-lt" :src="asset('assets/grapheneos/logo-color.svg')" width="138" height="32" alt="Zi0n" loading="lazy">
        <p class="body">{{ t(tagline) }}</p>
      </div>
      <div v-if="variant === 'home'" class="fcols">
        <div v-for="c in columns" :key="c.title" class="flinks"><span class="eyebrow">{{ t(c.title) }}</span><component :is="is(l.to)" v-for="l in c.links" :key="l.label" v-bind="bind(l.to)">{{ t(l.label) }}</component></div>
      </div>
      <div v-else class="flinks"><component :is="is(l.to)" v-for="l in links" :key="l.label" v-bind="bind(l.to)">{{ t(l.label) }}</component></div>
    </div>
    <div class="fbottom"><p>{{ t(copyright) }}</p></div>
  </div>
</footer>
</template>

<style scoped>
/* ---------- landings ---------- */
.footer .wrap{display:flex;flex-direction:column;gap:var(--zn-space-40);padding-top:var(--zn-space-64);padding-bottom:calc(64px + env(safe-area-inset-bottom))}
.ftop{display:flex;align-items:center;justify-content:space-between;gap:var(--zn-space-32)}
.brand{display:flex;flex-direction:column;gap:var(--zn-space-16);max-width:480px}
.flinks{display:flex;flex-wrap:wrap;gap:var(--zn-space-12) var(--zn-space-32);font:var(--zn-weight-regular) 14px/20px var(--font-sans);color:var(--ui-text-2)}
.flinks a:hover{color:var(--ui-hover-text)}
.fbottom{border-top:1px solid var(--ui-divider);padding-top:var(--zn-space-24)}
.fbottom p{font:var(--zn-weight-regular) 12px/16px var(--font-sans);color:var(--ui-muted)}
/* logo blanco en oscuro y a color (palabra navy) en claro */
.logo-dk{display:var(--ui-logo-white)}
.logo-lt{display:var(--ui-logo-color)}

/* inicio: columnas */
.footer--home .ftop{align-items:flex-start}
.fcols{display:flex;gap:var(--zn-space-64)}
.fcols .flinks{flex-direction:column;gap:var(--zn-space-12)}
.fcols .eyebrow{color:var(--ui-muted);margin-bottom:var(--zn-space-4)}

/* GrapheneOS: sección del lienzo de 1280 px */
.footer--graphene{position:relative;background:var(--color-ink);overflow:hidden}
.footer--graphene .frame{position:relative;width:1280px;margin:0 auto;zoom:var(--z)}
.footer--graphene .foot-in{display:flex;flex-direction:column;gap:var(--zn-space-40);padding:var(--zn-space-64) var(--zn-space-48)}
.footer--graphene .ftop{gap:0}
.footer--graphene .brand{max-width:none}
.footer--graphene .brand .body{width:480px}
.footer--graphene .flinks{flex-wrap:nowrap;gap:var(--zn-space-32);white-space:nowrap}

@media (max-width:1023px){
  .footer--graphene .frame{zoom:1!important;width:auto!important}
  .footer--graphene .foot-in{padding:var(--zn-space-48) var(--pad) calc(40px + env(safe-area-inset-bottom));gap:var(--zn-space-32)}
  .footer--graphene .ftop{flex-direction:column;align-items:flex-start;gap:var(--zn-space-28)}
  .footer--graphene .brand .body{width:auto}
  .footer--graphene .flinks{flex-wrap:wrap;gap:var(--zn-space-12) var(--zn-space-24);white-space:normal}
}
@media (max-width:640px){
  .footer--home .ftop{flex-direction:column;gap:var(--zn-space-32)}
  .footer--home .fcols{gap:var(--zn-space-40);flex-wrap:wrap}
  .footer--cripto .ftop{flex-direction:column;align-items:flex-start}
  .footer--cripto .flinks{gap:var(--zn-space-12) var(--zn-space-24)}
}

/* ---------- checkout ---------- */
.foot{border-top:1px solid var(--ui-divider)}
.foot>.foot-in{max-width:var(--layout-max-width-checkout);margin:0 auto;padding:var(--zn-space-24) var(--pad) calc(24px + env(safe-area-inset-bottom));display:flex;justify-content:space-between;gap:var(--zn-space-16);flex-wrap:wrap;font:var(--zn-weight-regular) 12px/18px var(--font-sans);color:var(--ui-muted)}
.foot nav{display:flex;gap:var(--zn-space-20);flex-wrap:wrap}
.foot a:hover{color:var(--ui-text)}
@media (max-width:640px){
  .foot>.foot-in{flex-direction:column}
}
</style>
