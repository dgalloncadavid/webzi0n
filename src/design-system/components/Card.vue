<script setup>
/* Tarjeta.
   variant: dark  (degradado navy, borde de línea y elevación al pasar el puntero)
            light (blanca con sombra suave, para secciones claras)
   as: etiqueta HTML (article por defecto) */
defineProps({
  variant: { type: String, default: 'dark' },
  as: { type: String, default: 'article' }
})
</script>

<template><component :is="as" class="card" :class="'card--' + variant"><slot /></component></template>

<style scoped>
.card{position:relative;border-radius:var(--radius-card);border:1px solid var(--color-line);background:linear-gradient(160deg,var(--zn-card-from) 0%,var(--zn-card-to) 100%);padding:var(--zn-space-24);transition:transform var(--dur-slow) var(--ease),border-color var(--dur-medium),box-shadow var(--dur-medium)}
.card:hover{transform:translateY(-4px);border-color:rgba(var(--rgb-ice),.32);box-shadow:var(--shadow-card-hover)}
.card--light{background:var(--color-light-surface);border-color:var(--zn-light-border);box-shadow:var(--shadow-card-light);transition:transform var(--dur-slow) var(--ease),box-shadow var(--zn-dur-350),border-color var(--zn-dur-350)}
.card--light:hover{border-color:var(--zn-light-border);box-shadow:var(--shadow-card-light-hover)}
@media (hover:none){.card:hover{transform:none}}
</style>
