<script setup>
/* Herramienta: ícono en baldosa, nombre y descripción corta.
   El tono lo hereda del grupo (--rgb y --tone). active: resaltado del recorrido automático.
   Se adapta al tema: tarjeta navy en oscuro, blanca en claro. */
import Icon from './Icon.vue'

defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, default: '' },
  active: { type: Boolean, default: false }
})
</script>

<template><li :class="{ act: active }"><span class="tile ico"><Icon :name="icon" /></span><div><b>{{ title }}</b><span>{{ text }}</span></div></li></template>

<style scoped>
li{display:flex;align-items:center;gap:var(--zn-space-12);padding:var(--zn-space-12) var(--zn-space-14);border-radius:var(--zn-radius-16);background:var(--ui-card);border:1px solid var(--ui-card-border);transition:border-color var(--zn-dur-400),box-shadow var(--zn-dur-400),transform var(--zn-dur-400) var(--ease)}
.tile{--k:var(--rgb);width:36px;height:36px;padding:var(--zn-space-9);border-radius:var(--zn-radius-10);background:rgba(var(--k),.12);color:var(--tone,rgb(var(--k)));flex:none;transition:transform var(--zn-dur-400) var(--ease)}
b{display:block;font:var(--zn-weight-medium) 14px/20px var(--font-sans);color:var(--ui-text)}
li span:not(.tile){display:block;font:var(--zn-weight-regular) 12px/16px var(--font-sans);color:var(--ui-muted)}
li.act,li:hover{border-color:rgba(var(--rgb),.6);box-shadow:0 0 0 3px rgba(var(--rgb),.08),0 12px 30px -14px rgba(var(--rgb),.5);transform:translateY(-2px)}
li.act .tile{background:rgba(var(--rgb),.28)}
</style>
