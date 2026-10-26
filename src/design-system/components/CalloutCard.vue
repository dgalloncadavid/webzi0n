<script setup>
/* Tarjeta de llamada a la acción: ícono en baldosa, título, texto y botones (slot).
   Superficie fija: oscura (data-theme="dark"), también dentro de una sección clara.
   Inicio la usa para "¿Tu caso es otro?" dentro de la sección clara de perfiles. */
import Icon from './Icon.vue'

defineProps({
  icon: { type: String, default: 'users' },
  title: { type: String, required: true },
  text: { type: String, default: '' }
})
</script>

<template>
<article class="callout" data-theme="dark">
  <div class="oleft">
    <span class="tile ico"><Icon :name="icon" /></span>
    <div><h3 class="h4">{{ title }}</h3><p class="body">{{ text }}</p></div>
  </div>
  <div class="obtns"><slot /></div>
</article>
</template>

<style scoped>
.callout{display:flex;align-items:center;justify-content:space-between;gap:var(--zn-space-32);padding:var(--zn-space-32) var(--zn-space-36);border-radius:var(--radius-card);background:var(--ui-bg);color:var(--ui-text);position:relative;overflow:hidden}
.callout::before{content:"";position:absolute;right:-120px;top:-160px;width:420px;height:420px;border-radius:50%;background:radial-gradient(closest-side,rgba(var(--rgb-signal),.18),rgba(var(--rgb-signal),0));animation:drift2 12s var(--zn-ease-in-out) infinite}
@keyframes drift2{0%,100%{transform:translate(0,0)}50%{transform:translate(-120px,-50px)}}
.callout .h4{color:var(--ui-text)}.callout .body{color:var(--ui-text-2)}
.oleft{position:relative;display:flex;align-items:center;gap:var(--zn-space-20)}
.oleft>div{display:flex;flex-direction:column;gap:var(--zn-space-4)}
.tile{--k:var(--rgb-signal);width:56px;height:56px;padding:14px;border-radius:var(--zn-radius-12);background:rgba(var(--rgb-signal),.14);color:rgb(var(--k));flex:none;transition:transform var(--zn-dur-400) var(--ease)}
.obtns{position:relative;display:flex;gap:var(--zn-space-12);flex:none}

@media (max-width:1023px){
  .callout{flex-direction:column;align-items:flex-start}
}
@media (max-width:640px){
  .callout{padding:var(--zn-space-28) var(--zn-space-22);gap:var(--zn-space-20)}
  .oleft{flex-direction:column;align-items:flex-start;gap:var(--zn-space-16)}
  .obtns{flex-direction:column;width:100%}
  .obtns :slotted(.btn){width:100%}
}
</style>
