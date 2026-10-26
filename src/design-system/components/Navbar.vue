<script setup>
/* Barra superior con enlaces, selector de idioma, CTA y menú móvil (< 1024 px).
   variant: home | cripto | graphene (las tres landings tienen medidas propias)
   links:   [{ label, to, ext? }]  ext = enlace a otra página (ícono de flecha en el menú móvil)
   Las etiquetas llegan en español y se traducen con el diccionario de la página.
   Superficie fija: oscura (barra y menú móvil). */
import { asset } from '@/design-system/asset'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Icon from './Icon.vue'
import Button from './Button.vue'
import LangSwitch from './LangSwitch.vue'
import { useT } from '../composables/useLang'
import { useMenu } from '../composables/useMenu'
import { isRouteLink } from '../composables/useLinkTo'

const props = defineProps({
  variant: { type: String, default: 'home' },
  homeTo: { type: String, default: '/' },
  links: { type: Array, required: true },
  /** Enlaces después del separador (solo inicio) */
  extraLinks: { type: Array, default: () => [] },
  ctaTo: { type: String, default: '/compra?tipo=prueba' },
  ctaLabel: { type: String, default: 'Probar 15 días' },
  ctaLabelMobile: { type: String, default: 'Probar 15 días gratis' }
})

const { t } = useT()
const menu = useMenu()
const innerClass = computed(() => (props.variant === 'graphene' ? 'frame' : 'wrap'))
</script>

<template>
<header class="nav" :class="['nav--' + variant, { open: menu.open.value }]" id="top" data-theme="dark">
  <div :class="[innerClass, 'nav-in']">
    <component :is="isRouteLink(homeTo) ? RouterLink : 'a'" :to="isRouteLink(homeTo) ? homeTo : undefined" :href="isRouteLink(homeTo) ? undefined : homeTo" class="logo" :aria-label="t('Zi0n, inicio')"><img :src="asset('assets/logo-white.svg')" width="138" height="32" alt="Zi0n"></component>
    <nav class="links" :aria-label="t('Principal')">
      <template v-for="l in links" :key="l.to"><component :is="isRouteLink(l.to) ? RouterLink : 'a'" :to="isRouteLink(l.to) ? l.to : undefined" :href="isRouteLink(l.to) ? undefined : l.to">{{ t(l.label) }}</component></template><template v-if="extraLinks.length">
      <span class="sep" aria-hidden="true"></span>
      <template v-for="l in extraLinks" :key="l.to"><RouterLink :to="l.to">{{ t(l.label) }}</RouterLink></template></template>
    </nav>
    <div class="actions">
      <LangSwitch />
      <Button :to="ctaTo" size="sm" variant="primary">{{ t(ctaLabel) }}</Button>
      <button class="burger" id="burger" type="button" :aria-label="t(menu.open.value ? 'Cerrar menú' : 'Abrir menú')" :aria-expanded="String(menu.open.value)" aria-controls="mmenu" @click="menu.toggle"><i></i><i></i></button>
    </div>
  </div>
</header>
<div class="mmenu" :class="['mmenu--' + variant, { open: menu.open.value }]" id="mmenu" data-theme="dark" @click="$event.target.closest('a') && menu.close()">
  <nav class="mlinks" :aria-label="t('Principal móvil')">
    <template v-for="l in links" :key="l.to"><component :is="isRouteLink(l.to) ? RouterLink : 'a'" :to="isRouteLink(l.to) ? l.to : undefined" :href="isRouteLink(l.to) ? undefined : l.to">{{ t(l.label) }}</component></template>
    <RouterLink v-for="l in extraLinks" :key="'m' + l.to" :to="l.to" class="ext">{{ t(l.label) }} <span class="ico"><Icon name="arrow-up-right" /></span></RouterLink>
  </nav>
  <div class="mfoot">
    <LangSwitch />
    <Button :to="ctaTo" size="lg" variant="primary">{{ t(ctaLabelMobile) }}</Button>
  </div>
</div>
</template>

<style scoped>
/* ---------- base: inicio ---------- */
.nav{position:sticky;top:0;z-index:50;background:var(--color-nav-bg);backdrop-filter:blur(var(--zn-blur-12));-webkit-backdrop-filter:blur(var(--zn-blur-12));border-bottom:1px solid var(--color-line);padding-top:env(safe-area-inset-top)}
.nav-in{display:flex;align-items:center;justify-content:space-between;height:var(--layout-nav-height);padding:0 var(--zn-space-32)}
.logo img{height:32px;width:auto}
.links{display:flex;align-items:center;gap:var(--zn-space-32);font:var(--zn-weight-medium) 14px/20px var(--font-sans);color:var(--color-ice)}
.links a{transition:color var(--dur-fast)}.links a:hover{color:var(--color-white)}
.actions{display:flex;align-items:center;gap:var(--zn-space-24)}
.burger,.mmenu{display:none}
.sep{width:1px;height:16px;background:var(--color-line);align-self:center}
.mlinks .ext{display:flex;align-items:center;justify-content:space-between;color:var(--color-ice)}
.mlinks .ext .ico{width:22px;height:22px}

/* ---------- Cripto ---------- */
.nav--cripto .links{align-items:normal}

/* ---------- GrapheneOS: el contenido vive en el lienzo de 1280 px escalado con zoom ---------- */
.nav--graphene{padding-top:0;overflow:visible}
.nav--graphene .frame{position:relative;width:1280px;margin:0 auto;zoom:var(--z)}
.nav--graphene .nav-in{padding:var(--zn-space-16) var(--zn-space-32)}
.nav--graphene .logo{display:block;height:32px}
.nav--graphene .logo img{height:auto;width:auto}
.nav--graphene .links{align-items:normal}

@media (max-width:1180px){
  .nav--home .links{gap:var(--zn-space-20)}
  .nav--cripto .links{gap:var(--zn-space-24)}
}
@media (max-width:1023px){
  .links,.actions>.lang{display:none}
  .nav-in{height:var(--layout-nav-height-mobile);padding:0 var(--pad)}
  .burger{display:grid;place-items:center;align-content:center;gap:var(--zn-space-6);width:44px;height:44px;border-radius:var(--zn-radius-12);border:1px solid var(--color-line);background:rgba(var(--rgb-white),.04)}
  .burger i{display:block;width:18px;height:2px;border-radius:var(--zn-radius-2);background:var(--color-mist);transition:transform var(--dur-medium) var(--ease)}
  .nav.open .burger i:first-child{transform:translateY(4px) rotate(45deg)}
  .nav.open .burger i:last-child{transform:translateY(-4px) rotate(-45deg)}
  .mmenu{display:flex;flex-direction:column;justify-content:space-between;position:fixed;z-index:49;left:0;right:0;top:calc(64px + env(safe-area-inset-top));height:calc(100dvh - 64px - env(safe-area-inset-top));padding:var(--zn-space-24) var(--pad) calc(32px + env(safe-area-inset-bottom));background:var(--color-menu-bg);opacity:0;visibility:hidden;transform:translateY(-8px);transition:opacity var(--dur-medium) var(--ease),transform var(--dur-medium) var(--ease),visibility var(--dur-medium);overflow-y:auto}
  .mmenu.open{opacity:1;visibility:visible;transform:none}
  .mlinks{display:flex;flex-direction:column}
  .mlinks a{font:var(--zn-weight-extrabold) 22px/30px var(--font-mono);letter-spacing:-.5px;padding:var(--zn-space-16) 0;border-bottom:1px solid var(--color-line)}
  .mfoot{display:flex;flex-direction:column;gap:var(--zn-space-16);padding-top:var(--zn-space-24)}
  .mfoot .lang{align-self:flex-start}

  .mmenu--cripto{overflow-y:visible}
  .mmenu--cripto .mlinks a{font-size:24px;line-height:32px;padding:var(--zn-space-18) 0}
  .mmenu--cripto .mfoot{padding-top:0}

  .nav--graphene{padding-top:env(safe-area-inset-top)}
  .nav--graphene .frame{zoom:1!important;width:auto!important}
  .nav--graphene .nav-in{padding:0 var(--pad)}
  .nav--graphene .logo img{width:112px;height:auto}
  .nav--graphene .actions{gap:var(--zn-space-12)}
  .nav--graphene .actions .btn-sm{padding:var(--zn-space-10) var(--zn-space-16)}
  .nav--graphene .actions :deep(.lang button),.mmenu--graphene :deep(.lang button),.nav--graphene .actions .btn,.mmenu--graphene .btn{touch-action:manipulation}
  .mmenu--graphene{top:64px;height:calc(100dvh - 64px);padding:var(--zn-space-24) var(--pad) var(--zn-space-32);backdrop-filter:blur(var(--zn-blur-14));-webkit-backdrop-filter:blur(var(--zn-blur-14));overflow-y:visible}
  .mmenu--graphene .mlinks a{font-size:24px;line-height:32px;color:var(--color-mist);padding:var(--zn-space-18) 0}
  .mmenu--graphene .mfoot{align-items:stretch;padding-top:0}
}
@media (max-width:640px){
  .nav--home .logo img,.nav--cripto .logo img{height:26px}
  .nav--home .actions,.nav--cripto .actions{gap:var(--zn-space-10)}
  .nav--home .actions .btn-sm,.nav--cripto .actions .btn-sm{padding:var(--zn-space-10) var(--zn-space-14)}
}
@media (max-width:380px){
  .nav--home .actions .btn-sm,.nav--cripto .actions .btn-sm{font-size:13px;padding:var(--zn-space-9) var(--zn-space-11)}
  .nav--home .logo img,.nav--cripto .logo img{height:24px}
  .nav--graphene .actions .btn-sm{padding:var(--zn-space-9) var(--zn-space-12);font-size:13px}
  .nav--graphene .logo img{width:100px}
}
</style>
